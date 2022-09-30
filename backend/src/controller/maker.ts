import BigNumber from 'bignumber.js'
import AWS from 'aws-sdk'
import { plainToInstance } from 'class-transformer'
import { isEthereumAddress } from 'class-validator'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Context, DefaultState } from 'koa'
import KoaRouter from 'koa-router'
import { equals } from 'orbiter-chaincore/src/utils/core'
import { makerConfig } from '../config'
import { DydxHelper } from '../service/dydx/dydx_helper'
import * as serviceMaker from '../service/maker'
import { getLastStatus, getMakerPulls } from '../service/maker_pull'
import * as serviceMakerWealth from '../service/maker_wealth'
import { getAmountToSend, getMakerList } from '../util/maker'
import { CHAIN_INDEX } from '../util/maker/core'
// extend relativeTime
dayjs.extend(relativeTime)

AWS.config.update({
  maxRetries: 3,
  httpOptions: { timeout: 30000, connectTimeout: 5000 },
  region: 'ap-northeast-1',
  accessKeyId: makerConfig.s3AccessKeyId,
  secretAccessKey: makerConfig.s3SecretAccessKey,
})

const s3 = new AWS.S3()

export default function (router: KoaRouter<DefaultState, Context>) {
  router.get('maker', async ({ restful }) => {
    const chains = <{ chainId: number; chainName: string }[]>[]
    const pushChain = (chainId: number, chainName: string) => {
      const find = chains.find((item) => item.chainId == chainId)
      if (find) {
        return
      }

      chains.push({ chainId, chainName })
    }
    const makerList = await getMakerList()
    for (const item of makerList) {
      pushChain(item.fromChain.id, item.fromChain.symbol)
      pushChain(item.toChain.id, item.toChain.symbol)
    }

    const earliestMakrNode = await serviceMaker.getEarliestMakerNode()
    let earliestTime = 0
    if (earliestMakrNode) {
      earliestTime = new Date(earliestMakrNode.fromTimeStamp).getTime()
    } else {
      earliestTime = new Date().getTime()
    }

    restful.json({ earliestTime, chains })
  })

  router.get('maker/nodes', async ({ request, restful }) => {
    // parse query
    const params = plainToInstance(
      class {
        makerAddress: string
        fromChain?: number
        toChain?: number
        startTime?: number
        endTime?: number
        keyword?: string
        userAddress?: string
      },
      request.query
    )
    const list = await serviceMaker.getMakerNodes(
      params.makerAddress,
      params.fromChain,
      params.toChain,
      Number(params.startTime),
      Number(params.endTime),
      params.keyword,
      params.userAddress
    )

    // fill data
    for (const item of list) {
      item['fromChainName'] = CHAIN_INDEX[item.fromChain] || ''
      item['toChainName'] = CHAIN_INDEX[item.toChain] || ''

      // format tokenName and amounts
      const fromChainTokenInfo = await serviceMaker.getTokenInfo(
        Number(item.fromChain),
        item.txToken
      )
      item['txTokenName'] = fromChainTokenInfo.tokenName
      item['fromAmountFormat'] = 0
      if (fromChainTokenInfo.decimals > -1) {
        item['fromAmountFormat'] = new BigNumber(item['fromAmount']).dividedBy(
          10 ** fromChainTokenInfo.decimals
        )
      }

      // to amounts
      const toChainTokenInfo = await serviceMaker.getTokenInfo(
        Number(item.fromChain),
        item.txToken
      )
      item['toAmountFormat'] = 0
      if (toChainTokenInfo.decimals > -1) {
        item['toAmountFormat'] = new BigNumber(item['toAmount']).dividedBy(
          10 ** toChainTokenInfo.decimals
        )
      }

      // Trade duration
      item['tradeDuration'] = 0

      // Time duration、time ago
      const dayjsFrom = dayjs(item.fromTimeStamp)
      item['fromTimeStampAgo'] = dayjs().to(dayjsFrom)
      item['toTimeStampAgo'] = '-'
      if (item.toTimeStamp && item.toTimeStamp != '0') {
        const dayjsTo = dayjs(item.toTimeStamp)
        item['toTimeStampAgo'] = dayjs().to(dayjsTo)

        item['tradeDuration'] = dayjsTo.unix() - dayjsFrom.unix()
      }

      let needTo = {
        chainId: 0,
        amount: 0,
        decimals: 0,
        amountFormat: '',
        tokenAddress: '',
      }

      if (item.state == 1 || item.state == 20) {
        const _fromChain = Number(item.fromChain)
        needTo.chainId = Number(
          serviceMaker.getAmountFlag(_fromChain, item.fromAmount)
        )
        let makerAddress = item.makerAddress;
        if (item.fromChain === '4' || item.fromChain == '44') {
          const starknetL1MapL2 =item.fromChain === '44'
          ? makerConfig.starknetL1MapL2['georli-alpha']
          : makerConfig.starknetL1MapL2['mainnet-alpha'];
          for (const L1Addr in starknetL1MapL2) {
            if (equals(starknetL1MapL2[L1Addr],item.makerAddress )) {
              makerAddress = L1Addr;
              break;
            }
          }
        }
        // find pool
        const pool = await serviceMaker.getTargetMakerPool(
          makerAddress,
          item.txToken,
          _fromChain,
          needTo.chainId
        )

        // if not find pool, don't do it
        if (pool) {
          needTo.tokenAddress =
            needTo.chainId == pool.c1ID ? pool.t1Address : pool.t2Address

          needTo.amount =
            getAmountToSend(
              _fromChain,
              needTo.chainId,
              item.fromAmount,
              pool,
              item.formNonce
            )?.tAmount || 0
          needTo.decimals = pool.precision
          needTo.amountFormat = new BigNumber(needTo.amount)
            .dividedBy(10 ** pool.precision)
            .toString()
        }
      }
      item['needTo'] = needTo

      // Parse to dydx txExt
      if (item.fromExt && (item.toChain == '11' || item.toChain == '511')) {
        const dydxHelper = new DydxHelper(Number(item.toChain))
        item.fromExt['dydxInfo'] = dydxHelper.splitStarkKeyPositionId(
          item.fromExt.value
        )
      }

      // Profit statistics
      // (fromAmount - toAmount) / token's rate - gasAmount/gasCurrency's rate
      item['profitUSD'] = (await serviceMaker.statisticsProfit(item)).toFixed(3)
    
      //
      if (item['fromChain'] === '4' || item['fromChain'] === '44') {
        item['userAddress'] = item['fromExt']['ext']
      }
      if (item['toChain'] === '4' || item['toChain'] === '44') {
        item['userAddress'] = item['fromExt']['value']
      }
      
    }

    restful.json(list)
  })

  router.get('maker/wealths', async ({ request, restful }) => {
    const makerAddress = String(request.query.makerAddress || '')

    // let rst = Core.memoryCache.get(
    //   `${serviceMakerWealth.CACHE_KEY_GET_WEALTHS}:${makerAddress}`
    // )
    // if (!rst) {
    //   rst = await serviceMakerWealth.getWealths(makerAddress)
    // }

    // No need to cache temporarily, get real-time
    const rst = await serviceMakerWealth.getWealths(makerAddress)

    restful.json(rst)
  })

  router.get('maker/get_last_status', async ({ restful }) => {
    const lastStatus = getLastStatus()

    restful.json(lastStatus)
  })

  router.get('maker/miss_private_key_addresses', async ({ restful }) => {
    const makerAddresses = await serviceMaker.getMakerAddresses()
    const addresses: string[] = []
    for (const item of makerAddresses) {
      if (makerConfig.privateKeys[item.toLowerCase()]) {
        continue
      }

      addresses.push(item)
    }
    const starknetL1MapL2 = process.env.NODE_ENV == 'development'
      ? makerConfig.starknetL1MapL2['georli-alpha']
      : makerConfig.starknetL1MapL2['mainnet-alpha']
    if (starknetL1MapL2) {
      for (const L1 in starknetL1MapL2) {
        const address = starknetL1MapL2[L1].toLowerCase();
        if (makerConfig.privateKeys[address]) {
          continue
        };
        addresses.push(address)
      }
    }
    restful.json(addresses)
  })

  // set makerConfig.privateKeys
  router.post('maker/privatekeys', async ({ request, restful }) => {
    const { body } = request

    const makerAddresses: string[] = []
    for (const makerAddress in body) {
      if (Object.prototype.hasOwnProperty.call(body, makerAddress)) {
        if (
          !body[makerAddress] ||
          makerConfig.privateKeys[makerAddress.toLowerCase()]
        ) {
          continue
        }

        makerAddresses.push(makerAddress)

        makerConfig.privateKeys[makerAddress.toLowerCase()] = body[makerAddress]
      }
    }

    restful.json(makerAddresses.join(','))
  })

  // set dydx's ApiKeyCredentials
  router.post(
    'maker/dydx_api_key_credentials',
    async ({ request, restful }) => {
      const { body } = request

      const makerAddresses: string[] = []
      for (const makerAddress in body) {
        if (Object.prototype.hasOwnProperty.call(body, makerAddress)) {
          if (!isEthereumAddress(makerAddress)) {
            continue
          }

          makerAddresses.push(makerAddress)

          DydxHelper.setApiKeyCredentials(makerAddress, body[makerAddress])
        }
      }

      restful.json(makerAddresses.join(','))
    }
  )

  router.get('maker/pulls', async ({ request, restful }) => {
    // parse query
    const params = plainToInstance(
      class {
        makerAddress: string
        startTime?: number
        endTime?: number
        fromOrToMaker?: number
      },
      request.query
    )

    const list = await getMakerPulls(
      params.makerAddress,
      params.startTime,
      params.endTime,
      params.fromOrToMaker == 1
    )

    for (const item of list) {
      item['chainName'] = CHAIN_INDEX[item.chainId] || ''

      // amount format
      const chainTokenInfo = await serviceMaker.getTokenInfo(
        Number(item.chainId),
        item.tokenAddress
      )
      item['amountFormat'] = 0
      if (chainTokenInfo.decimals > -1) {
        item['amountFormat'] = new BigNumber(item.amount).dividedBy(
          10 ** chainTokenInfo.decimals
        )
      }

      // time ago
      item['txTimeAgo'] = '-'
      if (item.txTime.getTime() > 0) {
        item['txTimeAgo'] = dayjs().to(dayjs(item.txTime))
      }
    }

    restful.json(list)
  })

  router.post('maker/config', async (ctx) => {
    const { headers, request, restful } = ctx
    try {
      if (makerConfig.s3Proof != headers.authorization) {
        ctx.response.status = 401
        return restful.json({ message: 's3Proof is error' })
      }
      const oldData = request.body.oldData
      const newData = request.body.newData
      if (oldData && newData) {
        const oldParams = {
          Bucket: 'orbiter-makerlist',
          Key: 'rinkeby/old_makerList.json',
          Body: Buffer.from(oldData),
        }
        const newParams = {
          ACL: 'public-read',
          Bucket: 'orbiter-makerlist',
          Key: 'rinkeby/makerList.json',
          Body: Buffer.from(newData),
        }
        await uploadToS3(oldParams)
        await uploadToS3(newParams)
        restful.json({ message: 'ok' })
      } else {
        ctx.response.status = 400
        restful.json({ message: 'param is empty' })
      }
    } catch (error) {
      ctx.response.status = 500
      restful.json({ message: error.message })
    }
  })
}

function uploadToS3(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err: Error, data: any) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

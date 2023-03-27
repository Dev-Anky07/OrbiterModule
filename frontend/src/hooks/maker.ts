import { $env } from '@/env'
import { $axios } from '@/plugins/axios'
import { reactive, ref } from 'vue'
import http from '@/plugins/axios2'
import { ethers } from 'ethers';
import chains from '../chain';
const chainNameToId = {
  ethereum: 1,
  arbitrum: 2,
  optimism: 7,
  starknet: 4,
  zksyncera: 14,
  zksynclite: 3,
}

type MakerInfoChains = {
  chainId: string
  chainName: string
}[]
type MakerInfo = {
  chains: MakerInfoChains
  earliestTime: number
}
export const makerInfo = {
  state: reactive({
    chains: [] as MakerInfoChains,
    earliestTime: 0,
  }),

  async get() {
    const resp = await $axios.get<MakerInfo>('http://iris_dashboard.orbiter.finance:3002/maker')
    const data = resp.data
    // unshift All item
    data.chains.unshift({ chainId: '', chainName: 'All' })

    makerInfo.state.chains = data.chains
    makerInfo.state.earliestTime = data.earliestTime
  },
}

export type MakerNode = {
  id: number
  transactionID: string
  makerAddress: string
  userAddress: string
  fromChain: string
  fromChainName: string
  toChain: string
  toChainName: string
  formTx: string
  fromTxHref: string
  fromAmountFormat: string
  fromExt: {
    type: string
    value: string
    dydxInfo?: {
      starkKey: string
      positionId: string
    }
  } | null
  toAmountFormat: string
  toTx: string
  toTxHref: string
  fromTimeStamp: string
  fromTimeStampAgo: string
  toTimeStamp: string
  toTimeStampAgo: string
  tradeDuration: number
  state: number
  txTokenName: string
  needTo: any
  profitUSD: string
}
function transforeDate(params: any = {}) {
  const { rangeDate = [], keyword = '' } = params
  if (!keyword) {
    if (rangeDate?.[0]) {
      params['startTime'] = rangeDate?.[0].getTime()
    }
    if (rangeDate?.[1]) {
      params['endTime'] = rangeDate?.[1].getTime()
    }
  }
}
function getDecimals(chainId, symbol) {
  if (symbol) {
    return 18
  }
  const chain = chains.find((e) => Number(e.internalId) === chainId)
  if (!chain) {
    return 18
  }
  const token = chain.tokens.find((e) => e.name === symbol)
  if (!token) {
    return 18
  }
  return token?.decimals
}
function transforeData(list: any = []) {
  const accountExploreUrl = $env.accountExploreUrl

  // add hrefs
  for (const item of list) {
    item['makerAddressHref'] =
      accountExploreUrl[item.fromChain] + item['replySender']
    item['userAddressHref'] =
      accountExploreUrl[item.toChain] + item['inData']?.['replyAccount']
    item['fromTxHref'] =
      $env.txExploreUrl[item.fromChain] + item['inData']?.['hash']
    item['toTxHref'] = ''

    item['txTokenName'] = item['inData']?.symbol
    item.transactionID = item.transcationId
    item.formTx = item['inData']?.['hash']
    

    if (item.matchedScanTx) {
      item.toTx = item.matchedScanTx.txHash
      item.toTxHref = $env.txExploreUrl[item.toChain] + item.matchedScanTx.txHash
      item.toTimeStamp = parseInt((new Date(item.matchedScanTx.createdAt).getTime() / 1000).toString(), 10)
    }

    if (item.matchedTx) {
      item.toTx = item.matchedTx.tx_hash
      item.toTxHref = $env.txExploreUrl[item.toChain] + item.matchedTx.tx_hash
      item.toTimeStamp = item.matchedTx.timestamp
    }
    
    if (item.inData) {
      let toSymbol = item.inData.extra?.toSymbol
      if (!toSymbol) {
        toSymbol = item.inData.symbol
      }
      item.formatFromAmount = ethers.utils.formatUnits(item.inData.value, getDecimals(item.fromChain, item.inData.symbol));
      item.formatToAmount = ethers.utils.formatUnits(item.toAmount, getDecimals(item.toChain, toSymbol));
    }
    // item.fromAmountFormat = +item.fromValue / Math.pow(10, 18)
    // item.toAmountFormat = +item.toValue / Math.pow(10, 18)

    /*
      item.state = 20
      if (item.status==1 || item.status==99) {
        item.state = 1
      } else {
        item.state = 20
      }
      if (item.fromStatus==1 || item.fromStatus==99) {
        item.state = 3
      } else {
        item.state = 2
      }
      if (item.state == 1 || item.state == 3) {
        if (item.toTx && item.fromTx) {
          item.state = 3
        } else {
          item.state = 20
        }
      }
    */

    // item.state = 20
    // if (item.fromStatus == 0) {
    //   item.state = 0
    // } else if (item.fromStatus == 1 || item.fromStatus == 99) {
    //   item.state = 1
    // }
    // if (item.status == 0) {
    //   if (item.fromStatus == 1 || item.fromStatus == 99) item.state = 2
    // } else if (item.status == 1 || item.status == 99) {
    //   item.state = 3
    // }
    // if (item.status === 'matched') {
    //   item.state = 20
    // } else {
    //   item.state = 3
    // }
  }
}

export const useTransactionHistory = async (params: any = {}) => {
  const loading = ref(false)
  const list: any = ref([])
  const size = ref(params.size || 10)
  const current = ref(params.current || 1)
  const total = ref(0)
  transforeDate(params)
  loading.value = true
  try {
    const res: any = await http.get(`/newlist`, {
      params: {
        ...params,
        rangeDate: null,
        size: size.value,
        current: current.value,
        transactionId: params.keyword ?? '',
      },
    })
    if (res.code === 0) {
      const data = res.data
      transforeData(data)
      list.value = data
      total.value = res.total
    }
  } catch (error) {
    console.error(error)
  }
  loading.value = false
  return {
    list,
    loading,
    total,
  }
}

type MakerWealths = {
  chainId: number
  chainName: string
  tokenExploreUrl: string
  balances: {
    makerAddress: string
    tokenAddress: string
    tokenName: string
    value: string
  }[]
}[]
export const makerWealth = {
  state: reactive({
    loading: false,
    list: [] as MakerWealths,
  }),

  async get(makerAddress: string) {
    if (!makerAddress) {
      return
    }

    makerWealth.state.loading = true
    try {
      const resp = await $axios.get<MakerWealths>('maker/wealths', {
        params: { makerAddress },
      })
      const wealths = resp.data

      // fill chain's accountExploreUrl
      for (const item of wealths) {
        item['tokenExploreUrl'] = $env.tokenExploreUrl[item.chainId]
      }
      makerWealth.state.list = wealths
    } catch (error) {
      console.error(error)
    }
    makerWealth.state.loading = false
  },
}

export const getTotals = async (data: any) => {
  transforeDate(data)
  try {
    const res: any = await http.get(`/statistic`, { params: { ...data } })
    return res.data
  } catch (error) {
    console.error(error)
  }
}

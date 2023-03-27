import { metamaskChains } from '../configs/chains'
import { ethers } from 'ethers'

export default {
  getChainInfo(netChainID) {
    const chain = metamaskChains.chainList.filter(
      (chain) => chain.chainId.toString() === netChainID.toString()
    )
    if (chain.length > 0) {
      return chain[0]
    }
    return undefined
  },
  chainName(localChainID, netChainID) {
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '3'
    ) {
      return 'zkSync'
    }
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '33'
    ) {
      return 'zkSync(R)'
    }
    const chain = metamaskChains.chainList.filter(
      (chain) => chain.chainId.toString() === netChainID
    )
    if (chain.length > 0) {
      return chain[0].name
    } else {
      return 'unknown'
    }
  },
  chainShortName(localChainID, netChainID) {
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '3'
    ) {
      return 'zkSync'
    }
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '33'
    ) {
      return 'zkSync(R)'
    }
    const chain = metamaskChains.chainList.filter(
      (chain) => chain.chainId.toString() === netChainID
    )
    if (chain.length > 0) {
      return chain[0].shortName
    } else {
      return 'unknown'
    }
  },
  toHex(num) {
    return '0x' + num.toString(16)
  },
  transferTimeStampToTime(timestamp) {
    if (!timestamp) {
      return timestamp
    }
    if (timestamp.toString().length === 10) {
      timestamp = timestamp * 1000
    }
    const date = new Date(timestamp)
    const Y = date.getFullYear() + '-'
    const M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    const D =
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
    const s =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const result = Y + M + D + h + m + s
    return result
  },
  shortAddress(address) {
    if (address && address.length > 5) {
      const subStr1 = address.substr(0, 4)
      const subStr2 = address.substr(address.length - 4, 4)
      return subStr1 + '...' + subStr2
    }
    return ''
  },
}

export function parseUnits(value: string, uint: number) {
  try {
    return ethers.utils.formatUnits(value, uint)
  } catch (error) {
    ;('')
  }
}

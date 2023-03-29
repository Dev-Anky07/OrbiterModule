const evn_map = {
  1: 'mainnet',
  2: 'arbitrum',
  3: 'zksynclite',
  4: 'starknet',
  6: 'polygon',
  7: 'optimism',
  9: 'loopring',
  15: 'bsc',
  14: 'zksyncera',
  16: 'Arbitrum Nova',
  8: 'immutableX',
  11: 'dydx',
  12: 'zkspace',
  13: 'boba',
  17: 'polygon evm',
}

export function getChainName(chain: string) {
  return evn_map[chain]
}

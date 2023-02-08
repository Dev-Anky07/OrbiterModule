const mainnet = [];
const testnet = [
  {
    "api": {
      "url": "https://api-goerli.etherscan.io/api",
      "key": ""
    },
    "chainId": "5",
    "networkId": "5",
    "internalId": "5",
    "name": "Görli",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://eth-goerli.public.blastapi.io",
      "https://rpc.ankr.com/eth_goerli",
      "https://rpc.goerli.mudit.blog",
      "https://eth-goerli.g.alchemy.com/v2/demo"
    ],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x6838e53488b9f75894a9fdf9feb509ee22c281dd"
    ]
  },
  {
    "api": {
      "url": "https://api-goerli.arbiscan.io/api",
      "key": ""
    },
    "chainId": "421613",
    "networkId": "421613",
    "internalId": "22",
    "name": "Arbitrum(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli-rollup.arbitrum.io/rpc",
      "https://arb-goerli.g.alchemy.com/v2/demo",
      "https://endpoints.omniatech.io/v1/arbitrum/goerli/public"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x6838e53488b9f75894a9fdf9feb509ee22c281dd"
    ]
  },
  {
    "api": {
      "url": "https://goerli-api.zksync.io/api/v0.2",
      "key": ""
    },
    "chainId": "zksync_test",
    "networkId": "zksync",
    "internalId": "33",
    "debug": false,
    "name": "ZKSync(G)",
    "nativeCurrency": {
      "id": 0,
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ]
  },
  {
    "api": {
      "url": "",
      "key": "",
      "intervalTime": 60000
    },
    "chainId": "SN_GOERLI",
    "networkId": "goerli-alpha",
    "internalId": "44",
    "name": "Starknet(G)",
    "debug": false,
    "contracts": [
      "0x0457bf9a97e854007039c43a6cc1a81464bd2a4b907594dabc9132c162563eb3"
    ],
    "nativeCurrency": {
      "id": 0,
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    },
    "rpc": [],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9"
      },
      {
        "name": "Tether USD",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x0386e8d061177f19b3b485c20e31137e6f6bc497cc635ccdfcab96fadf5add6a"
      },
      {
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
      }
    ]
  },
  {
    "api": {
      "url": "https://api-testnet.polygonscan.com/api",
      "key": ""
    },
    "chainId": "80001",
    "networkId": "80001",
    "internalId": "66",
    "name": "Polygon Mumbai",
    "nativeCurrency": {},
    "rpc": [
      "https://matic-testnet-archive-rpc.bwarelabs.com",
      "https://polygon-testnet.public.blastapi.io",
      "https://rpc.ankr.com/polygon_mumbai",
      "https://matic-mumbai.chainstacklabs.com"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "ETH",
        "symbol": "ETH",
        "decimals": 18,
        "address": "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"
      },
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x6838e53488b9f75894a9fdf9feb509ee22c281dd"
    ]
  },
  {
    "api": {
      "url": "https://api-goerli-optimism.etherscan.io/api",
      "key": "G1XY7R53AED1EB654H2PKV9NUMWKIGI1YA"
    },
    "chainId": "420",
    "networkId": "420",
    "internalId": "77",
    "name": "Optimism(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli.optimism.io",
      "https://opt-goerli.g.alchemy.com/v2/demo"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [
      "0x2200a79aDdFE2EFd7bDe34300f4C8FE902E31d39"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x6838e53488b9f75894a9fdf9feb509ee22c281dd"
    ]
  },
  {
    "api": {
      "url": "https://api.sandbox.x.immutable.com/v1",
      "key": ""
    },
    "chainId": "immutableX_testnet",
    "networkId": "immutableX",
    "internalId": "88",
    "name": "ImmutableX(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://uat2.loopring.io",
      "key": "35vBhSaHoYuUodTk2pFzuOLNeeVXtWyvsEUunNp0TRTph28gNFBecX9XRodrMUda"
    },
    "chainId": "loopring_testnet",
    "networkId": "5",
    "internalId": "99",
    "name": "Loopring(R)",
    "nativeCurrency": {
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "id": 0,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://stardust-explorer.metis.io/api",
      "key": ""
    },
    "chain": "ETH",
    "chainId": "588",
    "networkId": "588",
    "internalId": "510",
    "name": "Metis(G)",
    "nativeCurrency": {
      "name": "Metis Token",
      "symbol": "METIS",
      "decimals": 18,
      "address": "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
    },
    "rpc": [
      "https://stardust.metis.io/?owner=588"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "Ether (WETH)",
        "symbol": "ETH",
        "decimals": 18,
        "address": "0x420000000000000000000000000000000000000a"
      }
    ]
  },
  {
    "api": {
      "url": "https://api.stage.dydx.exchange",
      "key": ""
    },
    "chainId": "dydx_test",
    "networkId": "dydx",
    "internalId": "511",
    "name": "Dydx(G)",
    "nativeCurrency": {},
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": [{
      "name": "USDC",
      "symbol": "USDC",
      "decimals": 6,
      "address": "0x8707a5bf4c2842d46b31a405ba41b858c0f876c4"
    }]
  },
  {
    "api": {
      "url": "https://api.zkswap.info/v3-rinkeby",
      "key": ""
    },
    "chainId": "zkspace_test",
    "networkId": "zkspace",
    "internalId": "512",
    "name": "ZKSpace(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "id": 0,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "tokens": []
  },
  {
    "api": {
      "url": "https://api-testnet.bobascan.com/api",
      "key": ""
    },
    "chainId": "28",
    "internalId": "513",
    "name": "Boba(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "networkId": "28",
    "rpc": [
      "https://rinkeby.boba.network"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://zksync2-testnet.zkscan.io/api",
      "key": ""
    },
    "chainId": "280",
    "networkId": "280",
    "debug": true,
    "internalId": "514",
    "name": "ZkSync 2.0(G)",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x000000000000000000000000000000000000800A"
    },
    "rpc": [
      "https://zksync2-testnet.zksync.dev",
      "wss://zksync2-testnet.zksync.dev/ws"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ]
  },
  {
    "api": {
      "url": "https://api-testnet.bscscan.com/api",
      "key": ""
    },
    "chainId": "97",
    "networkId": "97",
    "internalId": "515",
    "name": "BSC(G)",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x2ceEA9FeAD4584aBA77eCdE697E9fc80C9BD4c56"
    },
    "rpc": [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://bsc-testnet.public.blastapi.io"
    ],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x6838e53488b9f75894a9fdf9feb509ee22c281dd"
    ]
  },
  {
    "api": {
      "url": "https://l2scan.scroll.io/api",
      "key": ""
    },
    "chainId": "534354",
    "networkId": "534354",
    "internalId": "519",
    "name": "Scroll L2(G)",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": ["https://prealpha.scroll.io/l2"],
    "watch": ["api", "rpc"],
    "tokens": []
  },
  {
    "api": {
      "url": "https://l2explorer.a1.taiko.xyz/api",
      "key": "",
      "intervalTime": 60000
    },
    "chainId": "167003",
    "networkId": "167003",
    "internalId": "520",
    "name": "Taiko A1(G)",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": ["https://l2rpc.a1.taiko.xyz"],
    "watch": ["api", "rpc"],
    "tokens": []
  }
];

export default {
  getChainInfoByChainId(chainId) {
    const configChainList = [...mainnet, ...testnet];
    const info = configChainList.find(item => +item.internalId === +chainId);
    if (!info) return null;
    return JSON.parse(JSON.stringify(info));
  },
  isSupportXVMContract(fromChainId) {
    const chainInfo = this.getChainInfoByChainId(fromChainId);
    return chainInfo?.xvmList && chainInfo.xvmList.length;
  },
  chainName(chainId) {
    return this.getChainInfoByChainId(chainId)?.name || 'unknown';
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
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
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

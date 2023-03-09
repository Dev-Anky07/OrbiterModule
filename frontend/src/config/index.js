import chainMain from './chain.json'
import chainTest from './chainTest.json'
import makerMain from './maker.json'
import makerTest from './makerTest.json'


export const isLocal = () => process.env.VUE_APP_ENV === 'local';
export const isDev = () => process.env.VUE_APP_ENV === 'development';
export const isProd = () => process.env.VUE_APP_ENV === 'production';

const chain = isProd() ? chainMain : chainTest;
const maker = isProd() ? makerMain : makerTest;

const chainConfig = [...chain].map(item => {
  if (process.env[`VUE_APP_CHAIN_API_KEY_${ item.internalId }`]) {
    item.api = item.api || {};
    item.api.key = process.env[`VUE_APP_CHAIN_API_KEY_${ item.internalId }`];
  }
  return item;
});

function convertMakerConfig() {
  const makerMap = maker;
  const chainList = chainConfig;
  const configs = [];
  const getChainTokenList = (chain) => {
    return chain.nativeCurrency ? [chain.nativeCurrency, ...chain.tokens] : [...chain.tokens];
  };
  for (const chainIdPair in makerMap) {
    if (!makerMap.hasOwnProperty(chainIdPair)) continue;
    const symbolPairMap = makerMap[chainIdPair];
    const [fromChainId, toChainId] = chainIdPair.split("-");
    const c1Chain = chainList.find(item => +item.internalId === +fromChainId);
    const c2Chain = chainList.find(item => +item.internalId === +toChainId);
    if (!c1Chain || !c2Chain) continue;
    for (const symbolPair in symbolPairMap) {
      if (!symbolPairMap.hasOwnProperty(symbolPair)) continue;
      const makerData = symbolPairMap[symbolPair];
      const [fromChainSymbol, toChainSymbol] = symbolPair.split("-");
      const fromTokenList = getChainTokenList(c1Chain);
      const toTokenList = getChainTokenList(c2Chain);
      const fromToken = fromTokenList.find(
          item => item.symbol === fromChainSymbol,
      );
      const toToken = toTokenList.find(
          item => item.symbol === toChainSymbol,
      );
      if (!fromToken || !toToken) continue;
      const config = {
        id: "",
        makerId: "",
        ebcId: "",
        slippage: makerData.slippage || 0,
        recipient: makerData.makerAddress,
        sender: makerData.sender,
        tradingFee: makerData.tradingFee,
        gasFee: makerData.gasFee,
        fromChain: {
          id: +fromChainId,
          name: c1Chain.name,
          tokenAddress: fromToken.address,
          symbol: fromChainSymbol,
          decimals: fromToken.decimals,
          minPrice: makerData.minPrice,
          maxPrice: makerData.maxPrice,
        },
        toChain: {
          id: +toChainId,
          name: c2Chain.name,
          tokenAddress: toToken.address,
          symbol: toChainSymbol,
          decimals: toToken.decimals,
        },
        times: [makerData.startTime, makerData.endTime],
        crossAddress: {
          recipient: makerData.crossAddress?.makerAddress,
          sender: makerData.crossAddress?.sender,
          tradingFee: makerData.crossAddress?.tradingFee,
          gasFee: makerData.crossAddress?.gasFee
        }
      };
      // handle makerConfigs
      configs.push(config);
      // v1 maker configs
      if (fromChainSymbol === toChainSymbol) {
        v1MakerConfigs.push(config);
      }
    }
  }
  return configs;
}

const v1MakerConfigs = [];

const makerConfigs = convertMakerConfig();

export default { chainConfig, makerConfigs };

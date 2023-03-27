<template>
  <div>
    <div class="maker">
      <div class="head">
        <Login />
      </div>
      <!-- <div
      class="maker-block maker-header maker-header--balances"
      v-loading="loadingWealths"
      element-loading-text="Loading Balances"
    >
      <el-row v-if="wealths.length > 0" class="chain_info_wrap" :gutter="16">
        <el-col v-for="(item, index) in wealths" :key="index" :span="4">
          <el-card
            class="chain_info"
            :header="mappingChainName(item.chainName)"
            shadow="hover"
          >
            <el-tabs class="maker-header--balances__names">
              <el-tab-pane
                v-for="(item1, index1) in item.balances"
                :key="index1"
                :label="item1.tokenName"
                :name="index1 + ''"
              >
                <div
                  v-if="item1.tokenAddress"
                  class="maker-header--balances__info"
                >
                  TokenAddress:&nbsp;
                  <a
                    :href="`${item.tokenExploreUrl}${item1.tokenAddress}`"
                    target="_blank"
                  >
                    <TextLong :content="item1.tokenAddress">
                      {{ item1.tokenAddress }}
                    </TextLong>
                  </a>
                </div>
                <div class="maker-header--balances__info">
                  <span class="maker-header--balances__value">
                    {{ item1.value || 'Faild Get' }}
                  </span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
      <el-empty v-else description="Empty balances"></el-empty>
    </div> -->
      <div
        class="maker-block maker-header maker-header--search"
        v-loading="loadingNodes"
      >
        <el-row :gutter="20">
          <el-col :span="4" class="maker-search__item">
            <div class="title">From chain</div>
            <el-select v-model="state.fromChainId" placeholder="Select">
              <el-option
                v-for="(item, index) in chains"
                :key="index"
                :label="mappingChainName(item.chainName)"
                :value="item.chainId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="maker-search__item">
            <div class="title">To chain</div>
            <el-select v-model="state.toChainId" placeholder="Select">
              <el-option
                v-for="(item, index) in chains"
                :key="index"
                :label="mappingChainName(item.chainName)"
                :value="item.chainId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col v-if="!state.keyword" :span="8" class="maker-search__item">
            <div class="title">From date range</div>
            <el-date-picker
              v-model="state.rangeDate"
              type="datetimerange"
              range-separator="To"
              :shortcuts="shortcuts"
              start-placeholder="Start date"
              end-placeholder="End date"
              :clearable="false"
              :offset="-110"
              :show-arrow="false"
            ></el-date-picker>
          </el-col>
          <el-col :span="8" class="maker-search__item">
            <div class="title">TransactionID</div>
            <el-input
              v-model="state.keyword"
              placeholder="Input search keyword."
              :clearable="true"
            />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="title">state</div>
            <el-select v-model="state.status" placeholder="Select">
              <el-option
                v-for="(item, index) in status"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <div class="title">minAmount</div>
            <el-input
              style="width: 200px;"
              v-model="state.minAmount"
              placeholder="Input minAmount"
              :clearable="true"
            />
          </el-col>
          <el-col :span="5">
            <div class="title">maxAmount</div>
            <el-input
              style="width: 200px;"
              v-model="state.maxAmount"
              placeholder="Input maxAmount"
              :clearable="true"
            />
          </el-col>
          <el-col :span="4" class="maker-search__item">
            <div class="title">Reset | Apply</div>
            <el-button @click="reset">Reset</el-button>
            <el-button type="primary" @click="() => clickApply()"
              >Apply</el-button
            >
          </el-col>
        </el-row>
        <el-row v-if="state.userAddressSelected">
          <el-tag closable @close="state.userAddressSelected = ''">
            UserAddress: {{ state.userAddressSelected }}
          </el-tag>
        </el-row>
      </div>
      <div class="maker-block maker-header maker-header__statistics">
        <el-button-group v-if="false">
          <el-button
            :disabled="loadingNodes"
            size="small"
            @click="onClickPageButton(false)"
          >
            Previous Page
          </el-button>
          <el-button
            :disabled="loadingNodes"
            size="small"
            @click="onClickPageButton(true)"
          >
            Next Page
          </el-button>
        </el-button-group>
        <div>成功: {{ statistics.successByMatchedCount }}</div>
        <div>人工确认成功: {{ statistics.successByAdminCount }}</div>
        <div>人工确认无回款: {{ statistics.failByAdminCount }}</div>
        <div>多条tx匹配: {{ statistics.failByMultiCount }}</div>
        <div>失败: {{ statistics.failByUnknownCount }}</div>
        <!-- <div style="color: #67c23a; font-weight: 600">
        +{{ statistics.profit['USD'] }} USD
      </div>
      <el-dropdown>
        <div style="color: #409eff; font-weight: 600">
          +{{ statistics.profit['ETH'] }} ETH
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(val, key) in statistics.profit"
              :key="key"
            >
              <div style="color: #409eff; font-weight: 600">
                + {{ val }} {{ key }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->

        <!-- <div style="color: #f56c6c; font-weight: 600">
        +{{ statistics.profit['CNY'] }} CNY
      </div> -->
        <!-- <div style="margin-left: auto">
        <router-link
          :to="`/maker/history?makerAddress=${makerAddressSelected}`"
          target="_blank"
        >
          <el-button size="small" round>All transactions</el-button>
        </router-link>
      </div> -->
      </div>
      <div class="maker-block">
        <template v-if="list.length > 0">
          <div
            v-if="!state.userAddressSelected"
            style="
              display: flex;
              justify-content: center;
              item-align: center;
              margin: 10px;
            "
          >
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="pagesizes"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>

          <el-table :data="list" stripe style="width: 100%">
            <el-table-column label="TransactionID">
              <template #default="scope">
                <div>
                  <el-tag
                    v-if="scope.row.txTokenName"
                    type="info"
                    effect="plain"
                    size="mini"
                    >{{ scope.row.txTokenName }}
                  </el-tag>
                  <el-tag v-else type="danger" effect="plain" size="mini"
                    >Invalid</el-tag
                  >
                </div>
                <div>
                  <TextLong :content="scope.row.transactionID">
                    {{ scope.row.transactionID }}
                  </TextLong>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="90">
              <template #header>
                From
                <br />To
              </template>
              <template #default="scope">
                <el-tag
                  class="maker__chain-tag"
                  type="success"
                  effect="light"
                  size="mini"
                  >+ {{ evn_map[scope.row.fromChain] }}
                </el-tag>
                <el-tag
                  class="maker__chain-tag"
                  type="danger"
                  effect="light"
                  size="mini"
                  >- {{ evn_map[scope.row.toChain] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column style="min-width: 120px">
              <template #header> User </template>
              <template #default="scope">
                <a :href="scope.row.userAddressHref" target="_blank">
                  <TextLong
                    :content="scope.row.replyAccount"
                    placement="bottom"
                  >
                    {{ scope.row.replyAccount }}
                  </TextLong>
                </a>
              </template>
            </el-table-column>
            <el-table-column width="145">
              <template #header>
                FromTx
                <br />FromTime
              </template>
              <template #default="scope">
                <a :href="scope.row.fromTxHref" target="_blank">
                  <TextLong :content="scope.row['inData']?.['hash']">
                    {{ scope.row['inData']?.['hash'] }}
                  </TextLong>
                </a>
                <div class="table-timestamp">
                  <TextLong
                    :content="scope.row['inData']?.['createdAt']"
                    placement="bottom"
                    >{{ scope.row['inData']?.['createdAt'] }}
                  </TextLong>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="145">
              <template #header>
                ToTx
                <br />ToTime
              </template>
              <template #default="{ row }">
                <a v-if="row.toTxHref" :href="row.toTxHref" target="_blank">
                  <TextLong :content="row.toTx">{{ row.toTx }}</TextLong>
                </a>
                <TextLong v-else :content="row.toTx">{{ row.toTx }}</TextLong>
                <div class="table-timestamp">
                  <TextLong
                    v-if="row.toTimeStamp && row.toTimeStamp != '0'"
                    :content="formatDate(row.toTimeStamp)"
                    placement="bottom"
                  >
                    {{ formatDate(row.toTimeStamp) }}
                  </TextLong>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template #header>
                FromAmount
                <br />ToAmount
              </template>
              <template #default="{ row }">
                <TextLong :content="row['inData']?.value">
                  <span class="amount-operator--plus">+</span>
                  {{ row['inData']?.value }}
                </TextLong>
                <TextLong :content="row.toAmount" placement="bottom">
                  <span class="amount-operator--minus">-</span>
                  {{ row.toAmount }}
                </TextLong>
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template #header>
                FromAmount
                <br />ToAmount
              </template>
              <template #default="{ row }">
                <TextLong :content="row?.formatFromAmount">
                  <span class="amount-operator--plus">+</span>
                  {{ row?.formatFromAmount }}
                </TextLong>
                <TextLong :content="row.formatToAmount" placement="bottom">
                  <span class="amount-operator--minus">-</span>
                  {{ row.formatToAmount }}
                </TextLong>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="State" width="120">
              <template #default="{ row }">
                <el-tag
                  :class="'state-tag--' + row.state"
                  :type="stateTags[row.state]?.type"
                  effect="dark"
                  @click="onClickStateTag(row)"
                  >{{ stateTags[row.state]?.label }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column>
              <template #header> 操作记录 </template>
              <template #default="scope">
                <div v-if="scope.row.userLog">
                  <div>操作人：{{ scope.row.userLog.name }}</div>
                  <div>
                    操作：{{
                      scope.row.userLog.updateStatus === 1
                        ? '改为成功'
                        : scope.row.userLog.updateStatus === 2
                        ? '确认无回款'
                        : ''
                    }}
                  </div>
                  <div>
                    操作时间：
                    <div class="table-timestamp">
                      {{ formatDate(scope.row.userLog.updateTime / 1000) }}
                    </div>
                  </div>
                  <div v-if="scope.row.userLog.hash !== 'undefined'">
                    绑定的hash：
                    <a
                      :href="getTxHref(scope.row, scope.row.userLog.hash)"
                      target="_blank"
                    >
                      <TextLong
                        :content="scope.row.userLog.hash"
                        placement="bottom"
                      >
                        {{ scope.row.userLog.hash }}
                      </TextLong>
                    </a>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header> 匹配的 tx hash </template>
              <template #default="scope">
                <div v-if="scope.row.warnTxList">
                  <div :key="item" v-for="item in scope.row.warnTxList">
                    <a :href="getTxHref(scope.row, item)" target="_blank">
                      <TextLong :content="item" placement="bottom">
                        {{ item }}
                      </TextLong>
                    </a>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="操作">
              <template #default="{ row }">
                <div v-if="row.state !== 1">
                  <el-button
                    size="small"
                    v-if="row.state === 3"
                    style="margin-top: 5px"
                    @click="onUpdate(row, 0)"
                  >
                    取消确认无回款
                  </el-button>
                  <el-button
                    v-if="row.state === 5"
                    size="small"
                    style="margin-top: 5px; margin-left: 0"
                    @click="onUpdate(row, 2)"
                  >
                    确认无回款
                  </el-button>
                  <el-button
                    size="small"
                    style="margin-top: 5px; margin-left: 0"
                    v-if="row.state === 5 || row.state === 4"
                    @click="
                      () => {
                        currentItem = row
                        dialogVisible = true
                      }
                    "
                  >
                    确认回款成功
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <el-empty v-else description="Empty"></el-empty>
      </div>
      <el-backtop :right="100" :bottom="100" />
    </div>
    <el-dialog v-model="dialogVisible" title="请输入tx hash" width="30%">
      <div>
        <div>
          hash：
          <ElInput
            v-model="hash"
            :type="'text'"
            :style="{ margin: '10px 0' }"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <Tx />
  </div>
</template>

<script lang="ts" setup>
import TextLong from '@/components/TextLong.vue'
import Tx from './Tx.vue'
import Login from './Login.vue'
import { MakerNode, makerWealth, useTransactionHistory } from '@/hooks/maker'
import { submit } from '@/hooks/login'
import {
  ElNotification,
  ElMessage,
  ElLoading,
  ElMessageBox,
} from 'element-plus'
import { BigNumberish, ethers, providers } from 'ethers'
import dayjs from 'dayjs'
import {
  TransactionDydx,
  TransactionEvm,
  TransactionImmutablex,
  TransactionLoopring,
  TransactionZksync,
  utils,
} from 'orbiter-sdk'
import { ref, computed, inject, reactive, watch, toRef } from 'vue'
import Web3 from 'web3'
import { getTotals, makerInfo } from '../hooks/maker'
import { $env } from '../env'
const stateTags = {
  1: { label: '成功', type: 'success' },
  2: { label: '人工确认成功', type: 'success' },
  3: { label: '人工确认无回款', type: 'info' },
  4: { label: '多条tx匹配', type: 'warning' },
  5: { label: '失败', type: 'danger' },
}
const CHAIN_NAME_MAPPING = {
  mainnet: 'Mainnet',
  arbitrum: 'Arbitrum',
  zksync: 'zkSync',
  polygon: 'Polygon',
  optimism: 'Optimism',
}
const mappingChainName = (chainName: string) => {
  if (CHAIN_NAME_MAPPING[chainName]) {
    return CHAIN_NAME_MAPPING[chainName]
  }
  return chainName
}
const status = [
  {
    value: -1,
    label: 'All',
  },
].concat(
  Object.keys(stateTags).map((key) => ({
    value: +key,
    label: stateTags[key].label,
  }))
)
// Default time duration 10800
const DEFAULT_TIME_DURATION = 1 * 24 * 60 * 60 * 1000

const makerAddressSelected: any = inject('makerAddressSelected')
const state = reactive({
  rangeDate: [] as Date[],
  fromChainId: '',
  toChainId: '',
  userAddressSelected: '',
  keyword: '',
  status: -1,
  minAmount: '',
  maxAmount: '',
})
const shortcuts = [
  {
    text: 'Today',
    value: () => {
      return [dayjs().startOf('d'), dayjs().endOf('d')]
    },
  },
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const statistics = ref({
  successByMatchedCount: 0,
  successByAdminCount: 0,
  failByAdminCount: 0,
  failByMultiCount: 0,
  failByUnknownCount: 0,
})
const makerNodes: any = ref([])
// computeds
const list = computed(() =>
  makerNodes.value.filter(
    (item) =>
      !state.userAddressSelected ||
      item.userAddress == state.userAddressSelected
  )
)
const evn_map = ref({
  1: 'mainnet',
  2: 'arbitrum',
  3: 'zksynclite',
  7: 'optimism',
  15: 'bsc',
  14: 'zksyncera',
  4: 'starknet',
  16: 'Arbitrum Nova',
})

const formatDate = (timestamp: number) => {
  return dayjs(timestamp * 1000).format()
}

const dialogVisible = ref(false)
const currentItem = ref<any>()
const hash = ref<string>()

const loadingNodes = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pagesizes = computed(() => Array.from(new Set([20, 50, 100, 200])))

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMakerNodes({ size: val })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMakerNodes({ current: val })
}

async function getStatistics() {
  const res = await getTotals({
    fromChainId: state.fromChainId ? +state.fromChainId : null,
    toChainId: state.toChainId ? +state.toChainId : null,
    rangeDate: state.rangeDate,
  })
  statistics.value = res
}

const getMakerWealth = () => makerWealth.get(makerAddressSelected?.value)
const reset = () => {
  state.rangeDate = [
    dayjs().subtract(10, 'day').toDate(),
    dayjs().endOf('d').toDate(),
  ]
  state.fromChainId = ''
  state.toChainId = ''
  state.userAddressSelected = ''
  state.keyword = ''
  state.status = -1

  getStatistics()
  getMakerNodes()
}


let prevMore = {}
const clickApply = () => {
  getStatistics()
  getMakerNodes({ current: 1 })
}

const getMakerNodes = async (more: any = {}) => {
  if (loadingNodes.value) return
  loadingNodes.value = true
  prevMore = {
    ...prevMore,
    ...more,
  }
  const {
    list: _list,
    // loading,
    total: _total,
  } = await useTransactionHistory({
    makerAddress: makerAddressSelected?.value,
    fromChainId: state.fromChainId ? +state.fromChainId : null,
    toChainId: state.toChainId ? +state.toChainId : null,
    rangeDate: state.rangeDate,
    keyword: state.keyword.trim(),
    state: state.status,
    minAmount: state.minAmount,
    maxAmount: state.maxAmount,
    ...prevMore,
  })
  loadingNodes.value = false
  makerNodes.value = _list.value
  total.value = _total.value
}

const chains = toRef(makerInfo.state, 'chains')

watch(chains, () => {
  if (!chains.value || chains.value.length) {
    return
  }
  for (let index = 0; index < chains.value.length; index++) {
    const element = chains.value[index]
    evn_map[element.chainId] = element.chainName
  }
})

const onUpdate = async (item: MakerNode, status: 0 | 1 | 2, hash?: string) => {
  const token = window.sessionStorage.getItem('token')

  if (!token) {
    ElMessage({
      showClose: true,
      message: '请先登录',
      type: 'error',
    })
    return false
  }
  if (status !== 1) {
    await ElMessageBox.confirm('确认更改?')
  }
  const loading = ElLoading.service({ fullscreen: true })
  try {
    const ok = await submit(status, item.id.toString(), hash)
    if (ok) {
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success',
      })
      await getMakerNodes()
      await getStatistics()
    } else {
      throw Error('submit fail')
    }
  } catch {
    ElMessage({
      showClose: true,
      message: '操作失败',
      type: 'error',
    })
  } finally {
    loading.close()
  }
}

const handleConfirm = () => {
  dialogVisible.value = false
  if (!currentItem.value || !hash.value) {
    return
  }
  onUpdate(currentItem.value, 1, hash.value)
}

const getTxHref = (v: MakerNode, hash: string) => {
  const txExploreUrl = $env.txExploreUrl
  return `${txExploreUrl[v.toChain]}${hash}`
}
const transferNeedTo = async (
  fromAddress: string,
  toAddress: string,
  needTo: {
    chainId: number
    amount: BigNumberish
    decimals: number
    tokenAddress: string
  },
  fromExt: any
) => {
  const ethereum = (window as any).ethereum
  if (!ethereum) {
    throw new Error('Please install metamask wallet first!')
  }

  // Check wallet
  // const walletAccount = (
  //   await ethereum.request({ method: 'eth_requestAccounts' })
  // )?.[0]
  // if (!utils.equalsIgnoreCase(walletAccount, fromAddress)) {
  //   throw new Error(
  //     `Please switch the address to ${fromAddress} in the wallet!`
  //   )
  // }

  // Ensure networkId
  await utils.ensureMetamaskNetwork(needTo.chainId, ethereum)

  // Get signer and make transfer's options
  const signer = new providers.Web3Provider(ethereum).getSigner()
  const transferOptions = {
    amount: ethers.BigNumber.from(needTo.amount),
    toAddress,
    tokenAddress: needTo.tokenAddress,
  }

  // Transfer
  let txHash = ''
  switch (needTo.chainId) {
    case 3:
    case 33: {
      const tZksync = new TransactionZksync(needTo.chainId, signer)
      await tZksync.transfer(transferOptions)
      break
    }

    case 4:
    case 44: {
      console.warn('do starknet')
      break
    }

    case 8:
    case 88: {
      const tImx = new TransactionImmutablex(needTo.chainId, signer)
      await tImx.transfer({
        ...transferOptions,
        decimals: needTo.decimals,
      })
      break
    }

    case 9:
    case 99: {
      const tLoopring = new TransactionLoopring(
        needTo.chainId,
        new Web3(ethereum)
      )
      await tLoopring.transfer({ ...transferOptions, fromAddress })
      break
    }

    case 11:
    case 511: {
      const tDydx = new TransactionDydx(needTo.chainId, new Web3(ethereum))
      await tDydx.transfer({
        ...transferOptions,
        fromAddress,
        receiverPublicKey: fromExt.dydxInfo?.starkKey,
        receiverPositionId: fromExt.dydxInfo?.positionId,
      })
      break
    }

    default: {
      const tEvm = new TransactionEvm(needTo.chainId, signer)
      await tEvm.transfer(transferOptions)
      break
    }
  }

  return { txHash }
}
// Events
const onClickStateTag = async (item: MakerNode) => {
  try {
    if (item.state != 1 || !item.needTo) {
      return
    }

    await transferNeedTo(
      item.makerAddress,
      item.userAddress,
      item.needTo,
      item.fromExt
    )

    // Update item.state
    // item.toTx = txHash
    // item.toTxHref = $env.txExploreUrl[item.toChain] + item['toTx']
    item.state = 2

    ElNotification({
      title: 'Transfer Succeed',
      message:
        'The transfer was successful! Dashboard will update data list in 15 minutes!',
      type: 'success',
    })
  } catch (err) {
    ElNotification({
      title: 'Error',
      message: `Fail: ${err.message}`,
      type: 'error',
    })
  }
}
const onClickPageButton = (next: boolean) => {
  const startTime: Date = state.rangeDate[0]
  const endTime: Date = state.rangeDate[1]
  if (!startTime || !endTime) {
    return
  }
  const duration = next ? DEFAULT_TIME_DURATION : -DEFAULT_TIME_DURATION
  state.rangeDate = [
    new Date(startTime.getTime() + duration),
    new Date(endTime.getTime() + duration),
  ]
  getMakerNodes()
}
const init = () => {
  getMakerWealth()
  getMakerNodes()
  getStatistics()
}
makerInfo.get()
reset()
init()
// When makerAddressSelected changed, get maker's data
watch(() => makerAddressSelected?.value, init)
</script>

<style lang="scss">
.head {
  display: flex;
  justify-content: flex-end;
}
.maker-header--balances__info {
  white-space: nowrap;
}
.maker {
  a {
    color: #{var(--el-table-font-color)};
    text-decoration: none;

    &:hover {
      color: #{var(--el-color-primary)};
    }
  }
}

.maker-block {
  display: block;
  margin: 0 auto;
  padding: 12px;
  background-color: white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.maker-search__item > * {
  margin-bottom: 8px;
}

.maker-header {
  border-bottom: 1px solid #e8e8e8;
  background-color: #f8f8f8;
}

.maker-header--balances {
  display: flex;
  flex-direction: row;

  .el-empty {
    padding: 0;
  }

  .el-card__header {
    font-size: 18px;
    font-weight: bold;
    color: #555555;
  }

  & > * {
    margin-right: 20px;
    flex: 1;
  }

  & > *:last-child {
    margin-right: 0;
  }

  &__names {
    margin-top: calc(#{var(--el-card-padding)} * -1);

    & .el-tabs__item {
      font-size: 13px;
      font-weight: normal;
    }
  }

  &__value {
    font-weight: bold;
  }

  &__info {
    color: #555555;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4px;

    > * {
      display: contents;
    }
  }
}

.maker-header--search {
  .el-row {
    margin-top: 10px;

    &:first-child {
      margin-top: 0;
    }
  }
}

.maker-header__statistics {
  font-size: 14px;
  color: #555555;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > * {
    margin-right: 16px;
  }
}

.user-addresses {
  max-height: 300px;
  overflow-y: scroll;

  > * {
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    text-align: center;

    &:hover {
      background-color: #f8f8f8;
      cursor: pointer;
    }

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 13px;
      color: #{var(--el-color-primary)};
    }
  }
}

.table-timestamp {
  font-size: 12px;
  color: #888888;
  width: max-content;
}

.maker__chain-tag {
  display: block;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 5px;
  text-align: center;

  &:last-child {
    margin-bottom: 0;
  }
}

.state-tag--1 {
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }
}

.chain_info_wrap {
  .chain_info {
    height: 165px;
  }

  .el-col:nth-child(n + 7) .chain_info {
    margin-top: 16px;
  }
}
</style>

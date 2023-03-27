<template>
  <div class="tx">
    <div class="title1">未知的tx数据</div>
    <div
      class="maker-block maker-header maker-header--search"
      v-loading="loadingNodes"
    >
      <el-row :gutter="20">
        <el-col :span="8">
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
        <el-col :span="8">
          <div class="title">chain</div>
          <el-select v-model="state.chainId" placeholder="Select">
            <el-option
              v-for="(item, index) in chains"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="maker-search__item">
          <div class="title">Reset | Apply</div>
          <el-button @click="reset">Reset</el-button>
          <el-button type="primary" @click="() => clickApply()"
            >Apply</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div
      class="maker-block maker-header maker-header__statistics"
      v-loading="loadingStatistics"
    >
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
    </div>
    <div class="maker-block">
      <template v-if="list.length > 0">
        <div
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
          <el-table-column label="Chain" width="80px">
            <template #default="scope">
              <div>
                {{ scope.row.tx_env }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="state" label="State" width="150">
            <template #default="{ row }">
              <el-tag
                :class="'state-tag--' + row.bind_status"
                :type="stateTags[row.bind_status]?.type"
                effect="dark"
                >{{ stateTags[row.bind_status]?.label }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column label="Transaction Hash">
            <template #default="scope">
              <div>
                <el-tag
                  v-if="scope.row.token_address"
                  type="info"
                  effect="plain"
                  size="mini"
                  >{{ scope.row.token_address }}
                </el-tag>
                <el-tag v-else type="danger" effect="plain" size="mini"
                  >Invalid</el-tag
                >
              </div>
              <div>
                <a :href="getTxHref(scope.row)" target="_blank">
                  <TextLong :content="scope.row.tx_hash" placement="bottom">
                    {{ scope.row.tx_hash }}
                  </TextLong>
                </a>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header> To </template>
            <template #default="scope">
              <a
                :href="getUserHref(scope.row, scope.row.to_address)"
                target="_blank"
              >
                <TextLong :content="scope.row.to_address" placement="bottom">
                  {{ scope.row.to_address }}
                </TextLong>
              </a>
            </template>
          </el-table-column>

          <el-table-column label="Fake Maker Address">
            <template #default="scope">
              <div>
                <a
                  :href="getUserHref(scope.row, scope.row.fake_maker_address)"
                  target="_blank"
                >
                  <TextLong
                    :content="scope.row.fake_maker_address"
                    placement="bottom"
                  >
                    {{ scope.row.fake_maker_address }}
                  </TextLong>
                </a>
              </div>
            </template>
          </el-table-column>

          <el-table-column width="145">
            <template #header> CreateTime </template>
            <template #default="scope">
              <div class="table-timestamp">
                {{ formatDate(scope.row.timestamp) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header> Amount </template>
            <template #default="{ row }">
              <TextLong :content="row.amount">
                <span class="amount-operator--plus">-</span>
                {{ row.amount }}
              </TextLong>
            </template>
          </el-table-column>

          <el-table-column>
            <template #header> 匹配的 Dashboard 交易id </template>
            <template #default="scope">
              <div v-if="scope.row.binding_potential">
                <div :key="item" v-for="item in scope.row.binding_potential">
                  <TextLong :content="item" placement="bottom">
                    {{ item }}
                  </TextLong>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-empty v-else description="Empty"></el-empty>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script lang="ts" setup>
import TextLong from '@/components/TextLong.vue'
import {
  useNotMatchMakerTxList,
  // requestStatistics,
} from '@/hooks/tx'
import { $env } from '@/env'
import dayjs from 'dayjs'
import { ref, computed, inject, reactive, watch } from 'vue'

const stateKey = {
  0: 'Error',
  1: 'multi',
  2: 'too_old',
}

const stateTags = {
  // Success: { label: '匹配成功', type: 'success' },
  Error: { label: '未匹配，需要手动匹配', type: 'danger', index: 0 },
  multi: { label: '有多个匹配', type: 'warning', index: 1 },
  too_old: { label: '旧数据', type: 'info', index: 2 },
}

const baseChains = [
  'arbitrum',
  'ethereum',
  'optimism',
  'starknet',
  'zksyncera',
  'zksynclite',
  'polygon',
  'metis',
  'boba',
  'bsc',
]
const chains = [
  {
    value: -1,
    label: 'All',
  },
].concat(
  baseChains.map((item, i) => ({
    value: i,
    label: item,
  }))
)

const status = [
  {
    value: -1,
    label: 'All',
  },
].concat(
  Object.values(stateTags).map((item) => ({
    value: +item.index,
    label: item.label,
  }))
)
// Default time duration 10800
const DEFAULT_TIME_DURATION = 1 * 24 * 60 * 60 * 1000

const makerAddressSelected: any = inject('makerAddressSelected')
const state = reactive({
  rangeDate: [] as Date[],
  chainId: -1,
  userAddressSelected: '',
  keyword: '',
  status: -1,
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
const chainNameToId = {
  ethereum: 1,
  arbitrum: 2,
  optimism: 7,
  starknet: 4,
  zksyncera: 14,
  zksynclite: 3,
}

const loadingNodes = ref(false)
const loadingStatistics = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pagesizes = computed(() =>
  Array.from(new Set([100, 200, 300, 400, Math.ceil(total.value / 100) * 100]))
)

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getTxList({ size: val })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getTxList({ current: val })
}

const getTxHref = (v: any) => {
  const txExploreUrl = $env.txExploreUrl
  return `${txExploreUrl[chainNameToId[v.tx_env]]}${v.tx_hash}`
}
const getUserHref = (v: any, address: string) => {
  const accountExploreUrl = $env.accountExploreUrl
  return `${accountExploreUrl[chainNameToId[v.tx_env]]}${address}`
}
const formatDate = (timestamp: number) => {
  return dayjs(timestamp * 1000).format()
}
const reset = () => {
  state.rangeDate = [
    dayjs().subtract(10, 'day').toDate(),
    dayjs().endOf('d').toDate(),
  ]
  state.userAddressSelected = ''
  state.keyword = ''
  state.status = -1

  getTxList()
  // getStatistics()
}

let prevMore = {}
const clickApply = () => {
  getTxList({ current: 1 })
  // getStatistics()
}

const getTxList = async (more: any = {}) => {
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
  } = await useNotMatchMakerTxList({
    makerAddress: makerAddressSelected?.value,
    chain: state.chainId === -1 ? null : baseChains[state.chainId],
    rangeDate: state.rangeDate,
    keyword: state.keyword.trim(),
    state: stateKey[state.status],
    ...prevMore,
  })
  loadingNodes.value = false
  makerNodes.value = _list.value
  total.value = _total.value
}

// Methods

// Events

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
  getTxList()
}
const init = () => getTxList()
reset()
init()
// When makerAddressSelected changed, get maker's data
watch(() => makerAddressSelected?.value, init)
</script>

<style lang="scss">
.maker-header--balances__info {
  white-space: nowrap;
}
.tx {
  margin-top: 20px;
  .title1 {
    font-size: 20px;
    padding: 20px 0;
  }
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

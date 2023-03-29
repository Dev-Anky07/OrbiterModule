<template>
  <div>
    <el-dialog v-model="detailVisible" title="交易详情" width="80%" top="5%">
      <div>
        <div class="maker-tx-info" style="display: flex">
          交易ID：
          {{ makerTx?.transactionID }}
          <span style="marigin-right: 5px">
            <el-tag type="success" effect="light" size="mini"
              >+ {{ getChainName(makerTx?.fromChain) }}
            </el-tag></span
          >
          <span style="marigin-right: 5px">
            <el-tag
              type="danger"
              effect="light"
              size="mini"
              style="marginleft: 5px"
              >- {{ getChainName(makerTx?.toChain) }}
            </el-tag></span
          >
          <span style="marigin-right: 5px">
            <el-tag
              v-if="makerTx?.txTokenName"
              type="info"
              effect="plain"
              size="mini"
              >{{ makerTx?.txTokenName }}
            </el-tag></span
          >
        </div>
        <div class="maker-tx-info">
          用户接收地址:
          <a :href="getUserHref(makerTx?.replyAccount)" target="_blank">
            {{ makerTx?.replyAccount }}
          </a>
        </div>
        <div class="maker-tx-info">
          From Tx:
          <a :href="makerTx?.fromTxHref" target="_blank">
            {{ makerTx?.['inData']?.['hash'] }}
          </a>
          <span class="table-timestamp"
            >({{ makerTx?.['inData']?.['timestamp'] }})</span
          >
        </div>
        <div class="maker-tx-info">收款金额：{{ makerTx?.inData?.value }}</div>
        <div class="maker-tx-info">应该回款金额：{{ makerTx?.toAmount }}</div>
        <div class="maker-tx-info">
          状态：
          <el-tag
            :type="stateTags[makerTx?.state]?.type"
            effect="dark"
            size="mini"
          >
            {{ stateTags[makerTx?.state]?.label }}
          </el-tag>
        </div>
      </div>
      <el-divider />
      <div v-if="makerTx">
        <el-button @click="remarkDialogVisible = true"> 添加备注 </el-button>
        <el-button
          type="info"
          @click="onUpdate(makerTx, 3)"
          v-if="makerTx.state !== 6"
        >
          标记存疑
        </el-button>
        <el-button
          v-if="makerTx.state === 3"
          type="warning"
          @click="onUpdate(makerTx, 0)"
        >
          取消确认无回款
        </el-button>
        <el-button
          type="danger"
          v-if="makerTx.state === 5 || makerTx.state === 6"
          @click="onUpdate(makerTx, 2)"
        >
          确认无回款
        </el-button>
        <el-button
          v-if="
            makerTx.state === 5 || makerTx.state === 4 || makerTx.state === 6
          "
          type="success"
          @click="() => (confirmDialogVisible = true)"
        >
          确认回款成功
        </el-button>
      </div>
      <el-divider
        v-if="makerTx && makerTx.remarkList && makerTx.remarkList.length"
      />
      <div v-if="makerTx && makerTx.remarkList && makerTx.remarkList.length">
        备注
        <div
          class="remarkList"
          v-for="item in makerTx.remarkList"
          :key="item._id"
        >
          <div>备注人：{{ item.userName }}</div>
          <div>内容人：{{ item.remark }}</div>
        </div>
      </div>
      <el-divider />
      <div class="maker-tx-info">
        <div>用户tx列表</div>
        <el-table :data="userTxs" stripe style="width: 100%">
          <el-table-column label="Tx Hash">
            <template #default="scope">
              <a
                :href="
                  getTxHref(
                    scope.row?.txHash || scope.row?.hash || scope.row?._id
                  )
                "
                target="_blank"
              >
                <TextLong
                  :content="
                    scope.row?.txHash || scope.row?.hash || scope.row?._id
                  "
                >
                  {{ scope.row?.txHash || scope.row?.hash || scope.row?._id }}
                </TextLong>
              </a>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header> Amount </template>
            <template #default="scope">
              <div>
                {{ getAmount(scope.row) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>Time </template>
            <template #default="scope">
              <div class="table-timestamp">
                <TextLong :content="getTime(scope.row)" placement="bottom"
                  >{{ getTime(scope.row) }}
                </TextLong>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template #header>操作 </template>
            <template #default="scope">
              <el-button
                size="small"
                v-if="makerTx && (makerTx.state === 5 || makerTx.state === 4)"
                type="success"
                @click="
                  () =>
                    onUpdate(
                      makerTx,
                      1,
                      scope.row?.txHash || scope.row?.hash || scope.row?._id
                    )
                "
              >
                确认回款成功
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog v-model="confirmDialogVisible" title="请输入tx hash" width="30%">
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
          <el-button @click="confirmDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="remarkDialogVisible" title="提交备注" width="30%">
      <div>
        <div>
          请输入备注：
          <el-input
            v-model="remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Please input"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="remarkDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="onSubmitRemark">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import TextLong from '@/components/TextLong.vue'
import { getUserTxs } from '@/hooks/userTx'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
// import dayjs from 'dayjs'
import { ref, defineExpose, defineEmits } from 'vue'
import { ethers } from 'ethers'
import { $env } from '../env'
import { submit, submitRemark } from '../hooks/login'
import { getChainName } from '../utils/getEnvName'
import { MakerNode } from '../hooks/maker'
import dayjs from 'dayjs'

const abiDecoder = require('abi-decoder')
const transferABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
abiDecoder.addABI(transferABI)

const emit = defineEmits(['update'])

const stateTags = {
  1: { label: '成功', type: 'success' },
  2: { label: '人工确认成功', type: 'success' },
  3: { label: '人工确认无回款', type: 'info' },
  4: { label: '多条tx匹配', type: 'warning' },
  5: { label: '待确认', type: 'danger' },
  6: { label: '存疑', type: 'danger' },
}

const detailVisible = ref(false)
const confirmDialogVisible = ref(false)
const remarkDialogVisible = ref(false)
const makerTx = ref<any>()
const userTxs = ref<any>()
const hash = ref<string>()
const remark = ref<string>('')

// const formatDate = (timestamp: number) => {
//   return dayjs(timestamp * 1000).format()
// }

const getTxHref = (hash: string) => {
  if (!makerTx.value) {
    return '#'
  }
  const txExploreUrl = $env.txExploreUrl
  return `${txExploreUrl[makerTx.value.toChain]}${hash}`
}

const getUserHref = (user: string) => {
  if (!makerTx.value) {
    return '#'
  }
  const txExploreUrl = $env.accountExploreUrl
  return `${txExploreUrl[makerTx.value.toChain]}${user}`
}

const show = (data: any) => {
  makerTx.value = data
  detailVisible.value = true
  userTxs.value = []

  if (data?.transcationId) {
    const loading = ElLoading.service({ fullscreen: true })
    getUserTxs(data.transcationId)
      .then((res: any) => {
        console.log(res)
        userTxs.value = res
      })
      .finally(() => loading.close())
  }
}

const onUpdate = async (
  item: MakerNode,
  status: 0 | 1 | 2 | 3,
  hash?: string,
  showConfrim = true
) => {
  const token = window.sessionStorage.getItem('token')

  if (!token) {
    ElMessage({
      showClose: true,
      message: '请先登录',
      type: 'error',
    })
    return false
  }

  if (status === 1 && !hash) {
    ElMessage({
      showClose: true,
      message: '参数错误',
      type: 'error',
    })
  }

  if (status !== 1 && showConfrim) {
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
      detailVisible.value = false
      emit('update')
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
const handleConfirm = async () => {
  confirmDialogVisible.value = false
  if (!makerTx.value || !hash.value) {
    return
  }
  await onUpdate(makerTx.value, 1, hash.value, false)
  hash.value = ''
}

const onSubmitRemark = async () => {
  const token = window.sessionStorage.getItem('token')

  if (!token) {
    ElMessage({
      showClose: true,
      message: '请先登录',
      type: 'error',
    })
    return false
  }

  if (!makerTx.value.transcationId || !remark.value) {
    ElMessage({
      showClose: true,
      message: '参数错误',
      type: 'error',
    })
  }

  const loading = ElLoading.service({ fullscreen: true })
  try {
    const ok = await submitRemark(makerTx.value.transcationId, remark.value)
    if (ok) {
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success',
      })
      emit('update')
      remark.value = ''
      remarkDialogVisible.value = false
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

const getAmount = (tx: any) => {
  if (tx?.op?.amount) {
    return ethers.BigNumber.from(tx.op.amount).toString()
  }

  const amount = ethers.BigNumber.from(tx?.value ? tx?.value : '0')

  if (amount.gt('0')) {
    return amount
  }

  if (tx.input?.[7] && tx.input?.[7].length > 1) {
    return tx.input?.[7] ?? ''
  }

  if (tx.input) {
    const data = abiDecoder.decodeMethod(tx.input)

    const amount = data?.params?.[1]?.value
    return amount ?? ''
  }

  if (tx.amount) {
    return tx.amount ?? ''
  }

  return ''
}

const getTime = (tx: any) => {
  if (
    tx?.timestamp &&
    (typeof tx?.timestamp === 'number' ||
      !Number.isNaN(parseInt(tx?.timestamp)))
  ) {
    return dayjs(parseInt(tx.timestamp) * 1000).format()
  }

  if (tx?.createdAt) {
    return dayjs(tx?.createdAt).format()
  }
}

defineExpose({ show })
</script>

<style lang="scss">
.maker-tx-info {
  margin-top: 10px;
}
a {
  color: #{var(--el-table-font-color)};
  text-decoration: none;

  &:hover {
    color: #{var(--el-color-primary)};
  }
}

.remarkList {
  margin-top: 5px;
}
</style>

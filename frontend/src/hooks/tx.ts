import { ref } from 'vue'
import http from '@/plugins/axios2'

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

export const useNotMatchMakerTxList = async (params: any = {}) => {
  const loading = ref(false)
  const list: any = ref([])
  const size = ref(params.size || 10)
  const current = ref(params.current || 1)
  const total = ref(0)
  transforeDate(params)
  loading.value = true
  try {
    const res: any = await http.get(`/notMatchMakerTxList`, {
      params: {
        ...params,
        rangeDate: null,
        size: size.value,
        current: current.value,
      },
    })
    if (res.code === 0) {
      const data = res.data
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

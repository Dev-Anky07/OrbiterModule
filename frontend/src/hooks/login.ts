import http from '@/plugins/axios2'
import { ElMessage } from 'element-plus'

export async function login(name: string, password: string) {
  const res = await http.get(`/login?name=${name}&password=${password}`, {})
  if (res.data.token) {
    window.sessionStorage.setItem('token', res.data.token)
  } else {
    throw new Error("can't find token")
  }
  return true
}

// 1.success 2.fail 0.取消
export async function submit(
  status: 0 | 1 | 2,
  makerTxId: string,
  hash?: string
) {
  const token = window.sessionStorage.getItem('token')

  if (!token) {
    ElMessage({
      showClose: true,
      message: '请先登录',
      type: 'error',
    })
    return false
  }
  try {
    const res = await http.get(
      `/submit?status=${status}&makerTxId=${makerTxId}&token=${token}&hash=${hash}`,
      {}
    )
    console.log(res)
    if ((res as any).code === 0) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

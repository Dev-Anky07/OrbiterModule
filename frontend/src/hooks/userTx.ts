import http from '@/plugins/axios2'

export async function getUserTxs(id: string) {
  const res = await http.get(
    `/userTxList?transactionId=${id}`,
    {}
  )
  return res.data
}

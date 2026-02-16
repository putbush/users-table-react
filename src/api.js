
const BASE = 'https://dummyjson.com/users'

export async function fetchUsers({limit=30, skip=0, sortBy=null, order=null, filters={}} = {}){
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  if(sortBy && order){
    params.set('sortBy', sortBy)
    params.set('order', order)
  }


  const url = `${BASE}?${params.toString()}`
  const res = await fetch(url)
  if(!res.ok){
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function filterUsers({key, value, limit=30, skip=0} = {}){
  const params = new URLSearchParams()
  params.set('key', key)
  params.set('value', value)
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  const url = `${BASE}/filter?${params.toString()}`
  const res = await fetch(url)
  if(!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
} // реализовал немного иначе, через функцию


import React, {useEffect, useState, useRef} from 'react'
import { fetchUsers, filterUsers } from '../api'
import UserModal from './UserModal'

const COLUMNS = [
  {key: 'lastName', label: 'Фамилия'},
  {key: 'firstName', label: 'Имя'},
  {key: 'maidenName', label: 'Отчество'},
  {key: 'age', label: 'Возраст'},
  {key: 'gender', label: 'Пол'},
  {key: 'phone', label: 'Телефон'},
  {key: 'email', label: 'Email'},
  {key: 'country', label: 'Страна'},
  {key: 'city', label: 'Город'}
]

function headerStateCycle(current){
  if(current === null) return 'asc'
  if(current === 'asc') return 'desc'
  return null
}

export default function UsersTable(){
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState({key: null, order: null})
  const [filters, setFilters] = useState({q: ''})
  const [selectedUser, setSelectedUser] = useState(null)

  const tableRef = useRef(null)
  const colWidths = useRef({})

  useEffect(()=>{
    load()
  }, [page, perPage, sort])

  async function load(){
    setLoading(true)
    setError(null)
    const skip = (page-1)*perPage
    try{
      const sortBy = sort.key
      const order = sort.order
      const data = await fetchUsers({limit: perPage, skip, sortBy, order})
      setUsers(data.users.map(u=>({...u, country: u.address?.country || '', city: u.address?.city || ''})))
      setTotal(data.total ?? data.users.length)
    }catch(e){
      setError(e.message)
    }finally{
      setLoading(false)
    }
  }

  function onHeaderClick(col){
    const next = headerStateCycle(sort.key === col ? sort.order : null)
    setSort({key: next ? col : null, order: next})
    setPage(1)
  }

  function renderSortIcon(col){
    if(sort.key !== col) return '↕'
    return sort.order === 'asc' ? '↑' : '↓'
  }

  function onRowClick(user){
    setSelectedUser(user)
  }

  function applyLocalFilter(){
    if(!filters.q) return users
    const q = filters.q.toLowerCase()
    return users.filter(u => (
      (u.firstName||'').toLowerCase().includes(q) ||
      (u.lastName||'').toLowerCase().includes(q) ||
      (u.email||'').toLowerCase().includes(q) ||
      (u.phone||'').toLowerCase().includes(q) ||
      (u.country||'').toLowerCase().includes(q) ||
      (u.city||'').toLowerCase().includes(q)
    ))
  }

  function startResize(e, key){
    const startX = e.clientX
    const th = e.target.parentElement
    const startWidth = th.offsetWidth
    function onMove(ev){
      const dx = ev.clientX - startX
      const newW = Math.min(500, Math.max(50, startWidth + dx))
      colWidths.current[key] = newW
      th.style.width = newW + 'px'
    }
    function onUp(){
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const visible = applyLocalFilter()

  return (
    <div className="table-wrap" style={{maxWidth: 1400, width: '100%'}}>
      <div className="controls">
        <div>
          <label>Поиск: <input value={filters.q} onChange={e=>setFilters(prev=>({...prev, q: e.target.value}))} placeholder="ФИО, email, телефон, город" /></label>
        </div>
        <div>
          <label>На страницу:
            <select value={perPage} onChange={e=>{setPerPage(Number(e.target.value)); setPage(1)}}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </label>
        </div>
      </div>

      {error && <div className="error">Ошибка: {error}</div>}
      <table ref={tableRef} className="users-table">
        <thead>
          <tr>
            {COLUMNS.map(c=>(
              <th key={c.key} style={{minWidth:50}}>
                <div className="th-inner" onClick={()=>onHeaderClick(c.key)}>
                  <span>{c.label}</span>
                  <span className="sort-icon">{renderSortIcon(c.key)}</span>
                </div>
                <div className="resizer" onMouseDown={(e)=>startResize(e,c.key)} title="Изменить ширину столбца" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={COLUMNS.length} style={{textAlign:'center'}}>Загрузка...</td></tr>
          ) : visible.length === 0 ? (
            <tr><td colSpan={COLUMNS.length} style={{textAlign:'center'}}>Нет данных</td></tr>
          ) : visible.map(u => (
            <tr key={u.id} onClick={()=>onRowClick(u)} className="row-clickable">
              <td>{u.lastName}</td>
              <td>{u.firstName}</td>
              <td>{u.maidenName}</td>
              <td>{u.age}</td>
              <td>{u.gender}</td>
              <td>{u.phone}</td>
              <td>{u.email}</td>
              <td>{u.country}</td>
              <td>{u.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Назад</button>
        <span>Страница {page} из {Math.max(1, Math.ceil(total/perPage))}</span>
        <button onClick={()=>setPage(p=>p+1)} disabled={page >= Math.ceil(total/perPage)}>Вперед</button>
      </div>

      {selectedUser && <UserModal user={selectedUser} onClose={()=>setSelectedUser(null)} />}
    </div>
  )
}

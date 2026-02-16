
import React from 'react'
import UsersTable from './components/UsersTable'

export default function App(){
  return (
    <div className="app">
      <header>
        <h1>Список пользователей (DummyJSON)</h1>
      </header>
      <main>
        <UsersTable />
      </main>
    </div>
  )
}

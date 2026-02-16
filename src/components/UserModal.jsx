
import React from 'react'

export default function UserModal({user, onClose}){
  if(!user) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <img src={user.image} alt="avatar" className="avatar" />
          <h2>{user.lastName} {user.firstName} {user.maidenName}</h2>
          <p><b>Возраст:</b> {user.age}</p>
          <p><b>Телефон:</b> {user.phone}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Адрес:</b> {user.address?.address}, {user.city}, {user.country}, {user.address?.postalCode}</p>
          <p><b>Рост:</b> {user.height ?? '—'}</p>
          <p><b>Вес:</b> {user.weight ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}

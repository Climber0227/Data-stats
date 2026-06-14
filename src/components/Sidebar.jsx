import { useState } from 'react'

const ACCENT_COLORS = ['#e11d48', '#d97706', '#059669', '#0891b2', '#7c3aed', '#db2777']

export default function Sidebar({ projects, activeId, onSwitch, onCreate, onRename, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    if (!newName.trim()) return
    onCreate(newName.trim())
    setNewName('')
    setAdding(false)
  }

  const handleRename = (id) => {
    if (!editName.trim()) return
    onRename(id, editName.trim())
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = (id) => {
    if (confirm('确定删除此项目及其所有数据？')) {
      onDelete(id)
    }
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-gray-50/80 border-r border-gray-200 min-h-screen relative z-20 flex flex-col">
      {/* Sidebar header */}
      <div className="px-4 py-4 border-b border-gray-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-black">数据项目</span>
        </div>
      </div>

      {/* Project tabs */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {projects.map((p, i) => {
          const isActive = p.id === activeId
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length]

          if (editingId === p.id) {
            return (
              <div key={p.id} className="px-2 py-1">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRename(p.id)
                    if (e.key === 'Escape') { setEditingId(null); setEditName('') }
                  }}
                  onBlur={() => handleRename(p.id)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )
          }

          return (
            <div
              key={p.id}
              onClick={() => onSwitch(p.id)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-white shadow-sm border border-gray-200/60'
                  : 'hover:bg-white/60 border border-transparent'
              }`}
            >
              {/* Color dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
              />

              {/* Name + count */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isActive ? 'text-black' : 'text-gray-700'}`}>
                  {p.name}
                </div>
                <div className="text-xs text-gray-400">{p.recordCount} 条记录</div>
              </div>

              {/* Actions (hover) */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(p.id)
                    setEditName(p.name)
                  }}
                  className="p-1 rounded text-gray-400 hover:text-black hover:bg-gray-200 transition-colors"
                  title="重命名"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
                {projects.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(p.id)
                    }}
                    className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="删除"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add project */}
      <div className="px-2 py-3 border-t border-gray-200/60">
        {adding ? (
          <div className="flex items-center gap-2 px-1">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') { setAdding(false); setNewName('') }
              }}
              placeholder="项目名称"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="px-2.5 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              创建
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-black hover:bg-white/60 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            新建项目
          </button>
        )}
      </div>
    </aside>
  )
}

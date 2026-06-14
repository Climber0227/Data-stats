import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function AddRecordModal({ open, record, onClose, onSubmit }) {
  const [form, setForm] = useState({ date: '', value: '', note: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (record) {
      setForm({ date: record.date, value: String(record.value), note: record.note || '' })
    } else {
      setForm({ date: new Date().toISOString().slice(0, 10), value: '', note: '' })
    }
    setError('')
  }, [record, open])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.date || !form.value) {
      setError('日期和数值为必填项')
      return
    }
    if (isNaN(Number(form.value)) || Number(form.value) < 0) {
      setError('请输入有效的数值')
      return
    }
    onSubmit({ date: form.date, value: Number(form.value), note: form.note })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-black">
                {record ? '编辑记录' : '添加记录'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">日期</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">数值</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="输入数值"
                  value={form.value}
                  onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  备注 <span className="text-gray-400 font-normal">(可选)</span>
                </label>
                <input
                  type="text"
                  placeholder="添加备注..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-xl transition-all"
                >
                  {record ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function RecordTable({ records, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (records.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">数据记录</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3 font-medium">日期</th>
              <th className="px-5 py-3 font-medium">数值</th>
              <th className="px-5 py-3 font-medium">备注</th>
              <th className="px-5 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-5 py-3 text-sm text-gray-700 font-medium">{r.date}</td>
                <td className="px-5 py-3 text-sm text-black font-semibold">{r.value.toFixed(1)}</td>
                <td className="px-5 py-3 text-sm text-gray-500 max-w-[200px] truncate">{r.note || '—'}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(r)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

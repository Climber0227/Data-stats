import { useMemo } from 'react'
import { BlurFade } from '@/components/ui/blur-fade'

export default function StatsCards({ records }) {
  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const monthRecords = records.filter(r => r.date >= monthStart)
    const monthTotal = monthRecords.reduce((sum, r) => sum + r.value, 0)
    const monthAvg = monthRecords.length ? monthTotal / monthRecords.length : 0
    const overallAvg = records.length
      ? records.reduce((sum, r) => sum + r.value, 0) / records.length
      : 0

    return { monthTotal, monthAvg, monthCount: monthRecords.length, overallAvg }
  }, [records])

  const cards = [
    {
      label: '本月合计',
      value: stats.monthTotal.toFixed(1),
      accent: '#059669',
      dot: '#059669',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: '本月日均',
      value: stats.monthAvg.toFixed(1),
      accent: '#d97706',
      dot: '#d97706',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      label: '本月记录',
      value: stats.monthCount,
      unit: '条',
      accent: '#e11d48',
      dot: '#e11d48',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      label: '总体日均',
      value: stats.overallAvg.toFixed(1),
      accent: '#0891b2',
      dot: '#0891b2',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <BlurFade key={card.label} inView={true} delay={0.1 + i * 0.08} duration={0.5} blur="4px">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-300 cursor-default group">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: card.accent }}
              >
                {card.icon}
              </div>
              <span className="text-sm text-gray-500 font-medium">{card.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-black tracking-tight">
                {card.value}
              </p>
              {card.unit && (
                <span className="text-sm font-normal text-gray-400">{card.unit}</span>
              )}
            </div>
          </div>
        </BlurFade>
      ))}
    </div>
  )
}

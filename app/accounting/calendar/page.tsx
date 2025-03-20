'use client'

import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('@/components/accounting/calendar/calendar'), { ssr: false })

export default function Inhouse() {
  return (
    <div>
      <h1 className='dark:text-gray-800' style={{ fontSize: '20px', marginBottom: '18px' }}>Transaction Calendar</h1>
      <Calendar />
    </div>
  )
}

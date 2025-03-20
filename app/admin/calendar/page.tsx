'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('@/components/accounting/calendar/calendar'), { ssr: false })

export default function Inhouse() {
  return (
    <div>
      <AdminLayout>
      <h1 className='dark:text-gray-800' style={{ fontSize: '20px', marginBottom: '18px' }}>Transaction Calendar</h1>
      <Calendar />
      </AdminLayout>
    </div>
  )
}

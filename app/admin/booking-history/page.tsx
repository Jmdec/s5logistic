import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/booking-history/Table'
import React from 'react'

const BookingHistory = () => {
  return (
    <div>
        <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default BookingHistory

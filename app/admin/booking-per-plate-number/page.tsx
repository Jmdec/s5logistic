import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/bookings-per-plate-number/Table'
import React from 'react'

const BookingsPerDriver = () => {
  return (
    <div>
        <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default BookingsPerDriver

import AdminLayout from '@/components/courier/Layout'
import DataTable from '@/components/courier/manage-order/Table'
import React from 'react'

const ManageOrder = () => {
  return (
    <div>
        <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default ManageOrder

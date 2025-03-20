import React from 'react'
import DataTable from '@/components/accounting/inhouse/peryear/Table'
import AdminLayout from '@/components/admin/AdminLayout'


export default function inhouse() {
  return (
    <div>
      <AdminLayout>
        <DataTable />
      </AdminLayout>
    </div>
  )
}

import AdminLayout from '@/components/admin/AdminLayout'
import Table from '@/components/admin/preventive-maintenance/Table'
import React from 'react'

const PreventiveMaintenance = () => {
  return (
    <div>
        <AdminLayout>
        <Table/>
      </AdminLayout>
    </div>
  )
}

export default PreventiveMaintenance

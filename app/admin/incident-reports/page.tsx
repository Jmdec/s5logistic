import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/incident-report/Table'
import React from 'react'

const IncidentReports = () => {
  return (
    <div>
      <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default IncidentReports

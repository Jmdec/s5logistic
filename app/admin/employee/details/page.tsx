import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/employee-details/Table'
import React from 'react'

const EmployeeDetails = () => {
  return (
    <div>
        <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default EmployeeDetails

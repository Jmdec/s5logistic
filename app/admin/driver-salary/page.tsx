import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/driver-salary/Table'
import React from 'react'

const DriverSalary = () => {
  return (
    <div>
      <AdminLayout>
        <DataTable/>
      </AdminLayout>
    </div>
  )
}

export default DriverSalary

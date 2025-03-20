import AdminLayout from '@/components/admin/AdminLayout'
import Archived from '@/components/admin/employee-details/ArchivedEmployees'
import React from 'react'

const EmployeeDetails = () => {
  return (
    <div>
        <AdminLayout>
        <Archived/>
      </AdminLayout>
    </div>
  )
}

export default EmployeeDetails

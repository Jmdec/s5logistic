import AdminLayout from '@/components/admin/AdminLayout'
import ArchivedVehicles from '@/components/admin/vehicle/ArchivedVehicles'
import React from 'react'

const Archived = () => {
  return (
    <div>
        <AdminLayout>
        <ArchivedVehicles/>
      </AdminLayout>
    </div>
  )
}

export default Archived

import AdminLayout from '@/components/admin/AdminLayout'
import FormComponent from '@/components/admin/booking-form/Form'
import React from 'react'

const BookingForm = () => {
  return (
    <div>
        <AdminLayout>
        <FormComponent/>
      </AdminLayout>
    </div>
  )
}

export default BookingForm

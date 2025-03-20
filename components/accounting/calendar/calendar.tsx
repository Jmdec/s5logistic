import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@/styles/calendar.css'

interface EventData {
  id: string
  name: string
  status: string
  borrower: string
  interest_percentage: number
  initial_amount: number
  payment_per_month: number
  total_payment: number
  date: string
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [modalPosition, setModalPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [modalVisible, setModalVisible] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/calendar-acc`)
      const data = await response.json()
      if (data && Array.isArray(data.loans)) {
        const unpaidEvents = data.loans.filter((event: any) => event.status === 'unpaid')
        setEvents(unpaidEvents)
      } else {
        console.error('Expected an array under "loans" but got:', data.loans)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEventClick = (clickInfo: any) => {
    const clickedEventId = clickInfo.event.id
    const event = events.find((event) => event.id.toString() === clickedEventId)
    if (event) {
      setSelectedEvent(event)
      const eventElement = clickInfo.el as HTMLElement
      const { left, top, width, height } = eventElement.getBoundingClientRect()
      setModalPosition({
        left: left + width + 10,
        top: top + height / 2 - 50
      })
      setModalVisible(true)
    }
  }

  const handleOutsideClick = (e: any) => {
    if (
      selectedEvent &&
      !e.target.closest('.event-modal') &&
      !e.target.closest('.fc-daygrid-day')
    ) {
      setModalVisible(false)
    }
  }

  const handleScroll = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    if (modalVisible) {
      document.addEventListener('click', handleOutsideClick)
      document.addEventListener('scroll', handleScroll)
    } else {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('scroll', handleScroll)
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [modalVisible, selectedEvent])

  const renderEventDetails = () => {
    if (!selectedEvent || !modalVisible) return null
    return (
      <div
        className="event-modal"
        style={{ left: `${modalPosition.left}px`, top: `${modalPosition.top}px` }}
      >
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Details</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Borrower:</strong> {selectedEvent.borrower}</p>
            <p><strong>Interest Percentage:</strong> {selectedEvent.interest_percentage}%</p>
            <p><strong>Initial Amount:</strong> ₱{selectedEvent.initial_amount.toLocaleString()}</p>
            <p><strong>Payment Per Month:</strong> ₱{selectedEvent.payment_per_month.toLocaleString()}</p>
            <p><strong>Total Payment:</strong> ₱{selectedEvent.total_payment.toLocaleString()}</p>
          </div>
        </div>
        <div className="modal-arrow" />
      </div>
    )
  }

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full
     max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:text-gray-800">

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: event.id.toString(),
          title: event.borrower,
          date: event.date,
        }))}
        eventClick={handleEventClick}
        height={400}
        contentHeight="auto"
      />
      {renderEventDetails()}
    </div>
  )
}

export default Calendar

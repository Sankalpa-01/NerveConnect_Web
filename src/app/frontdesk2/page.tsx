'use client'
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

// Define types
type AppointmentType = "Consultation" | "Follow-up" | "Check-up" | "Emergency"

interface Appointment {
  id: number
  patientName: string
  date: string
  time: string
  type: AppointmentType
  status: "completed" | "in-progress" | "scheduled" | "confirmed" // Add status
}

interface CurrentAppointment {
  patientName: string
  date: string
  time: string
  type: AppointmentType
  status: "completed" | "in-progress" | "scheduled" | "confirmed"
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2023-06-15",
    time: "10:00 AM",
    type: "Consultation",
    status: "confirmed", // Add status
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2023-06-15",
    time: "11:30 AM",
    type: "Follow-up",
    status: "scheduled", // Add status
  },
]

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

const FrontDeskDashboard: React.FC = () => {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>("")
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments)
  const [recognitionSupported, setRecognitionSupported] =
    useState<boolean>(false)
  const [currentAppointment, setCurrentAppointment] =
    useState<CurrentAppointment>({
      patientName: "",
      date: "",
      time: "",
      type: "Consultation",
      status: "completed",
    })

  const recognitionRef = useRef<any>(null)

  const handleLogout = () => {
    // Add any logout logic here (clear session, etc.)
    router.push('/signin')
  }

  useEffect(() => {
    const checkRecognitionSupport = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      return !!SpeechRecognition
    }

    const initializeRecognition = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + " " + finalTranscript)
          parseVoiceInput(finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
      }
    }

    if (checkRecognitionSupport()) {
      setRecognitionSupported(true)
      initializeRecognition()
    }
  }, [])

  const parseVoiceInput = (text: string) => {
    const lowerText = text.toLowerCase()

    // Simple parsing logic for appointment booking
    const nameMatch = lowerText.match(
      /(?:book|schedule|appointment for|patient)\s+([a-zA-Z\s]+)/
    )
    const dateMatch = lowerText.match(
      /(?:on|for)\s+(\w+\s+\d{1,2}|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2})/
    )
    const timeMatch = lowerText.match(
      /(?:at|time)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/
    )

    if (nameMatch) {
      setCurrentAppointment((prev) => ({
        ...prev,
        patientName: nameMatch[1].trim(),
      }))
    }

    if (dateMatch) {
      setCurrentAppointment((prev) => ({
        ...prev,
        date: dateMatch[1],
      }))
    }

    if (timeMatch) {
      setCurrentAppointment((prev) => ({
        ...prev,
        time: timeMatch[1],
      }))
    }
  }

  const startRecording = () => {
    if (recognitionSupported && recognitionRef.current) {
      setIsRecording(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false)
      recognitionRef.current.stop()
    }
  }

  const bookAppointment = () => {
    if (
      currentAppointment.patientName &&
      currentAppointment.date &&
      currentAppointment.time
    ) {
      const newAppointment: Appointment = {
        id: appointments.length + 1,
        patientName: currentAppointment.patientName,
        date: currentAppointment.date,
        time: currentAppointment.time,
        type: currentAppointment.type,
        status: currentAppointment.status,
      }
      setAppointments([...appointments, newAppointment])
      setCurrentAppointment({
        patientName: "",
        date: "",
        time: "",
        type: "Consultation",
        status: "completed",
      })
      setTranscript("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Front Desk Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Reception</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Appointment Booking */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Voice Appointment Booking
            </h2>

            {!recognitionSupported ? (
              <div className="text-center p-8">
                <p className="text-red-600 mb-4">
                  Speech recognition is not supported in your browser.
                </p>
                <p className="text-gray-600">
                  Please use Chrome, Safari, or Edge for voice features.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Voice Recording Controls */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition duration-300 ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 recording-animation"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isRecording ? "🛑" : "🎤"}
                    </button>
                    {isRecording && (
                      <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-400 pulse-ring"></div>
                    )}
                  </div>
                  <p className="mt-4 text-gray-600">
                    {isRecording
                      ? "Listening... Click to stop"
                      : "Click to start voice booking"}
                  </p>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Voice Transcript:
                    </h4>
                    <p className="text-gray-700">{transcript}</p>
                  </div>
                )}

                {/* Parsed Appointment Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Appointment Details:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={currentAppointment.patientName}
                        onChange={(e) =>
                          setCurrentAppointment({
                            ...currentAppointment,
                            patientName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        value={currentAppointment.date}
                        onChange={(e) =>
                          setCurrentAppointment({
                            ...currentAppointment,
                            date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/DD/YYYY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={currentAppointment.time}
                        onChange={(e) =>
                          setCurrentAppointment({
                            ...currentAppointment,
                            time: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="HH:MM AM/PM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={currentAppointment.type}
                        onChange={(e) =>
                          setCurrentAppointment({
                            ...currentAppointment,
                            type: e.target.value as AppointmentType,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Check-up">Check-up</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={bookAppointment}
                    disabled={
                      !currentAppointment.patientName ||
                      !currentAppointment.date ||
                      !currentAppointment.time
                    }
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Book Appointment
                  </button>
                </div>

                {/* Voice Commands Help */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Voice Commands Examples:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "Book appointment for John Smith"</li>
                    <li>• "Schedule patient Mary Johnson on June 15th"</li>
                    <li>• "Appointment at 2:30 PM"</li>
                    <li>• "Schedule for tomorrow at 10 AM"</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Today's Appointments
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="card-hover bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">
                        {appointment.time}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
            <div className="text-3xl font-bold text-blue-600">
              {appointments.length}
            </div>
            <div className="text-gray-600">Total Appointments</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
            <div className="text-3xl font-bold text-green-600">
              {
                appointments.filter(
                  (apt) => apt.date === new Date().toISOString().split("T")[0]
                ).length
              }
            </div>
            <div className="text-gray-600">Today's Appointments</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
            <div className="text-3xl font-bold text-orange-600">
              {recognitionSupported ? "✓" : "✗"}
            </div>
            <div className="text-gray-600">Voice Recognition</div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .recording-animation {
          animation: pulse 1.5s infinite;
        }

        .pulse-ring {
          animation: pulse-ring 1.5s infinite;
          opacity: 0;
          z-index: -1;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          70%,
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .card-hover:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  )
}

export default FrontDeskDashboard

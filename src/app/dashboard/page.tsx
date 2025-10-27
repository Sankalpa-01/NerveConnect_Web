"use client"
import React, { useEffect, useState } from "react"
import {
  Plus,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Clock,
  X,
  Heart,
  Thermometer,
  Activity,
  Bell,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Edit3,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Settings,
  Star,
  MessageSquare,
  FileText,
  Users,
  Calendar as CalendarIcon,
  PieChart,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  Bookmark,
  Archive,
  MoreVertical,
  Printer,
  Share2,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Moon,
  Sun,
  Globe,
  Shield,
  Zap as ZapIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Patient {
  id: string
  name: string
  age: number
  phone: string
  email: string
  address: string
  createdAt: string
  userId: string
  diseases?: Array<string | { id: string; name: string; patientId: string }>
}

interface Appointment {
  id: string
  date: string
  diagnosis: string
  symptoms: string
  temperature?: number
  bloodPressure?: string
  heartRate?: number
  oxygenSaturation?: number
  instructions?: string
  followUpInDays?: number
  patientId: string
  aiAnalysis?: {
    summary: string
    judgment: string
    reason: string
  }
}

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  completedToday: number
  pendingAppointments: number
}

// Helper function for deterministic time formatting (HH:mm UTC)
function formatTimeUTC(isoString: string) {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} UTC`;
}

const EnhancedDoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [newPatientData, setNewPatientData] = useState<Partial<Patient>>({})
  const [diseasesInput, setDiseasesInput] = useState("")

  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [appointmentData, setAppointmentData] = useState<Partial<Appointment>>(
    {}
  )
  const [selectedPatientId, setSelectedPatientId] = useState("")

  const [selectedAppointment, setSelectedAppointment] = useState<
    (Appointment & { patient: Patient }) | null
  >(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [AIAnalysis, setAIAnalysis] = useState<string | null>(null)

  const [userName, setUserName] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      message: "New patient added successfully",
      type: "success",
      timestamp: new Date().toISOString(), // store as string
      read: false,
    },
    {
      id: "2",
      message: "Appointment scheduled for tomorrow",
      type: "info",
      timestamp: new Date(Date.now() - 300000).toISOString(), // store as string
      read: false,
    },
  ])
  const [prescriptionData, setPrescriptionData] = useState<
    Record<string, string>
  >({})
  const [isEditingPrescription, setIsEditingPrescription] =
    useState<boolean>(false)
  const [tempPrescription, setTempPrescription] = useState<string>("")
  const [isSavingData, setIsSavingData] = useState<boolean>(false)

  const currentPrescription: string = selectedAppointment
    ? prescriptionData[selectedAppointment.id]
    : ""

  const handleAppointmentClick = (
    appointment: Appointment & { patient: Patient }
  ) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const router = useRouter()

  // Fetch all patients
  const getAllPatients = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/patient", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      setPatients(data)
      setLoading(false)
    } catch (err) {
      setError("Error fetching patients")
      setLoading(false)
    }
  }

  // Fetch all appointments
  const getAllAppointments = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/appointment", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      setAppointments(data)
      setLoading(false)
    } catch (err) {
      setError("Error fetching appointments")
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPatients()
    getAllAppointments()
  }, [])

  // New Patient Function
  const submitPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    const diseasesArray = diseasesInput
      ? diseasesInput
          .split(",")
          .map((d) => ({ name: d.trim() }))
          .filter((d) => d.name)
      : []

    const payload = {
      name: newPatientData.name || "",
      age: Number(newPatientData.age) || 0,
      phone: newPatientData.phone || "",
      email: newPatientData.email || "",
      address: newPatientData.address || "",
      diseases: diseasesArray,
    }

    const res = await fetch("/api/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return console.error(data.error)
    setPatients((prev) => [data.patient, ...prev])
    setNewPatientData({})
    setDiseasesInput("")
    setShowAddPatientModal(false)

    // Add notification
    const notification = {
      id: Date.now().toString(),
      message: `New patient ${data.patient.name} added`,
      type: "success",
      timestamp: new Date().toISOString(), // store as string
      read: false,
    }
    setNotifications((prev) => [notification, ...prev])
  }

  // New Appointment Function
  const submitAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      date: appointmentData.date,
      diagnosis: appointmentData.diagnosis || "",
      symptoms: appointmentData.symptoms || "",
      temperature: Number(appointmentData.temperature) || null,
      bloodPressure: appointmentData.bloodPressure || null,
      heartRate: Number(appointmentData.heartRate) || null,
      oxygenSaturation: Number(appointmentData.oxygenSaturation) || null,
      instructions: appointmentData.instructions || null,
      followUpInDays: Number(appointmentData.followUpInDays) || null,
      patientId: selectedPatientId,
    }

    const res = await fetch("/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) return console.error(data.error)
    setAppointments((prev) => [data.appointment, ...prev])
    setAppointmentData({})
    setSelectedPatientId("")
    setShowAddAppointmentModal(false)

    // Add notification
    const notification = {
      id: Date.now().toString(),
      message: `New appointment scheduled for ${new Date(
        payload.date ?? ""
      ).toLocaleDateString()}`,
      type: "info",
      timestamp: new Date().toISOString(), // store as string
      read: false,
    }

    setNotifications((prev) => [notification, ...prev])
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/signin")
  }

  // Get current username
  const getCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/current", {
        method: "GET",
        credentials: "include",
      })
      const data = await res.json()
      setUserName(data.username)
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  // // Fetch today's appointment count
  // useEffect(() => {
  //   const fetchTodayCount = async () => {
  //     try {
  //       const res = await fetch("/api/appointment/today", {
  //         method: "GET",
  //         credentials: "include",
  //       })
  //       const data = await res.json()
  //       setCount(data.count || 0)
  //     } catch (error) {
  //       console.error("Error fetching today's appointments:", error)
  //     }
  //   }

  //   fetchTodayCount()
  // }, [])

  // AI Analysis Function
  const aianalysis = async (
    appointment: Appointment & { patient: Patient }
  ): Promise<void> => {
    try {
      const res = await fetch(`/api/ai_analysis`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ appointment }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "AI analysis failed")

      console.log("AI Analysis Result:", data)

      setPrescriptionData((prev) => ({
        ...prev,
        [appointment.id]: data.result,
      }))

      const notification = {
        id: Date.now().toString(),
        message: `AI prescription generated for ${appointment.patient.name}`,
        type: "info",
        timestamp: new Date().toISOString(), // store as string
        read: false,
      }
      setNotifications((prev) => [notification, ...prev])
    } catch (error) {
      console.error("AI Analysis Error:", error)
    }
  }

  // Handle AI Analysis Save
  const handleAISave = async (): Promise<void> => {
    try {
      await fetch("/api/appointment/aiAnalysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment?.id,
          aiAnalysis: currentPrescription,
        }),
      })
      setShowDetailsModal(false)
      setSelectedAppointment(null)
      // Clear the prescription for this specific appointment
      if (selectedAppointment) {
        setPrescriptionData((prev) => ({
          ...prev,
          [selectedAppointment.id]: "",
        }))
      }
    } catch (error) {
      console.error("Error saving AI analysis:", error)
    }
  }

  const handlePrescriptionSave = async (): Promise<void> => {
    if (!selectedAppointment) return
    setIsSavingData(true)
    try {
      await fetch("/api/appointment/aiAnalysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          aiAnalysis: currentPrescription,
        }),
      })
      setIsEditingPrescription(false)
    } catch (error) {
      console.error("Error saving prescription:", error)
    } finally {
      setIsSavingData(false)
    }
  }

  const handlePrescriptionEdit = (): void => {
    setTempPrescription(currentPrescription)
    setIsEditingPrescription(true)
  }

  const handlePrescriptionCancel = (): void => {
    setTempPrescription("")
    setIsEditingPrescription(false)
  }

  const handlePrescriptionUpdate = (): void => {
    if (selectedAppointment) {
      setPrescriptionData((prev) => ({
        ...prev,
        [selectedAppointment.id]: tempPrescription,
      }))
    }
    setIsEditingPrescription(false)
  }

  const handlePrint = (): void => {
    window.print()
  }

  // Filter functions
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.diseases &&
        patient.diseases.some((d) =>
          typeof d === "string"
            ? d.toLowerCase().includes(searchTerm.toLowerCase())
            : d.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  )

  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter(
        (appointment) =>
          appointment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Notification functions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
  }

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVitalColor = (vital: string, value: number | string) => {
    if (vital === "heartRate" && typeof value === "number") {
      if (value < 60 || value > 100) return "text-red-600"
      return "text-green-600"
    }
    if (vital === "temperature" && typeof value === "number") {
      if (value > 99.5) return "text-red-600"
      return "text-green-600"
    }
    if (vital === "oxygenSaturation" && typeof value === "number") {
      if (value < 95) return "text-red-600"
      return "text-green-600"
    }
    return "text-gray-700"
  }

  // Add darkMode and selectedTab state
  const [darkMode, setDarkMode] = useState(false)
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "patients" | "appointments" | "analytics"
  >("overview")

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-100 via-white to-purple-100"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } sticky top-0 z-50 rounded-b-3xl mx-2 transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            {/* Left side - Logo and Title (clickable) */}
            <div
              className="flex items-center space-x-5 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight drop-shadow-lg hover:opacity-80 transition-opacity">
                  AI Doctor Dashboard
                </h1>
                <p
                  className={`text-base font-medium mt-1 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Intelligent Healthcare Management
                </p>
              </div>
            </div>

            {/* Right side - Dark Mode Toggle and User Info */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`p-3 ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-100"
                } transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400`}
                aria-label="Toggle Dark Mode"
                type="button"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>

              {/* User Info - closer to right corner */}
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span
                  className={`font-semibold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Dr. {userName}
                </span>
              </div>

              {/* Logout Button - positioned at the corner */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-2xl hover:from-red-600 hover:to-red-700 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <div
          className={`flex space-x-1 p-1 rounded-xl transition-colors ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {["overview", "patients", "appointments", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTab === tab
                  ? darkMode
                    ? "bg-gray-700 text-white shadow-md"
                    : "bg-white text-gray-900 shadow-md"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="max-w-7xl mx-auto px-8 py-10 space-y-10 transition-colors">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 rounded-full blur-2xl z-0" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-500 font-semibold">Total Patients</p>
                  <h3
                    className={`text-4xl font-extrabold text-${
                      darkMode ? "white" : "gray-900"
                    } mt-2 tracking-tight`}
                  >
                    {patients.length}
                  </h3>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl shadow-md">
                  <User className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-base text-green-600 font-semibold">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span>
                  {patients.length > 0
                    ? Math.round((patients.length / 10) * 100)
                    : 0}
                  % from last month
                </span>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 opacity-30 rounded-full blur-2xl z-0" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-500 font-semibold">
                    Total Appointments
                  </p>
                  <h3
                    className={`text-4xl font-extrabold text-${
                      darkMode ? "white" : "gray-900"
                    } mt-2 tracking-tight`}
                  >
                    {Array.isArray(appointments) ? appointments.length : 0}
                  </h3>
                </div>
                <div className="p-4 bg-purple-100 rounded-xl shadow-md">
                  <Calendar className="h-7 w-7 text-purple-600" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-base text-blue-600 font-semibold">
                <Clock className="h-5 w-5 mr-2" />
                <span>{count} scheduled today</span>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-md p-8 border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-200 to-yellow-200 opacity-30 rounded-full blur-2xl z-0" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-gray-500 font-semibold">Completed Today</p>
                  <h3
                    className={`text-4xl font-extrabold text-${
                      darkMode ? "white" : "gray-900"
                    } mt-2 tracking-tight`}
                  >
                    {
                      Array.isArray(appointments)
                        ? appointments.filter(
                            (a) =>
                              new Date(a.date).toDateString() ===
                              new Date().toDateString()
                          ).length
                        : 0
                    }
                  </h3>
                </div>
                <div className="p-4 bg-green-100 rounded-xl shadow-md">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <div className="mt-6 flex items-center text-base text-yellow-600 font-semibold">
                <Activity className="h-5 w-5 mr-2" />
                <span>85% satisfaction rate</span>
              </div>
            </div>
          </div>

          {/* Recent Activity and Upcoming Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Activity */}
            <div
              className={`lg:col-span-1 rounded-3xl shadow-md p-8 border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Activity
              </h2>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div
                    className={`${darkMode ? "text-gray-400" : "text-gray-400"}`}
                  >
                    No recent activity
                  </div>
                ) : (
                  notifications.slice(0, 6).map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                      }`}
                      onClick={() => markNotificationAsRead(activity.id)}
                    >
                      <div
                        className={`flex-shrink-0 p-2 rounded-full ${
                          activity.type === "success"
                            ? darkMode
                              ? "bg-green-900 text-green-400"
                              : "bg-green-100 text-green-600"
                            : activity.type === "error"
                            ? darkMode
                              ? "bg-red-900 text-red-400"
                              : "bg-red-100 text-red-600"
                            : darkMode
                            ? "bg-blue-900 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {activity.type === "success" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : activity.type === "error" ? (
                          <AlertCircle className="h-5 w-5" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {activity.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {formatTimeUTC(activity.timestamp)}
                        </p>
                      </div>
                      {!activity.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div
              className={`lg:col-span-2 rounded-3xl shadow-md p-8 border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Upcoming Appointments
              </h2>
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full divide-y ${
                    darkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <thead>
                    <tr>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Patient
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Time
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Diagnosis
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Status
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    {Array.isArray(appointments)
                      ? appointments.filter(
                          (a) =>
                            a.date &&
                            new Date(a.date) >= new Date() &&
                            (!(a as any).status ||
                              (a as any).status === "scheduled")
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .slice(0, 5)
                        .map((appointment) => {
                          const patient = patients.find(
                            (p) => p.id === appointment.patientId
                          )
                          return (
                            <tr
                              key={appointment.id}
                              className={`transition-colors duration-150 cursor-pointer ${
                                darkMode
                                  ? "hover:bg-gray-700"
                                  : "hover:bg-blue-50"
                              }`}
                              onClick={() =>
                                patient &&
                                handleAppointmentClick({
                                  ...appointment,
                                  patient,
                                })
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                    {patient?.name?.charAt(0) || "P"}
                                  </div>
                                  <div className="ml-4">
                                    <div
                                      className={`text-sm font-medium ${
                                        darkMode ? "text-white" : "text-gray-900"
                                      }`}
                                    >
                                      {patient?.name || "Unknown Patient"}
                                    </div>
                                    <div
                                      className={`text-sm ${
                                        darkMode
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {patient?.age || "N/A"} years
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {appointment.date
                                    ? new Date(
                                        appointment.date
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </div>
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {appointment.date
                                    ? new Date(
                                        appointment.date
                                      ).toLocaleDateString()
                                    : ""}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {appointment.diagnosis || "N/A"}
                                </div>
                                <div
                                  className={`text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {appointment.symptoms
                                    ?.split(",")
                                    .slice(0, 2)
                                    .join(", ") || "No symptoms"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                    (appointment as any).status || "scheduled"
                                  )}`}
                                >
                                  {(appointment as any).status || "scheduled"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className={`${
                                    darkMode
                                      ? "text-blue-400 hover:text-blue-300"
                                      : "text-blue-600 hover:text-blue-900"
                                  }`}
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTab === "patients" && (
        <div className="max-w-7xl mx-auto px-8 py-10 transition-colors">
          {/* Patients Section*/}
          <section
            className={`rounded-3xl shadow-md overflow-hidden border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`p-8 border-b transition-colors ${
                darkMode
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${
                      darkMode ? "bg-blue-900" : "bg-blue-100"
                    }`}
                  >
                    <User
                      className={`h-6 w-6 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } tracking-tight`}
                  >
                    Patients
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Patient</span>
                </button>
              </div>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`animate-pulse h-20 rounded-2xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12">
                  <User
                    className={`h-14 w-14 mx-auto mb-4 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No patients found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl border group ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                          : "bg-white/80 hover:bg-blue-50 border-gray-100"
                      }`}
                      onClick={() => {
                        const patientAppointments = Array.isArray(appointments)
                          ? appointments.filter(
                              (a) => a.patientId === patient.id
                            )
                          : [];
                        if (patientAppointments.length > 0) {
                          setSelectedAppointment({
                            ...patientAppointments[0],
                            patient,
                          })
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-bold text-lg transition-colors ${
                              darkMode
                                ? "text-white group-hover:text-blue-400"
                                : "text-gray-900 group-hover:text-blue-700"
                            }`}
                          >
                            {patient.name}
                          </h3>
                          <div
                            className={`flex items-center space-x-6 mt-2 text-base ${
                              darkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{patient.age} years</span>
                            </span>
                            <span className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{patient.email}</span>
                            </span>
                          </div>
                          {patient.diseases && patient.diseases.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {patient.diseases.map((disease, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-3 py-1 rounded-lg font-semibold ${
                                    darkMode
                                      ? "bg-red-900 text-red-300"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {typeof disease === "string"
                                    ? disease
                                    : disease.name || "Unknown Disease"}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-base font-semibold ${
                            darkMode ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      {selectedTab === "appointments" && (
        <div className="max-w-7xl mx-auto px-8 py-10 transition-colors">
          {/* Appointments Section (moved from overview) */}
          <section
            className={`rounded-3xl shadow-md overflow-hidden border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`p-8 border-b transition-colors ${
                darkMode
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-100 bg-gradient-to-r from-green-50 to-teal-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${
                      darkMode ? "bg-green-900" : "bg-green-100"
                    }`}
                  >
                    <Calendar
                      className={`h-6 w-6 ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    } tracking-tight`}
                  >
                    Appointments
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddAppointmentModal(true)}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Appointment</span>
                </button>
              </div>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`animate-pulse h-20 rounded-2xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar
                    className={`h-14 w-14 mx-auto mb-4 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No appointments found
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => {
                    const patient = patients.find(
                      (p) => p.id === appointment.patientId
                    )
                    return (
                      <div
                        key={appointment.id}
                        onClick={() =>
                          patient &&
                          handleAppointmentClick({ ...appointment, patient })
                        }
                        className={`rounded-2xl p-6 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl border group ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                            : "bg-white/80 hover:bg-green-50 border-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3
                              className={`font-bold text-lg transition-colors ${
                                darkMode
                                  ? "text-white group-hover:text-green-400"
                                  : "text-gray-900 group-hover:text-green-700"
                              }`}
                            >
                              {appointment.diagnosis}
                            </h3>
                            <div
                              className={`flex items-center space-x-6 mt-2 text-base ${
                                darkMode ? "text-gray-300" : "text-gray-500"
                              }`}
                            >
                              <span className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {appointment.date
                                    ? new Date(
                                        appointment.date
                                      ).toLocaleDateString()
                                    : ""}
                                </span>
                              </span>
                              <span className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {appointment.date
                                    ? new Date(
                                        appointment.date
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : ""}
                                </span>
                              </span>
                            </div>
                            <p
                              className={`text-base mt-2 ${
                                darkMode ? "text-gray-300" : "text-gray-500"
                              }`}
                            >
                              {appointment.symptoms}
                            </p>
                            {patient && (
                              <div className="mt-3 flex items-center">
                                <User
                                  className={`h-4 w-4 mr-2 ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-semibold ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {patient.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                (appointment as any).status || "scheduled"
                              )}`}
                            >
                              {(appointment as any).status || "scheduled"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
      {selectedTab === "analytics" && (
        <div className="max-w-7xl mx-auto px-8 py-10">
          <h2
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Analytics
          </h2>
          <div className="bg-white/70 dark:bg-gray-800 rounded-3xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-300">
              Analytics tab content goes here.
            </p>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`backdrop-blur-2xl rounded-3xl w-full max-w-6xl shadow-md relative h-[calc(100vh-32px)] flex flex-col border ${
              darkMode
                ? "bg-gray-800/90 border-gray-700"
                : "bg-white/80 border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-3xl relative shrink-0">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors text-xl"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold pr-10 tracking-tight text-white">
                {selectedAppointment.diagnosis}
              </h2>
              <p className="text-blue-100 text-base mt-2">
                Medical Record Details
              </p>
            </div>

            {/* Content - Two Column Layout */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Patient Information */}
                    <div
                      className={`rounded-2xl p-6 shadow-md ${
                        darkMode ? "bg-gray-700/60" : "bg-blue-50/60"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-5 flex items-center text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        Patient Information
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Name
                          </span>
                          <p
                            className={`font-semibold text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.patient.name}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Age
                          </span>
                          <p
                            className={`font-semibold text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.patient.age} years
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Email
                          </span>
                          <p
                            className={`font-medium text-sm ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.patient.email}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Phone
                          </span>
                          <p
                            className={`font-medium text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.patient.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div
                      className={`rounded-2xl p-6 shadow-md ${
                        darkMode ? "bg-gray-700/60" : "bg-green-50/60"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-5 flex items-center text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        Appointment Details
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Date & Time
                          </span>
                          <p
                            className={`font-semibold text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(
                              selectedAppointment.date
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Symptoms
                          </span>
                          <p
                            className={`text-base leading-relaxed mt-2 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.symptoms}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Instructions
                          </span>
                          <p
                            className={`text-base leading-relaxed mt-2 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.instructions ||
                              "None provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Vital Signs */}
                    <div
                      className={`rounded-2xl p-6 shadow-md ${
                        darkMode ? "bg-gray-700/60" : "bg-red-50/60"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-5 flex items-center text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        Vital Signs
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div
                          className={`rounded-xl p-5 text-center border shadow-sm ${
                            darkMode
                              ? "bg-gray-600/80 border-gray-500"
                              : "bg-white/80 border-gray-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold uppercase mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Blood Pressure
                          </div>
                          <p
                            className={`text-2xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.bloodPressure || "N/A"}
                          </p>
                        </div>
                        <div
                          className={`rounded-xl p-5 text-center border shadow-sm ${
                            darkMode
                              ? "bg-gray-600/80 border-gray-500"
                              : "bg-white/80 border-gray-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold uppercase mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Heart Rate
                          </div>
                          <p
                            className={`text-2xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.heartRate || "N/A"}{" "}
                            <span className="text-base">bpm</span>
                          </p>
                        </div>
                        <div
                          className={`rounded-xl p-5 text-center border shadow-sm ${
                            darkMode
                              ? "bg-gray-600/80 border-gray-500"
                              : "bg-white/80 border-gray-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold uppercase mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Oxygen Saturation
                          </div>
                          <p
                            className={`text-2xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.oxygenSaturation || "N/A"}
                            <span className="text-base">%</span>
                          </p>
                        </div>
                        <div
                          className={`rounded-xl p-5 text-center border shadow-sm ${
                            darkMode
                              ? "bg-gray-600/80 border-gray-500"
                              : "bg-white/80 border-gray-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold uppercase mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Temperature
                          </div>
                          <p
                            className={`text-2xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedAppointment.temperature || "N/A"}
                            <span className="text-base">°F</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AI Prescription */}
                    <div
                      className={`rounded-2xl p-6 shadow-md ${
                        darkMode ? "bg-gray-700/60" : "bg-purple-50/60"
                      }`}
                    >
                      <h3
                        className={`font-bold mb-5 flex items-center text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        AI Prescription
                      </h3>
                      <button
                        onClick={() => aianalysis(selectedAppointment)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-md"
                      >
                        <Zap className="h-5 w-5" />
                        Generate AI Prescription
                      </button>

                      {currentPrescription ? (
                        <div
                          className={`rounded-xl p-5 border mt-6 shadow-sm ${
                            darkMode
                              ? "bg-gray-600/90 border-gray-500"
                              : "bg-white/90 border-gray-200"
                          }`}
                        >
                          {isEditingPrescription ? (
                            <div className="space-y-4">
                              <textarea
                                value={tempPrescription}
                                onChange={(e) =>
                                  setTempPrescription(e.target.value)
                                }
                                className={`w-full p-4 border rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base ${
                                  darkMode
                                    ? "bg-gray-700 text-white border-gray-600"
                                    : "bg-white text-black border-gray-300"
                                }`}
                                rows={6}
                                placeholder="Enter prescription details..."
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={handlePrescriptionUpdate}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-base font-semibold transition-colors"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={handlePrescriptionCancel}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-base font-semibold transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p
                                className={`text-base leading-relaxed mb-5 whitespace-pre-wrap ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {currentPrescription}
                              </p>
                              <div className="flex gap-3 flex-wrap">
                                <button
                                  onClick={handlePrescriptionEdit}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-base font-semibold transition-colors flex items-center gap-2"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={handlePrescriptionSave}
                                  disabled={isSavingData}
                                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-xl text-base font-semibold transition-colors flex items-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    />
                                  </svg>
                                  {isSavingData ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={handlePrint}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-base font-semibold transition-colors flex items-center gap-2"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v8"
                                    />
                                  </svg>
                                  Print
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`rounded-xl p-8 border-2 border-dashed text-center mt-6 ${
                            darkMode
                              ? "bg-gray-600/80 border-gray-500"
                              : "bg-white/80 border-gray-300"
                          }`}
                        >
                          <div
                            className={`mb-3 ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            <Zap className="w-8 h-8 mx-auto" />
                          </div>
                          <p
                            className={`text-lg ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            AI prescription will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-md relative max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
              <h3
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } flex items-center space-x-3`}
              >
                <User className="h-6 w-6 text-blue-600" />
                <span>Add New Patient</span>
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-3 hover:bg-blue-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <form onSubmit={submitPatient} className="p-8 space-y-5">
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="Enter patient name"
                  value={newPatientData.name || ""}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Age
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  type="number"
                  placeholder="Enter age"
                  value={newPatientData.age || ""}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      age: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="Enter phone number"
                  value={newPatientData.phone || ""}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  type="email"
                  placeholder="Enter email address"
                  value={newPatientData.email || ""}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Address
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="Enter address"
                  value={newPatientData.address || ""}
                  onChange={(e) =>
                    setNewPatientData({
                      ...newPatientData,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Diseases (Optional)
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="Enter diseases separated by commas"
                  value={diseasesInput}
                  onChange={(e) => setDiseasesInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-lg font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 text-lg font-semibold shadow-md"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={submitAppointment}
            className="bg-white/90 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-md border border-gray-200 h-[calc(100vh-32px)] flex flex-col overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-3xl shrink-0">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                New Appointment
              </h2>
              <button
                onClick={() => setShowAddAppointmentModal(false)}
                className="p-3 hover:bg-green-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  value={appointmentData.date || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Select Patient
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 text-lg"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose a patient
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.age})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="Enter diagnosis"
                  value={appointmentData.diagnosis || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      diagnosis: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Symptoms
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  rows={3}
                  placeholder="Enter symptoms"
                  value={appointmentData.symptoms || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      symptoms: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                    placeholder="e.g., 98.6"
                    value={appointmentData.temperature || ""}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        temperature: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                    placeholder="e.g., 72"
                    value={appointmentData.heartRate || ""}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        heartRate: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="e.g., 95"
                  value={appointmentData.oxygenSaturation || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      oxygenSaturation: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  placeholder="e.g., 120/80"
                  value={appointmentData.bloodPressure || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      bloodPressure: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2">
                  Instructions (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 text-gray-900 text-lg"
                  rows={2}
                  placeholder="Enter any special instructions or notes"
                  value={appointmentData.instructions || ""}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      instructions: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 rounded-b-3xl shrink-0">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddAppointmentModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-lg font-semibold shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-200 text-lg font-semibold shadow-md"
                >
                  Save Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default EnhancedDoctorDashboard

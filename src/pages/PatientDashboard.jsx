import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaFileMedical, 
  FaFlask, 
  FaPills, 
  FaCalendarAlt,
  FaStethoscope,
  FaXRay,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaHeartbeat,
  FaSyringe,
  FaNotesMedical,
  FaUserMd,
  FaCalendarCheck,
  FaHospitalUser,
  FaMicroscope,
  FaPrescriptionBottle,
  FaBell,
  FaTrash
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLabComparisonGraph } from "../api/chat";
import "./PatientDashboard.css";

import { getPatientByNationalId } from "../api/patients";
import { getPatientAppointments } from "../api/appointments";
import { getPatientTimeline } from "../api/visits";
import { askPatientChat } from "../api/chat";

function PatientDashboard() {
  const navigate = useNavigate();
  const [labComparison, setLabComparison] = useState(null);
const [labComparisonLoading, setLabComparisonLoading] = useState(false);
const [labComparisonError, setLabComparisonError] = useState("");
  const [patient, setPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
  {

    id: 1,
    type: "bot",
    message:
      "Hello! I'm your AI Health Assistant. Ask me anything about your appointments, medications, visits, or lab results."
  }
]);

const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load notifications for patient
  const loadNotifications = (nationalId) => {
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const patientNotifications = allNotifications.filter(n => n.patientId === nationalId);
    // Sort by date (newest first)
    patientNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(patientNotifications);
  };

  // Mark single notification as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    
    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    
    // Update localStorage
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.filter(n => n.id !== notificationId);
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const mapGender = (gender) => {
  if (gender === null || gender === undefined || gender === "") return "Not specified";

  const normalized = String(gender).toLowerCase();
  if (normalized === "1" || normalized === "male") return "Male";
  if (normalized === "2" || normalized === "female") return "Female";

  return String(gender);
};

const mapPatientFromApi = (backendPatient, fallback = {}) => ({
  id: backendPatient.id,
  nationalId: backendPatient.nationalId || fallback.nationalId || fallback.username || "",
  fullName: backendPatient.fullName || fallback.fullName || fallback.name || "Patient",
  phone: backendPatient.phoneNumber || backendPatient.phone || "",
  email: backendPatient.email || "",
  dateOfBirth: backendPatient.dateOfBirth || "",
  age: backendPatient.age || calculateAge(backendPatient.dateOfBirth),
  gender: mapGender(backendPatient.gender),
  bloodType: backendPatient.bloodType || "Unknown",
  emergencyContactName: backendPatient.emergencyContactName || "",
  emergencyRelationship: backendPatient.emergencyRelationship || "",
  emergencyPhoneNumber: backendPatient.emergencyPhoneNumber || "",
  chronicConditions: backendPatient.chronicConditions || [],
  allergies: backendPatient.allergies || [],
visits: (backendPatient.visits || backendPatient.history || backendPatient.patientHistory || []).map(mapVisitFromApi),});
const mapVisitFromApi = (visit) => {
  const visitDate = visit.visitDate || visit.date || visit.createdAt || "";

  return {
    id: visit.id,
    doctorName: visit.doctorName || visit.doctorFullName || visit.doctor || "Doctor",
    specialty: visit.specialty || visit.specialization || "",
    date: visitDate ? visitDate.split("T")[0] : "",
    time: visitDate
      ? new Date(visitDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : visit.time || "",
    diagnosis: visit.diagnosis || "No diagnosis recorded",
    bloodPressure: visit.bloodPressure || "",
    heartRate: visit.heartRate || "",
    temperature: visit.temperature || "",
    medications: (visit.medications || visit.prescriptions || []).map((med) => ({
      name: med.name || med.drugName || med.medicationName || "",
      dosage: med.dosage || "",
      duration: med.duration || med.frequency || "",
    })),
    labResults: visit.labResults || visit.labTests || [],
    radiology: visit.radiology || visit.radiologyTests || [],
    notes: visit.notes || visit.additionalNotes || "",
  };
};

const loadLabComparisonGraph = async (nationalId) => {
  if (!nationalId) return;

  setLabComparisonLoading(true);
  setLabComparisonError("");

  try {
    const data = await getLabComparisonGraph(nationalId);

    setLabComparison({
      patientName: data.patientName || "",
      testType: data.testType || "Lab Test",
      graphData: data.graphData || [],
      aiAnalysis: data.aiAnalysis || "",
    });
  } catch (err) {
    console.error("Failed to load lab comparison graph:", err);
    setLabComparison(null);
    setLabComparisonError("No lab comparison data available.");
  } finally {
    setLabComparisonLoading(false);
  }
};

  const loadPatientProfile = async () => {
  const patientData = localStorage.getItem("patientLoggedIn");

  if (!patientData) {
    navigate("/patient/login");
    return;
  }

  const parsed = JSON.parse(patientData);
  const nationalId = parsed.nationalId || parsed.username;

  setPatient(parsed);

  try {
    console.log("National ID:", nationalId);
    console.log("Token:", localStorage.getItem("medtrackToken"));

    const backendPatient = await getPatientByNationalId(nationalId);

    console.log("PATIENT FROM API:", backendPatient);

    const mappedPatient = mapPatientFromApi(
      backendPatient,
      parsed
    );

    try {
      const timeline = await getPatientTimeline(nationalId);

      console.log("VISITS TIMELINE FROM API:", timeline);

      const timelineArray = Array.isArray(timeline)
        ? timeline
        : timeline?.items || timeline?.visits || timeline?.data || [];

      const mappedVisits = timelineArray
        .map(mapVisitFromApi)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (mappedVisits.length > 0) {
        mappedPatient.visits = mappedVisits;
      }
    } catch (timelineErr) {
      console.error("VISITS TIMELINE ERROR:", timelineErr);
    }

    console.log("MAPPED PATIENT:", mappedPatient);

    setPatientData(mappedPatient);

    await loadPatientAppointments(mappedPatient.nationalId);

    loadNotifications(mappedPatient.nationalId);
    loadLabComparisonGraph(mappedPatient.nationalId);

  } catch (err) {
    console.error("PATIENT API ERROR:", err);
    alert(err.message);

    setPatientData({
      nationalId,
      fullName: parsed.fullName || parsed.name || "Patient",
      age: 0,
      gender: "Not specified",
      bloodType: "Unknown",
      chronicConditions: [],
      allergies: [],
      visits: [],
    });
  }
};
    


  useEffect(() => {
    loadPatientProfile();
  }, [navigate]);

  
  
  // ÙÙŠ PatientDashboard.jsxØŒ Ù‚Ù… Ø¨ØªØ­Ø¯ÙŠØ« Ø¯ÙˆØ§Ù„ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª

// ØªØ­Ø³ÙŠÙ† Ø¯Ø§Ù„Ø© loadPatientMedicalData
const loadPatientMedicalData = (nationalId) => {
  const savedPatients = JSON.parse(localStorage.getItem("patients") || "[]");
  
  const found = savedPatients.find(p => p.nationalId === nationalId);
  if (found) {
    // ØªØ±ØªÙŠØ¨ Ø§Ù„Ø²ÙŠØ§Ø±Ø§Øª Ù…Ù† Ø§Ù„Ø£Ø­Ø¯Ø« Ø¥Ù„Ù‰ Ø§Ù„Ø£Ù‚Ø¯Ù…
    const sortedVisits = [...found.visits].sort((a, b) => new Date(b.date) - new Date(a.date));
    setPatientData({ ...found, visits: sortedVisits });
    
    // Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ÙˆØ¬ÙˆØ¯ Ø²ÙŠØ§Ø±Ø§Øª Ø¬Ø¯ÙŠØ¯Ø© ÙˆØ¥Ø¸Ù‡Ø§Ø± Ø¥Ø´Ø¹Ø§Ø±
    const lastSeen = localStorage.getItem(`lastVisitSeen_${nationalId}`);
    const newestVisit = sortedVisits[0];
    
    if (newestVisit && (!lastSeen || new Date(newestVisit.date) > new Date(lastSeen))) {
      // ÙŠÙˆØ¬Ø¯ Ø²ÙŠØ§Ø±Ø© Ø¬Ø¯ÙŠØ¯Ø©
      const newVisitNotifications = notifications.filter(n => n.type === 'new_visit' && !n.read);
      if (newVisitNotifications.length === 0) {
        // Ø¥Ø¶Ø§ÙØ© Ø¥Ø´Ø¹Ø§Ø± ØªÙ„Ù‚Ø§Ø¦ÙŠ Ù„Ù„Ø²ÙŠØ§Ø±Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© Ø¥Ø°Ø§ Ù„Ù… ÙŠÙƒÙ† Ù…ÙˆØ¬ÙˆØ¯Ø§Ù‹
        const doctorData = localStorage.getItem("doctorLoggedIn");
        let doctorName = "Doctor";
        if (doctorData) {
          const parsed = JSON.parse(doctorData);
          doctorName = parsed.name || doctorName;
        }
        
        const autoNotification = {
          id: Date.now(),
          patientId: nationalId,
          patientName: found.fullName,
          type: "new_visit",
          message: `New medical visit has been added to your record on ${newestVisit.date}.`,
          date: new Date().toISOString(),
          time: "Just now",
          read: false,
          visitDetails: newestVisit
        };
        
        const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
        allNotifications.push(autoNotification);
        localStorage.setItem("patientNotifications", JSON.stringify(allNotifications));
        loadNotifications(nationalId);
      }
      
      // ØªØ­Ø¯ÙŠØ« Ø¢Ø®Ø± ØªØ§Ø±ÙŠØ® Ù…Ø´Ø§Ù‡Ø¯Ø©
      localStorage.setItem(`lastVisitSeen_${nationalId}`, newestVisit.date);
    }
  } else {
    setPatientData({
      fullName: patient?.fullName || "Patient",
      nationalId: nationalId,
      age: 0,
      bloodType: "Unknown",
      gender: "Not specified",
      chronicConditions: [],
      allergies: [],
      visits: []
    });
  }
};

// ØªØ­Ø³ÙŠÙ† Ø¯Ø§Ù„Ø© refreshPatientData
const refreshPatientData = async () => {
  setIsRefreshing(true);
  await loadPatientProfile();
  setIsRefreshing(false);
};

const mapAppointmentStatus = (status) => {
  if (status === 0 || status === "0") return "scheduled";
  if (status === 1 || status === "1") return "in-progress";
  if (status === 2 || status === "2") return "completed";

  if (typeof status === "string") {
    return status.toLowerCase();
  }

  return "scheduled";
};

const getAppointmentKey = (appointment) => {
  return (
    appointment.id ||
    appointment.appointmentId ||
    `${appointment.patientId}-${appointment.date}-${appointment.time}-${appointment.type}-${appointment.location}`
  );
};

const dedupeAppointments = (appointmentList) => {
  const seen = new Set();

  return appointmentList.filter((appointment) => {
    const key = getAppointmentKey(appointment);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

  const loadPatientAppointments = async (nationalId) => {
  try {
    const backendAppointments = await getPatientAppointments(nationalId);

    const mappedAppointments = (backendAppointments || []).map((apt) => {
      const appointmentDate = apt.appointmentDate || apt.date || "";
const date = appointmentDate ? appointmentDate.split("T")[0] : "";
const time = appointmentDate
  ? new Date(appointmentDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  : apt.time || "";

return {
  id:
    apt.id ||
    apt.appointmentId ||
    `${nationalId}-${date}-${time}-${apt.type || "appointment"}`,
  patientName: apt.patientName || patientData?.fullName || "Patient",
  patientId: apt.patientNationalId || apt.patientId || nationalId,
  date,
  time,
  duration: apt.durationInMinutes || apt.duration || 30,
  type: apt.type || "Consultation",
  location: apt.location || "",
  notes: apt.notes || "",
  status: mapAppointmentStatus(apt.status),
};;
    });

    setAppointments(dedupeAppointments(mappedAppointments));
  } catch (err) {
    console.error("Failed to load patient appointments:", err);
    setAppointments([]);
  }
};

  // Group visits by doctor
  const getVisitsByDoctor = () => {
    if (!patientData?.visits) return [];
    const doctorMap = new Map();
    
    patientData.visits.forEach(visit => {
      if (!doctorMap.has(visit.doctorName)) {
        doctorMap.set(visit.doctorName, {
          doctorName: visit.doctorName,
          specialty: visit.specialty,
          visits: []
        });
      }
      doctorMap.get(visit.doctorName).visits.push(visit);
    });
    
    // Sort visits by date (newest first) for each doctor
    for (let [_, doctor] of doctorMap) {
      doctor.visits.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return Array.from(doctorMap.values());
  };

  const toggleDoctor = (doctorName) => {
    if (expandedDoctor === doctorName) {
      setExpandedDoctor(null);
    } else {
      setExpandedDoctor(doctorName);
    }
  };

  const toggleVisit = (visitId) => {
    if (expandedVisit === visitId) {
      setExpandedVisit(null);
    } else {
      setExpandedVisit(visitId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("patientLoggedIn");
    navigate("/");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="appt-status scheduled"><FaClock /> Scheduled</span>;
      case 'completed':
        return <span className="appt-status completed"><FaCheckCircle /> Completed</span>;
      case 'cancelled':
        return <span className="appt-status cancelled"><FaTimes /> Cancelled</span>;
      default:
        return <span className="appt-status scheduled">{status}</span>;
    }
  };

  // Chatbot responses

const handleSendMessage = async () => {
  if (!chatInput.trim()) return;

  const messageText = chatInput.trim();

  const userMessage = {
    id: Date.now(),
    type: "user",
    message: messageText,
  };

  setChatMessages((prev) => [...prev, userMessage]);
  setChatInput("");
  setIsTyping(true);

  try {
const loggedPatient = JSON.parse(localStorage.getItem("patientLoggedIn") || "{}");

const nationalId =
  patientData?.nationalId ||
  patient?.nationalId ||
  loggedPatient.nationalId ||
  loggedPatient.username;
    if (!nationalId) {
      throw new Error("Patient National ID is missing.");
    }

    const response = await askPatientChat(
      nationalId,
      messageText,
      chatHistory
    );

    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      message: response.reply || "I could not generate a response.",
    };

    setChatMessages((prev) => [...prev, botMessage]);
    setChatHistory(response.history || []);
  } catch (err) {
    console.error("Chat request failed:", err);

    const errorMessage = {
      id: Date.now() + 1,
      type: "bot",
      message: "Sorry, I could not connect to the assistant right now.",
    };

    setChatMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const doctorsByVisit = getVisitsByDoctor();

  if (!patientData) {
    return <div className="loading">Loading your health records...</div>;
  }

  return (
    <div className="patient-dashboard">
      {/* Header with Notification Bell */}
      <div className="patient-dashboard-header">
        <div className="patient-logo">
          <FaHeartbeat className="logo-icon" />
          <h2>MedTrack Patient Portal</h2>
        </div>
        <div className="header-right">
          <div className="patient-welcome-small">
            <span>Welcome, {patientData.fullName}</span>
          </div>
          
          {/* Notification Bell */}
          <div className="notification-bell-container">
            <button 
              className="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button className="mark-all-read-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <FaBell />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      >
                        <div className="notification-icon">
                          {notif.type === 'appointment' ? <FaCalendarAlt /> : <FaUserMd />}
                        </div>
                        <div className="notification-content">
                          <p>{notif.message}</p>
                          <span>{notif.time}</span>
                          {notif.appointmentDetails && (
                            <div className="notification-appointment-details">
                              <small>ðŸ“… {notif.appointmentDetails.date} at {notif.appointmentDetails.time}</small>
                              <small>ðŸ“ {notif.appointmentDetails.location}</small>
                            </div>
                          )}
                        </div>
                        <div className="notification-actions">
                          {!notif.read && (
                            <button 
                              className="mark-read-btn"
                              onClick={() => markAsRead(notif.id)}
                              title="Mark as read"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          <button 
                            className="delete-notif-btn"
                            onClick={() => deleteNotification(notif.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="patient-logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="patient-dashboard-content">
        {/* Patient Info Card */}
        <div className="patient-info-card">
          <div className="patient-avatar">
            <FaUserCircle />
          </div>
          <div className="patient-details">
            <h1>{patientData.fullName}</h1>
            <div className="patient-meta">
              <span>ID: {patientData.nationalId}</span>
              <span>Age: {patientData.age} years</span>
              <span>Blood Type: {patientData.bloodType}</span>
              <span>Gender: {patientData.gender}</span>
            </div>
            <div className="patient-medical-tags">
              {patientData.chronicConditions?.map((c, i) => (
                <span key={i} className="condition-tag">{c}</span>
              ))}
              {patientData.allergies?.map((a, i) => (
                <span key={i} className="allergy-tag">âš ï¸ {a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="medical-layout">
          {/* Left Column - Doctors History */}
          <div className="doctors-history-section">
            <h2 className="section-title">
              <FaUserMd /> My Doctors & Visit History
            </h2>
            
            {doctorsByVisit.length === 0 ? (
              <div className="empty-state-large">
                <FaHospitalUser className="empty-icon" />
                <p>No doctor visits recorded yet</p>
              </div>
            ) : (
              doctorsByVisit.map((doctor, idx) => (
                <div key={idx} className="doctor-card">
                  <div className="doctor-header" onClick={() => toggleDoctor(doctor.doctorName)}>
                    <div className="doctor-avatar-small">
                      <FaUserMd />
                    </div>
                    <div className="doctor-info-header">
                      <h3>{doctor.doctorName}</h3>
                      <p>{doctor.specialty}</p>
                    </div>
                    <div className="doctor-stats">
                      <span className="visit-count">{doctor.visits.length} visits</span>
                      {expandedDoctor === doctor.doctorName ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  
                  {expandedDoctor === doctor.doctorName && (
                    <div className="doctor-visits">
                      {doctor.visits.map((visit) => (
                        <div key={visit.id} className="visit-card-patient">
                          <div className="visit-header-patient" onClick={() => toggleVisit(visit.id)}>
                            <div className="visit-date-badge">
                              <div className="visit-day">{new Date(visit.date).getDate()}</div>
                              <div className="visit-month">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</div>
                              <div className="visit-year">{new Date(visit.date).getFullYear()}</div>
                            </div>
                            <div className="visit-summary">
                              <div className="visit-diagnosis-short">{visit.diagnosis}</div>
                              <div className="visit-meta-short">
                                <span><FaClock /> {visit.time}</span>
                                {visit.bloodPressure && <span><FaHeartbeat /> BP: {visit.bloodPressure}</span>}
                              </div>
                            </div>
                            <div className="visit-expand">
                              {expandedVisit === visit.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                          
                          {expandedVisit === visit.id && (
                            <div className="visit-details-patient">
                              {/* Vital Signs */}
                              <div className="detail-section">
                                <h4>Vital Signs</h4>
                                <div className="vital-grid">
                                  <div className="vital-item">
                                    <span className="vital-label">Blood Pressure:</span>
                                    <span className="vital-value">{visit.bloodPressure || 'Not recorded'}</span>
                                  </div>
                                  <div className="vital-item">
                                    <span className="vital-label">Heart Rate:</span>
                                    <span className="vital-value">{visit.heartRate || 'Not recorded'}</span>
                                  </div>
                                  <div className="vital-item">
                                    <span className="vital-label">Temperature:</span>
                                    <span className="vital-value">{visit.temperature || 'Not recorded'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Medications */}
                              {visit.medications?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaPrescriptionBottle /> Prescribed Medications</h4>
                                  <div className="medications-list">
                                    {visit.medications.map((med, i) => (
                                      <div key={i} className="medication-detail">
                                        <div className="med-name-detail">{med.name}</div>
                                        <div className="med-dose">{med.dosage}</div>
                                        <div className="med-frequency">{med.duration}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Lab Results */}
                              {visit.labResults?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaMicroscope /> Lab Results</h4>
                                  <ul className="lab-list">
                                    {visit.labResults.map((lab, i) => (
                                      <li key={i}>{lab}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Radiology */}
                              {visit.radiology?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaXRay /> Imaging / Radiology</h4>
                                  <ul className="radiology-list">
                                    {visit.radiology.map((scan, i) => (
                                      <li key={i}>{scan}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Doctor's Notes */}
                              {visit.notes && (
                                <div className="detail-section">
                                  <h4>Doctor's Notes</h4>
                                  <p className="doctor-notes">{visit.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
<div className="lab-comparison-card">
  <h2 className="section-title">
    Lab Comparison Graph
  </h2>

  {labComparisonLoading ? (
    <div className="empty-state">Loading lab comparison...</div>
  ) : labComparison && labComparison.graphData.length > 0 ? (
    <>
      <div className="lab-comparison-header">
        <h3>{labComparison.testType}</h3>
        {labComparison.patientName && <span>{labComparison.patientName}</span>}
      </div>

      <div className="lab-comparison-chart">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={labComparison.graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {labComparison.aiAnalysis && (
        <div className="lab-ai-analysis">
          <strong>AI Analysis</strong>
          <p>{labComparison.aiAnalysis}</p>
        </div>
      )}
    </>
  ) : (
    <div className="empty-state">
      {labComparisonError || "No lab comparison data available"}
    </div>
  )}
</div>

          {/* Right Column - Appointments */}
          <div className="appointments-section">
            <h2 className="section-title">
              <FaCalendarAlt /> My Appointments
            </h2>
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="appointment-card-mini">
                    <div className="appointment-date-large">
                      <div className="day">{new Date(apt.date).getDate()}</div>
                      <div className="month">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div className="appointment-details-mini">
                      <div className="appointment-time-mini">
                        <FaClock /> {apt.time} ({apt.duration} min)
                      </div>
                      <div className="appointment-type-mini">
                        <FaStethoscope /> {apt.type}
                      </div>
                      <div className="appointment-location-mini">
                        <FaSyringe /> {apt.location}
                      </div>
                      {apt.notes && <div className="appointment-notes-mini">{apt.notes}</div>}
                    </div>
                    <div className="appointment-status-mini">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No appointments scheduled</div>
              )}
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <div className="chatbot-header" onClick={() => setShowChatbot(!showChatbot)}>
            <div className="chatbot-header-left">
              <FaRobot className="chatbot-icon" />
              <div>
                <h3>Health Assistant AI</h3>
                <p>Ask me about your health records</p>
              </div>
            </div>
            <button className="chatbot-toggle">
              {showChatbot ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
          
          {showChatbot && (
            <div className="chatbot-body">
              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === 'bot' ? <FaRobot /> : <FaUserCircle />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.message}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot typing">
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Ask about your medications, lab results, appointments..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage}>
                  <FaPaperPlane />
                </button>
              </div>
              
              <div className="chat-suggestions">
                <button onClick={() => setChatInput("What medications am I taking?")}>
                  ðŸ’Š My medications
                </button>
                <button onClick={() => setChatInput("Show my lab results")}>
                  ðŸ”¬ Lab results
                </button>
                <button onClick={() => setChatInput("My upcoming appointments")}>
                  ðŸ“… Appointments
                </button>
                <button onClick={() => setChatInput("Which doctors have I seen?")}>
                  ðŸ‘¨â€âš•ï¸ My doctors
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;



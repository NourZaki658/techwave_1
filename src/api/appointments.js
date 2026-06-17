import { apiRequest } from "./client";

export function createAppointment(payload) {
  return apiRequest("/api/Appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAppointmentsByDate(date) {
  return apiRequest(`/api/Appointments/date/${date}`);
}

export function getPatientAppointments(nationalId) {
  return apiRequest(`/api/Appointments/patient/${nationalId}`);
}

export function updateAppointment(id, payload) {
  return apiRequest(`/api/Appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAppointmentStatus(id, status) {
  return apiRequest(`/api/Appointments/${id}/status?status=${status}`, {
    method: "PUT",
  });
}

export function deleteAppointment(id) {
  return apiRequest(`/api/Appointments/${id}`, {
    method: "DELETE",
  });
}
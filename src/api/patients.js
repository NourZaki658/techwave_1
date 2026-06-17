import { apiRequest } from "./client";

export function getPatients(page = 1, pageSize = 10) {
  return apiRequest(`/api/Patients?page=${page}&pageSize=${pageSize}`);
}

export function getPatientByNationalId(nationalId) {
  return apiRequest(`/api/Patients/${nationalId}`);
}

export function createPatient(payload) {
  return apiRequest("/api/Patients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePatient(nationalId, payload) {
  return apiRequest(`/api/Patients/${nationalId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePatient(nationalId) {
  return apiRequest(`/api/Patients/${nationalId}`, {
    method: "DELETE",
  });
}
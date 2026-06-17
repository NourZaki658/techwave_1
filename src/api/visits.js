import { apiRequest } from "./client";

export function createVisit(payload) {
  return apiRequest("/api/Visits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPatientTimeline(nationalId) {
  return apiRequest(`/api/Visits/patient/${nationalId}/timeline`);
}

export function getVisitById(id) {
  return apiRequest(`/api/Visits/${id}`);
}

export function deleteVisit(id) {
  return apiRequest(`/api/Visits/${id}`, {
    method: "DELETE",
  });
}

export function updatePrescription(id, payload) {
  return apiRequest(`/api/Visits/${id}/prescription`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
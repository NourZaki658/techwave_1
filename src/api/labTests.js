import { apiRequest } from "./client";

export function createLabTest(payload) {
  return apiRequest("/api/LabTests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPatientLabTests(nationalId) {
  return apiRequest(`/api/LabTests/patient/${nationalId}`);
}

export function getPendingLabTests() {
  return apiRequest("/api/LabTests/pending");
}

export function uploadLabResult(id, file, additionalNotes = "") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("additionalNotes", additionalNotes);

  return apiRequest(`/api/LabTests/${id}/result`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteLabTest(id) {
  return apiRequest(`/api/LabTests/${id}`, {
    method: "DELETE",
  });
}
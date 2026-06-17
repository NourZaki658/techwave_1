import { apiRequest } from "./client";

export function askPatientChat(nationalId, message, history = []) {
  return apiRequest(`/api/Chat/ask/${nationalId}`, {
    method: "POST",
    body: JSON.stringify({
      messageDto: {
        message,
        history,
      },
    }),
  });
}

export function uploadPrescriptionImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  return apiRequest("/api/Chat/upload-prescription", {
    method: "POST",
    body: formData,
  });
}

export function getLabComparisonGraph(nationalId) {
  return apiRequest(`/api/Chat/labs/comparison-graph/${nationalId}`);
}
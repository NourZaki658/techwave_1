import { apiRequest } from "./client";
import { TOKEN_KEY, USER_KEY } from "./config";
import { decodeJwt, getTokenClaim } from "./token";

export async function login(username, password, role) {
  const data = await apiRequest("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem(TOKEN_KEY, data.token);

const claims = decodeJwt(data.token);

const user = {
  username,
  role,
  expiration: data.expiration,
  claims,
  userId: getTokenClaim(claims, [
    "sub",
    "nameid",
    "nameidentifier",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]),
  email: getTokenClaim(claims, [
    "email",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  ]),
  backendRole: getTokenClaim(claims, [
    "role",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  ]),
};


  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
}

export function registerDoctor(payload) {
  return apiRequest("/api/Auth/register-doctor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerLab(payload) {
  return apiRequest("/api/Auth/register-lab", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerPatient(payload) {
  return apiRequest("/api/Auth/register-patient", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload) {
  return apiRequest("/api/Auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("doctorLoggedIn");
  localStorage.removeItem("patientLoggedIn");
  localStorage.removeItem("labLoggedIn");
}
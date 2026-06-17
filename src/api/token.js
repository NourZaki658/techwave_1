export function decodeJwt(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function getTokenClaim(claims, possibleNames) {
  if (!claims) return "";

  for (const name of possibleNames) {
    if (claims[name]) return claims[name];
  }

  return "";
}
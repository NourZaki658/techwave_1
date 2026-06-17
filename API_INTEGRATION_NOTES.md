# MedTrack API Integration Notes

## Completed

- Created shared API config:
  - `src/api/config.js`
- Created shared API client:
  - `src/api/client.js`
- Created auth API service:
  - `src/api/auth.js`
- Created patients API service:
  - `src/api/patients.js`
- Created visits API service:
  - `src/api/visits.js`
- Created appointments API service:
  - `src/api/appointments.js`
- Created lab tests API service:
  - `src/api/labTests.js`

## Auth Completed

- Doctor login uses `POST /api/Auth/login`
- Lab login uses `POST /api/Auth/login`
- Patient login uses `POST /api/Auth/login`
- Doctor register uses `POST /api/Auth/register-doctor`
- Lab register uses `POST /api/Auth/register-lab`

## Patient Dashboard Completed

- Patient dashboard fetches patient profile from:
  - `GET /api/Patients/{nationalId}`
- Patient dashboard maps:
  - `fullName`
  - `nationalId`
  - `phoneNumber`
  - `email`
  - `dateOfBirth`
  - `age`
  - `gender`
  - `bloodType`
  - emergency contact fields
  - `visits`

## Known Backend Details

### Patient create/register payload

```json
{
  "nationalId": "29805121401234",
  "fullName": "Ahmed Mohamed",
  "phoneNumber": "01234567890",
  "email": "ahmed.patient@medtrack.com",
  "dateOfBirth": "1998-05-12T00:00:00.000Z",
  "gender": 1,
  "bloodType": "O+",
  "emergencyContactName": "Mohamed Ahmed",
  "emergencyRelationship": "Father",
  "emergencyPhoneNumber": "01122334455"
}
## Confirmed Backend Details

- `GET /api/Patients/{nationalId}` returns patient history.
- `GET /api/Visits/patient/{nationalId}/timeline` returns full visits, not only summaries.
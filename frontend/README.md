# Car Show Registration System – Frontend

## Project Description

The Car Show Registration System is a React JS dashboard developed for AutoVista Events. It helps event staff monitor registrations, payments, participant information, and registration status for Car Show 2027.

This frontend is built using React JS, Vite, and Tailwind CSS.

## Technologies Used

- React JS
- Vite
- Tailwind CSS
- JavaScript
- Git and GitHub

## Frontend Features

- Dashboard with five KPI cards:
  - Total Registrations
  - Total Payments
  - Uncollected Payments
  - Confirmed
  - Checked In
- Registration table with participant and vehicle information
- Search by participant name with 400ms debounce
- Registration type filter
- Registration status filter
- Clear Filters button
- Pagination with Previous, Next, and page-number buttons
- Page-size selector
- Loading, empty, and error states
- Philippine Peso currency formatting

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── sample-data.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── RegistrationTable.jsx
│   │   ├── CarShowTable.jsx
│   │   └── Sidebar.jsx
│   ├── data/
│   │   ├── registrations.js
│   │   └── carShows.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## How to Run the Frontend

1. Install Node.js.
2. Open a terminal in the frontend folder.
3. Install the project dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

## Sample Data

The frontend currently uses `src/api/sample-data.js`.

This file contains at least 25 sample registrations and provides the following functions:

- `getRegistrations()` – retrieves, filters, and paginates sample registration records.
- `getSummary()` – returns the dashboard summary values.

The sample data allows frontend development and testing while the backend API is being developed.

## Switching to the Real Backend API

When the backend is ready, the frontend will use the following endpoints:

**Registrations**

```text
GET /api/registrations?participantName=&type=&status=&page=1&pageSize=10
```

**Registration Summary**

```text
GET /api/registrations/summary
```

The real API implementation will be placed in:

```text
src/api/registrationsApi.js
```

To switch from sample data to the real API:

1. Confirm the actual API base URL with the Backend Developer.
2. Create `src/api/registrationsApi.js` with the real fetch calls.
3. Keep the same function names and return shapes as `sample-data.js`.
4. Update the imports in `App.jsx` and `components/RegistrationTable.jsx` to use `registrationsApi.js` instead of `sample-data.js`.
5. Test the dashboard using the running C# backend.
6. Verify that the KPI values, search, filters, and pagination match the API responses.

The actual API URL will be configured in `frontend/.env.development` after it is confirmed by the Backend Developer.

Example:

```env
VITE_API_BASE_URL=http://localhost:YOUR_API_PORT
```

Replace `YOUR_API_PORT` with the actual port provided by the Backend Developer.

## Team Roles

| Member | Role |
|---|---|
| Kirstern Abunales | Backend Developer |
| Erica Resultan | Frontend Developer |

## Repository

GitHub Repository:

https://github.com/kirstenmendiola2105-hue/car-show-registration-Abunales-Resultan.git

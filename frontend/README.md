# Car Show Registration System – Frontend

## Project Description

The Car Show Registration System is a React JS dashboard developed for AutoVista Events. It helps event staff monitor registrations, payments, participant information, and registration statuses for Car Show 2027.

The frontend is built using React JS, Vite, and Tailwind CSS. It is integrated with a C# backend API to retrieve registration records and dashboard summary information.

## Technologies Used

- React JS
- Vite
- Tailwind CSS
- JavaScript
- Fetch API
- Git and GitHub
- C# Backend API

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
- Try Again button for API errors
- Philippine Peso currency formatting
- Real-time registration and summary data retrieved from the backend API

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── sample-data.js
│   │   └── registrationsApi.js
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

5. Open the local URL displayed in the terminal.

The frontend requires the backend API to be running to retrieve actual registration and summary data.

## Backend API Integration

The frontend uses `src/api/registrationsApi.js` to communicate with the C# backend.

The API base URL is configured using:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5205";
```

The default backend address is:

```text
http://localhost:5205
```

An optional `.env.development` file can be created inside the frontend folder to configure a different API address:

```env
VITE_API_BASE_URL=http://localhost:5205
```

Restart the Vite development server after changing environment variables.

### API Endpoints

**1. Get Registrations**

```http
GET /api/registrations?participantName=&type=&status=&page=1&pageSize=10
```

This endpoint retrieves registration records and supports participant-name searching, registration type filtering, status filtering, and pagination.

**2. Get Registration Summary**

```http
GET /api/registrations/summary
```

This endpoint retrieves the summary values displayed in the dashboard KPI cards.

### API Functions

The `registrationsApi.js` file provides the following functions:

- `getRegistrations()` – retrieves registration records from the backend API using search, filters, and pagination parameters.
- `getSummary()` – retrieves dashboard summary information from the backend API.

The frontend uses these functions in:

- `App.jsx` – retrieves dashboard summary information.
- `components/RegistrationTable.jsx` – retrieves registration records.

The frontend handles unsuccessful API responses and displays error messages when the backend is unavailable.

## Sample Data

The project also contains `src/api/sample-data.js`, which was used during the initial frontend development and testing.

It provides sample registration records and the following functions:

- `getRegistrations()` – retrieves, filters, and paginates sample registration records.
- `getSummary()` – returns sample dashboard summary values.

The frontend has since been switched to `registrationsApi.js` to retrieve actual data from the C# backend.

## Team Roles

| Member | Role |
|---|---|
| Kirstern Abunales | Backend Developer |
| Erica Resultan | Frontend Developer |

## Repository

GitHub Repository:

[Car Show Registration System](https://github.com/kirstenmendiola2105-hue/car-show-registration-Abunales-Resultan.git)

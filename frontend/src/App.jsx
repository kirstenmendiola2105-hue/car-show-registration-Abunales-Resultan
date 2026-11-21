
import { useEffect, useState } from "react";
import { registrations as initialRegistrations } from "./data/registrations.js";
import { carShows as initialCarShows } from "./data/carShows.js";
import { getSummary } from "./api/sample-data.js";
import CarShowTable from "./components/CarShowTable";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RegistrationTable from "./components/RegistrationTable";

function StatCard({ title, value, description, icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl ${color}`}
        >
          {icon}
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-bold text-slate-800">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function App() {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [carShows, setCarShows] = useState(initialCarShows);

  // Store the dashboard summary returned by the sample API.
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState("");

  // Load dashboard summary when the application starts.
  useEffect(() => {
    let isActive = true;

    async function loadSummary() {
      try {
        const result = await getSummary();

        if (isActive) {
          setSummary(result);
          setSummaryError("");
        }
      } catch (error) {
        if (isActive) {
          setSummaryError("Unable to load dashboard summary.");
          console.error("Summary loading error:", error);
        }
      }
    }

    loadSummary();

    return () => {
      isActive = false;
    };
  }, []);

  // Format amounts as Philippine pesos.
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return "—";
    }

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // The five required KPI cards.
  const statistics = [
    {
      title: "Total Registrations",
      value: summary ? summary.totalRegistrations : "—",
      description: "All registered participants",
      icon: "📋",
      color: "bg-blue-100",
    },
    {
      title: "Total Payments",
      value: summary ? formatCurrency(summary.totalPayments) : "—",
      description: "Payments collected",
      icon: "💰",
      color: "bg-green-100",
    },
    {
      title: "Uncollected Payments",
      value: summary ? formatCurrency(summary.uncollectedPayments) : "—",
      description: "Remaining payments",
      icon: "₱",
      color: "bg-red-100",
    },
    {
      title: "Confirmed",
      value: summary ? summary.confirmed : "—",
      description: "Confirmed registrations",
      icon: "✓",
      color: "bg-blue-100",
    },
    {
      title: "Checked In",
      value: summary ? summary.checkedIn : "—",
      description: "Participants checked in",
      icon: "🚗",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main id="dashboard" className="p-6 lg:p-8">
          <section className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome to Car Show Registration!
            </h1>

            <p className="mt-2 text-slate-500">
              Here's an overview of your car show registration system.
            </p>
          </section>

          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800">
                Dashboard Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Summary of registration activities
              </p>
            </div>

            {summaryError && (
              <p className="mb-4 text-sm text-red-600">
                {summaryError}
              </p>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {statistics.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          <RegistrationTable
            registrations={registrations}
            setRegistrations={setRegistrations}
          />

          <CarShowTable
            carShows={carShows}
            setCarShows={setCarShows}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

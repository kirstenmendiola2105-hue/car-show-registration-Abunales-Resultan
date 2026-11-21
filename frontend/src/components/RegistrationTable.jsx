
import { useEffect, useState } from "react";
import { getRegistrations } from "../api/sample-data.js";

function RegistrationTable() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reload, setReload] = useState(0);

  // Debounce participant name search by 400 milliseconds.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Load registrations whenever the search, filters, or page changes.
  useEffect(() => {
    let isActive = true;

    async function loadRegistrations() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await getRegistrations({
          participantName: debouncedSearch,
          type: typeFilter === "All" ? "" : typeFilter,
          status: statusFilter === "All" ? "" : statusFilter,
          page: currentPage,
          pageSize,
        });

        if (isActive) {
          setRegistrations(result.items);
          setTotalCount(result.totalCount);
          setTotalPages(result.totalPages);
        }
      } catch (error) {
        console.error("Unable to load registrations:", error);

        if (isActive) {
          setHasError(true);
          setRegistrations([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      isActive = false;
    };
  }, [
    debouncedSearch,
    typeFilter,
    statusFilter,
    currentPage,
    pageSize,
    reload,
  ]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount ?? 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "CheckedIn":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-yellow-100 text-yellow-700";
      case "Unpaid":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const startIndex = totalCount === 0
    ? 0
    : (currentPage - 1) * pageSize + 1;

  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <section
      id="registrations"
      className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Car Registrations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          View and manage submitted car show registrations.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search participant name..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:max-w-sm"
        />

        <select
          value={typeFilter}
          onChange={(e) => handleTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Competitor">Competitor</option>
          <option value="VIP">VIP</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">Checked In</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Page size selector */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {isLoading
            ? "Loading registrations..."
            : `Showing ${startIndex}–${endIndex} of ${totalCount} registrations`}
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-slate-600"
          >
            Rows per page:
          </label>

          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-16 text-center">
          <p className="font-semibold text-blue-600">
            Loading registrations...
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while the data is being loaded.
          </p>
        </div>
      ) : hasError ? (
        /* Error state */
        <div className="py-16 text-center">
          <p className="font-semibold text-red-600">
            Something went wrong!
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Unable to load registrations. Please try again.
          </p>

          <button
            type="button"
            onClick={() => setReload((value) => value + 1)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : registrations.length === 0 ? (
        /* Empty state */
        <div className="py-16 text-center">
          <p className="font-semibold text-slate-700">
            No registrations found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          {/* Registration table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">
                    Registration No.
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Participant
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Car
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Type
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Fee / Paid
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Payment
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-600">
                      {registration.registrationNumber}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {formatDate(registration.registrationDate)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-800">
                        {registration.participantName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {registration.contactNumber}
                      </p>

                      <p className="text-xs text-slate-500">
                        {registration.email}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-800">
                        {registration.carMakeModel}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Plate: {registration.plateNumber}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {registration.registrationType}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          registration.status
                        )}`}
                      >
                        {registration.status === "CheckedIn"
                          ? "Checked In"
                          : registration.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <p className="font-medium text-slate-800">
                        {formatCurrency(registration.registrationFee)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Paid: {formatCurrency(registration.amountPaid)}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                          registration.paymentStatus
                        )}`}
                      >
                        {registration.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
{/* Pagination */}
<div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-sm text-slate-500">
    Page {currentPage} of {totalPages}
  </p>

  <div className="flex flex-wrap items-center gap-2">
    <button
      type="button"
      onClick={() =>
        setCurrentPage((page) => Math.max(1, page - 1))
      }
      disabled={currentPage === 1}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
      (page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border border-slate-300 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {page}
        </button>
      )
    )}

    <button
      type="button"
      onClick={() =>
        setCurrentPage((page) =>
          Math.min(totalPages, page + 1)
        )
      }
      disabled={currentPage === totalPages || totalPages === 0}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  </div>
</div>
</>
)}
</section>
);
}

export default RegistrationTable;

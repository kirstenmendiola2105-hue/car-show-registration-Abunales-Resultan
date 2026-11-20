import { useMemo, useState } from "react";

function RegistrationTable({ registrations, setRegistrations }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
  owner: "",
  brand: "",
  model: "",
  category: "",
  status: "Pending",
});

  const [formData, setFormData] = useState({
    owner: "",
    brand: "",
    model: "",
    category: "",
  });

  const itemsPerPage = 5;

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        registration.id.toLowerCase().includes(searchText) ||
        registration.owner.toLowerCase().includes(searchText) ||
        registration.brand.toLowerCase().includes(searchText) ||
        registration.model.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        registration.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const totalPages = Math.ceil(
    filteredRegistrations.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayedRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRegistration = (e) => {
  e.preventDefault();

  const highestId = registrations.reduce((highest, registration) => {
    const number = Number(registration.id.replace("CSR-", ""));
    return Math.max(highest, number);
  }, 0);

  const nextId = `CSR-${String(highestId + 1).padStart(3, "0")}`;

  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const newRegistration = {
    id: nextId,
    owner: formData.owner.trim(),
    brand: formData.brand.trim(),
    model: formData.model.trim(),
    category: formData.category,
    date,
    status: "Pending",
  };

  setRegistrations((previous) => [
    ...previous,
    newRegistration,
  ]);

  setFormData({
    owner: "",
    brand: "",
    model: "",
    category: "",
  });

  setShowForm(false);
  setStatusFilter("All");
  setSearch("");
  setCurrentPage(Math.ceil((registrations.length + 1) / itemsPerPage));
};
const handleEditClick = () => {
  setEditData({
    owner: selectedRegistration.owner,
    brand: selectedRegistration.brand,
    model: selectedRegistration.model,
    category: selectedRegistration.category,
    status: selectedRegistration.status,
  });

  setIsEditing(true);
};

const handleSaveEdit = (e) => {
  e.preventDefault();

  const updatedRegistration = {
    ...selectedRegistration,
    owner: editData.owner.trim(),
    brand: editData.brand.trim(),
    model: editData.model.trim(),
    category: editData.category,
    status: editData.status,
  };

  setRegistrations((previous) =>
    previous.map((registration) =>
      registration.id === selectedRegistration.id
        ? updatedRegistration
        : registration
    )
  );

  setSelectedRegistration(updatedRegistration);
  setIsEditing(false);
};

const handleDeleteRegistration = () => {
  setRegistrations((previous) =>
    previous.filter(
      (registration) => registration.id !== selectedRegistration.id
    )
  );

  setSelectedRegistration(null);
  setIsEditing(false);
};

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setHasError(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const simulateError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <section
      id="registrations"
      className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Car Registrations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage submitted car show registrations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Registration"}
          </button>

          <button
            onClick={simulateLoading}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Test Loading
          </button>

          <button
            onClick={simulateError}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Test Error
          </button>

          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(false);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddRegistration}
          className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800">
            Add New Registration
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Owner Name
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Enter owner name"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Car Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g. Toyota"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Car Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g. Supra"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Muscle Car">Muscle Car</option>
                <option value="Classic">Classic</option>
                <option value="Modified">Modified</option>
                <option value="Luxury">Luxury</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Registration
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search ID, owner, brand, or model..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => handleFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

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
        <div className="py-16 text-center">
          <p className="font-semibold text-red-600">
            Something went wrong!
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Unable to display registrations. Please try again.
          </p>
          <button
            onClick={() => setHasError(false)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-slate-500">
            Showing {filteredRegistrations.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + itemsPerPage,
              filteredRegistrations.length
            )}
            {" of "}
            {filteredRegistrations.length} registrations
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Registration ID</th>
                  <th className="px-4 py-4 font-semibold">Owner</th>
                  <th className="px-4 py-4 font-semibold">Car</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {displayedRegistrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="transition hover:bg-slate-50"
                  >
                   <td className="whitespace-nowrap px-4 py-4 font-medium">
                   <button
        type="button"
    onClick={() => setSelectedRegistration(registration)}
    className="text-blue-600 hover:text-blue-800 hover:underline"
  >
    {registration.id}
  </button>
</td>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-800">
                      {registration.owner}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {registration.brand} {registration.model}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {registration.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {registration.date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          registration.status
                        )}`}
                      >
                        {registration.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {displayedRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <p className="font-semibold text-slate-700">
                        No registrations found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}


  
{selectedRegistration && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {isEditing ? "Edit Registration" : "Registration Details"}
        </h2>

        <button
          type="button"
          onClick={() => {
            setSelectedRegistration(null);
            setIsEditing(false);
          }}
          className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Owner Name
            </label>
            <input
              type="text"
              value={editData.owner}
              onChange={(e) =>
                setEditData({ ...editData, owner: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Car Brand
            </label>
            <input
              type="text"
              value={editData.brand}
              onChange={(e) =>
                setEditData({ ...editData, brand: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Car Model
            </label>
            <input
              type="text"
              value={editData.model}
              onChange={(e) =>
                setEditData({ ...editData, model: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="Sports Car">Sports Car</option>
              <option value="Muscle Car">Muscle Car</option>
              <option value="Classic">Classic</option>
              <option value="Modified">Modified</option>
              <option value="Luxury">Luxury</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Registration Status
            </label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Registration ID</p>
              <p className="font-semibold text-blue-600">
                {selectedRegistration.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Owner Name</p>
              <p className="font-semibold text-slate-800">
                {selectedRegistration.owner}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Car Brand</p>
              <p className="font-semibold text-slate-800">
                {selectedRegistration.brand}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Car Model</p>
              <p className="font-semibold text-slate-800">
                {selectedRegistration.model}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="font-semibold text-slate-800">
                {selectedRegistration.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Registration Date</p>
              <p className="font-semibold text-slate-800">
                {selectedRegistration.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Status</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                  selectedRegistration.status
                )}`}
              >
                {selectedRegistration.status}
              </span>
            </div>
          </div>

         
<div className="mt-6 flex flex-wrap gap-2">
  <button
    type="button"
    onClick={handleEditClick}
    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
  >
    Edit Registration
  </button>

  <button
    type="button"
    onClick={() => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this registration?"
      );

      if (confirmed) {
        handleDeleteRegistration();
      }
    }}
    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
  >
    Delete Registration
  </button>

  <button
    type="button"
    onClick={() => setSelectedRegistration(null)}
    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
  >
    Close
  </button>
</div>

        </>
      )}
    </div>
  </div>
)}
</section>
  );
}

export default RegistrationTable;

import { useMemo, useState } from "react";

function CarShowTable({ carShows, setCarShows }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCarShow, setSelectedCarShow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    status: "Upcoming",
  });

  const filteredCarShows = useMemo(() => {
    return carShows.filter((show) => {
      const matchesSearch =
        show.id.toLowerCase().includes(search.toLowerCase()) ||
        show.name.toLowerCase().includes(search.toLowerCase()) ||
        show.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || show.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [carShows, search, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      date: "",
      status: "Upcoming",
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const newCarShow = {
      id: `CS-${String(Date.now()).slice(-6)}`,
      ...formData,
    };

    setCarShows((previous) => [...previous, newCarShow]);
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const updatedCarShow = {
      ...selectedCarShow,
      ...formData,
    };

    setCarShows((previous) =>
      previous.map((show) =>
        show.id === selectedCarShow.id ? updatedCarShow : show
      )
    );

    setSelectedCarShow(updatedCarShow);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this car show?"
    );

    if (!confirmed) return;

    setCarShows((previous) =>
      previous.filter((show) => show.id !== selectedCarShow.id)
    );

    setSelectedCarShow(null);
  };

  const openEditForm = () => {
    setFormData({
      name: selectedCarShow.name,
      location: selectedCarShow.location,
      date: selectedCarShow.date,
      status: selectedCarShow.status,
    });

    setIsEditing(true);
  };

  const openAddForm = () => {
    resetForm();
    setIsAdding(true);
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Car Show Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your car show events
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          + Add Car Show
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, name, or location..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Car Show Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredCarShows.map((show) => (
              <tr key={show.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-blue-600">
                  {show.id}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {show.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {show.location}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {show.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      show.status === "Upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {show.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedCarShow(show)}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredCarShows.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No car shows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={isAdding ? handleAdd : handleEdit}
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-5 text-xl font-bold text-slate-800">
              {isAdding ? "Add New Car Show" : "Edit Car Show"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Car Show Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Enter car show name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  resetForm();
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                {isAdding ? "Add Car Show" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedCarShow && !isEditing && !isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">
                Car Show Details
              </h3>

              <button
                onClick={() => setSelectedCarShow(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p><strong>ID:</strong> {selectedCarShow.id}</p>
              <p><strong>Name:</strong> {selectedCarShow.name}</p>
              <p><strong>Location:</strong> {selectedCarShow.location}</p>
              <p><strong>Date:</strong> {selectedCarShow.date}</p>
              <p><strong>Status:</strong> {selectedCarShow.status}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={openEditForm}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                Edit Car Show
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
              >
                Delete Car Show
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CarShowTable;

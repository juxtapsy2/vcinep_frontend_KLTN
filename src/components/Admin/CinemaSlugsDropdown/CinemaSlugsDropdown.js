import React, { useState, useEffect } from "react";
import { getCinemaAll, getCinemaSlugs } from "../../../api/CinemaAPI";

const CinemaSelectDropdown = ({ selectedCinemaId, onChange }) => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await getCinemaAll();
        setCinemas(response.data);
        setLoading(false);
      } catch (error) {
        setError("Lỗi khi tải danh sách rạp. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading cinemas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="cinema"
        className="block text-lg font-semibold text-blue-950"
      >
        Chọn Rạp:
      </label>
      <select
        id="cinema"
        value={selectedCinemaId || ""}
        onChange={(e) => onChange(e.target.value)}
        className="block w-fit p-2 py-1 text-sm text-blue-950 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="" disabled>
          Chọn rạp
        </option>
        {cinemas.map((cinema) => (
          <option key={cinema._id} value={cinema._id}>
            {cinema.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CinemaSelectDropdown;
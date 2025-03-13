import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCinemaBySlug, getCinemaSlugById } from "../../api/CinemaAPI";
import { addTheater } from "../../api/TheaterAPI";
import { getTheatersByCinemaSlug } from "../../api/TheaterAPI";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  // MapPinIcon as LocationMarkerIcon,
  PhoneIcon,
  TicketIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext.js";

function ManagerDetailCinema() {
  const { user } = useAuth(); // Lấy user từ AuthContext
  const [slug, setSlug] = useState(null); // State để lưu slug

  const [cinema, setCinema] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleTheaterClick = (id) => {
    navigate(`/manage/theater/${id}`);
  };
  useEffect(() => {
    const fetchCinemaData = async () => {
      try {
        // Lấy slug dựa vào user.idCinema
        const slugResponse = await getCinemaSlugById(user.idCinema);
        if (slugResponse.success) {
          setSlug(slugResponse.data.slug);

          // Gọi API lấy thông tin rạp
          const cinemaResponse = await getCinemaBySlug(slugResponse.data.slug);
          setCinema(cinemaResponse.data);

          // Gọi API lấy danh sách phòng chiếu
          const theatersResponse = await getTheatersByCinemaSlug(
            slugResponse.data.slug
          );
          if (theatersResponse.success) {
            setTheaters(theatersResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching cinema or theaters data:", error);
      }
    };

    if (user?.idCinema) {
      fetchCinemaData();
    }
  }, [user?.idCinema]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rows = parseInt(formData.get("rows"), 10);
    const columns = parseInt(formData.get("columns"), 10);
    if (isNaN(rows) || isNaN(columns)) {
      console.error("Rows and columns must be valid numbers");
      alert("Please enter valid numbers for rows and columns.");
      return;
    }
    const newTheater = {
      name: formData.get("name"),
      type: formData.get("type"),
      rows,
      status: "active",
      columns,
      screenSize: formData.get("screenSize"),
      soundSystem: formData.get("soundSystem"),
      capacity: rows * columns,
      cinemaId: cinema._id,
    };
    try {
      await addTheater(newTheater);

      // Cập nhật danh sách phòng chiếu
      const response = await getTheatersByCinemaSlug(slug);
      if (response.success) {
        setTheaters(response.data);
      }
      setIsModalOpen(false);
      e.target.reset();
    } catch (error) {
      console.error("Error adding theater:", error);
      alert("Failed to add theater. Please try again.");
    }
  };

  const InputField = ({
    label,
    type,
    name,
    required = true,
    options = null,
    min = null,
    max = null,
    onChange = null,
  }) => (
    <div className="relative z-0 w-full mb-5 group">
      {type === "select" ? (
        <>
          <select
            name={name}
            className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {label}
          </label>
        </>
      ) : (
        <>
          <input
            type={type}
            name={name}
            className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
            placeholder=" "
            required={required}
            min={min}
            max={max}
            onChange={onChange}
          />
          <label
            htmlFor={name}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            {label}
          </label>
        </>
      )}
    </div>
  );

  const AddTheaterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Thêm phòng chiếu mới
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Tên phòng" type="text" name="name" />

          <InputField
            label="Loại phòng"
            type="select"
            name="type"
            options={[
              { value: "2D", label: "2D" },
              { value: "3D", label: "3D" },
              { value: "4DX", label: "4DX" },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Số hàng"
              type="number"
              name="rows"
              min={1}
              max={17}
            />
            <InputField
              label="Số cột"
              type="number"
              name="columns"
              min={1}
              max={17}
            />
          </div>

          <InputField
            label="Kích thước màn hình"
            type="text"
            name="screenSize"
          />
          <InputField
            label="Hệ thống âm thanh"
            type="text"
            name="soundSystem"
          />

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!cinema) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Không tìm thấy thông tin rạp</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="container mx-auto ">
        {/* Cinema Info Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-[300px]">
            <img
              src={cinema.coverImage}
              alt={cinema.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {cinema.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <p className="text-white font-medium">Địa điểm</p>
                    </div>
                    <p className="text-gray-200 text-sm">{cinema.address}</p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <PhoneIcon className="h-5 w-5 text-red-400" />
                      <p className="text-white font-medium">Liên hệ</p>
                    </div>
                    <p className="text-gray-200 text-sm">
                      {cinema.phoneNumber}
                    </p>
                    <p className="text-gray-200 text-sm">{cinema.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theaters Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Phòng chiếu</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm phòng chiếu
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6  bg-white">
            {theaters.map((theater) => (
              <div
                key={theater._id}
                onClick={() => handleTheaterClick(theater._id)}
                className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Theater Header with Gradient Overlay */}
                <div className="relative h-10 bg-gradient-to-r from-red-600 to-red-800">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-xl font-medium text-white tracking-wide truncate">
                      {theater.name}
                    </h3>
                  </div>
                </div>

                {/* Theater Content */}
                <div className="p-3">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
                      {theater.type}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <AddTheaterModal />}
    </div>
  );
}

export default ManagerDetailCinema;

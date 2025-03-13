import React, { useState, useEffect } from "react";
import * as ConcessionAPI from "../../../api/ConcessionsAPI.js";
import LoadingEffect from "../../LoadingEffect.js";
import { useBooking } from "../../../contexts/BookingContext.js";
function ConcessionStep() {
  const [concessions, setConcessions] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { updateConcessions, bookingData } = useBooking();

  useEffect(() => {
    const fetchConcessions = async () => {
      setIsLoading(true);
      try {
        const response = await ConcessionAPI.getAllConcessions();
        setConcessions(response.data);

        // Khởi tạo quantities từ bookingData.concessions
        const initialQuantities = {};
        response.data.forEach((item) => {
          const existingConcession = bookingData.concessions.find(
            (c) => c.id === item._id
          );
          initialQuantities[item._id] = existingConcession
            ? existingConcession.count
            : 0;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đồ uống:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConcessions();
  }, []);

  const handleIncrement = (item) => {
    const newCount = quantities[item._id] + 1;
    setQuantities((prev) => ({
      ...prev,
      [item._id]: newCount,
    }));

    updateConcessions({
      id: item._id,
      title: item.name,
      price: Number(item.price),
      count: newCount,
    });
  };

  const handleDecrement = (item) => {
    const newCount = Math.max(0, quantities[item._id] - 1);
    setQuantities((prev) => ({
      ...prev,
      [item._id]: newCount,
    }));

    updateConcessions({
      id: item._id,
      title: item.name,
      price: Number(item.price),
      count: newCount,
    });
  };
  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <LoadingEffect />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concessions.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-red-600 text-lg font-bold">
                      {item.price.toLocaleString()}đ
                    </p>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition duration-300"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-medium text-gray-900">
                        {quantities[item._id]}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConcessionStep;

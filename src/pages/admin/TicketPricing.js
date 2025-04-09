import React, { useState, useEffect } from "react";
import {
  Ticket,
  Edit2,
  Save,
  X,
  Sun,
  Moon,
  Calendar,
  Clock,
} from "lucide-react";
import { getCurrentPrice, updatePrice } from "../../api/PriceAPI";
import LoadingEffect from "../../components/LoadingEffect";
import toast from "react-hot-toast";
function PriceManagement() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCurrentPrice();
  }, []);

  const loadCurrentPrice = async () => {
    try {
      const data = await getCurrentPrice();
      setCurrentPrice(data.data);
      setEditedPrice(data.data);
    } catch (err) {
      setError("Không thể tải dữ liệu giá vé");
      toast.error("Không thể tải dữ liệu giá vé");
    }
  };

  const handleEdit = () => {
    setEditedPrice({ ...currentPrice });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPrice({ ...currentPrice });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updatePrice(editedPrice._id, {
        type1Price: editedPrice.type1Price,
        type2Price: editedPrice.type2Price,
        type3Price: editedPrice.type3Price,
        type4Price: editedPrice.type4Price,
        vipRegularDiff: editedPrice.vipRegularDiff,
      });

      setCurrentPrice(editedPrice);
      setIsEditing(false);
      setError(null);
      toast.success("Cập nhật giá vé thành công");
    } catch (err) {
      setError("Không thể cập nhật giá vé");
      toast.error("Không thể cập nhật giá vé");
    }
  };

  const handlePriceChange = (field, value) => {
    setEditedPrice((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  if (!currentPrice) return <LoadingEffect />;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const weekdayPrices = [
    {
      type: "type1Price",
      title: "Trước 17h",
      icon: <Sun className="w-5 h-5" />,
      time: "00:00 - 17:00",
      color: "bg-red-50 text-red-600",
    },
    {
      type: "type2Price",
      title: "Sau 17h",
      icon: <Moon className="w-5 h-5" />,
      time: "17:00 - 23:59",
      color: "bg-red-100 text-red-700",
    },
  ];

  const weekendPrices = [
    {
      type: "type3Price",
      title: "Trước 17h",
      icon: <Sun className="w-5 h-5" />,
      time: "00:00 - 17:00",
      color: "bg-red-50 text-red-600",
    },
    {
      type: "type4Price",
      title: "Sau 17h",
      icon: <Moon className="w-5 h-5" />,
      time: "17:00 - 23:59",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto bg-white rounded-xl  overflow-hidden">
        <div>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          {/* Price Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekday Prices */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-red-500 px-4 py-3">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Giá vé ngày thường (Thứ 2 - Thứ 6)
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {weekdayPrices.map((card) => (
                  <div key={card.type} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${card.color}`}>
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {card.title}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {card.time}
                          </p>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedPrice[card.type]}
                            onChange={(e) =>
                              handlePriceChange(card.type, e.target.value)
                            }
                            className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-right font-medium"
                          />
                          <span className="text-gray-500">đ</span>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-red-600">
                          {formatPrice(currentPrice[card.type])}đ
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend Prices */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-red-700 px-4 py-3">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Giá vé cuối tuần (Thứ 7 - Chủ nhật)
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {weekendPrices.map((card) => (
                  <div key={card.type} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${card.color}`}>
                          {card.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {card.title}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {card.time}
                          </p>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editedPrice[card.type]}
                            onChange={(e) =>
                              handlePriceChange(card.type, e.target.value)
                            }
                            className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-right font-medium"
                          />
                          <span className="text-gray-500">đ</span>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-red-600">
                          {formatPrice(currentPrice[card.type])}đ
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VIP Price */}
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-red-600 px-4 py-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Phụ thu ghế VIP
              </h2>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  Giá chênh lệch so với ghế thường
                </p>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">+</span>
                    <input
                      type="number"
                      value={editedPrice.vipRegularDiff}
                      onChange={(e) =>
                        handlePriceChange("vipRegularDiff", e.target.value)
                      }
                      className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-right font-medium"
                    />
                    <span className="text-gray-500">đ</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-red-600">
                    +{formatPrice(currentPrice.vipRegularDiff)}đ
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-sm text-gray-500 flex items-center justify-end gap-2">
            <span>Cập nhật lần cuối:</span>
            <span className="font-medium text-gray-700">
              {new Date(currentPrice.updatedAt).toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceManagement;

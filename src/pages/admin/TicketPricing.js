import React, { useState } from "react";
import {
  Clock,
  Calendar,
  Star,
  Ticket,
  Edit2,
  Save,
  X,
  Plus,
  Minus,
} from "lucide-react";

function TicketPricing() {
  const [isEditing, setIsEditing] = useState(false);
  const [vipDifference, setVipDifference] = useState(10000);
  const [prices, setPrices] = useState({
    weekday: {
      before: { normal: 45000, vip: 55000 },
      after: { normal: 55000, vip: 65000 },
    },
    weekend: {
      before: { normal: 65000, vip: 75000 },
      after: { normal: 75000, vip: 85000 },
    },
  });

  const handleSave = () => {
    setIsEditing(false);
    // Có thể thêm API call để lưu dữ liệu ở đây
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const updateVipDifference = (amount) => {
    const newDiff = vipDifference + amount;
    if (newDiff >= 0) {
      setVipDifference(newDiff);
      // Cập nhật tất cả giá VIP
      const newPrices = {
        weekday: {
          before: {
            normal: prices.weekday.before.normal,
            vip: prices.weekday.before.normal + newDiff,
          },
          after: {
            normal: prices.weekday.after.normal,
            vip: prices.weekday.after.normal + newDiff,
          },
        },
        weekend: {
          before: {
            normal: prices.weekend.before.normal,
            vip: prices.weekend.before.normal + newDiff,
          },
          after: {
            normal: prices.weekend.after.normal,
            vip: prices.weekend.after.normal + newDiff,
          },
        },
      };
      setPrices(newPrices);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#ED4241] flex items-center gap-2">
            <Ticket className="w-8 h-8" />
            Bảng Giá Vé
          </h1>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#ED4241] text-white rounded-lg hover:bg-[#ED4241]/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border-2 border-[#ED4241]/20">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Điều chỉnh chênh lệch giá VIP
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateVipDifference(-5000)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-700" />
            </button>
            <div className="px-4 py-2 bg-gray-50 rounded-lg min-w-[120px] text-center">
              {formatPrice(vipDifference)}đ
            </div>
            <button
              onClick={() => updateVipDifference(5000)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ngày thường */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#ED4241]/20">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#ED4241] mb-4">
              <Calendar />
              Thứ 2 - Thứ 6
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Trước 17:00</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-600" />
                    <span>
                      Thường: {formatPrice(prices.weekday.before.normal)}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ED4241]" />
                    <span>VIP: {formatPrice(prices.weekday.before.vip)}đ</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Sau 17:00</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-600" />
                    <span>
                      Thường: {formatPrice(prices.weekday.after.normal)}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ED4241]" />
                    <span>VIP: {formatPrice(prices.weekday.after.vip)}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cuối tuần */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#ED4241]/20">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#ED4241] mb-4">
              <Calendar />
              Thứ 7 - Chủ Nhật
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Trước 17:00</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-600" />
                    <span>
                      Thường: {formatPrice(prices.weekend.before.normal)}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ED4241]" />
                    <span>VIP: {formatPrice(prices.weekend.before.vip)}đ</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-3">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Sau 17:00</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-600" />
                    <span>
                      Thường: {formatPrice(prices.weekend.after.normal)}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#ED4241]" />
                    <span>VIP: {formatPrice(prices.weekend.after.vip)}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#ED4241]/5 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            * Giá vé VIP được áp dụng cho các ghế ở vị trí đẹp và bao gồm các
            dịch vụ ưu đãi
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketPricing;

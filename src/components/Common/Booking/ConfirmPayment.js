import React from "react";
import { Dialog } from "@headlessui/react";
import { Ticket, X } from "lucide-react";

function ConfirmPayment({
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  movie,
  totalPrice,
  redirectMoMo,
  groupedSeats,
  groupedConcessions,
  formatCurrency,
}) {
  return (
    <Dialog
      open={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      className="relative z-[9999]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-red-600 p-4 relative">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-6 h-6" />
              Xác nhận thanh toán
            </Dialog.Title>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="space-y-4">
              <div className="pb-4 border-b border-dashed border-gray-200">
                <h3 className="text-lg font-bold text-red-600 mb-2">
                  {movie?.title}
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Rạp:</span>
                    {movie?.cinema} - {movie?.theater}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Suất chiếu:</span>
                    {movie?.showtime}
                  </p>
                </div>
              </div>

              <div className="pb-4 border-b border-dashed border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Ghế đã chọn</h4>
                {Object.entries(groupedSeats).map(([type, data]) => (
                  <div key={type} className="mb-2 last:mb-0">
                    <div className="flex justify-between text-gray-600">
                      <span>{type}</span>
                      <span>x{data.count}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {data.seats.join(", ")}
                    </p>
                  </div>
                ))}
              </div>

              {Object.keys(groupedConcessions).length > 0 && (
                <div className="pb-4 border-b border-dashed border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Bắp nước</h4>
                  {Object.entries(groupedConcessions).map(([title, data]) => (
                    <div
                      key={title}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{title}</span>
                      <span>x{data.count}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-900">
                  Tổng tiền
                </span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
                onClick={redirectMoMo}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ConfirmPayment;

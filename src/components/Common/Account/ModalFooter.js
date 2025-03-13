export const ModalFooter = ({ loading, onClose }) => (
  <div className="mt-6 flex justify-end space-x-3">
    <button
      type="button"
      onClick={onClose}
      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Hủy
    </button>
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {loading ? <LoadingSpinner /> : "Cập nhật mật khẩu"}
    </button>
  </div>
);

const LoadingSpinner = () => (
  <>
    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Đang xử lý...
  </>
);

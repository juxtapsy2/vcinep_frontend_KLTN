export const ModalHeader = ({ onClose }) => (
  <div className="border-b px-6 py-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h3>
      <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
        <svg
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
);

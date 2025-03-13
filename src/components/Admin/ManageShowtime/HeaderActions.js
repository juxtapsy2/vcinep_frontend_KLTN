// components/HeaderActions.jsx
const HeaderActions = ({ handleModalOpen, handleSingleTheaterModalOpen }) => {
  return (
    <div className="mb-4 flex gap-4">
      <button
        onClick={handleModalOpen}
        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Thêm tất cả rạp
      </button>
      <button
        onClick={handleSingleTheaterModalOpen}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
        Thêm cho một rạp
      </button>
    </div>
  );
};

export default HeaderActions;

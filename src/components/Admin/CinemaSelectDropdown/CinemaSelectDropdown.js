import React, { useState, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { getCinemaAll } from "../../../api/CinemaAPI";

const CinemaSelectDropdown = ({ selectedCinemaId, onChange, disabled }) => {
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

  const selectedCinema = cinemas.find((c) => c._id === selectedCinemaId);

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải rạp...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Select.Root value={selectedCinemaId} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger
        className="inline-flex items-center justify-between min-w-[180px] px-2 py-1 text-sm font-semibold text-blue-900 bg-white rounded-full border-none"
        aria-label="Cinema"
      >
        <Select.Value placeholder="Chọn rạp">
          {selectedCinema?.name}
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon className="ml-2" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="z-50 overflow-hidden bg-white border border-gray-200 rounded shadow-sm max-h-60"
          position="popper"
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-500">
            ▲
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1 overflow-auto">
            {cinemas.map((cinema) => (
              <Select.Item
                key={cinema._id}
                value={cinema._id}
                className="relative cursor-pointer select-none rounded min-w-[180px] px-2 py-1 text-sm text-blue-900 font-normal hover:bg-blue-900 hover:text-white radix-disabled:opacity-50"
              >
                <Select.ItemText>{cinema.name}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-800">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-500">
            ▼
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CinemaSelectDropdown;
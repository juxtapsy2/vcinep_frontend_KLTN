import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { rolesForRender } from "../../../constants/constants";

const RoleSelectDropdown = ({ value, onChange, disabled }) => {
  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger className="inline-flex items-center justify-between min-w-[120px] px-2 py-1 rounded-full bg-blue-50 bg-opacity-50 text-blue-900 text-sm font-medium">
        <Select.Value placeholder="Chọn vai trò" />
        <Select.Icon className="ml-2">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content 
            position="popper" 
            side="bottom"
            sideOffset={4}
            avoidCollisions
            className="z-50 bg-white rounded-md shadow-lg border border-gray-200 text-sm text-blue-900"
        >
          <Select.Viewport className="p-1">
            {rolesForRender.map((role) => (
              <Select.Item
                key={role.value}
                value={role.value}
                className="relative cursor-pointer select-none rounded min-w-[120px] px-2 py-1 hover:bg-blue-900 hover:text-white focus:outline-none focus:bg-blue-900 focus:text-white"
              >
                <Select.ItemText>{role.label}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default RoleSelectDropdown;

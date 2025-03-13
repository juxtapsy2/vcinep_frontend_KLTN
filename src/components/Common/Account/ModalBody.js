export const ModalBody = ({ passwords, handleChange }) => (
  <div className="space-y-4">
    <PasswordInput
      label="Mật khẩu hiện tại"
      name="currentPassword"
      value={passwords.currentPassword}
      onChange={handleChange}
    />
    <PasswordInput
      label="Mật khẩu mới"
      name="newPassword"
      value={passwords.newPassword}
      onChange={handleChange}
    />
    <PasswordInput
      label="Xác nhận mật khẩu mới"
      name="confirmPassword"
      value={passwords.confirmPassword}
      onChange={handleChange}
    />
  </div>
);

const PasswordInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input
        type="password"
        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500 sm:text-sm"
        required
        {...props}
      />
    </div>
  </div>
);

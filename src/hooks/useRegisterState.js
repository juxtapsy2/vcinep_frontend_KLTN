import { useState } from "react";

export function useRegisterState() {
  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    gender: "Male",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  return { formData, setFormData, otp, setOtp };
}

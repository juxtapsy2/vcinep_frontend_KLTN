import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Common/RegisterProcess/RegisterForm.js";
import OTPForm from "../components/Common/RegisterProcess/OTPForm.js";
import { registerUser, checkOTP } from "../api/AuthAPI";
import { useRegisterState } from "../hooks/useRegisterState";
import toast, { Toaster } from "react-hot-toast";
function RegisterProcess() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, otp, setOtp } = useRegisterState();
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await registerUser({ ...formData, role: "User" });
    try {
      if (response.success) {
        //  toast.success(response?.message);
        setStep(2);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await checkOTP({ email: formData.email, otp });
      if (response.success) {
        localStorage.clear();
        navigate("/login");
        //  toast.success("Đăng ký thành công !");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      {step === 1 ? (
        <RegisterForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleRegister}
          loading={loading}
        />
      ) : (
        <OTPForm
          otp={otp}
          setOtp={setOtp}
          handleSubmit={handleOTPSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}
export default RegisterProcess;

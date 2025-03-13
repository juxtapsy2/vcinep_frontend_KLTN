import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Test() {
  const [amount, setAmount] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [orderType, setOrderType] = useState("product");
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");
  const [paymentUrl, setPaymentUrl] = useState("");

  const amountRef = useRef();
  const orderDescriptionRef = useRef();
  const orderTypeRef = useRef();
  const bankCodeRef = useRef();

  // Gửi yêu cầu đến backend để xử lý thanh toán VNPAY
  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      amount: amount,
      orderDescription: orderDescription,
      orderType: orderType,
      bankCode: bankCode,
      language: language,
    };

    try {
      const response = await axios.post(
        "http://localhost:8800/api/payment/vnpay",
        paymentData
      );
      setPaymentUrl(response.data.vnpayUrl); // Lưu URL thanh toán
    } catch (error) {
      console.error("Error during payment request:", error);
    }
  };

  // Chuyển hướng người dùng đến VNPAY khi có URL thanh toán
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);
  return (
    <div className="payment-form">
      <h2>Thanh toán qua VNPAY</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Số tiền:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            ref={amountRef}
            required
          />
        </div>
        <div>
          <label>Mô tả đơn hàng:</label>
          <input
            type="text"
            value={orderDescription}
            onChange={(e) => setOrderDescription(e.target.value)}
            ref={orderDescriptionRef}
            required
          />
        </div>
        <div>
          <label>Loại đơn hàng:</label>
          <input
            type="text"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            ref={orderTypeRef}
          />
        </div>
        <div>
          <label>Mã ngân hàng (Tùy chọn):</label>
          <input
            type="text"
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            ref={bankCodeRef}
          />
        </div>
        <div>
          <label>Ngôn ngữ:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="vn">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
          </select>
        </div>
        <div>
          <button type="submit">Thanh toán</button>
        </div>
      </form>
    </div>
  );
}

export default Test;

import React, { useState, useEffect } from "react";

function Description() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;

        if (isInView) {
          setIsVisible((prev) => ({
            ...prev,
            [el.id]: true,
          }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50">
      <div className="w-11/12 max-w-[1200px] mx-auto px-4 py-12">
        <div
          id="header"
          className={`animate-on-scroll text-center mb-12 transform transition-all duration-1000 ease-out ${
            isVisible["header"]
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-900">
              VCineP Cinema
            </span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            id="about"
            className={`animate-on-scroll transform transition-all duration-1000 ease-out ${
              isVisible["about"]
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-red-500/30 pb-3 mb-6">
                Về Chúng Tôi
              </h2>
              <p className="text-gray-700 text-base mb-6">
                VCineP tự hào là hệ thống rạp chiếu phim hàng đầu tại Việt Nam
                với công nghệ hiện đại và dịch vụ chất lượng.
              </p>
              <ul className="space-y-4">
                {[
                  "50+ cụm rạp đạt chuẩn quốc tế",
                  "Công nghệ IMAX & Dolby Atmos",
                  "Phòng chiếu Premium hiện đại",
                  "Đa dạng lựa chọn phim hay",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center space-x-3 animate-on-scroll transform transition-all duration-500 ${
                      isVisible["about"]
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <span className="text-red-500">●</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            id="services"
            className={`animate-on-scroll transform transition-all duration-1000 ease-out ${
              isVisible["services"]
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Đặt Vé Online",
                  desc: "Thanh toán nhanh chóng, tiện lợi",
                  icon: "🎫",
                },
                {
                  title: "Ẩm Thực",
                  desc: "Menu đa dạng, phong phú",
                  icon: "🍿",
                },
                {
                  title: "Check In",
                  desc: "Check In bằng QG nhanh chóng",
                  icon: "⭐",
                },
                {
                  title: "AI",
                  desc: "Gợi ý phìm bằng công nghệ AI hiện đại",
                  icon: "✨",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 rounded-lg shadow hover:shadow-md
                    transition duration-300 hover:-translate-y-1 animate-on-scroll transform ${
                      isVisible["services"]
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="text-2xl mb-2 block">{service.icon}</span>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="cta"
          className={`animate-on-scroll mt-12 text-center transform transition-all duration-1000 ease-out ${
            isVisible["cta"]
              ? "translate-y-0 opacity-100"
              : "translate-y-20 opacity-0"
          }`}
        >
          <button
            className="px-8 py-3 bg-red-600 text-white text-base font-semibold rounded-full
              hover:bg-red-700 transition duration-300 hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Đặt Vé Ngay
          </button>

          <div className="mt-6 flex justify-center space-x-4 text-sm">
            {["Hotline: 1900 2224", "Email: support@vcinep.vn"].map(
              (contact, index) => (
                <span
                  key={index}
                  className={`text-gray-500 animate-on-scroll transform transition-all duration-500 ${
                    isVisible["cta"]
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {contact}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Description;

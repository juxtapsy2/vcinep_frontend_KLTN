import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaUserFriends,
  FaStar,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaRegPlayCircle,
} from "react-icons/fa";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  const stats = [
    {
      icon: <FaFilm className="text-4xl" />,
      count: "1000+",
      text: "Phim Chiếu",
    },
    {
      icon: <FaUserFriends className="text-4xl" />,
      count: "100K+",
      text: "Khách Hàng",
    },
    { icon: <FaStar className="text-4xl" />, count: "4.9", text: "Đánh Giá" },
    {
      icon: <FaMapMarkerAlt className="text-4xl" />,
      count: "50+",
      text: "Chi Nhánh",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section with enhanced gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative h-[600px] bg-gradient-to-r from-red-700 via-red-500 to-rose-500"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-white max-w-3xl"
            >
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                VCineP Cinema
              </h1>
              <p className="text-2xl mb-8 text-gray-100">
                Khám phá thế giới điện ảnh đỉnh cao cùng công nghệ hiện đại và
                trải nghiệm độc đáo
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/50"
              >
                <FaRegPlayCircle className="text-xl" />
                Khám Phá Ngay
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* About Content with enhanced animations */}
      <div ref={aboutRef} className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={
                isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent"
            >
              Về Chúng Tôi
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              VCineP tự hào là chuỗi rạp chiếu phim tiên phong tại Việt Nam,
              mang đến trải nghiệm giải trí điện ảnh đẳng cấp quốc tế. Với hệ
              thống phòng chiếu hiện đại, công nghệ âm thanh Dolby Atmos sống
              động và dịch vụ 5 sao, chúng tôi cam kết mỗi lần đến rạp là một
              hành trình trải nghiệm đáng nhớ.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-700 leading-relaxed"
            >
              Sứ mệnh của chúng tôi là nâng tầm trải nghiệm xem phim, từ chất
              lượng hình ảnh 4K sắc nét đến không gian thư giãn sang trọng và
              dịch vụ ẩm thực đa dạng.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isVisible
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-red-600 mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.count}
                </div>
                <div className="text-gray-600 font-medium">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
            Trải Nghiệm Độc Đáo Tại VCineP
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Công Nghệ Tối Tân",
                description:
                  "Màn hình 4K crystal clear, âm thanh vòm Dolby Atmos sống động như thật",
                icon: "🎬",
              },
              {
                title: "Dịch Vụ 5 Sao",
                description:
                  "Đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ mọi nhu cầu",
                icon: "⭐",
              },
              {
                title: "Không Gian Sang Trọng",
                description:
                  "Thiết kế hiện đại, ghế ngồi êm ái, không gian rộng rãi thoải mái",
                icon: "🏛️",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* Contact Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent mb-4">
              Liên Hệ Với Chúng Tôi
            </h2>
            <p className="text-gray-600 text-lg">
              Chúng tôi luôn sẵn sàng hỗ trợ và lắng nghe ý kiến của bạn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={
                isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
              }
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Gửi Tin Nhắn
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Tin nhắn</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 h-32"
                    placeholder="Nhập nội dung tin nhắn"
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Gửi Tin Nhắn
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="grid gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Điện Thoại
                      </h4>
                      <p className="text-gray-600">+84 123 456 789</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">contact@vcinep.com</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Địa Chỉ</h4>
                      <p className="text-gray-600">
                        123 Đường ABC, Quận 1, TP.HCM
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Kết Nối Với Chúng Tôi
                </h4>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors duration-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors duration-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-200 transition-colors duration-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Enhanced CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-red-700 via-red-600 to-rose-600 py-20 mt-20"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-8"
          >
            Sẵn sàng cho trải nghiệm điện ảnh đỉnh cao?
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            <FaTicketAlt className="text-xl" />
            Đặt Vé Ngay
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default About;

import React, { useState, useEffect } from "react";
import Slide from "../components/Common/Slide/Slide.js";
import QuickBookingBar from "../components/Common/QuickBookingBar/QuickBookingBar.js";
import MovieList from "../components/Common/MovieList/MovieList.js";
import Promotion from "../components/Common/Promotion/Promotion";
import Description from "../components/Common/Description/Description.js";
import * as MovieAPI from "../api/MovieAPI.js";
import LoadingEffects from "../components/LoadingEffect.js";
import Suggestion from "../components/Common/SuggestionMovie/Suggestion.js";

const Home = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); // Bắt đầu tải dữ liệu
        const nowShowing = await MovieAPI.getNowShowingMovies();
        const comingSoon = await MovieAPI.getComingSoonMovies();
        setNowShowingMovies(nowShowing.data);
        setComingSoonMovies(comingSoon.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    fetchMovies();
  }, []);

  const items = [
    {
      image:
        "https://res.cloudinary.com/dhs93uix6/image/upload/v1728040887/S1_k3cwdw.png",
      title: "CHÀO MỪNG RẠP PHIM BHD STAR CINEPLEX ĐÃ CÓ MẶT TẠI PHÚ MỸ",
      promotionPeriod: "Thời gian khuyến mãi: 26/8/2023 - 26/9/2023",
    },
    {
      image:
        "https://res.cloudinary.com/dhs93uix6/image/upload/v1728040887/S1_k3cwdw.png",
      title: "Quét mã QR - Thắng tiến vào Rạp",
      promotionPeriod: "Thời gian sự kiện: 26/8/2023 - 26/9/2023",
    },
    {
      image:
        "https://res.cloudinary.com/dhs93uix6/image/upload/v1728040895/S2_aijdj7.png",
      title: "Happy day thứ 2 giá rẻ - Chỉ từ 60k/ vé",
      promotionPeriod: "Thời gian khuyến mãi: 26/8/2023 - 26/9/2023",
    },
    {
      image:
        "https://res.cloudinary.com/dhs93uix6/image/upload/v1728040895/S2_aijdj7.png",
      title: "Happy day thứ 2 giá rẻ - Chỉ từ 60k/ vé",
      promotionPeriod: "Thời gian khuyến mãi: 26/8/2023 - 26/9/2023",
    },
    {
      image:
        "https://res.cloudinary.com/dhs93uix6/image/upload/v1728040895/S2_aijdj7.png",
      title: "Happy day thứ 2 giá rẻ - Chỉ từ 60k/ vé",
      promotionPeriod: "Thời gian khuyến mãi: 26/8/2023 - 26/9/2023",
    },
  ];

  return (
    <div className="home-container">
      {loading ? (
        <LoadingEffects />
      ) : (
        <>
          {/* <ChatBot style={{ zIndex: 9999 }} /> */}
          <Slide />
          <QuickBookingBar />
          <MovieList title="Phim đang chiếu" movies={nowShowingMovies} />
          <MovieList title="Phim sắp chiếu" movies={comingSoonMovies} />
          <Suggestion />
          <Promotion items={items} />
          <Description />
        </>
      )}
    </div>
  );
};

export default Home;

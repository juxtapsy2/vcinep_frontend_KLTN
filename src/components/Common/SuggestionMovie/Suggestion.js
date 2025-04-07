import React, { useState, useEffect } from "react";
import { Loader2, Sparkles, Bot, Send, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MovieItem from "../MovieItem/MovieItem";
import { suggestionMovieGemini } from "../../../api/Gemini";

function Suggestion() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const loadingTexts = [
    "Đang phân tích sở thích của bạn...",
    "Đang quét cơ sở dữ liệu phim...",
    "Đang áp dụng thuật toán AI...",
    "Đang tìm kiếm những phim phù hợp...",
    "Đang tổng hợp gợi ý cá nhân hóa...",
  ];

  const handleSearch = async (searchText) => {
    if (!searchText.trim()) return;

    setLoading(true);
    setMovies([]);

    let textIndex = 0;
    const textInterval = setInterval(() => {
      setLoadingText(loadingTexts[textIndex]);
      textIndex = (textIndex + 1) % loadingTexts.length;
    }, 2000);

    try {
      const data = await suggestionMovieGemini(searchText);
      setMovies(data.response);
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error);
    } finally {
      clearInterval(textInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    let recognition;
    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "vi-VN";

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        // Tự động tìm kiếm khi có kết quả nhận diện giọng nói
        await handleSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "vi-VN";

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
        // Tự động tìm kiếm khi có kết quả nhận diện giọng nói
        await handleSearch(transcript);
      };

      recognition.start();
      setIsListening(true);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ chức năng nhận diện giọng nói");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSearch(prompt);
  };

  return (
    <div className="min-h-screen mt-2 bg-gradient-to-br from-white to-red-50">
      <div className="max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="w-8 h-8 text-[#D33027]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D33027] to-red-400 bg-clip-text text-transparent">
              VCineP AI
            </h1>
          </motion.div>
          <p className="text-gray-600 text-sm">
            Trợ lý AI thông minh cho phim của bạn
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Bạn muốn xem phim gì? Hãy mô tả..."
              className="w-full px-4 py-3 rounded-full border-2 border-red-100 focus:border-[#D33027] outline-none text-base shadow-sm transition-all duration-300 pr-24 bg-white/80 backdrop-blur-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <motion.button
                type="button"
                onClick={startListening}
                className={`text-white p-2 rounded-full ${
                  isListening
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-[#D33027] to-red-400"
                }`}
                animate={
                  isListening
                    ? {
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 20px rgba(239, 68, 68, 0)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: isListening ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <Mic className="w-5 h-5" />
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500"
                    initial={{ scale: 0.1, opacity: 0.8 }}
                    animate={{
                      scale: [1, 2],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                className="text-white bg-gradient-to-r from-[#D33027] to-red-400 p-2 rounded-full disabled:from-red-300 disabled:to-red-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-full h-full text-[#D33027]" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Bot className="w-10 h-10 text-[#D33027]" />
                </motion.div>
              </div>
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base text-gray-600"
              >
                {loadingText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading && movies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {movies.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 },
                  }}
                >
                  <MovieItem movie={movie} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 p-3 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100"
                  >
                    <div className="flex items-start gap-2">
                      <Bot className="w-5 h-5 text-[#D33027] mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-[#D33027]">
                          Lý do gợi ý:
                        </span>{" "}
                        {movie.reason}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <Bot className="w-12 h-12 mx-auto mb-3 text-[#D33027] opacity-50" />
            </motion.div>
            <p className="text-gray-500">
              Hãy cho tôi biết bạn muốn xem phim gì!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Suggestion;

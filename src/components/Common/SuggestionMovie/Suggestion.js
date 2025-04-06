import React, { useState } from "react";
import { Loader2, Sparkles, Bot, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MovieItem from "../MovieItem/MovieItem";
import { suggestionMovieGemini } from "../../../api/Gemini";
function Suggestion() {
  const [prompt, setPrompt] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const loadingTexts = [
    "Analyzing your preferences...",
    "Scanning movie database...",
    "Applying AI algorithms...",
    "Finding perfect matches...",
    "Curating personalized recommendations...",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setMovies([]);

    // Simulate AI thinking with loading text animation
    let textIndex = 0;
    const textInterval = setInterval(() => {
      setLoadingText(loadingTexts[textIndex]);
      textIndex = (textIndex + 1) % loadingTexts.length;
    }, 2000);

    try {
      const data = await suggestionMovieGemini(prompt);
      setMovies(data.response);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      clearInterval(textInterval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with AI Theme */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-10 h-10 text-[#E83B3B]" />
            <h1 className="text-4xl font-bold text-[#E83B3B]">VCineP AI</h1>
          </div>
          <p className="text-gray-600">
            Your intelligent movie companion powered by AI
          </p>
        </motion.div>

        {/* AI-styled Input Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mb-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell me what kind of movie you're looking for..."
              className="w-full px-3 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#E83B3B] outline-none text-lg shadow-sm transition-all duration-300 pr-14"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#E83B3B] p-2.5 rounded-xl hover:bg-[#c52f2f] transition-all duration-300 disabled:bg-[#ff9999]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.form>

        {/* AI Processing Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Sparkles className="w-full h-full text-[#E83B3B]" />
                </motion.div>
                <Loader2 className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#E83B3B]" />
              </div>
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-gray-600"
              >
                {loadingText}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movie Results */}
        <AnimatePresence>
          {!loading && movies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {movies.map((movie) => (
                  <motion.div
                    key={movie._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MovieItem movie={movie} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 p-4 bg-gradient-to-r from-[#fff5f5] to-white rounded-xl border border-[#ffeded]"
                    >
                      <div className="flex items-start gap-2">
                        <Bot className="w-5 h-5 text-[#E83B3B] mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-[#E83B3B]">
                            AI Reasoning:
                          </span>{" "}
                          {movie.reason}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <Bot className="w-16 h-16 mx-auto mb-4 text-[#E83B3B] opacity-50" />
            <p className="text-lg">
              I'm ready to help you discover your next favorite movie!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Suggestion;

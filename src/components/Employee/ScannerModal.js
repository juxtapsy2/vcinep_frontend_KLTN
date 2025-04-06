import React from "react";
import { X, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ScannerModal({ scanStatus, stopScanner }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Quét QR Code</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopScanner}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Scanner Container */}
          <div className="relative mb-6">
            <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-gray-200">
              {/* Scanner Window */}
              <div id="qr-reader" className="w-full h-full" />

              {/* Scanning Animation */}
              <motion.div
                initial={{ y: "0%" }}
                animate={{ y: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"
              />

              {/* Corner Markers */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ScannerModal;

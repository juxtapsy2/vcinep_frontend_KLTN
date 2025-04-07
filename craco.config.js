// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        {
          module: /html5-qrcode/,
          message: /Failed to parse source map/,
        },
      ];

      // Loại bỏ source-map-loader cho thư viện gây lỗi
      const sourceMapLoader = webpackConfig.module.rules
        .find((rule) => Array.isArray(rule.oneOf))
        .oneOf.find(
          (rule) =>
            rule.enforce === "pre" && rule.use?.includes("source-map-loader")
        );

      if (sourceMapLoader) {
        sourceMapLoader.exclude = /node_modules\/html5-qrcode/;
      }

      return webpackConfig;
    },
  },
};

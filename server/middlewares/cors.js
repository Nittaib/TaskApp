const cors = require("cors");

const allowedOrigins = "*";
const allowedMethods = ["GET", "POST", "DELETE"];
const allowedHeaders = ["Content-Type"];

const corsOptions = {
  origin: allowedOrigins,
  methods: allowedMethods,
  allowedHeaders,
};

module.exports = cors(corsOptions);

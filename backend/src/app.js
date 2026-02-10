const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const bfhlRoutes = require("./routes/bfhl.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60000,
    max: 100,
  }),
);

app.use("/", bfhlRoutes);

module.exports = app;

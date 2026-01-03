require("dotenv").config();
const express = require("express");
const cors = require("cors");
const i18n = require("i18n");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const swaggerSpec = require("./config/swagger");
const responseMiddleware = require("./middlewares/response.middleware");

const app = express();

i18n.configure({
    locales: ["en", "hi"],
    directory: __dirname + "/locales",
    defaultLocale: process.env.LANGUAGE,
    objectNotation: true,
});

const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Needed for form submissions
app.use(cookieParser());
app.use(i18n.init);
app.use(responseMiddleware);

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/panel", require("./panel/panel.routes"));

module.exports = app;

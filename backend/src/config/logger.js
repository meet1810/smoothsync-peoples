const winston = require("winston");
const path = require("path");

const logDir = path.join(__dirname, "../logger/logs");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error-YYYY-MM-DD.log`
        // - Write all logs with importance level of `info` or less to `info-YYYY-MM-DD.log`
        //
        new winston.transports.File({
            filename: path.join(logDir, `error-${new Date().toISOString().slice(0, 10)}.log`),
            level: "error"
        }),
        new winston.transports.File({
            filename: path.join(logDir, `info-${new Date().toISOString().slice(0, 10)}.log`)
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

module.exports = logger;

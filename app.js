const express = require("express");
const app = express();
const expressWinston = require("express-winston");
const { transports, format } = require("winston");
require("dotenv").config();
require("winston-mongodb");

const logger = require("./logger");
app.use(
  expressWinston.logger({
    // transports: [
    //   new transports.Console(),
    //   new transports.File({
    //     level: "warn",
    //     filename: "logsWarnings.log",
    //   }),
    //   new transports.File({
    //     level: "error",
    //     filename: "logsErrors.log",
    //   }),
    //   new transports.MongoDB({
    //     db: process.env.MONGODB_URI,
    //     collection: "logs",
    //   }),
    // ],
    // format: format.combine(
    //   format.json(),
    //   format.timestamp(),
    //   format.metadata(),
    //   format.prettyPrint()
    // ),
    winstonInstance: logger,
    statusLevels: true,
  })
);

app.get("/", (req, res) => {
  logger.info("This is an info log.");
  res.sendStatus(200);
});
app.get("/400", (req, res) => {
  logger.warn("This is a warn log.");
  res.sendStatus(400);
});
app.get("/500", (req, res) => {
  res.sendStatus(500);
});
app.get("/error", (req, res) => {
  throw new Error("This is a custom error.");
});

const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});

app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: "logsInternalErrors.log",
      }),
    ],
    format: format.combine(format.json(), format.timestamp(), myFormat),
  })
);
app.listen(4000);

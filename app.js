const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const projetsRoutes = require("./routes/projets");
const usersRoutes = require("./routes/users");

const app = express();

mongoose
  .connect(
    "mongodb+srv://hamza1997:hamza123@cluster0.or2rn3r.mongodb.net/dashboard?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database!");
  })
  .catch(() => {
    console.log("connection failed!");
  });

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/projets", projetsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;

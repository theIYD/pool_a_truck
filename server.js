const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const errorHandler = require("./middlewares/error");
const app = express();

const routes = require("./routes/index");

// Connect to db
mongoose
  .connect(process.env.DB_URL)
  .then(connection => {
    console.log(`Database connected`);
  })
  .catch(err => console.error(err));

// Needed to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// Home route
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Pool a truck" });
});

app.use("/api", routes);

// Error middleware
app.use(errorHandler);

let port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Server listening on port ${port}`));

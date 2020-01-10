const express = require("express");
const dotenv = require("dotenv").config();
const app = express();

// Needed to be able to read body data
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

let port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Server listening on port ${port}`));

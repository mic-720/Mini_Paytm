require('dotenv').config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const expressRouter = require("./routes/index");

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1", expressRouter);

app.get("/", (req, res) => {
  res.send("welcome to the world of coding..");
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Connected to DB and running on port http://localhost:${process.env.PORT}/`
    );
  });
});

require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const expressRouter = require("./routes/index");

app.use(cors());
app.use(express.json())
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

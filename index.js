const http = require("https");
const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const axios = require("axios");
require('dotenv').config();

const app = express();
const port = process.env.PORT ;
app.use(cors());

app.get("/", (req, res) => {
  console.log("first");
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  const io = socket(server);

  io.on("connection", (socket) => {
    socket.on("Hello", (data) => {
      console.log(data);
    });
    socket.emit("bac", "Hello");
    
    console.log("connection made");

    const getData = () => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false",
          {
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
          }
        )
        .then((data) => {
          socket.emit("data-emit", data.data);
        })
        .catch((err) => socket.emit("data-error", err));
    };
    getData();

    setInterval(() => {
      getData();
    }, 5000);
  });
});

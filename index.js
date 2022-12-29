const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const APIdata = process.env.api;
app.use(cors());
let errorOccured = true;

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

    console.log("connection made");

    const getData = () => {
      axios
        .get(APIdata, {
          headers: { "Accept-Encoding": "gzip,deflate,compress" },
        })
        .then((data) => {
          socket.emit("data-emit", data.data);
          console.log("first")
        })
        .catch((err) => {
          socket.emit("data-error", err);
          console.log(err.message);
          socket.emit("display-error-message", errorOccured);
        });
    };

    getData();

    setInterval(() => {
      getData();
    }, 50000);
  });
});

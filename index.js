const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const getIP = require("ip");

// const myIP = getIP.address();
const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();

app.get("/api/hello", async (req, res) => {
  const visitor_name = req.query.visitor_name || "Guest";
  function roundUp(number) {
    const factor = Math.pow(10, 0);
    value = Math.ceil(number * factor) / factor;
    return value;
  }

  try {
    // const response = await fetch("https://api.ipify.org?format=json");
    // const ip_data = await response.json();
    // let myIP = ip_data.ip;
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const myIP = clientIp.includes(":") ? clientIp.split(":").pop() : clientIp;

    console.log(myIP);

    const Location = await axios.get("https://ipapi.co/" + myIP + "/json/");
    const data = Location.data;
    let city = data.city;
    const findTemp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const temp = findTemp.data;
    let temperature_in_c = roundUp(temp.main.temp);
    const Greetings = `Hello, ${visitor_name}!, the temperature is ${temperature_in_c} degrees celcius in ${city}`;

    res.json({
      client_IP: myIP,
      location: city,
      greeting: Greetings,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error retrieving data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

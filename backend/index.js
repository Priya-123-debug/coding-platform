const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Google DNS at the Node.js layer

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieparser = require("cookie-parser");
const authRouter = require("./routes/userauth");
const problemrouter = require("./routes/problemcreate");
const submitrouter = require("./routes/submit");
const cors = require("cors");
// app.use(
//   cors({
//     origin: "https://codingplatformservice-2lb7-hiubn40tr-supriya-kumaris-projects.vercel.app",
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://codingplatformservice-2lb7-hiubn40tr-supriya-kumaris-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools or server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");


// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin (like curl or Postman)
//       if (!origin) return callback(null, true);

//       // check if the origin is allowed
//       if (!allowedOrigins.includes(origin)) {
//         return callback(new Error("CORS policy violation"), false);
//       }

//       return callback(null, true);
//     },
//     credentials: true,
//   })
// );


app.use(express.json());
app.use(cookieparser());
app.use("/user", authRouter);
app.use("/problem", problemrouter);
app.use("/submission", submitrouter);
const main = require("./utilis/db");

/// cookie come in json format
const port = process.env.PORT || 5000;
main()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

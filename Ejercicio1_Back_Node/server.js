let fs = require('fs');
let util = require('util');
let log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
let log_stdout = process.stdout;
require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./database/db');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// app.get('/', (req, res) => {
  //     res.json({ msg: "Hello Peter" })
  // })
  
// Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/crudRouter"));

connectDB()
// require('./schemas/indexSchemas.js');

// BRING IN YOUR SCHEMAS & MODELS
// const URI = process.env.MONGODB_URL;

// mongoose.connect(
//   URI,
//   {
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err) => {
//     if (err) throw err;
//     console.log(`Connected to mongodb.`);
//   }
// );

const port = process.env.PORT || 3245;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

app.listen(port, () =>
  console.log(`Running on port http://localhost:${port}`)
);

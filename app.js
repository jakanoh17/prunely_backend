const cors = require("cors");
const express = require("express");

const app = express();

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/prunely");
mongoose.set("strictQuery", false);

const { PORT = 3001 } = process.env;

const users = require("./routes/users");

app.use(cors());
app.use(express.json());

app.use("/users", users);
// app.use("/", users);

// app.use((req, res) => {
//   res.status(notFound.status).send({ message: notFound.message });
// });

app.listen(PORT, () => {
  console.log(`App listing on port: ${PORT}`);
});

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/error");
const connection = require("./config/database_connection");
const userRoute = require("./routes/userRoute");
const bookRoute = require("./routes/bookRoute");
const cloudinaryConnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
//cloudinary connection
cloudinaryConnect();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://todo-nine-olive-52.vercel.app",
    credentials: true,
  })
);
const PORT = process.env.PORT || 6000;

app.use("/api/v1", userRoute);
app.use("/api/v1", bookRoute);
app.use(errorMiddleware);

connection()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

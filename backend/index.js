import express from "express";
import env from "dotenv";
import dataBase from "./config/database.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRoutes from "./routes/message.route.js"
import {app, server} from "./utils/socket.js"
import cors from "cors"


env.config();
// const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


server.listen(process.env.PORT, () => {
  console.log(`server runing on PORT no ${process.env.PORT}`);
  dataBase();
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRoute from "./routes/summarize.js";
import sendEmailRoute from "./routes/sendEmail.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api/summarize", summarizeRoute);
app.use("/api/sendEmail", sendEmailRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

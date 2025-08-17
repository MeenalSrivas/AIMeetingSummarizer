import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { recipients, subject, body } = req.body;

  if (!recipients || !subject || !body) {
    return res
      .status(400)
      .json({ error: "recipients, subject and body are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465,
      secure: true,
      auth: {
        user: "meenalsrivastav2004@gmail.com",
        pass: "lqpj xhcf shba phiq",
      },
    });

    const info = await transporter.sendMail({
      from: 'Meenal Srivastav <meenalsrivastav2004@gmail.com',
      to: recipients,
      subject,
      text: body,
    });

    return res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Error sending email:", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;

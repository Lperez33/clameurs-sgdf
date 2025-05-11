require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/send-photo", async (req, res) => {
  const { email, imageBase64 } = req.body;

  if (!email || !imageBase64) {
    return res.status(400).json({ message: "Email et image requis." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.fr", // ou smtp.1and1.fr selon ton adresse
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Votre photo du photobooth",
    text: "Merci d’avoir utilisé notre photobooth !",
    attachments: [
      {
        filename: "photo.png",
        content: imageBase64.split("base64,")[1],
        encoding: "base64"
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Photo envoyée !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l’envoi." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});

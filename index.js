const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" }));

app.post("/send-photo", async (req, res) => {
  const { email, imageBase64 } = req.body;

  if (!email || !imageBase64) {
    return res.status(400).json({ message: "Email et image requis." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.fr", // ou smtp.1and1.fr selon ton adresse
    port: 587,
    secure: false, // true si port 465, false pour 587
    auth: {
      user: process.env.EMAIL_USER, // ton e-mail IONOS complet
      pass: process.env.EMAIL_PASS  // ton mot de passe normal (ou mot de passe app si activé)
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

app.get("/", (req, res) => {
  res.send("Serveur photobooth opérationnel !");
});

app.listen(PORT, () => {
  console.log(`Serveur actif sur le port ${PORT}`);
});

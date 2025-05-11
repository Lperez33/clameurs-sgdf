const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const sendButton = document.getElementById('send');
const emailInput = document.getElementById('email');

// Accéder à la webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error('Accès à la caméra refusé', err);
  });

// Capturer la photo
captureButton.addEventListener('click', () => {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageBase64 = canvas.toDataURL('image/png');
  sendButton.disabled = false; // Activer le bouton "Envoyer"
  sendButton.onclick = () => {
    const email = emailInput.value;
    if (!email || !validateEmail(email)) {
      alert('Veuillez entrer un email valide.');
      return;
    }
    sendPhoto(email, imageBase64);
  };
});

// Fonction pour envoyer la photo
function sendPhoto(email, imageBase64) {
  fetch('/send-photo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      imageBase64: imageBase64,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
    }
  })
  .catch(error => {
    alert('Erreur lors de l\'envoi de la photo.');
    console.error(error);
  });
}

// Valider l'email
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

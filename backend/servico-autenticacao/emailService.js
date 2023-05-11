const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'contact@dynastygi.com',
    pass: 'DN/s~Gc!";.2m~[.',
  },
});

const sendConfirmationEmail = async (to, token) => {
  console.log('Token recebido na função sendConfirmationEmail: ', token); // adicionado para verificar o valor da variável token
  const confirmationLink = `http://localhost:3001/users/confirm-email?token=${token}`;

  const mailOptions = {
    from: 'your_email',
    to,
    subject: 'Confirmação de cadastro',
    text: `Olá, obrigado por se cadastrar! Por favor, confirme seu e-mail clicando no link a seguir: ${confirmationLink}`,
    html: `<p>Olá, obrigado por se cadastrar! Por favor, confirme seu e-mail clicando no link a seguir: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error);
  }
};

module.exports = {
  sendConfirmationEmail,
};

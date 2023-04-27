import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'matheus.almn@gmail.com',
    pass: '8352850!Aff',
  },
});

const sendConfirmationEmail = async (to, token) => {
  const confirmationLink = 'http://localhost:3000/confirm/${token}';

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

export { sendConfirmationEmail };

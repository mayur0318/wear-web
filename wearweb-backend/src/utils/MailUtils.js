const mailer = require("nodemailer");

const mailSend = async (to, subject, text) => {
  const transporter = await mailer.createTransport({
    service: "gmail",
    auth: {
      user: "mayurparmar0317@gmail.com",
      pass: "rfeo ojbd dyuv sdfs",
    },
  });
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    }
    .container {
      width: 100%;
      padding: 20px;
    }
    .card {
      max-width: 500px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #000;
      color: #fff;
      padding: 15px;
      border-radius: 10px 10px 0 0;
      font-size: 22px;
    }
    .content {
      margin: 20px 0;
      color: #333;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 15px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="card">
    
    <div class="header">
      👕 Wear Web
    </div>

    <div class="content">
      <h2>Thank You for Registering!</h2>
      
      <p>
        We are excited to have you as a part of <b>Wear Web</b>.
      </p>
      
      <p>
        Your journey towards discovering amazing fashion starts here.
        Stay tuned for the latest trends, exclusive offers, and much more!
      </p>

      <p>
        If you have any questions, feel free to reach out anytime.
      </p>

      <a href="#" class="button">Explore Now</a>
    </div>

    <div class="footer">
      © 2026 Wear Web. All rights reserved.
    </div>

  </div>
</div>

</body>
</html>`;
  const mailOptions = {
    to: to,
    subject: subject,
    html: htmlContent,
  };

  const mailResponse = await transporter.sendMail(mailOptions);
  return mailOptions;
};

module.exports = mailSend;

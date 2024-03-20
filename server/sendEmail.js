const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  service: 'gmail',
  auth: {
    user: "gabriell.touma@gmail.com",
    pass: "kanw mxkw ggqd dddj",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '<gabriell.touma@gmail.com>', // sender address
    to: "gabriell.touma@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>To reset your password, please click the following link:</p><a href="https://yourapp.com/reset-password?token=">Reset your password</a><p>This link will expire in 1 hour.</p>`
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

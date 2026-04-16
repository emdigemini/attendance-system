import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (status, email, fullName, username, password) => {
  const mailOption1 = {
    from: `East System Colleges of Rizal - Attendance System`,
    to: email,
    subject: 'Welcome! Your Account Credentials',
    html: `
      <h3>Hello, ${fullName}!</h3>
      <p>Your account is already created. Here is your login details:</p>
      <ul>
        <li><b>Full Name:</b> ${fullName}</li>
        <li><b>Username:</b> ${username}</li>
        <li><b>Password:</b> ${password}</li>
      </ul>
      <p>We recommend changing your password after your first login to ensure account security.</p>
    `
  };

  const mailOption2 = {
    from: `Attendance System: East System Colleges of Rizal`,
    to: email,
    subject: 'Your Password Has Been Reset',
    html: `
      <h3>Hello, ${fullName}!</h3>
      <p>Your password has been reset. Here is your new login details:</p>
      <ul>
        <li><b>Full Name:</b> ${fullName}</li>
        <li><b>Username:</b> ${username}</li>
        <li><b>Password:</b> ${password}</li>
      </ul>
      <p>We recommend changing your password after you login to ensure account security.</p>
    `
  };

  try {
    if(status === "create") {
      await transporter.sendMail(mailOption1);
    } else {
      await transporter.sendMail(mailOption2);
    }
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendWelcomeEmail;
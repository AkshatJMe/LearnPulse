// Importing nodemailer module
import nodemailer from "nodemailer";

// Function to send email using nodemailer
export const mailSender = async (
  email: string,
  title: string,
  body: string
) => {
  try {
    // Check if email credentials are configured
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("❌ Email configuration missing! Check MAIL_HOST, MAIL_USER, and MAIL_PASS in .env");
      throw new Error("Email service not configured");
    }

    console.log(`📧 Attempting to send email to: ${email}`);
    console.log(`📧 Using mail host: ${process.env.MAIL_HOST}`);
    console.log(`📧 Using mail user: ${process.env.MAIL_USER}`);

    // Creating a nodemailer transporter using SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // SMTP server hostname
      auth: {
        user: process.env.MAIL_USER, // SMTP username
        pass: process.env.MAIL_PASS, // SMTP password
      },
    });

    // Sending email using transporter
    const info = await transporter.sendMail({
      from: `"LearnPulse" <${process.env.MAIL_USER}>`, // Sender's email address
      to: email, // Recipient's email address
      subject: title, // Email subject
      html: body, // Email body in HTML format
    });

    console.log(`✅ Email sent successfully to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);

    return info; // Returning information about the sent email
  } catch (error: any) {
    // Handling errors if any occur during the email sending process
    console.error("❌ Error while sending mail:");
    console.error(`   To: ${email}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Full error:`, error);
    throw error; // Re-throw to let caller handle it
  }
};

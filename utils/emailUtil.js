import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  EMAIL,
  EMAIL_USER,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
} from "./config.js";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const title = "Delisting notification.";
const sendEmail = async (text = title, subject = title) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: EMAIL_USER,
      subject: subject,
      text: text,
      // html: '<h1>This is a test email sent using OAuth2!</h1>',
    };

    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi!");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

export default sendEmail;

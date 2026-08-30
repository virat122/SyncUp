const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendOtpEmail(toEmail, otpCode) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Your Verification Code";
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.sender = { 
    name: "Your App Name", 
    email: "no-reply@yourdomain.com" // Or your verified Brevo sender email
  };
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
      <p style="font-size: 15px; color: #555;">Use the OTP below to complete your registration or login. This code will expire in 5 minutes.</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background: #f0f4ff; padding: 10px 20px; border-radius: 6px; display: inline-block;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 13px; color: #888; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = { sendOtpEmail };
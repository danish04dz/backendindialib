exports.signinWelcome = (name) =>{

    return `<!DOCTYPE html>
<head>
    <title>Welcome Mail</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 0; text-align: center;">
          <h1 style="margin: 0;">Welcome, ${name}!</h1>
        </div>
        <div style="padding: 20px; text-align: left;">
          <p style="font-size: 16px; line-height: 1.6;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for signing up! We’re thrilled to have you with us. You can now access all of our amazing features and be part of a great community.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions or need assistance, feel free to reach out to our support team. We’re always here to help!
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Best regards,<br>
            The Team
          </p>
        </div>
        <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center;">
          <p style="font-size: 12px; color: #666;">
            You received this email because you signed up for indialib.in
            If you didn’t sign up, please ignore this email or contact support.
          </p>
          <p style="font-size: 12px; color: #666;">
            &copy; 2024 IndiaLib. All rights reserved.
          </p>
        </div>
      </div>
      
</body>
</html>`

}
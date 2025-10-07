/**
 * Generates HTML email template for certificate generation
 * @param studentName - Student name
 * @param courseName - Course name
 * @param certificateId - Certificate ID
 * @returns HTML email template
 */
export const certificateEmail = (
  studentName: string,
  courseName: string,
  certificateId: string
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion</title>
  <style>
    body {
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
    }
    .message {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #f59e0b;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .highlight {
      font-weight: bold;
      color: #5b21b6;
    }
    .certificate-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .certificate-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .cta {
      display: inline-block;
      padding: 12px 24px;
      background-color: #fff;
      color: #5b21b6;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="message">🎓 Congratulations on Completing the Course!</div>
    <div class="body">
      <p>Hello ${studentName},</p>
      <p>We're thrilled to inform you that you have successfully completed "<span class="highlight">${courseName}</span>"!</p>
      
      <div class="certificate-box">
        <div class="certificate-icon">🏆</div>
        <h2>Certificate of Completion</h2>
        <p>Certificate ID: ${certificateId}</p>
      </div>
      
      <p>Your certificate is now ready to download. Share your achievement with your network and showcase your new skills!</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/certificates" class="cta">
        Download Certificate
      </a>
      
      <p>Keep learning and growing with Learn Pulse!</p>
    </div>
  </div>
</body>
</html>`;
};

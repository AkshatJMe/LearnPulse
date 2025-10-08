/**
 * Generates HTML email template for course rejection notification
 * @param instructorName - Instructor name
 * @param courseName - Course name
 * @param reason - Rejection reason
 * @returns HTML email template
 */
export const courseRejectionEmail = (
  instructorName: string,
  courseName: string,
  reason: string
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Course Requires Revision</title>
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
      color: #ef4444;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .highlight {
      font-weight: bold;
      color: #5b21b6;
    }
    .reason-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .cta {
      display: inline-block;
      padding: 12px 24px;
      background-color: #5b21b6;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="message">Course Requires Revision</div>
    <div class="body">
      <p>Hello ${instructorName},</p>
      <p>Your course "<span class="highlight">${courseName}</span>" has been reviewed. Unfortunately, it requires some revisions before it can be published.</p>
      
      <div class="reason-box">
        <strong>Reason for rejection:</strong><br>
        ${reason}
      </div>
      
      <p>Please review the feedback and make the necessary changes. You can then resubmit your course for approval.</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/my-courses" class="cta">
        Edit Course
      </a>
      
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>`;
};

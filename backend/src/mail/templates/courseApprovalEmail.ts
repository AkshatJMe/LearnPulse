/**
 * Generates HTML email template for course approval notification
 * @param instructorName - Instructor name
 * @param courseName - Course name
 * @returns HTML email template
 */
export const courseApprovalEmail = (
  instructorName: string,
  courseName: string
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Course Approved</title>
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
      color: #22c55e;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .highlight {
      font-weight: bold;
      color: #5b21b6;
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
    <div class="message">Congratulations! Your Course Has Been Approved ✅</div>
    <div class="body">
      <p>Hello ${instructorName},</p>
      <p>Great news! Your course "<span class="highlight">${courseName}</span>" has been reviewed and approved by our admin team.</p>
      <p>Your course is now live and available for students to enroll. Start promoting your course to reach more learners!</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/my-courses" class="cta">
        View My Courses
      </a>
      
      <p>Thank you for contributing to our learning community!</p>
    </div>
  </div>
</body>
</html>`;
};

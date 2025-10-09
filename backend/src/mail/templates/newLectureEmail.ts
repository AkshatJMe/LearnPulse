/**
 * Generates HTML email template for new lecture announcement
 * @param studentName - Student name
 * @param courseName - Course name
 * @param lectureName - Lecture name
 * @returns HTML email template
 */
export const newLectureEmail = (
  studentName: string,
  courseName: string,
  lectureName: string
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Lecture Added</title>
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
      color: #3b82f6;
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
    <div class="message">📚 New Lecture Available!</div>
    <div class="body">
      <p>Hello ${studentName},</p>
      <p>Great news! A new lecture has been added to your course "<span class="highlight">${courseName}</span>".</p>
      <p><strong>New Lecture:</strong> ${lectureName}</p>
      <p>Continue your learning journey and check out the latest content!</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/enrolled-courses" class="cta">
        Watch Now
      </a>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generates HTML email template for payment success notification
 * @param name - Student name
 * @param amount - Payment amount
 * @param orderId - Order ID
 * @param paymentId - Payment ID
 * @returns HTML email template
 */
export const paymentSuccessEmail = (
  name: string,
  amount: number,
  orderId: string,
  paymentId: string
): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Successful</title>
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
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
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
    .payment-details {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #6b7280;
    }
    .value {
      font-weight: 600;
      color: #111827;
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
    .support {
      font-size: 14px;
      color: #6b7280;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="message">Payment Successful! 🎉</div>
    <div class="body">
      <p>Hello ${name},</p>
      <p>Thank you for your purchase! Your payment has been successfully processed.</p>
      
      <div class="payment-details">
        <div class="detail-row">
          <span class="label">Amount Paid:</span>
          <span class="value">$${amount.toFixed(2)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Order ID:</span>
          <span class="value">${orderId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Payment ID:</span>
          <span class="value">${paymentId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date:</span>
          <span class="value">${new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <p>You can now access your purchased courses and start learning!</p>
      
      <a href="${process.env.FRONTEND_URL}/dashboard/enrolled-courses" class="cta">
        View My Courses
      </a>
      
      <p class="support">
        If you have any questions or need assistance, please don't hesitate to contact our support team.
      </p>
    </div>
  </div>
</body>
</html>`;
};

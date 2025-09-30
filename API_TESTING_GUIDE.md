# 🧪 API Testing Quick Reference

This document provides sample API requests for testing all new features.

---

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1️⃣ Stripe Payment APIs

### Create Checkout Session
```http
POST http://localhost:4000/api/v1/stripe/create-checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "coursesId": ["course_id_1", "course_id_2"],
  "couponCode": "SAVE20"  // optional
}
```

### Verify Payment
```http
POST http://localhost:4000/api/v1/stripe/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "cs_test_xxx"
}
```

### Get Payment History
```http
GET http://localhost:4000/api/v1/stripe/history
Authorization: Bearer <token>
```

---

## 2️⃣ Cart APIs

### Get Cart
```http
GET http://localhost:4000/api/v1/cart
Authorization: Bearer <token>
```

### Add to Cart
```http
POST http://localhost:4000/api/v1/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

### Remove from Cart
```http
DELETE http://localhost:4000/api/v1/cart/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

### Clear Cart
```http
DELETE http://localhost:4000/api/v1/cart/clear
Authorization: Bearer <token>
```

---

## 3️⃣ Wishlist APIs

### Get Wishlist
```http
GET http://localhost:4000/api/v1/wishlist
Authorization: Bearer <token>
```

### Toggle Wishlist (Add/Remove)
```http
POST http://localhost:4000/api/v1/wishlist/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

---

## 4️⃣ Quiz APIs

### Create Quiz (Instructor)
```http
POST http://localhost:4000/api/v1/quiz/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id",
  "subSectionId": "lecture_id",
  "title": "React Basics Quiz",
  "description": "Test your React knowledge",
  "questions": [
    {
      "questionText": "What is JSX?",
      "options": ["JavaScript XML", "Just X", "Java Syntax", "None"],
      "correctAnswer": 0,
      "points": 10
    },
    {
      "questionText": "What is useState?",
      "options": ["A hook", "A function", "A class", "A component"],
      "correctAnswer": 0,
      "points": 10
    }
  ],
  "passingScore": 60,
  "duration": 30,
  "attemptLimit": 3
}
```

### Get Quiz
```http
GET http://localhost:4000/api/v1/quiz/<quiz_id>
Authorization: Bearer <token>
```

### Submit Quiz (Student)
```http
POST http://localhost:4000/api/v1/quiz/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "quiz_id",
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": 0
    },
    {
      "questionIndex": 1,
      "selectedAnswer": 0
    }
  ],
  "timeTaken": 300
}
```

### Get Quiz Results
```http
GET http://localhost:4000/api/v1/quiz/results/<quiz_id>
Authorization: Bearer <token>
```

---

## 5️⃣ Discussion APIs

### Create Discussion
```http
POST http://localhost:4000/api/v1/discussion/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id",
  "subSectionId": "lecture_id",
  "content": "How do I implement state management?",
  "parentId": null  // null for new thread, or discussion_id for reply
}
```

### Get Discussions for Lecture
```http
GET http://localhost:4000/api/v1/discussion?subSectionId=<lecture_id>
Authorization: Bearer <token>
```

### Get Replies
```http
GET http://localhost:4000/api/v1/discussion/<discussion_id>/replies
Authorization: Bearer <token>
```

### Like Discussion
```http
POST http://localhost:4000/api/v1/discussion/<discussion_id>/like
Authorization: Bearer <token>
```

### Pin Discussion (Instructor)
```http
POST http://localhost:4000/api/v1/discussion/<discussion_id>/pin
Authorization: Bearer <token>
```

---

## 6️⃣ Certificate APIs

### Generate Certificate (Student)
```http
POST http://localhost:4000/api/v1/certificate/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id"
}
```

### Get My Certificates
```http
GET http://localhost:4000/api/v1/certificate/my-certificates
Authorization: Bearer <token>
```

### Verify Certificate (Public)
```http
GET http://localhost:4000/api/v1/certificate/verify/<certificate_id>
```

### Download Certificate
```http
GET http://localhost:4000/api/v1/certificate/download/<certificate_id>
Authorization: Bearer <token>
```

---

## 7️⃣ Analytics APIs

### Get Instructor Analytics
```http
GET http://localhost:4000/api/v1/analytics/instructor
Authorization: Bearer <token>
```

### Get Course Statistics
```http
GET http://localhost:4000/api/v1/analytics/course/<course_id>
Authorization: Bearer <token>
```

---

## 8️⃣ Admin APIs

### Get Platform Analytics
```http
GET http://localhost:4000/api/v1/admin/analytics
Authorization: Bearer <token>
```

### Get Pending Courses
```http
GET http://localhost:4000/api/v1/admin/courses/pending
Authorization: Bearer <token>
```

### Approve Course
```http
PUT http://localhost:4000/api/v1/admin/courses/approve/<course_id>
Authorization: Bearer <token>
```

### Reject Course
```http
PUT http://localhost:4000/api/v1/admin/courses/reject/<course_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Course content needs improvement in module 3."
}
```

### Disable Course
```http
PUT http://localhost:4000/api/v1/admin/courses/disable/<course_id>
Authorization: Bearer <token>
```

### Remove Review
```http
DELETE http://localhost:4000/api/v1/admin/reviews/<review_id>
Authorization: Bearer <token>
```

### Get All Users
```http
GET http://localhost:4000/api/v1/admin/users?role=student&page=1&limit=20
Authorization: Bearer <token>
```

### Toggle User Status
```http
PUT http://localhost:4000/api/v1/admin/users/<user_id>/toggle-status
Authorization: Bearer <token>
```

---

## 9️⃣ Enhanced Rating & Review APIs

### Create Rating
```http
POST http://localhost:4000/api/v1/course/createRating
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id",
  "rating": 5,
  "review": "Excellent course! Learned a lot."
}
```

### Get Course Reviews
```http
GET http://localhost:4000/api/v1/course/getReviews/<course_id>
```

### Update Review
```http
PUT http://localhost:4000/api/v1/course/updateReview/<review_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "review": "Updated: Very good course."
}
```

### Delete Review
```http
DELETE http://localhost:4000/api/v1/course/deleteReview/<review_id>
Authorization: Bearer <token>
```

---

## 🔟 Enhanced Coupon APIs

### Create Coupon (Admin)
```http
POST http://localhost:4000/api/v1/coupon/new
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20",
  "discountPercent": 20,
  "discountType": "percent",
  "expiryDate": "2026-12-31",
  "maxUsage": 100,
  "minPurchaseAmount": 50,
  "isActive": true
}
```

### Apply Coupon
```http
GET http://localhost:4000/api/v1/coupon/applyDiscount?coupon=SAVE20&amount=100&courseId=xxx
```

---

## 🧪 Testing with Postman/Thunder Client

### 1. Create Environment
```json
{
  "baseUrl": "http://localhost:4000/api/v1",
  "token": "your_jwt_token_here"
}
```

### 2. Set Headers
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

### 3. Import Collection
Save requests as a Postman collection for easy testing.

---

## 🔑 Test Data Examples

### Test User Roles
```json
// Student
{
  "email": "student@test.com",
  "password": "password123",
  "accountType": "student"
}

// Instructor
{
  "email": "instructor@test.com",
  "password": "password123",
  "accountType": "instructor"
}

// Admin
{
  "email": "admin@test.com",
  "password": "password123",
  "accountType": "admin"
}
```

### Test Stripe Card
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/28)
CVC: Any 3 digits (e.g., 123)
```

---

## 📝 Response Examples

### Successful Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 🚀 Quick Test Workflow

1. **Setup:**
   - Start backend server
   - Get JWT token (login)
   - Set token in headers

2. **Test Cart Flow:**
   ```
   GET /cart → Add course → GET /cart → Remove → Clear
   ```

3. **Test Wishlist Flow:**
   ```
   GET /wishlist → Toggle course → GET /wishlist
   ```

4. **Test Payment Flow:**
   ```
   Add to cart → Create checkout → Pay → Verify → Check enrollment
   ```

5. **Test Quiz Flow:**
   ```
   Create quiz → Get quiz → Submit → Get results
   ```

6. **Test Discussion Flow:**
   ```
   Create thread → Reply → Like → Pin
   ```

---

## 🔍 Debugging Tips

### Check Server Logs
Monitor terminal for errors and request logs.

### Verify Database
Use MongoDB Compass to check data creation.

### Test Webhooks
Use Stripe CLI to test webhook locally:
```bash
stripe listen --forward-to localhost:4000/api/v1/stripe/webhook
```

### Check Environment
Verify all .env variables are set correctly.

---

## 📚 Additional Resources

- **Stripe Testing:** https://stripe.com/docs/testing
- **MongoDB Queries:** https://www.mongodb.com/docs/manual/
- **Postman Docs:** https://learning.postman.com/

---

**Happy Testing! 🧪**

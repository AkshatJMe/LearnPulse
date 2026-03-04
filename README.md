# LearnPulse 📝

LearnPulse is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. <br/>
The platform is built using the **MERN stack**, which includes ReactJS, NodeJS, MongoDB, and ExpressJS.

## Schema 📋

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/schema.png' />

## Tech Stack 💻🔧

### Frontend 🎨 :

<code title="React.js"><img height="40" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/react%20ogo.png"></code>

<code title="Vite"><img height="40" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/Vitejs-logo.png"></code>

<code title="Redux.js"><img height="35" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/redux-logo.png"></code>

<code title="CSS"><img height="40" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/css%20logo.png"></code>

<code title="Tailwind CSS"><img height="35" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/tailwind%20css%20logo.png"></code>

### Backend ⚙️ :

<code title="Node.js"><img height="50" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/nodejs-logo.png"></code>

<code title="Express"><img height="70" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/express%20logo.png"></code>

### Database 🛢️ :

<code title="MongoDB"><img height="40" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/mongodb%20logo.png"></code>

### Cloudinary Integration ☁️

<code title="Cloudinary"><img height="40" src="https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/Tech%20stack%20logo/cloudinary-logo.jpg"></code>

<hr/>

## Front End Features 🎨

The front end of LearnPulse includes all the essential pages required for an ed-tech platform:

### For Students:

- **Homepage 🏠:** A brief introduction to the platform with links to the course list and user details and a random background.
- **Course List 📚:** A comprehensive list of all available courses, including descriptions, ratings, and filtering options.
- **Course Details Page 👀:** Detailed view of individual courses with descriptions, instructor information, reviews, and ratings.
- **Cart Management 🛒:** Add/remove courses from cart, view cart with course details, subtotal, and checkout functionality.
- **Course Content 🎓:** Presents detailed content for specific courses, including videos, sections, subsections, and related materials.
- **Video Player 🎥:** Video streaming functionality with play/pause, progress tracking, and quality settings.
- **Quiz/Assessments ❓:** Interactive quizzes with multiple-choice questions, instant feedback, and score tracking.
- **Wishlist 💖:** Save courses for later viewing with easy access and organization.
- **Ratings & Reviews ⭐:** View and submit course ratings and written reviews.
- **Discussion Forum 💬:** Engage with other students and instructors through course discussions and Q&A.
- **Learning Progress 📊:** Track course completion percentage, section progress, and learning timeline.
- **Certificate Download 🎓:** Download completion certificates upon course completion.
- **Notification Center 🔔:** View announcements, course updates, payment confirmations, and system notifications.
- **User Profile 👤:** View student profile with enrolled courses, learning history, and account statistics.
- **Edit Profile ✏️:** Update personal information, profile picture, and account settings.
- **About Page 📖:** Learn about the platform, its mission, and values.
- **Contact Page 📞:** Send inquiries and contact the support team.
- **Authentication Pages 🔐:** Sign up, login, email verification, password reset, and forgot password functionality.
- **Payment Processing 💳:** Secure checkout with Razorpay and Stripe integration.

### For Instructors:

- **Dashboard 📊:** Comprehensive overview of all courses, student enrollments, ratings, and feedback.
- **Instructor Insights 📈:** Advanced analytics showing course views, clicks, conversion rates, and revenue metrics.
- **Course Management 🛠️:** Create, update, delete, and publish courses.
- **Course Builder 🏗️:** Intuitive interface for structuring courses with sections and subsections.
- **Section Management 📑:** Organize course content into logical sections with descriptions.
- **Sub-section Management 📄:** Add video lectures, resources, and materials to subsections.
- **Video Upload 🎬:** Upload and manage course videos with Cloudinary integration.
- **Course Pricing 💰:** Set course prices, discounts, and promotional offers.
- **Quiz Builder ❓:** Create quizzes with questions, options, and correct answers.
- **Course Approval Status ✅:** Track course submission status and approval by admin.
- **View & Edit Profile 👀:** Manage instructor profile, bio, credentials, and avatar.
- **Revenue Tracking 💹:** Monitor course sales and earnings analytics.
- **Student Interactions 💭:** Respond to course discussions and student inquiries.

### For Admin:

- **Admin Dashboard 📊:** Overall platform analytics, user statistics, and system health monitoring.
- **Category Management 📂:** Create, update, and delete course categories.
- **Category CRUD 🔧:** Full control over category organization and hierarchy.
- **User Management 👥:** View all students and instructors with detailed profiles and account status.
- **User Approval ✅:** Approve or reject new instructor registrations.
- **Course Approval 📚:** Review and approve courses before they go live to students.
- **Coupon Management 🎟️:** Create, manage, and track promotional coupons and discount codes.
- **Analytics & Reports 📈:** Advanced metrics on platform usage, revenue, student engagement, and course performance.
- **Financial Tracking 💰:** Monitor payments, refunds, and revenue distribution.

## Back End Features ⚙️

The back-end of LearnPulse is built with NodeJS and ExpressJS, providing robust APIs for the front end to interact with:

- **User Authentication & Authorization 🔐:** Complete authentication system with sign-up, login, email verification, OTP verification, password reset, and JWT-based session management.
- **Role-Based Access Control 👮:** Granular permissions for Students, Instructors, and Admins with middleware-based authorization.
- **User Management 👥:** CRUD operations for user profiles, profile pictures, account settings, and user preferences.
- **Course Management 🛠️:** Complete CRUD operations for courses with detailed information, descriptions, pricing, and status tracking.
- **Section & Sub-Section Management 📑:** Hierarchical organization of course content with sections and video subsections.
- **Video Hosting & Streaming 🎥:** Integration with Cloudinary for video uploads, storage, and streaming capabilities.
- **Quiz System 🎯:** Full quiz functionality with question management, multiple-choice options, scoring, and result tracking.
- **Course Progress Tracking 📊:** Track student progress through courses, sections, video completion, and quiz attempts.
- **Rating & Review System ⭐:** Allow students to rate and review courses with average ratings and review display.
- **Discussion Forum 💬:** Enable course discussions and Q&A between students and instructors.
- **Wishlist Management 💖:** Students can add/remove courses from wishlist and view saved courses.
- **Cart Management 🛒:** Shopping cart functionality with add, remove, and checkout operations.
- **Payment Integration 💳:** Multi-payment gateway support:
  - **Stripe Integration:** International payment support with card processing and payment intent handling.
- **Payment Management:** Track payments, refunds, invoices, and transaction history.
- **Coupon System 🎟️:** Create and apply discount coupons with validation and tracking.
- **Email Notifications 📧:** Automated emails for:
  - Account verification
  - Password reset
  - Course enrollment confirmation
  - Payment receipts
  - Course updates and announcements
- **Cloud-based Media Management ☁️:** Cloudinary integration for secure image and video uploads, transformation, and delivery.
- **Analytics & Reporting 📈:** Comprehensive analytics for:
  - Course performance metrics
  - Student engagement data
  - Revenue analytics
  - Platform-wide statistics
- **Certificate Management 🎓:** Automatic certificate generation and distribution upon course completion.
- **Data Validation & Error Handling:** Robust input validation and comprehensive error responses.
- **Admin Controls 🔧:** Administrative endpoints for managing categories, users, courses, and coupons.

## 🖥️ Screen Preview :

### 1️⃣ Open Pages (Before Login)

#### Home Page 🏠

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/HomePage.png' />

#### About Page 📖

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/aboutPage.png' />

#### Contact Page 📞

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/contactPage.png' />

#### View Course 👀

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/viewCourse.png' />

#### Sign Up Page ✍️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/SignUpPage.png' />

#### Verify Email Page ✅

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/verifyEmailPage.png' />

#### Login Page 🔐

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/LoginPage.png' />

#### Forget Password Page 🔑

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/forgetPasswordPage.png' />

#### Reset Password After Link Page 🔄

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/openPages/resetPassAfterLinkPage.png' />

---

### 2️⃣ After Login Pages

#### Cart Page 🛒

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/afterLogin/cartPage.png' />

#### Profile Dashboard Page 👤

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/afterLogin/profileDashboardPage.png' />

#### Profile Setting Page ⚙️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/afterLogin/profileSettingPage.png' />

#### Notification Page 🔔

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/afterLogin/notificationPage.png' />

---

### 3️⃣ Admin Pages

#### Admin Analytics Page 📊

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/adminAnalyticsPage.png' />

#### Category Management 📂

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/categoryMgmt.png' />

#### Category CRUD 🔧

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/categoryCRUD.png' />

#### Coupon Management 🎟️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/couponMgmt.png' />

#### Coupon Creation 🎁

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/couponCreation.png' />

#### Course Management 📚

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/courseMgmt.png' />

#### Course View 👁️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/courseView.png' />

#### Approval Courses Page ✏️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/approvalCoursesPage.png' />

#### User Management 👥

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/adminPages/userMgmt.png' />

---

### 4️⃣ Instructor Pages

#### Dashboard 📈

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/instructorPages/dashboardInstructor.png' />

#### Course Dashboard 🎓

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/instructorPages/courseDashboard.png' />

#### Course Builder 🛠️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/instructorPages/courseBuilder.png' />

#### Course Builder 2️⃣

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/instructorPages/courseBuilder2.png' />

#### Quiz Builder ❓

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/instructorPages/quizBuilder.png' />

---

### 5️⃣ Student Pages

#### Enrolled Courses 📖

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/enrolledCourses.png' />

#### Course Modal 🎬

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/courseModal.png' />

#### Wishlist Page 💖

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/wishlistPage.png' />

#### Full Cart Page 🛍️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/fullCartPage.png' />

#### Cart with Coupon Page 🎟️

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/cartWithCouponPage.png' />

#### Processing Payment ⏳

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/processingPayment.png' />

#### Payment Successful 🎉

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/paymentSuccessfull.png' />

#### Learning Progress Page 📊

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/learningProgressPage.png' />

#### Certificate Download Page 🎓

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/certificateDownloadPage.png' />

#### Certificate Download Screenshot 📸

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/studentPages/certificateDownloadSS.png' />

---

### 6️⃣ Email Templates 📧

#### Mail Template

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/mails/mail-template.png' />

#### Course Registration Mail

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/mails/courseRegistration.jpeg' />

#### Payment Mail

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/mails/paymentMail.jpeg' />

#### Certificate Page Mail

<img width='100%' src='https://github.com/AkshatJMe/LearnPulse/blob/main/screenshot/mails/cartificatePage.png' />

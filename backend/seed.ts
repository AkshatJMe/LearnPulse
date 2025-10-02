import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "./src/models/user";
import { Profile } from "./src/models/profile";
import { Category } from "./src/models/category";
import { Course } from "./src/models/course";
import { RatingAndReview } from "./src/models/ratingAndreview";
import { Certificate } from "./src/models/certificate";
import { CourseProgress } from "./src/models/courseProgress";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.DATABASE_URL || process.env.MONGODB_URL;

const profilesData = [
  { gender: "Male", dateOfBirth: "1990-05-15", about: "Passionate software developer and educator", contactNumber: 9876543210 },
  { gender: "Female", dateOfBirth: "1992-08-22", about: "Full-stack developer with 5+ years experience", contactNumber: 9876543211 },
  { gender: "Male", dateOfBirth: "1988-03-10", about: "Data science and machine learning expert", contactNumber: 9876543212 },
  { gender: "Female", dateOfBirth: "1995-11-30", about: "Web designer and frontend specialist", contactNumber: 9876543213 },
  { gender: "Male", dateOfBirth: "1998-01-14", about: "Enthusiastic learner exploring tech", contactNumber: 9876543214 },
  { gender: "Female", dateOfBirth: "1996-07-20", about: "Career changer into tech industry", contactNumber: 9876543215 },
  { gender: "Male", dateOfBirth: "1994-09-05", about: "Backend specialist with cloud expertise", contactNumber: 9876543216 },
  { gender: "Female", dateOfBirth: "1999-02-28", about: "Student exploring different tech stacks", contactNumber: 9876543217 },
  { gender: "Male", dateOfBirth: "1991-06-12", about: "DevOps engineer and system architect", contactNumber: 9876543218 },
  { gender: "Female", dateOfBirth: "1997-04-18", about: "Mobile app developer passionate about innovation", contactNumber: 9876543219 },
];

const categoriesData = [
  { name: "Web Development", description: "Learn HTML, CSS, JavaScript, and frameworks" },
  { name: "Mobile Development", description: "iOS, Android, React Native, Flutter" },
  { name: "Data Science", description: "Python, Data Analysis, Machine Learning" },
  { name: "Cloud & DevOps", description: "AWS, Docker, Kubernetes, CI/CD" },
  { name: "UI/UX Design", description: "Design principles, Figma, User Experience" },
  { name: "Cybersecurity", description: "Network security, Ethical hacking, Compliance" },
];

const thumbnailPool = [
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537432376769-00a3f0f4c0d2?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop",
];

const baseCourseTemplates = [
  {
    courseName: "Complete Web Development Bootcamp",
    courseDescription: "Master modern web development with HTML, CSS, JavaScript, React, Node.js and MongoDB",
    whatYouWillLearn: "Build responsive websites with HTML and CSS\nMaster JavaScript ES6+ concepts\nCreate interactive frontends with React\nBuild RESTful APIs with Node.js and Express\nWork with MongoDB databases",
    price: 15000,
    tag: ["web", "javascript", "react", "nodejs"],
    instructions: ["Complete all video lessons sequentially", "Build 3 capstone projects", "Participate in code reviews", "Complete weekly quizzes"],
  },
  {
    courseName: "React.js Advanced Concepts",
    courseDescription: "Deep dive into advanced React patterns, hooks, and performance optimization",
    whatYouWillLearn: "Master React Hooks deeply\nImplement custom hooks\nOptimize performance with memoization\nWork with Context API\nImplement state management patterns",
    price: 12000,
    tag: ["react", "javascript", "frontend"],
    instructions: ["Watch video lessons", "Complete coding challenges", "Build a portfolio project"],
  },
  {
    courseName: "Python for Data Science",
    courseDescription: "Learn Python programming for data analysis, visualization, and machine learning",
    whatYouWillLearn: "Python fundamentals\nNumPy and Pandas for data manipulation\nData visualization with Matplotlib and Seaborn\nMachine Learning basics with Scikit-learn\nReal-world projects",
    price: 14000,
    tag: ["python", "datascience", "ml"],
    instructions: ["Complete hands-on coding exercises", "Work on data science projects", "Submit project reports"],
  },
  {
    courseName: "Cloud Architecture with AWS",
    courseDescription: "Comprehensive guide to designing and deploying applications on Amazon Web Services",
    whatYouWillLearn: "AWS core services\nVPC and networking\nEC2, RDS, and database services\nLambda and serverless computing\nCloudFront and CDN",
    price: 18000,
    tag: ["aws", "cloud", "devops"],
    instructions: ["Set up AWS free tier", "Complete hands-on labs", "Deploy sample applications", "Pass AWS practice exams"],
  },
  {
    courseName: "Mobile App Development with Flutter",
    courseDescription: "Build beautiful, high-performance mobile apps for iOS and Android",
    whatYouWillLearn: "Flutter basics and widgets\nState management with Provider\nBuilding responsive UIs\nFirebase integration\nPublishing apps to stores",
    price: 13000,
    tag: ["flutter", "mobile", "dart"],
    instructions: ["Install Flutter SDK", "Follow along with video tutorials", "Build practice applications", "Complete 2 capstone projects"],
  },
  {
    courseName: "UI/UX Design Fundamentals",
    courseDescription: "Learn design principles, user research, and prototyping with Figma",
    whatYouWillLearn: "Design principles and typography\nUser research methods\nWireframing and prototyping\nFigma mastery\nAccessibility in design",
    price: 10000,
    tag: ["design", "uiux", "figma"],
    instructions: ["Download Figma free plan", "Complete design challenges", "Get feedback on projects", "Build design portfolio"],
  },
  {
    courseName: "Node.js Backend Mastery",
    courseDescription: "Build scalable backend services with Node.js, Express and MongoDB",
    whatYouWillLearn: "Node.js event loop\nExpress architecture\nMongoDB schema design\nAuthentication and authorization\nProduction deployment",
    price: 13500,
    tag: ["nodejs", "backend", "mongodb"],
    instructions: ["Implement all API assignments", "Complete auth module", "Deploy final backend project"],
  },
  {
    courseName: "DevOps CI/CD Pipeline Pro",
    courseDescription: "Automate builds, tests and deployments with modern CI/CD pipelines",
    whatYouWillLearn: "GitHub Actions\nDockerized workflows\nInfrastructure basics\nObservability\nRelease strategies",
    price: 16000,
    tag: ["devops", "cicd", "docker"],
    instructions: ["Set up pipelines", "Run integration tests", "Deploy to cloud sandbox"],
  },
  {
    courseName: "Cybersecurity Essentials",
    courseDescription: "Understand practical security concepts for modern web systems",
    whatYouWillLearn: "OWASP basics\nSecure coding standards\nThreat modeling\nIncident response\nSecurity testing",
    price: 14500,
    tag: ["security", "owasp", "cyber"],
    instructions: ["Complete security labs", "Submit audit report", "Fix vulnerable app tasks"],
  },
  {
    courseName: "Machine Learning Practical",
    courseDescription: "Apply machine learning concepts through real-world projects",
    whatYouWillLearn: "Supervised learning\nFeature engineering\nModel evaluation\nDeployment basics\nExperiment tracking",
    price: 17000,
    tag: ["ml", "python", "ai"],
    instructions: ["Train multiple models", "Compare metrics", "Present capstone model"],
  },
  {
    courseName: "TypeScript for Professionals",
    courseDescription: "Master TypeScript for production-grade frontend and backend systems",
    whatYouWillLearn: "Type system deep dive\nGenerics and utility types\nType-safe APIs\nMonorepo patterns\nTesting",
    price: 12500,
    tag: ["typescript", "javascript", "fullstack"],
    instructions: ["Refactor JS modules to TS", "Complete type challenges", "Ship typed final project"],
  },
  {
    courseName: "Android Development with Kotlin",
    courseDescription: "Create robust Android apps using Kotlin and modern architecture",
    whatYouWillLearn: "Kotlin language features\nJetpack components\nMVVM architecture\nNetworking and persistence\nApp publishing",
    price: 15500,
    tag: ["android", "kotlin", "mobile"],
    instructions: ["Build 2 production-style apps", "Complete UI exercises", "Publish APK demo"],
  },
];

const coursesData = Array.from({ length: 30 }, (_, index) => {
  const template = baseCourseTemplates[index % baseCourseTemplates.length];
  const batchNumber = Math.floor(index / baseCourseTemplates.length) + 1;
  const isBase = index < baseCourseTemplates.length;

  return {
    ...template,
    courseName: isBase ? template.courseName : `${template.courseName} - Batch ${batchNumber}`,
    price: template.price + (index % 5) * 500,
    thumbnail: thumbnailPool[index % thumbnailPool.length],
    tag: [...template.tag, `level-${(index % 3) + 1}`],
    instructions: [...template.instructions],
  };
});

const reviewsData = [
  { rating: 5, review: "Excellent course! The instructor explains concepts very clearly and the projects are practical and engaging." },
  { rating: 5, review: "Best course I have taken. Well structured, comprehensive, and the instructor is very responsive." },
  { rating: 4, review: "Great content and well organized. Some sections could use a bit more detail, but overall fantastic." },
  { rating: 4, review: "Very good course. Took me some time to understand certain concepts, but the material is solid." },
  { rating: 5, review: "This completely changed how I understand web development. Highly recommended for beginners and intermediate learners." },
  { rating: 3, review: "Good course, but some videos are outdated. The core concepts are solid though." },
  { rating: 5, review: "Amazing! I built real projects and now feel confident in my skills. Worth every penny." },
  { rating: 4, review: "Well-taught course with practical projects. Some advanced topics could be covered more deeply." },
  { rating: 5, review: "Outstanding instructor! Very patient and explains everything step by step." },
  { rating: 4, review: "Comprehensive course with good examples. Would appreciate more real-world projects." },
  { rating: 5, review: "Perfect for someone looking to transition into tech. Highly structured and beginner-friendly." },
  { rating: 4, review: "Good course overall. The projects are practical and help solidify concepts learned." },
];

async function seedDatabase() {
  try {
    if (!MONGO_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      RatingAndReview.deleteMany({}),
      CourseProgress.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    const createdProfiles = await Profile.insertMany(profilesData);
    console.log(`Created ${createdProfiles.length} profiles`);

    const usersData = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@learnpulse.com",
        password: "Admin@123456",
        accountType: "admin",
        additionalDetails: createdProfiles[0]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        active: true,
        approved: true,
      },
      {
        firstName: "Rahul",
        lastName: "Kumar",
        email: "rahul@instructor.com",
        password: "Instructor@123",
        accountType: "instructor",
        additionalDetails: createdProfiles[1]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
        active: true,
        approved: true,
      },
      {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@instructor.com",
        password: "Instructor@123",
        accountType: "instructor",
        additionalDetails: createdProfiles[2]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        active: true,
        approved: true,
      },
      {
        firstName: "Amit",
        lastName: "Patel",
        email: "amit@instructor.com",
        password: "Instructor@123",
        accountType: "instructor",
        additionalDetails: createdProfiles[3]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
        active: true,
        approved: true,
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[4]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        active: true,
        approved: true,
      },
      {
        firstName: "Aditya",
        lastName: "Singh",
        email: "aditya@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[5]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=aditya",
        active: true,
        approved: true,
      },
      {
        firstName: "Neha",
        lastName: "Gupta",
        email: "neha@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[6]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha",
        active: true,
        approved: true,
      },
      {
        firstName: "Vikram",
        lastName: "Desai",
        email: "vikram@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[7]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
        active: true,
        approved: true,
      },
      {
        firstName: "Zara",
        lastName: "Khan",
        email: "zara@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[8]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=zara",
        active: true,
        approved: true,
      },
      {
        firstName: "Rohan",
        lastName: "Verma",
        email: "rohan@student.com",
        password: "Student@123",
        accountType: "student",
        additionalDetails: createdProfiles[9]._id,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohan",
        active: true,
        approved: true,
      },
    ];

    for (const user of usersData) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const createdUsers = await User.insertMany(usersData);
    console.log(`Created ${createdUsers.length} users`);

    const instructors = [createdUsers[1], createdUsers[2], createdUsers[3]];
    const students = createdUsers.slice(4);

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories`);

    const coursesByInstructor = coursesData.map((course, index) => {
      const instructor = index < 16 ? instructors[0] : index < 24 ? instructors[1] : instructors[2];

      const enrolledStudents = students
        .filter((_, studentIndex) => {
          if (studentIndex === 0 && index < 24) return true;
          if (studentIndex === 1 && index % 3 === 0) return true;
          if (studentIndex === 2 && index % 2 === 0) return true;
          if (studentIndex === 3 && index % 4 !== 0) return true;
          if (studentIndex === 4 && index % 5 === 0) return true;
          if (studentIndex === 5 && index % 3 === 1) return true;
          return false;
        })
        .map((student) => student._id);

      if (enrolledStudents.length < 2) {
        enrolledStudents.push(students[0]._id, students[1]._id);
      }

      return {
        ...course,
        instructor: instructor._id,
        category: createdCategories[index % createdCategories.length]._id,
        studentsEnrolled: enrolledStudents,
        status: "Published",
        isApproved: true,
        averageRating: 4.2 + (index % 7) * 0.1,
        totalRatings: 0,
        totalRevenue: enrolledStudents.length * course.price,
      };
    });

    const createdCourses = await Course.insertMany(coursesByInstructor);
    console.log(`Created ${createdCourses.length} courses`);

    const reviewsToCreate: any[] = [];

    for (let courseIndex = 0; courseIndex < createdCourses.length; courseIndex++) {
      const course = createdCourses[courseIndex];
      const reviewerIds = (course.studentsEnrolled || []).slice(0, Math.min(4, course.studentsEnrolled.length));

      for (let reviewIndex = 0; reviewIndex < reviewerIds.length; reviewIndex++) {
        const review = reviewsData[(courseIndex + reviewIndex) % reviewsData.length];
        reviewsToCreate.push({
          user: reviewerIds[reviewIndex],
          rating: review.rating,
          review: review.review,
          course: course._id,
          isApproved: true,
          isRemoved: false,
        });
      }
    }

    const createdReviews = await RatingAndReview.insertMany(reviewsToCreate);
    console.log(`Created ${createdReviews.length} reviews and ratings`);

    for (const course of createdCourses) {
      const courseReviews = createdReviews.filter((review: any) => String(review.course) === String(course._id));
      if (courseReviews.length === 0) continue;

      const averageRating =
        courseReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / courseReviews.length;

      course.ratingAndReviews = courseReviews.map((review: any) => review._id);
      course.averageRating = Math.round(averageRating * 10) / 10;
      course.totalRatings = courseReviews.length;
      await course.save();
    }

    for (const instructor of instructors) {
      const instructorCourses = createdCourses.filter(
        (course) => String(course.instructor) === String(instructor._id)
      );

      instructor.courses = instructorCourses.map((course) => course._id);
      instructor.totalRevenue = instructorCourses.reduce(
        (sum, course) => sum + (course.totalRevenue || 0),
        0
      );
      await instructor.save();
    }

    const studentToCoursesMap = new Map<string, mongoose.Types.ObjectId[]>();

    for (const student of students) {
      studentToCoursesMap.set(String(student._id), []);
    }

    for (const course of createdCourses) {
      for (const studentId of course.studentsEnrolled) {
        const key = String(studentId);
        const existing = studentToCoursesMap.get(key) || [];
        existing.push(course._id as mongoose.Types.ObjectId);
        studentToCoursesMap.set(key, existing);
      }
    }

    for (const student of students) {
      student.courses = studentToCoursesMap.get(String(student._id)) || [];
      await student.save();
    }

    const courseProgressRecords: any[] = [];
    for (const course of createdCourses) {
      for (const studentId of course.studentsEnrolled) {
        courseProgressRecords.push({
          courseID: course._id,
          userId: studentId,
          completedVideos: [],
        });
      }
    }

    const createdProgress = await CourseProgress.insertMany(courseProgressRecords);

    const studentToProgressMap = new Map<string, mongoose.Types.ObjectId[]>();
    for (const progress of createdProgress) {
      const key = String(progress.userId);
      const existing = studentToProgressMap.get(key) || [];
      existing.push(progress._id as mongoose.Types.ObjectId);
      studentToProgressMap.set(key, existing);
    }

    for (const student of students) {
      student.courseProgress = studentToProgressMap.get(String(student._id)) || [];
      await student.save();
    }
    console.log(`Created ${createdProgress.length} course progress records`);

    const studentById = new Map(students.map((student) => [String(student._id), student]));
    const instructorById = new Map(instructors.map((instructor) => [String(instructor._id), instructor]));

    const certificatesToCreate: any[] = [];
    const sarahId = String(students[0]._id);

    for (let index = 0; index < createdCourses.length; index++) {
      const course = createdCourses[index];
      const issuer = instructorById.get(String(course.instructor));

      const selectedCertificateStudents = course.studentsEnrolled.filter((studentId, studentIndex) => {
        const studentKey = String(studentId);
        if (studentKey === sarahId) return true;
        return index % 6 === 0 && studentIndex === 0;
      });

      for (const studentId of selectedCertificateStudents) {
        const learner = studentById.get(String(studentId));
        if (!learner) continue;

        certificatesToCreate.push({
          userId: learner._id,
          courseId: course._id,
          certificateId: `CERT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
          studentName: `${learner.firstName} ${learner.lastName}`,
          courseName: course.courseName,
          instructorName: issuer ? `${issuer.firstName} ${issuer.lastName}` : "Instructor",
          completionDate: new Date(),
          issueDate: new Date(),
          isValid: true,
        });
      }
    }

    const createdCertificates = await Certificate.insertMany(certificatesToCreate);
    console.log(`Created ${createdCertificates.length} certificates`);

    console.log("\n✅ Seed data created successfully!");
    console.log("\nSummary:");
    console.log(`- ${createdUsers.length} Users created`);
    console.log(`- ${createdProfiles.length} Profiles created`);
    console.log(`- ${createdCategories.length} Categories created`);
    console.log(`- ${createdCourses.length} Courses created`);
    console.log(`- ${createdReviews.length} Reviews and Ratings created`);
    console.log(`- ${createdProgress.length} Course Progress records created`);
    console.log(`- ${createdCertificates.length} Certificates created`);

    console.log("\n📝 Demo Credentials (center of attention):");
    console.log("Admin: admin@learnpulse.com / Admin@123456");
    console.log("Instructor: rahul@instructor.com / Instructor@123");
    console.log("Student: sarah@student.com / Student@123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

seedDatabase();

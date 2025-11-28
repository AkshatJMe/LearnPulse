// ============ User Types ============
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'admin' | 'instructor' | 'student';
  active: boolean;
  approved: boolean;
  image: string;
  additionalDetails?: Profile;
  courses?: string[]; // Array of course IDs
  wishlist?: string; // Wishlist ID
  cart?: string; // Cart ID
  totalRevenue?: number; // For instructors
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  _id: string;
  userId: string;
  gender?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// ============ Course Types ============
export interface Course {
  _id: string;
  courseName: string;
  courseDescription?: string;
  instructor: User | string; // User object or ID
  whatYouWillLearn?: string;
  courseContent: Section[]; // Array of Section documents
  ratingAndReviews: RatingAndReview[];
  price?: number;
  thumbnail?: string;
  category?: Category | string;
  tag: string[];
  studentsEnrolled: User[] | string[]; // Array of User objects or IDs
  instructions?: string[] | string;
  status?: 'Draft' | 'Published' | 'Pending' | 'Rejected';
  averageRating?: number;
  totalRatings?: number;
  isApproved?: boolean;
  rejectionReason?: string;
  totalRevenue?: number;
  courseLevel?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

export interface SubSection {
  _id: string;
  title: string;
  timeDuration: string;
  description?: string;
  videoUrl: string;
}

// ============ Cart Types ============
export interface Cart {
  _id: string;
  userId: string;
  courses: Course[]; // Populated course objects
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string;
  courseId: Course;
  quantity?: number; // Not in backend, for UI only
}

// ============ Wishlist Types ============
export interface Wishlist {
  _id: string;
  userId: string;
  courses: Course[]; // Populated course objects
  createdAt?: string;
  updatedAt?: string;
}

// ============ Quiz Types ============
export interface Quiz {
  _id: string;
  courseId: string;
  sectionId?: string;
  subSectionId?: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  totalPoints: number;
  passingScore: number;
  duration?: number; // In minutes
  attemptLimit?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  points: number;
}

export interface QuizResult {
  _id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
  }[];
  timeSpent: number; // In seconds
  attemptNumber: number;
  passed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============ Discussion Types ============
export interface Discussion {
  _id: string;
  courseId: string;
  sectionId?: string;
  subSectionId?: string;
  userId: User | string; // User object or ID
  content: string;
  parentId?: string; // For replies (reference to parent discussion)
  replies?: Discussion[]; // Nested replies (populated from parentId references)
  isInstructorReply: boolean;
  isPinned: boolean;
  likes: string[]; // Array of user IDs
  createdAt?: string;
  updatedAt?: string;
}

// ============ Rating & Review Types ============
export interface RatingAndReview {
  _id: string;
  user: User | string;
  rating: number; // 1-5
  review: string;
  course: string; // Course ID
  isApproved?: boolean;
  isRemoved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============ Payment Types ============
export interface Payment {
  _id: string;
  userId: string;
  courses: string[]; // Array of course IDs
  amount: number;
  currency: string;
  paymentMethod: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  couponCode?: string;
  discountAmount?: number;
  finalAmount: number;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  maxUses: number;
  currentUses: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============ Course Progress Types ============
export interface CourseProgress {
  _id: string;
  userId: string;
  courseId: string;
  completedVideos: string[]; // Array of SubSection IDs
  completedQuizzes: string[]; // Array of Quiz IDs
  progressPercentage: number;
  certificateId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Course display data
  courseName?: string;
  thumbnail?: string;
  instructor?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
}

// ============ Certificate Types ============
export interface Certificate {
  _id: string;
  userId: string | User;
  courseId: string | Course;
  courseProgress: string; // CourseProgress ID
  certificateUrl?: string;
  certificateId?: string; // Unique certificate identifier
  issuedAt: string;
  grade?: string; // e.g., "A", "B+", "Pass"
  completionDate?: string;
  instructorSignature?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificateWithDetails extends Certificate {
  student: User;
  course: Course;
  instructor: User;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============ Auth Types ============
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  accountType: 'student' | 'instructor';
}

// ============ Notification Types ============
export interface Notification {
  _id: string;
  userId: string;
  type: 'enrollment' | 'payment' | 'course_update' | 'course_approval' | 'course_rejection' | 'system' | 'message';
  title: string;
  message: string;
  read: boolean;
  link?: string; // Optional navigation link
  metadata?: Record<string, any>; // Additional data (courseId, paymentId, etc.)
  createdAt: string;
  updatedAt?: string;
}

// ============ Filter & Sort Types ============
export interface CourseFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  searchQuery?: string;
  sortBy?: 'newest' | 'popular' | 'priceLow' | 'priceHigh' | 'topRated';
}

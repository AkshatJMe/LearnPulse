import React, { useRef } from "react";
import { Award, Download, Share2, CheckCircle } from "lucide-react";
import { Certificate, User, Course } from "../../types";
import Button from "../ui/Button";

interface CertificateViewProps {
  certificate: Certificate;
  onDownload?: () => void;
  onShare?: () => void;
  isDownloading?: boolean;
}

const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  onDownload,
  onShare,
  isDownloading = false,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Handle populated vs unpopulated data
  const student = typeof certificate.userId === "object"
    ? certificate.userId as User
    : { firstName: "Student", lastName: "Name", email: "" };

  const course = typeof certificate.courseId === "object"
    ? certificate.courseId as Course
    : { courseName: "Course Name", instructor: "Instructor" };

  const instructor = typeof course.instructor === "object"
    ? course.instructor as User
    : { firstName: "Instructor", lastName: "Name" };

  const studentName = `${student.firstName} ${student.lastName}`;
  const courseName = "courseName" in course ? course.courseName : "Course Name";
  const instructorName = `${instructor.firstName} ${instructor.lastName}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button
          variant="secondary"
          onClick={onShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          variant="primary"
          onClick={onDownload}
          disabled={isDownloading}
          className="gap-2"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      {/* Certificate Document */}
      <div
        ref={certificateRef}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-8 border-amber-500 dark:border-amber-600 p-12"
        style={{ aspectRatio: "1.414/1" }}
      >
        {/* Decorative Border Pattern */}
        <div className="border-4 border-double border-amber-400 dark:border-amber-500 p-8 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full">
                <Award className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Certificate of Completion
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto"></div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is to certify that
            </p>
            <h2 className="text-5xl font-serif font-bold text-gray-900 dark:text-white">
              {studentName}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
              has successfully completed the course
            </p>
            <h3 className="text-3xl font-serif font-semibold text-blue-600 dark:text-blue-400 px-4">
              {courseName}
            </h3>
            {certificate.grade && (
              <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>with a grade of <strong className="text-green-600 dark:text-green-400">{certificate.grade}</strong></span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Date of Completion
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatDate(certificate.issuedAt)}
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-400 dark:border-gray-600 w-48 mx-auto mb-2"></div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {instructorName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Course Instructor
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          {certificate.certificateId && (
            <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-500">
              Certificate ID: {certificate.certificateId}
            </div>
          )}

          {/* LearnPulse Branding */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">LP</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                LearnPulse
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Info */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>This certificate can be verified at:</p>
        <p className="font-mono text-blue-600 dark:text-blue-400 mt-1">
          {window.location.origin}/verify-certificate/{certificate.certificateId || certificate._id}
        </p>
      </div>
    </div>
  );
};

export default CertificateView;

import React from "react";
import { Award, Download, Share2, ExternalLink, Calendar } from "lucide-react";
import { Certificate, User } from "../../types";
import Button from "../ui/Button";

interface CertificateCardProps {
  certificate: Certificate;
  onDownload?: (certificateId: string) => void;
  onShare?: (certificate: Certificate) => void;
  onView?: (certificateId: string) => void;
  isDownloading?: boolean;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onDownload,
  onShare,
  onView,
  isDownloading = false,
}) => {
  // Handle populated vs unpopulated data
  const course = typeof certificate.courseId === "object" 
    ? certificate.courseId 
    : { courseName: "Course", instructor: "Instructor" };
  
  const courseName = typeof course === "object" && "courseName" in course 
    ? course.courseName 
    : "Course Name";
  
  const instructor = typeof course === "object" && "instructor" in course
    ? typeof course.instructor === "object"
      ? `${(course.instructor as User).firstName} ${(course.instructor as User).lastName}`
      : "Instructor"
    : "Instructor";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{courseName}</h3>
              <p className="text-blue-100 text-sm">by {instructor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Issue Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Issued on {formatDate(certificate.issuedAt)}</span>
          </div>

          {/* Certificate ID */}
          {certificate.certificateId && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Certificate ID: {certificate.certificateId}
            </div>
          )}

          {/* Grade/Status */}
          {certificate.grade && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
              <Award className="w-4 h-4" />
              Grade: {certificate.grade}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(certificate._id)}
            className="gap-2 flex-1"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownload?.(certificate._id)}
            disabled={isDownloading}
            className="gap-2 flex-1"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare?.(certificate)}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;

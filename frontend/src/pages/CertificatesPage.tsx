import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, BookOpen } from "lucide-react";
import { Certificate } from "../types";
import { CertificateCard } from "../components/certificate";
import { useToast } from "../context/ToastContext";

const CertificatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [certificates, setCertificates] = useState<Certificate[]>([
    // Mock data - TODO: Replace with API call
    {
      _id: "cert1",
      userId: "user123",
      courseId: {
        _id: "course1",
        courseName: "Advanced React Patterns and Best Practices",
        instructor: {
          _id: "instructor1",
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah@example.com",
          accountType: "instructor" as const,
          active: true,
          approved: true,
          image: "",
        },
        courseContent: [],
        ratingAndReviews: [],
        tag: [],
        studentsEnrolled: [],
      },
      courseProgress: "progress1",
      certificateId: "CERT-2026-ABC123",
      issuedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      grade: "A",
    },
    {
      _id: "cert2",
      userId: "user123",
      courseId: {
        _id: "course2",
        courseName: "Machine Learning Fundamentals",
        instructor: {
          _id: "instructor2",
          firstName: "Dr. John",
          lastName: "Smith",
          email: "john@example.com",
          accountType: "instructor" as const,
          active: true,
          approved: true,
          image: "",
        },
        courseContent: [],
        ratingAndReviews: [],
        tag: [],
        studentsEnrolled: [],
      },
      courseProgress: "progress2",
      certificateId: "CERT-2026-XYZ789",
      issuedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      grade: "A+",
    },
  ]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Fetch certificates from backend
  useEffect(() => {
    // const fetchCertificates = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await apiConnector('GET', '/certificates', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setCertificates(response.data.certificates);
    //   } catch (error) {
    //     console.error("Error fetching certificates:", error);
    //     error("Failed to load certificates");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchCertificates();
  }, []);

  const handleDownload = async (certificateId: string) => {
    setDownloadingId(certificateId);
    try {
      // TODO: Call backend to download certificate
      // const response = await apiConnector('GET', `/certificates/${certificateId}/download`, {
      //   headers: { Authorization: `Bearer ${token}` },
      //   responseType: 'blob'
      // });
      
      // Create download link
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `certificate-${certificateId}.pdf`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);

      // Mock success
      setTimeout(() => {
        success("Certificate Downloaded", "Your certificate has been saved");
        setDownloadingId(null);
      }, 1500);
    } catch (err) {
      console.error("Error downloading certificate:", err);
      error("Download Failed", "Could not download certificate");
      setDownloadingId(null);
    }
  };

  const handleShare = (certificate: Certificate) => {
    const courseName = typeof certificate.courseId === "object" && "courseName" in certificate.courseId
      ? certificate.courseId.courseName
      : "this course";
    
    const text = `I just completed "${courseName}" on LearnPulse! 🎓`;
    const url = `${window.location.origin}/verify-certificate/${certificate.certificateId || certificate._id}`;

    if (navigator.share) {
      navigator
        .share({
          title: "My Certificate",
          text,
          url,
        })
        .then(() => success("Shared!", "Certificate link shared"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      success("Link Copied", "Certificate verification link copied to clipboard");
    }
  };

  const handleView = (certificateId: string) => {
    navigate(`/certificate/${certificateId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""}{" "}
            earned
          </p>
        </div>

        {/* Empty State */}
        {certificates.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Complete your courses to earn certificates and showcase your
              achievements!
            </p>
            <button
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              <BookOpen className="w-5 h-5" />
              View My Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate._id}
                certificate={certificate}
                onDownload={handleDownload}
                onShare={handleShare}
                onView={handleView}
                isDownloading={downloadingId === certificate._id}
              />
            ))}
          </div>
        )}

        {/* Info Card */}
        {certificates.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Certificate Verification
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  All certificates can be verified using their unique certificate ID.
                  Share your achievement with employers and showcase your skills!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;

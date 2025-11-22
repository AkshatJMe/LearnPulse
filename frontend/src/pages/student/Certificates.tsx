import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserCertificates, downloadCertificate as downloadCertificateAPI } from "../../services/operations/certificateAPI";
import { useToast } from "../../context/ToastContext";

interface Certificate {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  courseId: {
    courseName: string;
    instructor?: {
      firstName: string;
      lastName: string;
    };
  };
  certificateId: string;
  completionDate?: string;
  issueDate?: string;
  createdAt?: string;
  studentName?: string;
  courseName?: string;
  instructorName?: string;
}

const Certificates = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { token } = useSelector((state: any) => state.auth);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchCertificates();
    } else {
      setLoading(false);
      error("Authentication Error", "You must be logged in to view certificates");
      navigate("/login");
    }
  }, [token]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await getUserCertificates(token);
      console.log(response)
      if (response.success && response.certificates) {
        setCertificates(response.certificates);
      } else {
        setCertificates([]);
      }
    } catch (err: any) {
      console.error("Error fetching certificates:", err);
      error("Failed to Load Certificates", err.message || "Could not fetch your certificates");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    setDownloadingId(certificateId);
    try {
      // Call backend to download certificate
      const response = await downloadCertificateAPI(certificateId, token);
      
      if (response.success) {
        // Generate HTML to PDF and download
        const htmlContent = generateCertificateHTML(response.certificate);
        downloadPDF(htmlContent);
        success("Downloaded", "Certificate downloaded successfully");
      }
    } catch (err: any) {
      console.error("Error downloading certificate:", err);
      error("Download Failed", err.message || "Could not download certificate");
    } finally {
      setDownloadingId(null);
    }
  };

  const generateCertificateHTML = (cert: any) => {
    const issueDate = new Date(cert.issueDate || cert.completionDate || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          * { margin: 0; padding: 0; }
          body { 
            font-family: 'Georgia', serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            background: #f5f5f5;
          }
          .certificate {
            width: 11in;
            height: 8.5in;
            background: white;
            border: 8px solid #d4a574;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            text-align: center;
            page-break-after: always;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #d4a574;
            pointer-events: none;
          }
          .content {
            position: relative;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .header {
            margin-bottom: 30px;
            text-decoration: underline;
            text-decoration-color: #d4a574;
            text-underline-offset: 8px;
          }
          .header h1 {
            font-size: 48px;
            color: #6b4423;
            margin-bottom: 10px;
            font-weight: normal;
            letter-spacing: 3px;
          }
          .subtitle {
            font-size: 18px;
            color: #8b5a2b;
            margin-bottom: 40px;
          }
          .body-text {
            margin: 30px 0;
            font-size: 16px;
            color: #333;
            line-height: 1.8;
          }
          .recipient {
            font-size: 32px;
            color: #6b4423;
            margin: 30px 0;
            font-weight: bold;
            text-decoration: underline;
            text-decoration-color: #d4a574;
            text-underline-offset: 8px;
          }
          .course-name {
            font-size: 24px;
            color: #6b4423;
            margin: 20px 0;
            font-style: italic;
          }
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
          }
          .signature-box {
            width: 25%;
            text-align: center;
            border-top: 2px solid #333;
            padding-top: 10px;
            font-size: 14px;
          }
          .date {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
          .cert-id {
            margin-top: 15px;
            font-size: 12px;
            color: #999;
            font-family: monospace;
          }
          @media print {
            body { background: white; }
            .certificate { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="content">
            <div class="header">
              <h1>Certificate of Completion</h1>
              <p style="color: #8b5a2b; font-size: 16px;">This is to certify that</p>
            </div>
            
            <div class="recipient">${cert.studentName || (cert.userId?.firstName + ' ' + cert.userId?.lastName)}</div>
            
            <div class="body-text">has successfully completed the course</div>
            
            <div class="course-name">${cert.courseName || cert.courseId?.courseName}</div>
            
            <div class="body-text">and demonstrated proficiency in the knowledge and skills taught in this course.</div>
            
            <div class="footer">
              <div class="signature-box">
                <p>${cert.instructorName || (cert.courseId?.instructor?.firstName + ' ' + cert.courseId?.instructor?.lastName)}</p>
                <p style="font-size: 12px; margin-top: 5px;">Instructor</p>
              </div>
            </div>
            
            <div class="date">Date Issued: ${issueDate}</div>
            <div class="cert-id">Certificate ID: ${cert.certificateId}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPDF = (htmlContent: string) => {
    // Create a new window/tab with the HTML content
    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Use browser's print-to-PDF functionality
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const shareCertificate = (certificate: Certificate) => {
    const courseName = certificate.courseName || (typeof certificate.courseId === "object" && "courseName" in certificate.courseId
      ? certificate.courseId.courseName
      : "this course");
    const text = `I just completed "${courseName}" on LearnPulse! 🎓`;
    const url = `${window.location.origin}/verify-certificate/${certificate.certificateId}`;
    
    if (navigator.share) {
      navigator.share({
        title: "My Certificate",
        text,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      success("Link Copied", "Certificate verification link copied to clipboard");
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎓 My Certificates
            </h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-80 shadow-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎓 My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {certificates.length} certificate{certificates.length !== 1 ? "s" : ""} earned
          </p>
        </div>

        {/* Empty State */}
        {certificates.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 mb-6">
              <svg
                className="w-12 h-12 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No certificates yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Complete your courses to earn certificates and showcase your achievements!
            </p>
            <button
              onClick={() => navigate("/dashboard/enrolled-courses")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map((certificate) => {
              const courseName = certificate.courseName || (typeof certificate.courseId === "object" 
                ? (certificate.courseId as any).courseName 
                : "Course");
              const instructor = certificate.instructorName || (typeof certificate.courseId === "object" && (certificate.courseId as any).instructor
                ? `${(certificate.courseId as any).instructor.firstName} ${(certificate.courseId as any).instructor.lastName}`
                : "Instructor");
              const studentName = certificate.studentName || (typeof certificate.userId === "object"
                ? `${(certificate.userId as any).firstName} ${(certificate.userId as any).lastName}`
                : "Student");
              const issueDate = certificate.issueDate || certificate.completionDate || certificate.createdAt || new Date().toISOString();

              return (
                <div
                  key={certificate._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                >
                  {/* Certificate Header */}
                  <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                              Certificate of Completion
                            </p>
                            <p className="text-xl font-bold">LearnPulse</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-90">Certificate ID</p>
                          <p className="text-sm font-mono font-semibold">
                            {certificate.certificateId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Body */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {courseName}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>
                            Awarded to: <strong className="text-gray-900 dark:text-white">
                              {studentName}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>
                            Instructor: {instructor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            Issued: {new Date(issueDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate(`/certificate/${certificate._id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </span>
                      </button>
                      <button
                        onClick={() => downloadCertificate(certificate._id)}
                        disabled={downloadingId === certificate._id}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        {downloadingId === certificate._id ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            Downloading...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => shareCertificate(certificate)}
                        className="sm:w-auto bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;

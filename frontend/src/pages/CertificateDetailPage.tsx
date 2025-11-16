import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { Certificate } from "../types";
import { CertificateView } from "../components/certificate";
import { getCertificateById, getUserCertificates } from "../services/operations/certificateAPI";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";

const CertificateDetailPage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { token } = useSelector((state: any) => state.auth);

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      setIsLoading(true);
      const response = await getCertificateById(certificateId || "");
      if (response.success && response.certificate) {
        setCertificate(response.certificate as any);
      } else {
        setCertificate(null);
      }
    } catch (err: any) {
      try {
        if (!token || !certificateId) {
          throw err;
        }

        const listResponse = await getUserCertificates(token);
        const certificates = Array.isArray(listResponse?.certificates)
          ? listResponse.certificates
          : [];

        const matchedCertificate = certificates.find((cert: any) => {
          const certCourseId =
            typeof cert?.courseId === "object" ? cert.courseId?._id : cert?.courseId;

          return (
            cert?._id === certificateId ||
            cert?.certificateId === certificateId ||
            certCourseId === certificateId
          );
        });

        if (matchedCertificate) {
          setCertificate(matchedCertificate);
        } else {
          setCertificate(null);
          error("Certificate Not Found", "Could not load certificate details");
        }
      } catch (fallbackErr: any) {
        console.error("Error fetching certificate:", fallbackErr);
        error("Failed to Load Certificate", fallbackErr.message || "Could not fetch certificate");
        setCertificate(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateCertificateHTML = (cert: any) => {
    const issueDate = new Date(cert.issueDate || cert.completionDate || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const studentName = cert.studentName || (typeof cert.userId === "object" && cert.userId?.firstName
      ? `${cert.userId?.firstName} ${cert.userId?.lastName}`
      : "Student");
    const courseName = cert.courseName || (typeof cert.courseId === "object" && cert.courseId?.courseName
      ? cert.courseId?.courseName
      : "Course");
    const instructorName = cert.instructorName || (typeof cert.courseId === "object" && cert.courseId?.instructor
      ? `${cert.courseId?.instructor?.firstName} ${cert.courseId?.instructor?.lastName}`
      : "Instructor");
    
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
            
            <div class="recipient">${studentName}</div>
            
            <div class="body-text">has successfully completed the course</div>
            
            <div class="course-name">${courseName}</div>
            
            <div class="body-text">and demonstrated proficiency in the knowledge and skills taught in this course.</div>
            
            <div class="footer">
              <div class="signature-box">
                <p>${instructorName}</p>
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
    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = async () => {
    if (!certificate) return;
    setIsDownloading(true);
    try {
      const htmlContent = generateCertificateHTML(certificate);
      downloadPDF(htmlContent);
      success("Certificate Downloaded", "Your certificate has been saved as PDF");
    } catch (err) {
      console.error("Error downloading certificate:", err);
      error("Download Failed", "Could not download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (!certificate) return;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Certificate Not Found
          </h2>
          <Button onClick={() => navigate("/dashboard/certificates")}>
            Back to Certificates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/certificates")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Certificates
        </button>

        {/* Certificate View */}
        <CertificateView
          certificate={certificate}
          onDownload={handleDownload}
          onShare={handleShare}
          isDownloading={isDownloading}
        />
      </div>
    </div>
  );
};

export default CertificateDetailPage;

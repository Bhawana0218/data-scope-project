
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  Calendar,
  FileImage,
  BadgeCheck,
} from "lucide-react";

interface PhotoData {
  image: string;
  employeeId: string;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

const PhotoResult = () => {
  const navigate = useNavigate();
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("capturedPhoto");
    if (stored) setPhotoData(JSON.parse(stored));
  }, []);

  const handleDownload = () => {
    if (photoData?.image) {
      const link = document.createElement("a");
      link.href = photoData.image;
      link.download = `employee-photo-${photoData.employeeId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/002/623/657/small_2x/template-dark-navy-blue-luxury-premium-abstract-background-with-luxury-triangles-pattern-and-gold-lighting-lines-illustration-vector.jpg')", // Dark navy blue image
      }}
    >
      {/* Overlay to darken the background slightly */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-3xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/list")}
              className="flex items-center gap-2 text-slate-200 hover:text-indigo-400 transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-xl font-semibold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Photo Result
            </h1>

            <div />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16 space-y-14">

          {/* Success Card */}
          <div className="relative group h-180">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500  to-purple-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>

            <div className="relative bg-white/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-12 text-center shadow-2xl">

              {/* Icon */}
              <div className="w-28 h-28 mx-auto rounded-full bg-linear-to-tr from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 mb-8">
                <CheckCircle className="text-white" size={44} />
              </div>

              <h2 className="text-3xl font-bold mb-4">Photo Captured Successfully</h2>

              <p className="text-slate-200 mb-10">
                The employee photo has been securely stored and is ready for download.
              </p>

              {/* Image */}
              {photoData?.image && (
                <div className="mb-10 flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                    <img
                      src={photoData.image}
                      alt="Captured"
                      className="relative w-72 h-72 object-cover rounded-2xl border border-white/10 shadow-2xl"
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-center gap-5 flex-wrap">
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:scale-105 transition flex items-center gap-2"
                >
                  <Download size={18} />
                  Download
                </button>

                <button
                  onClick={() => navigate("/list")}
                  className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-slate-100 hover:bg-white/20 transition"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>

          {/* Info Card Section */}
          <div className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-8">
              Photo Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                icon={<BadgeCheck size={18} />}
                label="Employee ID"
                value={photoData?.employeeId || "N/A"}
              />

              <InfoCard
                icon={<Calendar size={18} />}
                label="Capture Date"
                value={new Date().toLocaleDateString()}
              />

              <InfoCard
                icon={<FileImage size={18} />}
                label="Format"
                value="PNG"
              />

              <InfoCard
                icon={<CheckCircle size={18} />}
                label="Status"
                value="Saved Successfully"
                highlight
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  highlight = false,
}: InfoCardProps) => (
  <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-3xl hover:bg-white/20 transition duration-300">
    <div className="flex items-center gap-2 text-indigo-400 mb-2">
      {icon}
      <p className="text-sm text-slate-200">{label}</p>
    </div>
    <p
      className={`text-lg font-semibold ${
        highlight ? "text-emerald-400" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

export default PhotoResult;
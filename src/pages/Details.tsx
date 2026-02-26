
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Save,
  RotateCcw,
  X,
  Edit,
  FileText,
  Clock,
  DollarSign,
  MapPin,
  User,
  ShieldCheck,
  Activity
} from "lucide-react";
import type { Employee } from "../types";

interface DetailsProps {
  employee: Employee;
  onCapturePhoto: (id: number, image: string) => void;
  onBack: () => void;
}

const Details = ({ employee, onCapturePhoto, onBack }: DetailsProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

  if (!employee) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      setShowCamera(true);
      setIsCameraReady(false);

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraReady(true);
          };
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Camera permission denied or not available. Please check your browser settings.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    const stream = video.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  const handleSavePhoto = () => {
    if (!capturedImage) return;
    onCapturePhoto(employee.id, capturedImage);
    // Simulating a slight delay for effect
    setTimeout(() => {
        navigate("/photo-result", {
        state: { employeeId: employee.id, image: capturedImage },
        });
    }, 300);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div
  className="min-h-screen relative bg-cover bg-center bg-no-repeat text-white font-sans selection:bg-indigo-500/30"
  style={{
  
    backgroundImage:"url('https://tse1.mm.bing.net/th/id/OIP.oalOckL9g-KwibXcoLJ39AHaH_?w=1000&h=1080&rs=1&pid=ImgDetMain&o=7&rm=3')",
  }}
>
  {/* Overlay to slightly darken the background */}
  <div className="absolute inset-0 bg-black/50"></div>

       <header className="relative z-50 border-b border-white/10 bg-white/5 backdrop-blur-2xl top-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-200 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/5"
        >
          <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Active Record
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">Employee Profile</h1>
        </div>

        <div className="w-24" />
      </div>
    </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-8">

        {/* Left Column: Profile Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            {/* Decorative linear inside card */}
            <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl shadow-indigo-500/20">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-6xl font-bold text-white overflow-hidden">
                    {employee.username.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full" title="Active Status"></div>
              </div>

              <h2 className="text-3xl font-bold mt-6 text-white tracking-tight">
                {employee.username}
              </h2>
              <p className="text-indigo-400 font-medium text-sm mt-1 uppercase tracking-widest">
                {employee.department}
              </p>

              <div className="w-full h-px bg-white/10 my-8" />

              <div className="w-full space-y-4">
                <InfoRow 
                  icon={<DollarSign size={18} className="text-emerald-400" />} 
                  label="Annual Salary" 
                  value={`$${employee.salary.toLocaleString()}`} 
                />
                <InfoRow 
                  icon={<Calendar size={18} className="text-blue-400" />} 
                  label="Join Date" 
                  value={employee.joinDate} 
                />
                <InfoRow 
                  icon={<MapPin size={18} className="text-pink-400" />} 
                  label="Location" 
                  value={employee.city} 
                />
                <InfoRow 
                  icon={<ShieldCheck size={18} className="text-violet-400" />} 
                  label="Employee ID" 
                  value={`EMP-${employee.id.toString().padStart(4, '0')}`} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Camera (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionCard icon={<Edit size={24} />} label="Edit Profile" color="from-blue-500 to-cyan-500" />
            <ActionCard icon={<FileText size={24} />} label="Documents" color="from-violet-500 to-purple-500" />
            <ActionCard icon={<Activity size={24} />} label="Performance" color="from-emerald-500 to-teal-500" />
            <ActionCard icon={<Clock size={24} />} label="History" color="from-orange-500 to-amber-500" />
          </div>

          {/* Camera Section */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden min-h-100 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Camera size={20} />
                </div>
                Identity Verification
              </h3>
              {showCamera && (
                <span className="flex items-center gap-2 text-xs font-bold text-red-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  LIVE FEED
                </span>
              )}
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-black/20">
              
              {/* Empty State */}
              {!showCamera && !capturedImage && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <User size={40} className="text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">No Photo Available</h4>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      Capture a live photo to update the employee's official record. Ensure good lighting.
                    </p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-8 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Camera size={18} />
                    Initialize Camera
                  </button>
                </div>
              )}

              {/* Camera Feed */}
              {showCamera && (
                <div className="w-full max-w-2xl relative animate-in fade-in duration-300">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover transform scale-x-[-1] ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {/* Overlay Grid */}
                    <div className="absolute inset-0 border-20 border-black/40 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-lg"></div>
                    </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => {
                        const stream = videoRef.current?.srcObject as MediaStream;
                        stream?.getTracks().forEach((track) => track.stop());
                        setShowCamera(false);
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition flex items-center gap-2 backdrop-blur-sm border border-white/10"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={capturePhoto}
                      disabled={!isCameraReady}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Camera size={18} fill="currentColor" />
                      Capture Snapshot
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Result */}
              {capturedImage && (
                <div className="w-full max-w-md text-center animate-in zoom-in duration-300">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black aspect-3/4 max-h-100 mx-auto group">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <span className="text-white font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md">Preview</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={retakePhoto}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition flex items-center gap-2 border border-white/10"
                    >
                      <RotateCcw size={18} />
                      Retake
                    </button>
                    <button
                      onClick={handleSavePhoto}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save to Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub Components ---

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-slate-900/50 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
        <span className="text-sm text-slate-200 font-medium">{value}</span>
      </div>
    </div>
    <ArrowLeft size={14} className="text-slate-600 rotate-180 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
  </div>
);

const ActionCard = ({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) => (
  <div className="group relative p-6 rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden">
    <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div className={`p-3 rounded-xl bg-linear-to-br ${color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-300 group-hover:text-white">{label}</p>
    </div>
  </div>
);

export default Details;

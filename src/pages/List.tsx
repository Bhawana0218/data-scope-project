
import { useState, useEffect } from "react";
import { DollarSign, Users, MapPin, Search, LayoutGrid, BarChart3, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import type { Employee, User } from "../types";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import { useNavigate } from "react-router-dom";


const cityDefaultCoords: Record<string, [number, number]> = {
  Edinburgh: [55.9533, -3.1883],
  Tokyo: [35.6895, 139.6917],
  "San Francisco": [37.7749, -122.4194],
  "New York": [40.7128, -74.0060],
  London: [51.5074, -0.1278],
  Sydney: [-33.8688, 151.2093],
  Singapore: [1.3521, 103.8198],
};

interface FitBoundsProps {
  markers: [number, number][];
}


const FitBoundsWrapper = ({ markers }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      map.fitBounds(markers, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};


interface ListProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  user: User | null;
  onLogout: () => void;
}

const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-indigo-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
  </div>
);

const List = ({ employees, onSelectEmployee, user, onLogout }: ListProps) => {
  const navigate = useNavigate(); // Renamed navigate to router for Next.js
  const [viewMode, setViewMode] = useState<"table" | "chart" | "map">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  
  const itemsPerPage = 10;



  useEffect(() => {
    setIsMounted(true);

    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);



  useEffect(() => setIsMounted(true), []);

  if (!employees || employees.length === 0) return <Loader />;

  // Departments
  const departments = ["All", ...Array.from(new Set(employees.map((e) => e.department)))];

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "All" || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const departmentStats = departments
    .filter((d) => d !== "All")
    .map((dept) => {
      const deptEmployees = employees.filter((e) => e.department === dept);
      return {
        name: dept,
        count: deptEmployees.length,
        avgSalary: Math.round(deptEmployees.reduce((sum, e) => sum + e.salary, 0) / deptEmployees.length),
      };
    });

  const totalEmployees = employees.length;
  const avgSalary =
    employees.length > 0
      ? Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length)
      : 0;

  // City coords
  const uniqueCities = Array.from(new Set(employees.map((e) => e.city)));
  const cityCoords: Record<string, [number, number]> = {};
  uniqueCities.forEach((city) => {
    cityCoords[city] = cityDefaultCoords[city] || [35, 0];
  });

  return (

    <div className="relative min-h-screen text-white font-sans overflow-hidden">

  {/* Background Image */}
  <div className="absolute inset-0 -z-20">
    <img
      src="https://tse1.mm.bing.net/th/id/OIP.oalOckL9g-KwibXcoLJ39AHaH_?w=1000&h=1080&rs=1&pid=ImgDetMain&o=7&rm=3"
      alt="background"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/70 -z-10"></div>

  {/* Soft linear Glow */}
  <div className="absolute top-0 left-0 w-full h-72 bg-linear-to-r from-indigo-600/40 via-purple-600/30 to-pink-600/40 blur-3xl opacity-40 -z-10"></div>
  
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></span>
            </div>
            <div>
             
              <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
  Employee Dashboard
</h1>
              <p className="text-xs font-medium text-indigo-200/70 uppercase tracking-wider">
                Admin Panel • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="group relative overflow-hidden px-6 py-2.5 rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Logout
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Cards - Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden bg-white/10 backdrop-blur-lg hover:bg-white/10 p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Employees</p>
                <p className="text-3xl font-bold text-white mt-1">{totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Avg. Salary</p>
                <p className="text-3xl font-bold text-white mt-1">${avgSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/5 hover:bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
             <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
             <div className="relative flex items-center gap-4">
               <div className="p-4 bg-violet-500/20 text-violet-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                 <Globe className="w-7 h-7" />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-400">Global Locations</p>
                 <p className="text-3xl font-bold text-white mt-1">{uniqueCities.length}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Controls - Floating Glass Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-4  flex flex-wrap gap-4 justify-between items-center sticky top-24 z-40">
          <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
            {["table", "chart", "map"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  viewMode === mode
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2 capitalize">
                  {mode === "table" && <LayoutGrid size={16} />}
                  {mode === "chart" && <BarChart3 size={16} />}
                  {mode === "map" && <Globe size={16} />}
                  {mode}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap w-full md:w-auto">
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all placeholder:text-slate-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full md:w-48 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-200 appearance-none cursor-pointer transition-all hover:bg-white/10"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-black/40">
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View - Modern Transparent Grid */}
        {viewMode === "table" && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-white/10  border-white/20 shadow-2xl rounded-2xl border  overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-medium">
                  <thead className="bg-white/10 text-slate-300 uppercase text-xs tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-5 text-left border-b border-white/5">Employee Info</th>
                      <th className="px-6 py-5 text-left border-b border-white/5">Department</th>
                      <th className="px-6 py-5 text-left border-b border-white/5">Location</th>
                      <th className="px-6 py-5 text-left border-b border-white/5">Salary</th>
                      <th className="px-6 py-5 text-left border-b border-white/5">Joined</th>
                      <th className="px-6 py-5 text-left border-b border-white/5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => {
                          onSelectEmployee(emp);
                          navigate("/details");
                        }}
                        className="hover:bg-white/5 transition-colors duration-200 cursor-pointer group/row"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-white font-bold shadow-inner text-sm group-hover/row:scale-110 transition-transform">
                              {emp.username.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-200 group-hover/row:text-white transition-colors">{emp.username}</div>
                              
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                             {emp.department}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                          <MapPin size={14} />
                          {emp.city}
                        </td>
                        <td className="px-6 py-4 font-mono text-emerald-400 font-medium">
                          ${emp.salary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{emp.joinDate}</td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs tracking-wide flex items-center gap-1 group-hover/gap:translate-x-1 transition-transform">
                            View Details &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/5">
                <div className="text-xs text-slate-500">
                   Showing <span className="font-medium text-slate-300">{startIndex + 1}</span> to <span className="font-medium text-slate-300">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> of <span className="font-medium text-slate-300">{filteredEmployees.length}</span> entries
                </div>
                
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === i + 1 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110" 
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                  <Search size={48} className="opacity-20" />
                  <p>No employees found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Charts */}
        {viewMode === "chart" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
            {/* Chart 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl ">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Employee Distribution</h3>
                <p className="text-sm text-slate-400">Breakdown by department</p>
              </div>
              <div className="h-100 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} style={{ textShadow: '0 1px 2px black' }}/>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                      {departmentStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2 */}

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-white mb-1">
      Average Salary Analysis
    </h3>
    <p className="text-sm text-slate-400">
      Compensation across teams
    </p>
  </div>

  <div className="overflow-x-auto">
    <div className="min-w-150 h-95">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={departmentStats}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff10"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />

          <Tooltip
            cursor={{ fill: "#ffffff05" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#34d399" }}
          />

          <Bar dataKey="avgSalary" radius={[6, 6, 0, 0]} barSize={28}>
            {departmentStats.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index % 2 === 0 ? "#10b981" : "#059669"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
          </div>
        )}

        {/* Interactive Map */}
        {viewMode === "map" && (
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden relative min-h-150">
              {!isMounted ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                   <div className="animate-pulse flex flex-col items-center">
                     <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                     <p className="text-slate-400 text-sm">Initializing Map Engine...</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-4 left-4 z-1000 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-lg border border-white/10 shadow-lg pointer-events-none">
                     <h3 className="font-semibold text-white flex items-center gap-2"><Globe size={16} className="text-indigo-400"/> Global Workforce</h3>
                  </div>
                  <div className="h-150 w-full z-0">
                    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />
                      <FitBoundsWrapper markers={Object.values(cityCoords)} />
                      
                      {Object.entries(cityCoords).map(([city, coords]) => {
                        const cityEmployees = employees.filter((emp) => emp.city === city);
                        if (cityEmployees.length === 0) return null;
                        return (
                          <Marker key={city} position={coords}>
                            <Popup className="font-sans">
                                <div className="min-w-37.5">
                                  <div className="font-bold text-indigo-500 mb-1">{city}</div>
                                  <div className="text-xs text-gray-500 mb-2">Team Size: {cityEmployees.length}</div>
                                  <div className="space-y-2">
                                    {cityEmployees.slice(0, 5).map((emp) => (
                                      <div key={emp.id} className="flex items-center gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span>{emp.username}</span>
                                      </div>
                                    ))}
                                  </div>
                                  {cityEmployees.length > 5 && (
                                    <div className="text-xs text-indigo-400 mt-2 italic">+{cityEmployees.length - 5} more</div>
                                  )}
                                </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </>
              )}
           </div>
        )}

      </main>
    </div>
  );
};

export default List;
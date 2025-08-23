import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingData, setRatingData] = useState([]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/login");
    }

    const fetchTotals = async () => {
      try {
        const [usersRes, storesRes, ratingsRes, ratingGraphRes] = await Promise.all([
          fetch("http://localhost:5000/users/getUsersCount"),
          fetch("http://localhost:5000/stores/getStoresCount"),
          fetch("http://localhost:5000/ratings/getRatingsCount"),
          fetch("http://localhost:5000/stores/getStoreRatings")
        ]);

        const usersData = await usersRes.json();
        const storesData = await storesRes.json();
        const ratingsData = await ratingsRes.json();
        const ratingGraphData = await ratingGraphRes.json();

        setTotalUsers(usersData.count);
        setTotalStores(storesData.count);
        setTotalRatings(ratingsData.count);
        setRatingData(ratingGraphData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchTotals();
  }, [navigate]);

  return (
    <div className="p-8 bg-blue-100 min-h-screen">

      <h1 className="text-4xl font-extrabold text-black mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <button
          onClick={() => navigate('/admin/manage-users')}
          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/manage-stores')}
          className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-3 rounded-2xl shadow-lg transition-all duration-300"
        >
          Manage Stores
        </button>
        <button
          onClick={handleLogout}
          className="bg-blue-300 hover:bg-blue-400 text-black px-6 py-3 rounded-2xl shadow-lg transition-all duration-300"
        >
          Logout
        </button>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 justify-items-center">
        <div className="bg-blue-200 p-6 w-80 rounded-3xl shadow-md text-center hover:shadow-xl transition">
          <p className="text-xl font-semibold text-black mb-2">Total Users</p>
          <p className="text-4xl font-extrabold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-blue-200 p-6 w-80 rounded-3xl shadow-md text-center hover:shadow-xl transition">
          <p className="text-xl font-semibold text-black mb-2">Total Stores</p>
          <p className="text-4xl font-extrabold text-blue-600">{totalStores}</p>
        </div>
        <div className="bg-blue-200 p-6 w-80 rounded-3xl shadow-md text-center hover:shadow-xl transition">
          <p className="text-xl font-semibold text-black mb-2">Total Ratings</p>
          <p className="text-4xl font-extrabold text-blue-600">{totalRatings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
        <div className="bg-blue-200 p-6 rounded-3xl shadow-md hover:shadow-xl transition w-[700px]">
          <h2 className="text-lg font-semibold text-black mb-3 text-center">Top 5 Stores by Ratings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="store" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Bar dataKey="ratings" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-blue-200 p-6 rounded-3xl shadow-md hover:shadow-xl transition w-[700px]">
          <h2 className="text-lg font-semibold text-black mb-3 text-center">Platform Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
        data={[
          { name: 'Total Users', value: totalUsers },
          { name: 'Total Stores', value: totalStores },
          { name: 'Total Ratings', value: totalRatings }
        ]}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={70}
        fill="#2563EB"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {['#1E40AF', '#2563EB', '#60A5FA'].map((color, index) => (
          <Cell key={`cell-${index}`} fill={color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

</div>

    </div>
  );
}

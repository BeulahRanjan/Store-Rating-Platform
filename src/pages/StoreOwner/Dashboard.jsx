import { useState, useEffect } from "react";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [expandedStoreId, setExpandedStoreId] = useState(null);
  const ownerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStoresAndRatings = async () => {
      try {
        const resStores = await fetch(`http://localhost:5000/stores/getStoreByOwner/${ownerId}`);
        const data = await resStores.json();
        console.log("Stores data:", data);

        if (!data.stores || data.stores.length === 0) {
          setStores([]);
          return;
        }

        setStores(data.stores);

        const ratingsObj = {};
        for (const store of data.stores) {
          const resRatings = await fetch(`http://localhost:5000/ratings/getRatingsByStore/${store.id}`);
          const ratingsData = await resRatings.json();
          console.log(`Ratings for store ${store.id}:`, ratingsData);

          const allRatings = ratingsData.ratings || [];
          ratingsObj[store.id] = {
            ratings: allRatings,
            average:
              allRatings.length > 0
                ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(2)
                : "N/A",
          };
        }
        setRatingsMap(ratingsObj);
      } catch (err) {
        console.error(err);
      }
    };

    if (ownerId) fetchStoresAndRatings();
  }, [ownerId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleExpand = (storeId) => {
    setExpandedStoreId(expandedStoreId === storeId ? null : storeId);
  };

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-black">Store Owner Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-200 text-black px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-400 transition"
        >
          Logout
        </button>
      </div>

      {stores.length === 0 ? (
        <p className="text-black text-lg font-medium">No stores found for this owner.</p>
      ) : (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`bg-blue-200 shadow-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  expandedStoreId === store.id ? "border-2 border-blue-200" : ""
                }`}
                onClick={() => handleExpand(store.id)}
              >
                <h2 className="text-2xl font-bold mb-2 text-black">{store.name}</h2>
                <p className="mb-2 text-black">
                  <strong>Average Rating:</strong>{" "}
                  <span
                    className="text-black"
                  >
                    ⭐ {ratingsMap[store.id]?.average || "N/A"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm italic">{store.address}</p>
                <p className="text-blue-500 font-semibold mt-3">
                  {expandedStoreId === store.id ? "Hide Details" : "View Details"}
                </p>
              </div>
            ))}
          </div>

          
          {expandedStoreId && (
            <div className="mt-10 bg-blue-200 rounded-xl shadow-lg p-6 border border-blue-300">
              <h3 className="text-xl font-bold text-black mb-4">
                Ratings for {stores.find((s) => s.id === expandedStoreId)?.name}
              </h3>
              <div className="overflow-x-auto rounded-md border border-blue-200">
                <table className="w-full text-sm">
                  <thead className="bg-blue-200 text-black text-lg font-bold">
                    <tr>
                      <th className="border border-blue-300 px-4 py-2">User</th>
                      <th className="border border-blue-300 px-4 py-2 ">Rating</th>
                      <th className="border border-blue-300 px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratingsMap[expandedStoreId]?.ratings.length > 0 ? (
                      ratingsMap[expandedStoreId].ratings.map((r, index) => (
                        <tr
                          key={`${r.id}-${index}`}
                         
                        >
                          <td className="border border-blue-300 px-4 py-2 text-center">{r.user?.name || "Unknown"}</td>
                          <td className="border border-blue-300 px-4 py-2 text-center">{r.rating}</td>
                          <td className="border border-blue-300 px-4 py-2 text-center">
                            {new Date(r.created_at || r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500 italic">
                          No ratings yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({}); 
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const userId = localStorage.getItem("userId");
  console.log("userId:", userId);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  
  useEffect(() => {
    const fetchStores = async () => {
      if (!userId) return;

      try {
       
        const resStores = await fetch("http://localhost:5000/ratings/getStoreRatings");
        const storeData = await resStores.json();
        setStores(storeData);

       
        const resUserRatings = await fetch(`http://localhost:5000/ratings/getRatingsByUser/${userId}`);
        const userRatingsData = await resUserRatings.json();

        const ratingsMap = {};
        userRatingsData.ratings.forEach(r => {
          ratingsMap[r.store_id] = r.rating;
        });
        setUserRatings(ratingsMap);

      } catch (err) {
        console.error(err);
      }
    };

    fetchStores();
  }, [userId]);

  
  const handleRating = async (storeId, rating) => {
    if (!userId || !storeId || !rating) return;

    try {
      const res = await fetch("http://localhost:5000/ratings/submitRating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, storeId, rating }),
      });

      const data = await res.json();
      if (!res.ok) console.error(data.message);
      else {
        setUserRatings(prev => ({ ...prev, [storeId]: rating }));

        
        const resStores = await fetch("http://localhost:5000/ratings/getStoreRatings");
        const storeData = await resStores.json();
        setStores(storeData);
      }
    } catch (err) {
      console.error(err);
    }
  };

 
  const filteredStores = stores.filter(store =>
    store.storeName.toLowerCase().includes(searchName.toLowerCase()) &&
    store.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  return (
    <div className="p-6 bg-blue-100 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Stores</h1>
        <button
          onClick={handleLogout}
          className="bg-blue-300 text-black px-4 h-12 rounded hover:bg-blue-400"
        >
          Logout
        </button>
      </div>

      
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className=" p-2 rounded-xl w-48 bg-blue-200"
        />
        <input
          type="text"
          placeholder="Search by Address"
          value={searchAddress}
          onChange={e => setSearchAddress(e.target.value)}
          className=" p-2 rounded-xl w-48 bg-blue-200"
        />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div key={store.storeId} className="bg-blue-200x shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{store.storeName}</h2>
            <p className="text-gray-600 mb-1">Address: {store.address}</p>
            <p className="text-gray-600 mb-2">
              Overall Rating: ⭐ {store.averageRating || "N/A"} ({store.ratingCount || 0} ratings)
            </p>

            <p className="mb-2">Your Rating:</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(store.storeId, star)}
                  className={star <= (userRatings[store.storeId] || 0) ? "text-yellow-500 text-xl" : "text-gray-400 text-xl"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredStores.length === 0 && (
          <p className="text-gray-500 col-span-full">No stores found.</p>
        )}
      </div>
    </div>
  );
}

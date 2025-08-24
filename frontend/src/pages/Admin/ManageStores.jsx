import { useState, useEffect } from "react";

export default function ManageStores() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerName: "",
    rating: "",
  });


  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");

  const [stores, setStores] = useState([]);


const fetchStores = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/stores/getAllStores", {
      method: "GET", 
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    
    const data = await response.json();
    console.log(data); 
    
    if (response.ok) {
      setStores(data.stores); 
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};


  useEffect(() => {
    fetchStores();
  }, []);


  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }


  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/stores/addStore", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Store added successfully!");
        setShowForm(false);
        setFormData({ name: "", email: "", address: "", ownerName: "", rating: "" });
        fetchStores(); 
      } else {
        alert(data.message || "Failed to add store");
      }
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Something went wrong!");
    }
  }


  const filteredStores = stores.filter((store) => {
    return (
      (store.name?.toLowerCase() || "").includes(filterName.toLowerCase()) &&
      (store.address?.toLowerCase() || "").includes(filterAddress.toLowerCase()) 
    );
  });

  return (
    <div className="p-6 bg-blue-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Stores</h1>

    
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-200 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          Add Store
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Store Name"
                placeholderTextColor="black"
                className="text-black border p-2 rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Store Email"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Store Address"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Owner Name"
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder="Rating"
                min="0"
                max="5"
                step="0.1"
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-blue-300 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg mx-auto block"
              >
                Add Store
              </button>
            </form>
          </div>
        </div>
      )}

   
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className=" p-2 rounded-xl w-48 bg-blue-200 "
        />
        <input
          type="text"
          placeholder="Search by Address"
          value={filterAddress}
          onChange={(e) => setFilterAddress(e.target.value)}
          className=" p-2 rounded-xl w-48 bg-blue-200"
        />

      </div>

   
      <div className="overflow-x-auto  bg-blue-200">
        <table className="w-full border-collapse border border-blue-300">
          <thead className="bg-blue-200">
            <tr>
              <th className="border border-blue-300 text-center py-2">Store Name</th>
              <th className="border border-blue-300 text-center py-2">Email</th>
              <th className="border border-blue-300 text-center py-2">Address</th>
              <th className="border border-blue-300 text-center py-2">Owner</th>
              <th className="border border-blue-300 text-center py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
              <tr key={index}>
                <td className="border border-blue-300 text-center py-2">{store.name}</td>
                <td className="border border-blue-300 text-center py-2">{store.email}</td>
                <td className="border border-blue-300 text-center py-2">{store.address}</td>
                <td className="border border-blue-300 text-center py-2">{store.owner?.name}</td>
                <td className="border border-gray-300 text-center py-2">
                    {store.averageRating ? Number(store.averageRating).toFixed(1) : "0"}
                  </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No stores found</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

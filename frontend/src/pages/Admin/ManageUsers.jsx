import { useState, useEffect } from "react";
import PasswordChecklist from "react-password-checklist";
var validate = require("react-email-validator");

export default function ManageUsers() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "",
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false); 

  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [users, setUsers] = useState([]);

  
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/getAllUsers");
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  function handleClick(userId) {
    window.location.href = `/users/${userId}`;
  }

  
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (validate.validate(value)) {
        setEmailError("");
        setIsEmailValid(true);
      } else {
        setEmailError("Invalid email address");
        setIsEmailValid(false);
      }
    } else if (name === "name") {
      if (value.length < 20 || value.length > 60) setNameError("Name must be 20-60 characters");
      else setNameError("");
    } else if (name === "address") {
      if (value.length >= 400) setAddressError("Address must be less than 400 characters");
      else setAddressError("");
    }
  }

  
  async function handleSubmit(e) {
    e.preventDefault();
    if (emailError || nameError || addressError || !isPasswordValid || !formData.role) {
      alert("Please fix all errors before submitting!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User added successfully!");
        setShowForm(false);
        setFormData({ name: "", email: "", address: "", password: "", role: "" });
        setIsPasswordValid(false);
        fetchUsers();
      } else {
        alert(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Something went wrong!");
    }
  }

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filterName.toLowerCase()) &&
      user.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      user.address.toLowerCase().includes(filterAddress.toLowerCase()) &&
      (filterRole === "" || user.role.toLowerCase() === filterRole.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-blue-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

    
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-200 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          Add User
        </button>
      </div>

     
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-blue-200 p-6 rounded-lg shadow-lg w-full max-w-lg relative transform transition-transform duration-300 scale-100">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className="border p-2 rounded"
                required
              />
              {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email"
                className="border p-2 rounded"
                required
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

              
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="border p-2 rounded"
                required
              />
              {addressError && <p className="text-red-500 text-sm">{addressError}</p>}

              
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => {
                  if (isEmailValid && !isPasswordValid) setShowPasswordChecklist(true);
                }}
                onBlur={() => {

                  if (isPasswordValid) setShowPasswordChecklist(false);
                }}
                placeholder="Enter Password"
                className="border p-2 rounded"
                required
              />

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showPasswordChecklist ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <PasswordChecklist
                  rules={["minLength", "specialChar", "number", "capital"]}
                  minLength={8}
                  value={formData.password}
                  onChange={(isValid) => {
                    setIsPasswordValid(isValid);
                    if (isValid) {
                      setTimeout(() => setShowPasswordChecklist(false), 500); 
                    } else if (document.activeElement.name === "password") {
                      setShowPasswordChecklist(true);
                    }
                  }}
                />
              </div>


        
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="store_owner">store_owner</option>
              </select>

              <button
                type="submit"
                className="bg-blue-300 hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg mx-auto block"
              >
                Add User
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
          className="text-black p-2 rounded-xl w-48 bg-blue-200"
        />
        <input
          type="text"
          placeholder="Search by Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="text-black  p-2 rounded-xl w-48 bg-blue-200"
        />
        <input
          type="text"
          placeholder="Search by Address"
          value={filterAddress}
          onChange={(e) => setFilterAddress(e.target.value)}
          className="text-black p-2 rounded-xl w-48 bg-blue-200"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className=" p-2 rounded-xl w-48 bg-blue-200"
        >
          <option value="">All Roles</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="store_owner">store_owner</option>
        </select>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border--300blue">
          <thead className="bg-blue-200">
            <tr>
              <th className="border border-blue-300 px-4 py-2">Name</th>
              <th className="border border-blue-300 px-4 py-2">Email</th>
              <th className="border border-blue-300 px-4 py-2">Address</th>
              <th className="border border-blue-300 px-4 py-2">Role</th>
              <th className="border border-blue-300 px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="border border-blue-300 px-4 py-2">{user.name}</td>
                  <td className="border border-blue-300 px-4 py-2">{user.email}</td>
                  <td className="border border-blue-300 px-4 py-2">{user.address}</td>
                  <td className="border border-blue-300 px-4 py-2">{user.role}</td>
                  <td className="border border-blue-300 px-2 text-center py-2">
                    <button
                      onClick={() => handleClick(user.id)}
                      className="text-blue-500 text-center hover:underline mr-2"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

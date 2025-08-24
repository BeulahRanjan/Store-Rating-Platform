import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You are not logged in!");
      return;
    }

    if (!isPasswordValid) {
      setMessage("❌ Please meet the password requirements.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        if (role === "store_owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/user/store-list");
        }
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      setMessage("Error connecting to server");
    }

    setLoading(false);
  };

  const handleSkip = () => {
    if (role === "store_owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/user/store-list");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-blue-200 rounded-3xl shadow">
        <h2 className="text-2xl font-bold text-center">Update Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setShowPasswordChecklist(true)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showPasswordChecklist && !isPasswordValid
                  ? "max-h-40 opacity-100 mt-2"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital"]}
                minLength={8}
                value={newPassword}
                onChange={(isValid) => setIsPasswordValid(isValid)}
              />
            </div>
          </div>

          
          <div className="flex gap-[120px]">
            <button
              type="submit"
              className="flex-1/2  px-4 py-2 ml-10 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="flex-1/2 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-300"
            >
              Skip
            </button>
          </div>
        </form>

        
        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;

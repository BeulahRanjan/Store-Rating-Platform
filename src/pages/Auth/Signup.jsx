import React, { useState } from "react";
import PasswordChecklist from "react-password-checklist";
var validate = require("react-email-validator");

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (emailError || nameError || addressError || !isPasswordValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, address, role }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server");
    }
  };

  const isEmailValid = validate.validate(email);
  const showChecklist = isEmailValid && isPasswordFocused && !isPasswordValid;

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200 ">
      <div className="w-full max-w-md p-8 space-y-4 bg-blue-100 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          
          <div className="relative">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                setNameError(
                  val.length < 20 || val.length > 60
                    ? "Name must be between 20 and 60 characters"
                    : ""
                );
              }}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p
              className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out ${
                nameError ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              {nameError}
            </p>
          </div>

          
          <div className="relative">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setEmailError(isEmailValid ? "" : "Invalid email address");
              }}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p
              className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out ${
                emailError ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              {emailError}
            </p>
          </div>

          
          <div className="relative">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(true)} 
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
                showChecklist
                  ? "max-h-96 opacity-100 mt-2 scale-100"
                  : "max-h-0 opacity-0 mt-0 scale-95"
              }`}
            >
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital"]}
                minLength={8}
                value={password}
                onChange={(isValid) => setIsPasswordValid(isValid)}
              />
            </div>
          </div>

          
          <div className="relative">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                const val = e.target.value;
                setAddress(val);
                setAddressError(
                  val.length >= 400
                    ? "Address must be less than 400 characters"
                    : ""
                );
              }}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p
              className={`text-red-500 text-sm mt-1 transition-all duration-300 ease-in-out ${
                addressError ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              {addressError}
            </p>
          </div>

        
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="store_owner">store_owner</option>
          </select>

          <button
            type="submit"
            className="w-7/8 px-4 py-1  text-black bg-blue-300 rounded hover:bg-blue-400 transition-colors duration-300 block mx-auto"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

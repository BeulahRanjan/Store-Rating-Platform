
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import UpdatePassword from "../pages/Auth/UpdatePassword";


// Admin
import AdminDashboard from "../pages/Admin/Dashboard";
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageStores from "../pages/Admin/ManageStores";
import UserDetails from "../pages/Admin/UserDetails";

// Normal User
import StoreList from "../pages/NormalUser/StoreList";


// Store Owner
import OwnerDashboard from "../pages/StoreOwner/Dashboard";



export default function AppRoutes() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-stores" element={<ManageStores />} />
            <Route path="users/:id" element={<UserDetails />} />
          </>

          <>

            <Route path="/user/store-list" element={<StoreList />} />
    
          </>

          <>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />

          </>

        <Route path="/update-password" element={<UpdatePassword />} />
      
      </Routes>
    </Router>
  );
}

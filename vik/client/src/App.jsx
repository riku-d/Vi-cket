import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import AllMatches from './pages/AllMatches';
import MatchDetails from './pages/MatchDetails';
import StadiumSelector from './pages/StadiumSelector';
import MyBookings from './pages/MyBookings';
import BookingPage from './components/BookingPage';
import { useUser } from "@civic/auth/react";
import FoodMenu from './pages/FoodMenu';
import CartPage from './pages/CartPage';


const App = () => {
  const { user, isLoading, error } = useUser();
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");

  // 🌐 Log user state for debug
  useEffect(() => {
    console.log("Civic Auth State ->", { user, isLoading, error });
  }, [user, isLoading, error]);

  // 🔁 Sync user to backend once loaded
  useEffect(() => {
    if (!isLoading && user) {
      const syncUser = async () => {
        try {
          const res = await fetch("/api/auth/civic-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              username: user.username || "Anonymous",
              image: user.image || ""
            })
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
          }

          const data = await res.json();
          console.log("✅ User synced to DB:", data);
        } catch (err) {
          console.error("❌ Failed to sync user:", err.message);
        }
      };

      syncUser();
    }
  }, [user, isLoading]);

  // 🌀 Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">🔄 Logging you in...</p>
      </div>
    );
  }

  // ❌ Auth Error screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-red-600 text-xl font-bold">Login Error</h2>
          <p className="text-gray-600 mt-2">{error.message || "Something went wrong during Civic login."}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/matches' element={<AllMatches />} />
          <Route path='/matches/:id' element={<MatchDetails />} />
          <Route path='/book/:Id' element={<StadiumSelector />} />
          <Route path='/booking' element={<BookingPage />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/services' element={<FoodMenu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/menu" element={<FoodMenu />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

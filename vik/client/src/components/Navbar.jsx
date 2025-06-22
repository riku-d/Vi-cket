import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useUser, UserButton } from "@civic/auth/react";
import axios from "axios";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  // Track previous user to detect logout safely
  const prevUserRef = useRef(user);
  const [walletAddress, setWalletAddress] = useState(null);

  const connectMetaMask = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0];
      setWalletAddress(wallet);
      alert("✅ MetaMask Connected: " + wallet);

      // ⬇️ Update wallet in the database
      if (user?.id) {
        await axios.post("http://localhost:3000/api/auth/update-wallet", {
          civicId: user.id,
          walletAddress: wallet,
        });
        console.log("✅ Wallet address synced with DB");
      }
    } catch (err) {
      console.error("MetaMask connection error", err);
      alert("⚠️ Could not connect to MetaMask.");
    }
  } else {
    alert("❌ MetaMask is not installed. Please install it to connect.");
  }
};



  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (prevUser && !user) {
      navigate("/");
    }
    prevUserRef.current = user;
  }, [user, navigate]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Matches", path: "/matches" },
    { label: "Services", path: "/services" },
    { label: "Bookings", path: "/my-bookings" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-gray-100/90 shadow-md backdrop-blur-md py-4 md:py-6"
          : "bg-transparent py-6 md:py-8"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-15 ${isScrolled ? "invert opacity-80" : ""}`}
        />
      </Link>

      {/* Center Nav Items */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-8">
        {navItems.map(({ label, path }) => {
          const protectedRoute = label !== "Home";
          return (
            <Link
              key={label}
              to={protectedRoute && !user ? "#" : path}
              onClick={(e) => {
                if (protectedRoute && !user) {
                  e.preventDefault();
                  alert(`Please log in to access ${label}.`);
                }
              }}
              className={`group flex flex-col font-semibold gap-0.5 ${
                isScrolled ? "text-gray-700" : "text-gray-100"
              }`}
            >
              {label}
              <div
                className={`${
                  isScrolled ? "bg-gray-700" : "bg-gray-100"
                } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </Link>
          );
        })}
      </div>

      {/* Right Side (Avatar or Login) */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <button
              onClick={connectMetaMask}
              className="text-sm font-semibold bg-transparent text-gray-600 px-3 py-1.5 rounded-full hover:text-gray-800 hover:bg-gray-200"

            >
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}
            </button>

            <UserButton
              render={({ avatarUrl }) => (
                <img
                  src={
                    avatarUrl?.startsWith("http")
                      ? avatarUrl
                      : "/default-avatar.png"
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full border"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              )}
            />
          </>
        ) : (
          <UserButton
            render={() => (
              <button
                onClick={() =>
                  document.querySelector('[data-civic-login]')?.click()
                }
                className="text-sm font-semibold bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-black"
              >
                Log In
              </button>
            )}
          />
        )}
      </div>


      {/* Mobile Menu Icon */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="Open Menu"
          className={`${isScrolled ? "invert" : ""} h-4`}
        />
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-gray-50 text-gray-800 flex flex-col md:hidden items-center justify-center gap-6 font-semibold transform transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          aria-label="Close Menu"
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
        </button>

        {navItems.map(({ label, path }) => {
          const protectedRoute = label !== "Home";
          return (
            <Link
              key={label}
              to={protectedRoute && !user ? "#" : path}
              onClick={(e) => {
                if (protectedRoute && !user) {
                  e.preventDefault();
                  alert(`Please log in to access ${label}.`);
                } else {
                  setIsMenuOpen(false);
                }
              }}
            >
              {label}
            </Link>
          );
        })}

        {user && (
          <button
            onClick={connectMetaMask}
            className="text-sm font-semibold bg-transparent text-gray-600 px-3 py-1.5 rounded-full hover:text-gray-800 hover:bg-gray-200"
          >
            {walletAddress ? "Wallet Connected" : "Connect Wallet"}
          </button>
        )}


        {user ? (
          <UserButton
            render={({ avatarUrl }) => (
              <img
                src={
                  avatarUrl?.startsWith("http")
                    ? avatarUrl
                    : "/default-avatar.png"
                }
                alt="User"
                className="w-8 h-8 rounded-full border mt-4"
              />
            )}
          />
        ) : (
          <UserButton
            render={() => (
              <button
                onClick={() =>
                  document.querySelector('[data-civic-login]')?.click()
                }
                className="text-sm font-semibold bg-gray-800 text-white px-4 py-1.5 rounded hover:bg-black mt-4"
              >
                Log In
              </button>
            )}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@civic/auth/react';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking) {
      alert("No booking data found. Please select seats first.");
      navigate("/");
    }
  }, [booking, navigate]);

  const handlePayment = async () => {
    if (!booking) {
      alert("Booking data is missing.");
      return;
    }
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Get matchId either from booking or fallback to hotel._id
    const matchId = booking.matchId || booking.hotel?._id || '';



    if (!matchId) {
      alert("Match ID is missing. Cannot proceed with booking.");
      return;
    }

    setIsProcessing(true);
    console.log("👉 matchId being passed to /booking:", matchId);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: (booking.totalPrice || 0) * 100, // amount in paise
      currency: 'INR',
      name: 'Vi-cket',
      description: `Booking for ${booking.matchTitle || booking.hotel?.name || 'Match'}`,
      handler: async function (response) {
        console.log("✅ Razorpay Payment ID:", response.razorpay_payment_id);

        try {
          // Save booking in backend
          const saveRes = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userAddress: user.id,
              matchId: matchId,
              matchTitle: booking.matchTitle || booking.hotel?.name || 'Unknown Match',
              stadium: booking.stadium || booking.hotel?.address || 'Unknown Stadium',
              blockName: booking.blockName,
              seats: booking.seats,
              pricePerSeat: booking.pricePerSeat,
              totalPrice: booking.totalPrice,
              bookingDate: new Date().toISOString(),
              nftTokenId: null,
              nftMinted: false,
            }),
          });

          if (!saveRes.ok) {
            const errorText = await saveRes.text();
            throw new Error(`Booking save failed: ${errorText}`);
          }

          const bookingData = await saveRes.json();
          if (!bookingData.booking?._id) {
            throw new Error("Booking save failed: No booking ID returned");
          }

          const bookingId = bookingData.booking._id;
          console.log("🆔 Booking ID to mint NFT:", bookingId);

          // Mint NFT ticket
          const mintRes = await fetch('http://localhost:3000/api/nft/mint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              seatLabel: booking.seats[0], // ✅ You can loop later if supporting multiple
              seatPriceINR: booking.pricePerSeat,
            }),
          });

          if (!mintRes.ok) {
            const mintError = await mintRes.text();
            throw new Error(`NFT minting failed: ${mintError}`);
          }

          const mintData = await mintRes.json();
          const { tokenId } = mintData;
          alert(`🎟 NFT Ticket Minted! Token ID: ${tokenId}`);

          navigate("/my-bookings");
        } catch (err) {
          console.error("❌ Error during booking or NFT minting:", err);
          alert(err.message || "Something went wrong during booking or NFT minting.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user.username || "Guest",
        email: user.email || "guest@example.com",
        contact: user.phone || "9999999999",
      },
      theme: {
        color: "#1e40af",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
        <div><strong>Match:</strong> {booking.matchTitle || booking.hotel?.name || "N/A"}</div>
        <div><strong>Stadium:</strong> {booking.stadium || booking.hotel?.address || "N/A"}</div>
        <div><strong>Block:</strong> {booking.blockName} (ID: {booking.blockId || "N/A"})</div>
        <div><strong>Seats:</strong> {booking.seats?.join(', ') || "N/A"}</div>
        <div><strong>Price per Seat:</strong> ₹{booking.pricePerSeat || 0}</div>
        <div className="text-lg font-semibold">Total: ₹{booking.totalPrice || 0}</div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full px-4 py-2 rounded text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isProcessing ? "Processing Payment..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;

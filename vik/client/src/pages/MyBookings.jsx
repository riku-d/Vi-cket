import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { useUser } from '@civic/auth/react';
import QRCode from "react-qr-code";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  const [showQR, setShowQR] = useState(false);
  const [currentQRData, setCurrentQRData] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshTime, setRefreshTime] = useState(Date.now());

  // ⏱ Update QR code every 30 seconds
  useEffect(() => {
    if (!selectedBooking) return;

    const updateQR = () => {
      const timeWindow = Math.floor(Date.now() / 30000);
      const hashData = `${selectedBooking._id}-${timeWindow}`;
      setCurrentQRData(hashData);
      setRefreshTime(Date.now()); // force re-render
    };

    updateQR();
    const interval = setInterval(updateQR, 30000);
    return () => clearInterval(interval);
  }, [selectedBooking]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const walletAddress = user?.id;
        if (!walletAddress) throw new Error('Wallet address not found');

        const res = await fetch(`/api/bookings/user/${walletAddress}`);
        if (!res.ok) throw new Error('Failed to fetch bookings');

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-40 text-lg text-gray-600">
        Loading your bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-40 text-red-500">
        {error}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 text-center text-gray-600">
        <Title
          title="My Booking"
          subTitle="Easily manage your past, current, and upcoming match tickets in one place."
          align="center"
        />
        <p className="mt-10 text-lg">You have no bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Booking"
        subTitle="Easily manage your past, current, and upcoming match tickets in one place."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium ml-35 text-base py-3">
          <div>Block & Seats</div>
          <div>Date & Time</div>
          <div>Payment</div>
        </div>

        {bookings.map((booking) => {
          const {
            _id,
            matchTitle = "No Match",
            stadium = "Unknown",
            blockName = 'Unknown Block',
            seats = [],
            bookingDate = 'N/A',
            pricePerSeat = 0,
            totalPrice = 0,
            nftMinted = false,
            nftTokenId = null,
          } = booking;

          return (
            <div key={_id}>
              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                {/* Booking Info */}
                <div className="flex flex-col gap-1">
                  <p className="font-playfair text-2xl">{matchTitle}</p>
                  <p className="text-sm text-gray-700">Block: {blockName}</p>
                  <p className="text-sm text-gray-600">
                    Seats: <span className="font-semibold">{seats.join(', ')}</span>
                  </p>
                  <p className="text-sm text-gray-700">Price/Seat: ₹{pricePerSeat}</p>

                  {nftMinted && nftTokenId && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowQR(true);
                      }}
                      className="text-sm text-blue-600 underline mt-1"
                    >
                      🎟️ Show Ticket
                    </button>
                  )}
                </div>

                {/* Date & Time */}
                <div className="flex items-center justify-start md:justify-center text-sm text-gray-700 mt-4 md:mt-0">
                  <p className="ml-1">{bookingDate}</p> {/* ⬅️ pushed right */}
                </div>

                {/* Payment */}
                <div className="flex items-center justify-start md:justify-end text-sm text-gray-700 mt-4 md:mt-0">
                  <div className="text-right ml-2"> {/* ⬅️ pushed right */}
                    <p className="font-semibold">₹{totalPrice}</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
              </div>

              {/* 🔹 Divider */}
              <div className="my-4 border-t border-gray-300"></div>
            </div>
          );
        })}
      </div>

      {/* ✅ QR Code Modal */}
      <Modal
        isOpen={showQR}
        onRequestClose={() => setShowQR(false)}
        contentLabel="QR Ticket"
        className="bg-white rounded-lg p-6 w-[90%] max-w-md mx-auto mt-20 shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">🎟️ Your Ticket QR</h2>
          {currentQRData && <QRCode value={currentQRData} size={256} />}
          <p className="text-xs mt-4 text-gray-500">
            This QR updates every 30 seconds for security.
          </p>
          <button
            onClick={() => setShowQR(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { stadiumBlocks as defaultBlocks } from '../assets/stadiumBlocks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "@civic/auth/react";

const StadiumSelector = () => {
  const { user } = useUser();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatsMap, setBookedSeatsMap] = useState({});
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get match data from navigation state
  const matchId = location.state?.matchId;
  const matchTitle = location.state?.matchTitle || "Match Title";
  const stadium = location.state?.stadium || "Default Stadium";

  // Basic safety: if no matchId, redirect user
  useEffect(() => {
    if (!matchId) {
      alert("Match ID is missing. Please select a match first.");
      navigate("/", { replace: true });
    }
  }, [matchId, navigate]);

  // Fetch booked seats and update block status
  useEffect(() => {
    if (!matchTitle || !stadium) return;

    const fetchBookedSeats = async () => {
      setLoadingSeats(true);
      try {
        const res = await axios.get('/api/bookings/seats', {
          params: { matchId, stadium }
        });
        const map = res.data || {};
        setBookedSeatsMap(map);

        // Mark blocks sold out if all seats booked
        const updatedBlocks = defaultBlocks.map(block => {
          const totalSeats = block.seats.length;
          const bookedSeats = map[block.name] || [];
          return bookedSeats.length >= totalSeats
            ? { ...block, color: '#A0A0A0', isSoldOut: true }
            : { ...block, color: block.color, isSoldOut: false };
        });

        setBlocks(updatedBlocks);
      } catch (err) {
        console.error("Failed to fetch booked seats:", err);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchBookedSeats();
  }, [matchTitle, stadium]);

  // Handlers

  const handleBlockClick = useCallback((block) => {
    if (block.isSoldOut) return;
    setSelectedBlock(block);
    setSelectedSeats([]);
    setIsModalOpen(true);
  }, []);

  const toggleSeatSelection = useCallback((seat) => {
    if (!selectedBlock) return;

    if ((bookedSeatsMap[selectedBlock.name] || []).includes(seat)) return; // booked seat can't be selected

    setSelectedSeats(prevSeats => {
      if (prevSeats.includes(seat)) {
        // Deselect seat
        return prevSeats.filter(s => s !== seat);
      } else {
        if (prevSeats.length >= 5) {
          alert('You can only book a maximum of 5 seats.');
          return prevSeats;
        }
        return [...prevSeats, seat];
      }
    });
  }, [bookedSeatsMap, selectedBlock]);

  const totalPrice = selectedBlock ? selectedSeats.length * selectedBlock.price : 0;

  const handleAddToCart = () => {
    if (!user) {
      alert("Please log in to proceed with booking.");
      return;
    }
    if (!selectedBlock || selectedSeats.length === 0) {
      alert('Please select at least one seat before proceeding.');
      return;
    }
    if (!matchId) {
      alert("Match ID missing. Cannot proceed.");
      return;
    }

    const bookingData = {
      blockName: selectedBlock.name,
      blockId: selectedBlock.id,
      seats: selectedSeats,
      pricePerSeat: selectedBlock.price,
      totalPrice,
      stadium,
      matchTitle,
      matchId,
      bookingDate: new Date().toISOString()
    };

    navigate("/booking", { state: bookingData });
  };

  // SVG helper functions

  const centerX = 300;
  const centerY = 300;
  const innerRadius = 120;
  const outerRadius = 230;
  const totalBlocks = blocks.length;

  const polarToCartesian = (cx, cy, radius, angleInRadians) => ({
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  });

  const createDoughnutPath = (startAngle, endAngle, innerR, outerR) => {
    const startOuter = polarToCartesian(centerX, centerY, outerR, startAngle);
    const endOuter = polarToCartesian(centerX, centerY, outerR, endAngle);
    const startInner = polarToCartesian(centerX, centerY, innerR, endAngle);
    const endInner = polarToCartesian(centerX, centerY, innerR, startAngle);
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-1">Select a Stadium Block</h1>
      <p className="mb-4 text-gray-600">{matchTitle} – {stadium}</p>

      {loadingSeats ? (
        <p className="text-gray-500 mb-4">Loading seat availability...</p>
      ) : (
        <svg width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="Stadium blocks seat selection">
          <circle cx={centerX} cy={centerY} r={innerRadius} fill="#4CAF50" stroke="black" strokeWidth="1" />
          <rect x={centerX - 15} y={centerY - 30} width="30" height="60" fill="#FFDAB9" stroke="black" strokeWidth="1" rx="5" />

          {blocks.map((block, index) => {
            const anglePerBlock = (2 * Math.PI) / totalBlocks;
            const startAngle = index * anglePerBlock;
            const endAngle = startAngle + anglePerBlock;

            const pathD = createDoughnutPath(startAngle, endAngle, innerRadius, outerRadius);
            const labelAngle = startAngle + anglePerBlock / 2;
            const labelPos = polarToCartesian(centerX, centerY, (innerRadius + outerRadius) / 2, labelAngle);

            return (
              <g
                key={block.id}
                onClick={() => handleBlockClick(block)}
                style={{ cursor: block.isSoldOut ? 'not-allowed' : 'pointer' }}
                role="button"
                tabIndex={0}
                aria-disabled={block.isSoldOut}
                aria-label={`${block.isSoldOut ? 'Sold Out' : block.id} block`}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !block.isSoldOut) {
                    handleBlockClick(block);
                  }
                }}
              >
                <path d={pathD} fill={block.color} stroke="black" strokeWidth="1" />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill="white"
                  pointerEvents="none"
                >
                  {block.isSoldOut ? "Sold Out" : block.id}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {isModalOpen && selectedBlock && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // Close on backdrop click
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close seat selection modal"
            >
              ✕
            </button>

            <h2 id="modal-title" className="text-xl font-bold mb-2">{selectedBlock.name}</h2>
            <p className="mb-1">Price per Seat: ₹{selectedBlock.price}</p>
            <p className="mb-3 text-sm text-gray-500">Click on seats to add/remove</p>

            <div className="h-40 overflow-y-auto border rounded p-2 mb-4">
              <div className="text-xs flex flex-wrap gap-1">
                {selectedBlock.seats.map((seat) => {
                  const isBooked = (bookedSeatsMap[selectedBlock.name] || []).includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                    <span
                      key={seat}
                      onClick={() => !isBooked && toggleSeatSelection(seat)}
                      className={`px-2 py-1 rounded cursor-pointer select-none ${
                        isBooked
                          ? 'bg-red-400 text-white line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      role="button"
                      tabIndex={isBooked ? -1 : 0}
                      aria-pressed={isSelected}
                      aria-disabled={isBooked}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !isBooked) {
                          toggleSeatSelection(seat);
                        }
                      }}
                    >
                      {seat}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">
                <p className="font-semibold">Selected: {selectedSeats.length}</p>
                <p>Total: ₹{totalPrice}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={selectedSeats.length === 0}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadiumSelector;

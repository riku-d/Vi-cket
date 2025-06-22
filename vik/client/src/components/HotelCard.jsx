import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index }) => {
    const navigate = useNavigate();

    return (
        <Link
            to={`/matches/${room._id}`}
            onClick={() => scrollTo(0, 0)}
            key={room._id}
            className="relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
            <img src={room.images[0]} alt="" />

            {index % 2 === 0 && (
                <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-semibold rounded-full">
                    Fast Filling
                </p>
            )}

            <div className='p-4 pt-5'>
                <div className="flex items-center justify-between">
                    <p className="font-playfair text-xl font-semibold text-gray-800">
                        {room.hotel.name}
                    </p>
                </div>

                <div className="flex items-center gap-1 text-sm">
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel.address}</span>
                </div>

                <div className="flex items-center gap-1 text-sm mt-1">
                    <img src={assets.calenderIcon} alt="calender-icon" />
                    <span>{room.hotel.date}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p>
                        <span className="text-xl text-gray-800">
                            ₹{room.pricePerNight}
                        </span> onwards
                    </p>
                    {/* Stop event propagation to avoid triggering Link */}
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        // Navigate directly to booking page with full booking data in state
                        navigate('/booking', {
                        state: {
                            matchId: room._id,          // important
                            matchTitle: room.hotel.name,
                            stadium: room.hotel.address,
                            blockName: "",              // fill in or get from seat selection UI
                            seats: [],                  // empty now, but update when you add seat selection
                            pricePerSeat: room.pricePerNight,
                            totalPrice: room.pricePerNight, // or calculate total
                        }
                        });
                    }}
                    className="px-4 py-2 bg-orange-500 text-gray-50 rounded-md hover:bg-orange-600 transition duration-200"
                    >
                    Book Now
                    </button>

                </div>
            </div>
        </Link>
    )
}

export default HotelCard;

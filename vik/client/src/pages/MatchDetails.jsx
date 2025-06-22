import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, roomsDummyData } from '../assets/assets'
import HotelCard from '../components/HotelCard'

const MatchDetails = () => {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [mainImage, setMainImage] = useState(null)
  const [showTerms, setShowTerms] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const foundRoom = roomsDummyData.find(room => room._id === id)
    if (foundRoom) {
      setRoom(foundRoom)
      setMainImage(foundRoom.images[0])
    } else {
      // Optional: redirect if no room found
      // navigate("/", { replace: true })
    }
  }, [id, navigate])

  if (!room) {
    return <p className="text-center mt-20 text-gray-600">Loading event details...</p>
  }

  return (
    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Match Details */}
      <div className='flex flex-col md:flex-row items-center md:items-center gap-2'>
        <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}</h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>10% OFF</p>
      </div>
      {/* Match Address */}
      <div className='flex items-center lg:flex-row mt-6 gap-2'>
        <img src={assets.CityIcon} alt="city icon" className='h-4 w-4' />
        <span>{room.hotel.city}</span>
      </div>
      {/* Match Images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        {/* Left: Main Image */}
        <div className='lg:w-2/3 w-full'>
          <img
            src={mainImage}
            alt="Event"
            className='w-full h-[400px] rounded-xl shadow-lg object-cover'
          />
        </div>

        {/* Right: Event Details */}
        <div className='lg:w-1/3 w-full'>
          <div className='w-full bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border'>
            <h2 className='text-2xl font-semibold text-gray-800'>{room.hotel.name}</h2>

            <p className='flex items-center gap-2 text-gray-600'>
              <img src={assets.calenderIcon} alt="calendar" className='h-4 w-4' />
              <span className='font-medium'>{room.hotel.date}</span>
            </p>

            <p className='flex items-center gap-2 text-gray-600'>
              <img src={assets.timeIcon} alt="time" className='h-4 w-4' />
              <span className='font-medium'>{room.hotel.time}</span>
            </p>

            <p className='flex items-center gap-2 text-gray-600'>
              <img src={assets.durationIcon} alt="duration" className='h-4 w-4' />
              <span className='font-medium'>{room.hotel.duration}</span>
            </p>

            <p className='flex items-center gap-2 text-gray-600'>
              <img src={assets.locationIcon} alt="location" className='h-4 w-4' />
              <span>{room.hotel.address}, {room.hotel.city}</span>
            </p>

            <p className='text-xl text-gray-900 font-bold'>
              ₹{room.pricePerNight} <span className='text-sm text-gray-600'> onwards</span>
            </p>

            <button
              onClick={() =>
                navigate(`/book/${room._id}`, {
                  state: {
                    matchTitle: room.hotel.name,
                    stadium: room.hotel.stadium || room.hotel.city,
                    matchId: room._id,
                  }
                })
              }
              className='px-5 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 w-fit'
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <h1 className='text-3xl md:text-4xl font-playfair mb-4'>About the Event</h1>
        <p className='text-gray-700 leading-relaxed text-justify'>
          Experience the thrill of the Indian Premier League like never before! Watch your favorite cricket stars battle it out in a high-octane clash filled with electrifying performances, nail-biting finishes, and unmatched energy in the stadium. {room.hotel.name} match promises unforgettable moments in a fierce rivalry. Whether you're a die-hard fan or a first-time attendee, this is the ultimate cricketing spectacle you won't want to miss!
        </p>

        <div className='mt-8'>
          <button
            onClick={() => setShowTerms(true)}
            className='text-sm text-blue-600 hover:underline font-medium'
          >
            View Terms & Conditions
          </button>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl"
              aria-label="Close terms and conditions"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Terms & Conditions</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 max-h-[300px] overflow-y-auto pr-2">
              <li>Entry is permitted only with a valid ticket and ID proof.</li>
              <li>Re-entry is not allowed once you exit the venue.</li>
              <li>Outside food, drinks, and contraband items are strictly prohibited.</li>
              <li>Follow all stadium rules and cooperate with security checks.</li>
              <li>Children must be accompanied by adults at all times.</li>
              <li>Match schedules are subject to change without prior notice.</li>
              <li>In case of event cancellation, refund policies will apply.</li>
            </ul>
          </div>
        </div>
      )}

      <div className='mt-12'>
        <h1 className='text-3xl md:text-4xl font-playfair mb-4'>You May Also Like</h1>
        <div className='flex flex-wrap items-center justify-center gap-6 mt-8'>
          {roomsDummyData.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MatchDetails

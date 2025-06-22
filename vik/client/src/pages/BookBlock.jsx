// pages/BookBlock.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { stadiumBlocks } from '../assets/stadiumBlocks';

const BookBlock = () => {
  const { blockId } = useParams();
  const block = stadiumBlocks.find(b => b.id === blockId);

  if (!block) {
    return <div className="p-4">Block not found</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Booking: {block.name}</h1>
      <p className="mb-2">Price: ₹{block.price}</p>
      <p className="mb-2">Available Seats: {block.seats.length}</p>
      <div className="h-40 overflow-y-auto border rounded p-2 mb-4">
        <p className="text-sm text-gray-700 mb-1 font-semibold">Seats:</p>
        <div className="text-xs text-gray-600 flex flex-wrap gap-1">
          {block.seats.map((seat) => (
            <span key={seat} className="bg-gray-100 px-2 py-1 rounded">
              {seat}
            </span>
          ))}
        </div>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Confirm Booking
      </button>
    </div>
  );
};

export default BookBlock;

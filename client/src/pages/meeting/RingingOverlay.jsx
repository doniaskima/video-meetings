import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function RingingOverlay({ ringingUser, handleAccept, handleDecline }) {
  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  });

  function handleEscape(e) {
    if (e.key === 'Esc' || e.key === 'Escape') {
      handleDecline();
    }
  }

  const username = ringingUser?.identity || 'new user';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-10">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="bg-gray-900 rounded-full p-12 sm:p-20 shadow-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="w-24 h-24 sm:w-32 sm:h-32 fill-current text-white"
          >
            <path d="M17.256 12.253c-.096-.667-.611-1.187-1.274-1.342-2.577-.604-3.223-2.088-3.332-3.734C12.193 7.092 11.38 7 10 7s-2.193.092-2.65.177c-.109 1.646-.755 3.13-3.332 3.734-.663.156-1.178.675-1.274 1.342l-.497 3.442C2.072 16.907 2.962 18 4.2 18h11.6c1.237 0 2.128-1.093 1.953-2.305l-.497-3.442zM10 15.492c-1.395 0-2.526-1.12-2.526-2.5s1.131-2.5 2.526-2.5 2.526 1.12 2.526 2.5-1.132 2.5-2.526 2.5zM19.95 6c-.024-1.5-3.842-3.999-9.95-4C3.891 2.001.073 4.5.05 6s.021 3.452 2.535 3.127c2.941-.381 2.76-1.408 2.76-2.876C5.345 5.227 7.737 4.98 10 4.98s4.654.247 4.655 1.271c0 1.468-.181 2.495 2.76 2.876C19.928 9.452 19.973 7.5 19.95 6z" />
          </svg>
        </div>
        <div className="text-3xl sm:text-4xl text-white mt-2">{username}</div>
        <div className="text-lg sm:text-xl text-white flex items-end">
          wants to join the room
        </div>
        <div className="mt-8 w-full max-w-sm mx-auto flex justify-around">
          <div>
            <button
              onClick={handleDecline}
              type="button"
              className="p-3 rounded-full bg-red-500 shadow-2xl focus:outline-none focus:shadow-outline z-20"
            >
              <svg
                viewBox="0 0 20 20"
                className="w-10 h-10 sm:w-12 sm:h-12 fill-current text-white"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                <path d="M16.707 3.293a1 1 0 010 1.414L15.414 6l1.293 1.293a1 1 0 01-1.414 1.414L14 7.414l-1.293 1.293a1 1 0 11-1.414-1.414L12.586 6l-1.293-1.293a1 1 0 011.414-1.414L14 4.586l1.293-1.293a1 1 0 011.414 0z" />
              </svg>
            </button>
            <div className="text-white text-center mt-1">Decline</div>
          </div>
          <div>
            <button
              onClick={handleAccept}
              type="button"
              className="p-3 rounded-full bg-green-500 shadow-2xl focus:outline-none focus:shadow-outline z-20"
            >
              <svg
                viewBox="0 0 20 20"
                className="w-10 h-10 sm:w-12 sm:h-12 fill-current text-white"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <div className="text-white text-center mt-1">Accept</div>
          </div>
        </div>
      </div>
    </div>
  );
}

RingingOverlay.propTypes = {
  ringingUser: PropTypes.object,
  handleAccept: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
};

export default RingingOverlay;
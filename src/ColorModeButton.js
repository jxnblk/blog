import * as React from 'react';

export default function ColorModeButton () {
  return (
    <button
      id='color-button'
      className='colormode ml1'>
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C22.3431 0 20.7255 0.167893 19.1632 0.487595C10.8718 2.18425 4.13795 8.15644 1.36564 16C0.481233 18.5022 0 21.1949 0 24C0 37.2548 10.7452 48 24 48ZM42 24C42 33.9411 33.9411 42 24 42V6C33.9411 6 42 14.0589 42 24Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};

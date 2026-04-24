// import React from "react";

// const GlobalLoader = () => {
//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f4f4f4]">
//       <div className="relative w-28 h-28 flex items-center justify-center">
        
//         <svg
//           viewBox="0 0 100 100"
//           className="w-full h-full spin"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {/* Orbit 1 */}
//           <path
//             className="orbit orbit1"
//             d="M50 15 C30 25, 30 75, 50 85 C70 75, 70 25, 50 15"
//           />

//           {/* Orbit 2 */}
//           <path
//             className="orbit orbit2"
//             d="M20 50 Q50 30 80 50 Q50 70 20 50"
//           />

//           {/* Orbit 3 */}
//           <path
//             className="orbit orbit3"
//             d="M30 25 Q50 50 70 75 Q50 65 30 25"
//           />
//         </svg>

//         {/* Center Glow Dot */}
//         <div className="absolute w-2.5 h-2.5 bg-red-700 rounded-full pulse-dot"></div>
//       </div>

//       <style>
//         {`
//           .orbit {
//             fill: none;
//             stroke: #b71c1c;
//             stroke-width: 2.5;
//             stroke-linecap: round;

//             stroke-dasharray: 140;
//             stroke-dashoffset: 140;

//             animation: flow 1.2s linear infinite;
//             filter: drop-shadow(0 0 4px rgba(183, 28, 28, 0.4));
//           }

//           .orbit1 { animation-delay: 0s; }
//           .orbit2 { animation-delay: 0.2s; }
//           .orbit3 { animation-delay: 0.4s; }

//           @keyframes flow {
//             0% {
//               stroke-dashoffset: 140;
//               opacity: 0.2;
//             }
//             50% {
//               opacity: 1;
//             }
//             100% {
//               stroke-dashoffset: -140;
//               opacity: 0.2;
//             }
//           }

//           .spin {
//             animation: rotate 2s linear infinite;
//             transform-origin: center;
//           }

//           @keyframes rotate {
//             100% {
//               transform: rotate(360deg);
//             }
//           }

//           .pulse-dot {
//             animation: pulse 1.5s ease-in-out infinite;
//           }

//           @keyframes pulse {
//             0%, 100% {
//               transform: scale(1);
//               opacity: 0.7;
//             }
//             50% {
//               transform: scale(1.6);
//               opacity: 1;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default GlobalLoader;
import React from "react";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <style>
        {`
          .loading {
            --speed-of-animation: 0.9s;
            --gap: 6px;
            /* Using the exact Red from your NSDL theme */
            --brand-red: #8B0000; 
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            gap: var(--gap);
            height: 100px;
          }

          .loading span {
            width: 5px;
            height: 50px;
            background: var(--brand-red);
            border-radius: 2px;
            animation: scale var(--speed-of-animation) ease-in-out infinite;
          }

          /* Staggered Opacity for a smoother wave effect */
          .loading span:nth-child(1) { opacity: 1;   animation-delay: 0s; }
          .loading span:nth-child(2) { opacity: 0.8; animation-delay: -0.8s; }
          .loading span:nth-child(3) { opacity: 0.6; animation-delay: -0.7s; }
          .loading span:nth-child(4) { opacity: 0.4; animation-delay: -0.6s; }
          .loading span:nth-child(5) { opacity: 0.2; animation-delay: -0.5s; }

          @keyframes scale {
            0%, 40%, 100% {
              transform: scaleY(0.1);
            }
            20% {
              transform: scaleY(1.2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default GlobalLoader;
import { keyframes } from 'styled-components';
export const cloudyAnimation = keyframes `
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
export const floatAnimation = keyframes `
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
export const fadeIn = keyframes `
  from { opacity: 0; }
  to { opacity: 1; }
`;

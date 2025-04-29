import styled from "styled-components";
import { motion } from "framer-motion";

const EnhancedDashboardContainer = styled.div`
  width: 150%; /* Increased by 50% */
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const MobileDashboard = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1rem;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  }
`;

const AnimatedBackground = styled.div`
  background: linear-gradient(
    -45deg,
    #ee7752,
    #e73c7e,
    #23a6d5,
    #23d5ab
  );
  background-size: 400% 400%;
  animation: ${cloudyAnimation} 15s ease infinite;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  opacity: 0.1;
`;

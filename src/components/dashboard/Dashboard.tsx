
import styled from "styled-components";
import { motion } from "framer-motion";
import { cloudyAnimation } from "@/styles/animations";

export const EnhancedDashboardContainer = styled.div`
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

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const MobileDashboard = styled(motion.div)`
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

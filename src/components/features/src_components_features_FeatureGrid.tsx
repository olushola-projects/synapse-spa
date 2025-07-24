import { motion } from "framer-motion";
import styled from "styled-components";
// cloudyAnimation import removed - not used in this component

const FeatureContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const EnhancedFeatureBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  
  /* Reduced size by approximately 50% */
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  /* Enhanced visibility */
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.secondary};
`;

// Reduced feature set (removed duplicates)
export const features = [
  {
    title: "AI-Powered Analysis",
    description: "Intelligent regulatory insights and automated compliance tasks",
    icon: "MessageSquare"
  },
  {
    title: "Professional Network",
    description: "Connect with global GRC professionals and experts",
    icon: "Users"
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time compliance monitoring and reporting",
    icon: "BarChart3"
  }
];

export const FeatureGrid = () => {
  return (
    <FeatureContainer>
      {features.map((feature, index) => (
        <EnhancedFeatureBox
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <FeatureIcon>{feature.icon}</FeatureIcon>
          <FeatureTitle>{feature.title}</FeatureTitle>
          <FeatureDescription>{feature.description}</FeatureDescription>
        </EnhancedFeatureBox>
      ))}
    </FeatureContainer>
  );
};
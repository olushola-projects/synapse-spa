import { motion } from 'framer-motion';
import { SFDRGem } from '@/components/sfdr-gem/SFDRGem';

const SFDRGemPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SFDRGem />
    </motion.div>
  );
};

export default SFDRGemPage;

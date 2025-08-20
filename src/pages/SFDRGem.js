import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { SFDRGem } from '@/components/sfdr-gem/SFDRGem';
const SFDRGemPage = () => {
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 }, children: _jsx(SFDRGem, {}) }));
};
export default SFDRGemPage;

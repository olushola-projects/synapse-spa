import { motion } from 'framer-motion';
export const AnimatedBackground = () => {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden'>
      {/* Main diagonal gradient background */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50'
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 1.5
        }}
      />

      {/* Animated diagonal stripes - Stripe-inspired */}
      <motion.div
        className='absolute -inset-[100%] rotate-[-35deg]'
        initial={{
          opacity: 0,
          x: '-10%'
        }}
        animate={{
          opacity: 1,
          x: '0%'
        }}
        transition={{
          duration: 2
        }}
      >
        {/* Stripe 1 */}
        <motion.div
          className='h-[20vh] w-[200%] bg-gradient-to-r from-indigo-100/40 to-purple-100/40 mb-[15vh] blur-xl'
          animate={{
            x: [0, 50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Stripe 2 */}
        <motion.div
          className='h-[10vh] w-[200%] bg-gradient-to-r from-blue-100/30 to-indigo-100/30 mb-[25vh] blur-lg'
          animate={{
            x: [50, 0, 50]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Stripe 3 */}
        <motion.div
          className='h-[15vh] w-[200%] bg-gradient-to-r from-purple-100/20 to-blue-100/20 blur-xl'
          animate={{
            x: [0, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>

      {/* Diagonal stripes for header - fixed position */}

      {/* Diagonal stripes for footer - fixed position */}
    </div>
  );
};

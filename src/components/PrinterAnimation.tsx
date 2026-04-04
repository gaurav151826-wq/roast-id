import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface PrinterAnimationProps {
  show: boolean;
  children: ReactNode;
}

export default function PrinterAnimation({ show, children }: PrinterAnimationProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Printer body */}
      <div className="printer-slot w-[420px] h-[40px] rounded-t-lg relative z-20 flex items-center justify-center">
        <div className="w-[360px] h-[4px] bg-black/40 rounded-full" />
      </div>

      {/* Receipt comes out */}
      <div className="relative z-10 overflow-hidden" style={{ maxHeight: show ? '2000px' : '0px' }}>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ y: -600, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 40,
                damping: 15,
                mass: 1.2,
                duration: 1.5,
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

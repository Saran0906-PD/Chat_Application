import { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import MinionEyes from "./MinionEyes";

const AuthImagePattern = ({ title, subtitle, eyesClosed }) => {
  const rightPanelRef = useRef(null);

  return (
    <div
      ref={rightPanelRef}
      className="hidden lg:flex items-center justify-center bg-base-200 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8"
      >
        <MinionEyes
          containerRef={rightPanelRef}
          eyesClosed={eyesClosed}
        />

        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthImagePattern;

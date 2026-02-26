// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const MinionEyes = ({ containerRef, eyesClosed }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 15 });

  useEffect(() => {
    if (eyesClosed) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }

    const container = containerRef?.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseX.set(x / 25);
      mouseY.set(y / 25);
    };

    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, eyesClosed]);

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      {/* face */}
      <circle cx="110" cy="110" r="90" fill="#FDE68A" />


      {/* goggles */}
      <circle cx="75" cy="100" r="30" fill="#e5e7eb" stroke="#374151" strokeWidth="6" />
      <circle cx="145" cy="100" r="30" fill="#e5e7eb" stroke="#374151" strokeWidth="6" />

      {/* OPEN EYES */}
      {!eyesClosed && (
        <>
          <motion.circle
            cx="75"
            cy="100"
            r="10"
            fill="#111827"
            style={{ x: smoothX, y: smoothY }}
          />
          <motion.circle
            cx="145"
            cy="100"
            r="10"
            fill="#111827"
            style={{ x: smoothX, y: smoothY }}
          />
        </>
      )}

      {/* CLOSED EYES */}
      {eyesClosed && (
        <>
          <line x1="60" y1="100" x2="90" y2="100" stroke="#111827" strokeWidth="4" />
          <line x1="130" y1="100" x2="160" y2="100" stroke="#111827" strokeWidth="4" />
        </>
      )}

      {/* smile */}
      <path
        d="M80 145 Q110 165 140 145"
        stroke="#111827"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MinionEyes;

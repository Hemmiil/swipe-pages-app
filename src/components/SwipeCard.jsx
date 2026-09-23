import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SwipeCard({ image, onSwipe, active, depth }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const unlikeOpacity = useTransform(x, [-120, -20], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (!active) return;
    const threshold = 110;
    if (info.offset.x > threshold) onSwipe("like");
    else if (info.offset.x < -threshold) onSwipe("unlike");
  };

  return (
    <motion.div
      className="card"
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        scale: 1 - depth * 0.035,
        y: depth * 10,
        zIndex: 10 - depth,
      }}
    >
      <img src={image.src} alt={`card ${image.id}`} draggable="false" />
      {/* ログテーブルの fileName 列と突き合わせるためのファイル名表示 */}
      <span className="card-filename">{image.name}</span>
      {active && (
        <>
          <motion.div className="badge badge-like" style={{ opacity: likeOpacity }}>LIKE</motion.div>
          <motion.div className="badge badge-unlike" style={{ opacity: unlikeOpacity }}>NOPE</motion.div>
        </>
      )}
    </motion.div>
  );
}

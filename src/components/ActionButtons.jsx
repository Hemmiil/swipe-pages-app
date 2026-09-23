export default function ActionButtons({ onUnlike, onLike }) {
  return (
    <div className="actions">
      <button className="action-button" onClick={onUnlike} aria-label="Unlike">×</button>
      <button className="action-button" onClick={onLike} aria-label="Like">♡</button>
    </div>
  );
}

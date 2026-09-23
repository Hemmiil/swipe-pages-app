import SwipeCard from "./SwipeCard";

export default function CardStack({ images, index, onSwipe }) {
  const visible = images.slice(index, index + 3).reverse();
  return (
    <div className="card-stack">
      {visible.map((image, reversedIndex) => {
        const isTop = reversedIndex === visible.length - 1;
        const depth = visible.length - 1 - reversedIndex;
        return (
          <SwipeCard
            key={image.id}
            image={image}
            onSwipe={onSwipe}
            active={isTop}
            depth={depth}
          />
        );
      })}
    </div>
  );
}

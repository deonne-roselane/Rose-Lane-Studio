import styles from "./GridOverlay.module.css";

export default function GridOverlay() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.columns}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={[
                styles.column,
                i >= 4 && i < 8 && styles.columnHiddenSm,
                i >= 8 && styles.columnHiddenLg,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

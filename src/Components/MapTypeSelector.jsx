import styles from "../Css Modules/MapTypeSelector.module.css";

export default function MapTypeSelector({ onMapTypeChange, currentMapType }) {
  const mapTypes = [
    { id: "street", name: "Street", icon: "🗺️" },
    { id: "satellite", name: "Satellite", icon: "🌍" },
    { id: "hybrid", name: "Hybrid", icon: "🛰️" },
    { id: "terrain", name: "Terrain", icon: "🏔️" },
  ];

  return (
    <div className={styles.mapTypeSelector}>
      <h3>Map View</h3>
      <div className={styles.buttonGroup}>
        {mapTypes.map((type) => (
          <button
            key={type.id}
            className={`${styles.mapTypeButton} ${
              currentMapType === type.id ? styles.active : ""
            }`}
            onClick={() => onMapTypeChange(type.id)}
          >
            <span className={styles.icon}>{type.icon}</span>
            <span className={styles.name}>{type.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

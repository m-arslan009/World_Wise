import Styles from "../Css Modules/Empty.module.css";

export default function Empty() {
  return (
    <div className={Styles.emptyCities}>
      <span className={Styles.emptyCitiesIcon}>⚠️</span>Add Location by clicking
      on a Map
    </div>
  );
}

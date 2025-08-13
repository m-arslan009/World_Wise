export default function Error({ error }) {
  return (
    <div className="error_container">
      <span className="error_icon">❌</span>Error: {error}
    </div>
  );
}

export default function InputComponent({ label, value, error, width = 'full', ...restProps }) {
  return (
    <div className={`input-wrapper ${width}`}>
      <label>{label}</label>
      <input value={value} {...restProps} />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

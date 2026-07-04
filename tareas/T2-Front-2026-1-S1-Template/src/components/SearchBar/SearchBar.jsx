import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  ariaLabel,
  className = "",
  inputClassName = "",
}) {
  const rootClassName = ["search-bar", className].filter(Boolean).join(" ");
  const fieldClassName = ["search-bar-input", inputClassName]
    .filter(Boolean)
    .join(" ");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form className={rootClassName} role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClassName}
        aria-label={ariaLabel}
      />
      <button type="submit" className="search-bar-button-icon" aria-label="Buscar">
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
}

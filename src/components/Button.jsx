// Mirrors the Figma "Button" component: Style = primary | outline | text. Hover, focus and disabled states live in index.css (.btn*).
// The label is uppercased by the .btn class, so write it in normal case.
export default function Button({ variant = 'primary', className = '', type = 'button', children, ...rest }) {
  return (
    <button type={type} className={`btn btn--${variant}${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </button>
  );
}

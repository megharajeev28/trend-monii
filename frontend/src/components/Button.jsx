const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

export default function Button({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  return (
    <button className={`${VARIANTS[variant]} ${className}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

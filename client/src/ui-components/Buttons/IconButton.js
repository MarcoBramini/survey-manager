import "./Button.css";

function IconButton(props) {
  const getClassNameFromVariant = () => {
    switch (props.variant) {
      case "danger":
        return "btn-danger";
      case "primary":
      default:
        return "btn-primary";
    }
  };

  return (
    <props.icon
      size={props.size || "30"}
      role='button'
      disabled={props.disabled}
      className={`icon-button font-weight-light rounded-circle p-1 ${getClassNameFromVariant()} ${
        props.className || ""
      }`}
      onClick={!props.disabled ? props.onClick : null}>
      {props.children}
    </props.icon>
  );
}

export default IconButton;

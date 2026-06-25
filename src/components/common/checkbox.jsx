import React from "react";
import { Form } from "react-bootstrap";

const CommonCheckbox = ({
  label,
  id,
  checked,
  onChange,
  className = "",
  disabled = false,
  required = false,
  error = "",
  style = {},
  ...props
}) => {
  return (
    <Form.Group
      className={`custom-control custom-checkbox custom-control-inline form-group ${className}`}
      style={style}
    >
      <Form.Check.Input
        className="cursor-pointer"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        isInvalid={!!error}
        {...props}
      />{" "}
      {label && (
        <Form.Check.Label htmlFor={id} className="user-select-none cursor-pointer">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Check.Label>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </Form.Group>
  );
};

export default CommonCheckbox;

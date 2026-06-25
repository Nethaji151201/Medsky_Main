import React from "react";
import { Form } from "react-bootstrap";

const CommonTextField = ({
  label,
  id,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  width = "100%",
  height = "36px",
  error,
  required,
  disabled,
  style = {},
  ...props
}) => {
  const containerStyle = width ? { width, ...style } : style;
  const inputStyle = height ? { height } : {};

  return (
    <Form.Group className={`form-group cust-form-input ${className}`} style={containerStyle}>
      {label && (
        <Form.Label htmlFor={id} className="mb-0">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        id={id}
        type={type}
        className="my-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={inputStyle}
        isInvalid={!!error}
        {...props}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default CommonTextField;

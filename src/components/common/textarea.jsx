import React, { useRef, useEffect } from "react";
import { Form } from "react-bootstrap";

const CommonTextArea = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  className = "",
  width = "100%",
  rows = 1,
  error,
  required,
  disabled,
  style = {},
  ...props
}) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 32)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e) => {
    adjustHeight();
    if (onChange) {
      onChange(e);
    }
  };

  const containerStyle = width ? { width, ...style } : style;

  return (
    <Form.Group className={`form-group cust-form-input ${className}`} style={containerStyle}>
      {label && (
        <Form.Label htmlFor={id} className="mb-0">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        ref={textareaRef}
        as="textarea"
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        isInvalid={!!error}
        style={{
          minHeight: "32px",
          resize: "none",
          overflowY: "hidden",
          ...style
        }}
        {...props}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default CommonTextArea;

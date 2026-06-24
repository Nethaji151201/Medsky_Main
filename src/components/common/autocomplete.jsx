import React, { useState, useRef, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import CommonTextField from "./textfield";

const CommonAutocomplete = ({
  label,
  id,
  placeholder,
  options = [], // Can be array of strings or objects: { label: '...', value: '...' }
  value = "",
  onChange, // Callback when an option is selected: (value, option) => {}
  onInputChange, // Callback when text input changes
  className = "",
  width = "100%",
  height = "42px",
  error,
  required,
  disabled,
  getOptionLabel = (option) => (typeof option === "object" ? option.label : option),
  getOptionValue = (option) => (typeof option === "object" ? option.value : option),
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Scroll highlighted item into view automatically
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Find currently selected option based on value prop
  const selectedOption = options.find(
    (opt) => String(getOptionValue(opt)) === String(value)
  );
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : "";

  // Sync internal input value with selected option or value changes
  useEffect(() => {
    const matched = options.find(
      (opt) => String(getOptionValue(opt)) === String(value)
    );
    if (matched) {
      setInputValue(getOptionLabel(matched));
    } else {
      setInputValue(value !== undefined && value !== null ? String(value) : "");
    }
  }, [value, options]);

  // Keep refs of volatile variables to keep event listeners static and clean
  const selectedOptionRef = useRef(selectedOption);
  const getOptionLabelRef = useRef(getOptionLabel);

  useEffect(() => {
    selectedOptionRef.current = selectedOption;
    getOptionLabelRef.current = getOptionLabel;
  }, [selectedOption, getOptionLabel]);

  // Handle clicking outside to dismiss dropdown list and reset input if needed
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);

        const currentSelected = selectedOptionRef.current;
        const currentGetLabel = getOptionLabelRef.current;
        if (currentSelected) {
          setInputValue(currentGetLabel(currentSelected));
        } else {
          setInputValue("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options list matching typed query.
  // If the input value matches the label of the currently selected option, show all options (like MUI)
  const filteredOptions =
    inputValue === selectedLabel || !inputValue
      ? options
      : options.filter((option) => {
        const text = String(getOptionLabel(option) || "").toLowerCase();
        const search = String(inputValue || "").toLowerCase();
        return text.includes(search);
      });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    setHighlightedIndex(0);
    if (onInputChange) {
      onInputChange(e);
    }
  };

  const handleSelectOption = (option) => {
    const optionLabel = getOptionLabel(option);
    const optionValue = getOptionValue(option);
    setInputValue(optionLabel);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(optionValue, option);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleFocus = (e) => {
    setIsOpen(true);
    e.target.select(); // Highlight entire text for easy editing like MUI
  };

  return (
    <div
      ref={containerRef}
      className={`position-relative ${className}`}
      style={{ width }}
    >
      <CommonTextField
        label={label}
        id={id}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        error={error}
        required={required}
        disabled={disabled}
        height={height}
        width={width}
        autoComplete="off"
        {...props}
      />

      {isOpen && filteredOptions.length > 0 && (
        <ListGroup
          ref={listRef}
          className="position-absolute shadow rounded-2 overflow-auto bg-body"
          style={{
            zIndex: 1050,
            maxHeight: "220px",
            top: "100%",
            left: 0,
            marginTop: "-6px",
            border: "1px solid var(--bs-border-color)",
            minWidth: "100%",
            width: "max-content",
            maxWidth: "100vw",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          {filteredOptions.map((option, idx) => {
            const isHighlighted = idx === highlightedIndex;
            const isSelected =
              selectedOption &&
              String(getOptionValue(option)) === String(getOptionValue(selectedOption));

            return (
              <ListGroup.Item
                key={idx}
                action
                active={isHighlighted}
                onClick={() => handleSelectOption(option)}
                className={`py-2 px-3 border-0 text-start d-flex justify-content-between align-items-center ${isHighlighted
                  ? "bg-primary text-white"
                  : isSelected
                    ? "bg-primary-subtle text-primary fw-semibold"
                    : "bg-body text-body"
                  }`}
                style={{ cursor: "pointer", transition: "all 0.15s ease" }}
              >
                <span>{getOptionLabel(option)}</span>
                {isSelected && (
                  <i
                    className={`ri-check-line ${isHighlighted ? "text-white" : "text-primary"
                      }`}
                  ></i>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      {isOpen && filteredOptions.length === 0 && (
        <ListGroup
          className="position-absolute shadow rounded-2 bg-body"
          style={{
            zIndex: 1050,
            top: "100%",
            left: 0,
            marginTop: "-6px",
            border: "1px solid var(--bs-border-color)",
            minWidth: "100%",
            width: "max-content",
            maxWidth: "100vw",
            display: "inline-flex",
            flexDirection: "column",
          }}
        >
          <ListGroup.Item className="py-2 px-3 text-muted text-start bg-body border-0">
            No options found
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
};

export default CommonAutocomplete;

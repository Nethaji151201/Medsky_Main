import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ListGroup } from "react-bootstrap";
import CommonTextField from "./textfield";

const CommonAutocomplete = ({
  label,
  id,
  placeholder,
  options = [], // Can be array of strings or objects: { label: '...', value: '...' }
  value = "",
  onChange, // Callback when an option is selected: (value, option) => {}
  onChangeJson, // Callback when an option is selected: (jsonString) => {}
  onInputChange, // Callback when text input changes
  className = "",
  width = "100%",
  height = "32px",
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
  const [listStyle, setListStyle] = useState({ display: "none" });
  const containerRef = useRef(null);
  const listRef = useRef(null);



  useEffect(() => {
    if (!isOpen) {
      setListStyle({ display: "none" });
    }
  }, [isOpen]);

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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        (!listRef.current || !listRef.current.contains(event.target))
      ) {
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

  // Dynamically calculate style and position relative to the viewport/document to render in Portal
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const minSpaceNeeded = 230;
        const openUp = spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow;

        const left = rect.left + window.scrollX;
        const width = rect.width;

        if (openUp) {
          setListStyle({
            position: "absolute",
            left: `${left}px`,
            top: `${rect.top + window.scrollY - 6}px`,
            transform: "translateY(-100%)",
            width: `${width}px`,
            zIndex: 9999,
            display: "block"
          });
        } else {
          setListStyle({
            position: "absolute",
            left: `${left}px`,
            top: `${rect.bottom + window.scrollY + 6}px`,
            transform: "none",
            width: `${width}px`,
            zIndex: 9999,
            display: "block"
          });
        }
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, filteredOptions.length]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);
    setHighlightedIndex(0);
    if (onInputChange) {
      onInputChange(e);
    }
    if (val.trim() === "") {
      if (onChange) {
        onChange(null, null);
      }
      if (onChangeJson) {
        onChangeJson(null);
      }
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
    if (onChangeJson) {
      onChangeJson(JSON.stringify(option));
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
      className={`position-relative autocomplete-container ${isOpen ? "autocomplete-open" : "autocomplete-closed"} ${className}`}
      style={{ width }}
    >
      <style>{`
        .autocomplete-container .form-control {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 14px 10px !important;
          padding-right: 2.25rem !important;
          transition: background-image 0.15s ease-in-out !important;
        }
        [data-bs-theme="dark"] .autocomplete-container .form-control {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cccccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
        }
        .autocomplete-container.autocomplete-open .form-control {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 11 6-6 6 6'/%3e%3c/svg%3e") !important;
        }
        [data-bs-theme="dark"] .autocomplete-container.autocomplete-open .form-control {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cccccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 11 6-6 6 6'/%3e%3c/svg%3e") !important;
        }
      `}</style>
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

      {isOpen && filteredOptions.length > 0 && createPortal(
        <div className="autocomplete-container" style={{ position: "absolute", ...listStyle }}>
          <ListGroup
            ref={listRef}
            className="shadow rounded-2 bg-body"
            style={{
              maxHeight: "220px",
              border: "1px solid var(--bs-border-color)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "4px 12px 4px 4px",
              width: "100%"
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
        </div>,
        document.body
      )}

      {isOpen && filteredOptions.length === 0 && createPortal(
        <div className="autocomplete-container" style={{ position: "absolute", ...listStyle }}>
          <ListGroup
            ref={listRef}
            className="shadow rounded-2 bg-body"
            style={{
              border: "1px solid var(--bs-border-color)",
              display: "flex",
              flexDirection: "column",
              overflowX: "hidden",
              width: "100%"
            }}
          >
            <ListGroup.Item className="py-2 px-3 text-muted text-start bg-body border-0">
              No options found
            </ListGroup.Item>
          </ListGroup>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CommonAutocomplete;

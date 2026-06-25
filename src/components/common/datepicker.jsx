import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Form } from "react-bootstrap";

const CommonDatePicker = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  className = "",
  width = "100%",
  height = "32px",
  error,
  required,
  disabled,
  minDate,
  maxDate,
  options = {},
  style = {},
  ...props
}) => {
  const containerStyle = width ? { width, ...style } : style;
  const inputStyle = height ? { height } : {};

  return (
    <Form.Group className={`form-group cust-form-input position-relative mb-3 ${className}`} style={containerStyle}>
      {label && (
        <Form.Label htmlFor={id} className="mb-0">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <div className={`position-relative d-flex align-items-center datepicker-container `}>
        <Flatpickr
          id={id}
          value={value}
          onChange={(selectedDates) => {
            if (onChange) {
              onChange(selectedDates[0] || null);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          options={{
            dateFormat: "d-m-Y",
            allowInput: true,
            changeMonth: true,
            changeYear: true,
            static: false,
            minDate,
            maxDate,
            parseDate: (datestr) => {
              if (!datestr) return null;
              const cleanStr = datestr.trim();

              // 1. Try to match YYYY-MM-DD or YYYY/MM/DD format
              if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanStr)) {
                const parts = cleanStr.split(/[-/]/);
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
              }

              // 2. Try to match DD-MM-YYYY or DD/MM/YYYY format
              if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanStr)) {
                const parts = cleanStr.split(/[-/]/);
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) return date;
              }

              // Fallback
              const parsed = new Date(cleanStr);
              if (!isNaN(parsed.getTime())) return parsed;
              return null;
            },
            ...options
          }}
          className={`form-control date-picker-input w-100 ${error ? "is-invalid" : ""}`}
          style={inputStyle}
          {...props}
        />
        <span className="position-absolute end-0 me-3 text-primary calendar-icon-wrapper d-flex align-items-center">
          <i className="ri-calendar-line fs-5 calendar-icon-anim"></i>
        </span>
      </div>
      {error && <div className="invalid-feedback d-block mt-1">{error}</div>}

      {/* Scoped fancy CSS micro-animations */}
      <style>{`
        .datepicker-container {
          transition: transform 0.2s ease;
          width: 100% !important;
        }
        .datepicker-container .flatpickr-wrapper {
          width: 100% !important;
          flex-grow: 1 !important;
        }
        .datepicker-container:focus-within {
          transform: translateY(-2px);
        }
        .date-picker-input {
          padding-right: 40px !important;
          transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
        }
        .date-picker-input:focus {
          border-color: var(--bs-primary) !important;
          box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.18) !important;
        }
        .calendar-icon-wrapper {
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .datepicker-container:focus-within .calendar-icon-wrapper {
          transform: scale(1.15) rotate(-10deg);
          color: var(--bs-primary) !important;
        }
        /* Custom styled Flatpickr calendar dropdown popup */
        .flatpickr-calendar {
          z-index: 999999 !important;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 8px 15px -8px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          background-color: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(8px) !important;
          animation: fpFadeInDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        [data-bs-theme="dark"] .flatpickr-calendar {
          background-color: rgba(26, 30, 41, 0.98) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
        }
        @keyframes fpFadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* Flatpickr month and day cells */
        .flatpickr-months {
          background-color: transparent !important;
        }
        .flatpickr-current-month span.cur-month {
          font-weight: 600 !important;
        }
        .flatpickr-day {
          border-radius: 6px !important;
          transition: all 0.15s ease !important;
        }
        .flatpickr-day:hover {
          background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
          color: var(--bs-primary) !important;
          transform: scale(1.08);
        }
        .flatpickr-calendar .flatpickr-day.selected,
        .flatpickr-calendar .flatpickr-day.selected:hover,
        .flatpickr-calendar .flatpickr-day.selected:focus,
        .flatpickr-calendar .flatpickr-day.selected.prevMonthDay,
        .flatpickr-calendar .flatpickr-day.selected.nextMonthDay {
          background-color: var(--bs-primary) !important;
          border-color: var(--bs-primary) !important;
          color: #ffffff !important;
          transform: scale(1.05) !important;
          font-weight: 600 !important;
        }
        .flatpickr-day.today {
          border-color: var(--bs-primary) !important;
          color: var(--bs-primary) !important;
          font-weight: 600 !important;
        }
        .flatpickr-day.today:hover {
          background-color: var(--bs-primary) !important;
          color: #ffffff !important;
        }
      `}</style>
    </Form.Group>
  );
};

export default CommonDatePicker;

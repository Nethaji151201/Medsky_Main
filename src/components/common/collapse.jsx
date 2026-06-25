import React, { useState } from "react";
import { Collapse, Button } from "react-bootstrap";

const CommonCollapse = ({
  title,
  children,
  defaultOpen = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  titleIcon,
  rightActions,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded mb-4 common-collapse ${className}`}>
      {/* Header */}
      <div
        className={`d-flex justify-content-between align-items-center p-3 cursor-pointer select-none ${headerClassName}`}
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center gap-2">
          {titleIcon && <span className="text-primary fs-5 d-flex align-items-center">{titleIcon}</span>}
          <h6 className="mb-0 text-primary fw-semibold d-flex align-items-center gap-2">
            {title}
          </h6>
        </div>
        <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {rightActions}
          <Button
            variant="link"
            size="sm"
            className="text-decoration-none text-muted p-0 ms-2 d-flex align-items-center"
            onClick={() => setOpen(!open)}
            aria-controls="collapse-content"
            aria-expanded={open}
          >
            <i className={`ri-arrow-${open ? "up" : "down"}-s-line fs-5`}></i>
          </Button>
        </div>
      </div>

      {/* Collapsible Content */}
      <Collapse in={open}>
        <div id="collapse-content">
          <div className={`p-3 border-top ${bodyClassName}`}>
            {children}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CommonCollapse;

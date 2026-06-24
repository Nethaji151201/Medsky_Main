import React from "react";
import { Modal } from "react-bootstrap";

const CommonDialog = ({
  open = false,
  onClose,
  title = 'Dialog',
  children,
  maxWidth,
  fullWidth,
  persistent = false, // Locks dialog; shakes on outside click / ESC when true
  titleIcon = null,   // Lucide-react icon element shown beside title
  fullScreen = false,
  footer = null
}) => {
  // Map maxWidth to Bootstrap sizes
  let size = undefined;
  if (maxWidth === 'xs' || maxWidth === 'sm') {
    size = 'sm';
  } else if (maxWidth === 'lg') {
    size = 'lg';
  } else if (maxWidth === 'xl') {
    size = 'xl';
  }

  return (
    <Modal
      centered
      show={open}
      onHide={onClose}
      backdrop={persistent ? "static" : true}
      keyboard={!persistent}
      size={size}
      fullscreen={fullScreen}
      dialogClassName={fullWidth ? "mw-100 w-100 px-3" : ""}
      className="ps-0"
    >
      <Modal.Header closeButton={!!onClose}>
        <Modal.Title as="h5" className="d-flex align-items-center gap-2">
          {titleIcon && <span className="d-inline-flex align-items-center text-primary">{titleIcon}</span>}
          <span>{title}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export default CommonDialog;
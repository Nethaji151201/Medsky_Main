import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import CommonTextField from "../../components/common/textfield";
import CommonAutocomplete from "../../components/common/autocomplete";
import CommonCheckbox from "../../components/common/checkbox";

const specialityOptions = [
  "Cardiology",
  "Pediatrics",
  "Gynecology",
  "General Medicine",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "ENT",
  "Oncology",
  "Ophthalmology"
];

const doctorNoteTypeOptions = [
  "OPD Note",
  "Prescription Only",
  "General Note",
  "Emergency Note"
];

const AddDoctor = ({ clickedRow, onClose, onSave }) => {
  // Form States
  const [doctorName, setDoctorName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [regNo, setRegNo] = useState("");
  const [tokenPrefix, setTokenPrefix] = useState("");
  const [degree, setDegree] = useState("");
  const [availableTiming, setAvailableTiming] = useState("");
  const [emailId, setEmailId] = useState("");
  const [personalNo, setPersonalNo] = useState("");
  const [officialNo, setOfficialNo] = useState("");
  const [doctorNoteType, setDoctorNoteType] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Validation Errors
  const [formErrors, setFormErrors] = useState({});

  // Populate data if editing
  useEffect(() => {
    if (clickedRow) {
      setDoctorName(clickedRow.docterName || "");
      setSpeciality(clickedRow.specality || "");
      setRegNo(clickedRow.regNo || "");
      setTokenPrefix(clickedRow.tokenPrefix || "");
      setDegree(clickedRow.degree || "");
      setAvailableTiming(clickedRow.availableTiming || "");
      setEmailId(clickedRow.emailId || "");
      setPersonalNo(clickedRow.personalNo || "");
      setOfficialNo(clickedRow.officialNo || "");
      setDoctorNoteType(clickedRow.docterNoteType || "");
      setIsActive(clickedRow.status === 1);
    } else {
      setDoctorName("");
      setSpeciality("");
      setRegNo("");
      setTokenPrefix("");
      setDegree("");
      setAvailableTiming("");
      setEmailId("");
      setPersonalNo("");
      setOfficialNo("");
      setDoctorNoteType("");
      setIsActive(true);
    }
    setFormErrors({});
  }, [clickedRow]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!doctorName.trim()) {
      errors.doctorName = "Doctor Name is required";
    }
    if (!speciality) {
      errors.speciality = "Speciality is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const savedDoctor = {
      id: clickedRow ? clickedRow.id : Date.now(),
      docterName: doctorName,
      specality: speciality,
      regNo: regNo,
      tokenPrefix: tokenPrefix,
      degree: degree,
      availableTiming: availableTiming,
      emailId: emailId,
      personalNo: personalNo,
      officialNo: officialNo,
      docterNoteType: doctorNoteType,
      status: isActive ? 1 : 0
    };

    if (onSave) {
      onSave(savedDoctor);
    }
  };

  return (
    <Form onSubmit={handleSubmit} id="doctor-registration-form" className="px-1 py-1" noValidate>
      <Row>
        {/* Doctor Name */}
        <Col md="6">
          <CommonTextField
            label="Doctor Name"
            id="doctorName"
            placeholder="Enter Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
            error={formErrors.doctorName}
            className="mb-0"
          />
        </Col>

        {/* Speciality */}
        <Col md="6">
          <CommonAutocomplete
            label="Speciality"
            id="speciality"
            placeholder="Select Speciality"
            options={specialityOptions}
            value={speciality}
            onChange={(val) => setSpeciality(val)}
            required
            error={formErrors.speciality}
            className="mb-0 autocomplete-select-input"
          />
        </Col>

        {/* Reg No */}
        <Col md="6">
          <CommonTextField
            label="Reg No"
            id="regNo"
            placeholder="Enter Registration Number"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Token Prefix */}
        <Col md="6">
          <CommonTextField
            label="Token Prefix"
            id="tokenPrefix"
            placeholder="Enter Token Prefix"
            value={tokenPrefix}
            onChange={(e) => setTokenPrefix(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Degree */}
        <Col md="6">
          <CommonTextField
            label="Degree"
            id="degree"
            placeholder="Enter Degree Details"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Available Timing */}
        <Col md="6">
          <CommonTextField
            label="Available Timing"
            id="availableTiming"
            placeholder="e.g. 10:00 AM - 01:00 PM"
            value={availableTiming}
            onChange={(e) => setAvailableTiming(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Email ID */}
        <Col md="6">
          <CommonTextField
            label="Email ID"
            id="emailId"
            type="email"
            placeholder="Enter Email ID"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Personal No */}
        <Col md="6">
          <CommonTextField
            label="Personal No"
            id="personalNo"
            placeholder="Enter Personal Number"
            value={personalNo}
            onChange={(e) => setPersonalNo(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Official No */}
        <Col md="6">
          <CommonTextField
            label="Official No"
            id="officialNo"
            placeholder="Enter Official Number"
            value={officialNo}
            onChange={(e) => setOfficialNo(e.target.value)}
            className="mb-0"
          />
        </Col>

        {/* Doctor Note Type */}
        <Col md="6">
          <CommonAutocomplete
            label="Doctor Note Type"
            id="doctorNoteType"
            placeholder="Select Doctor Note Type"
            options={doctorNoteTypeOptions}
            value={doctorNoteType}
            onChange={(val) => setDoctorNoteType(val)}
            className="mb-0 autocomplete-select-input"
          />
        </Col>

        {/* Active Status */}
        <Col md="12" className="mt-3">
          <CommonCheckbox
            label="Active"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mb-0"
          />
        </Col>
      </Row>

      {/* Custom Scoped CSS Styles to match project design, z-index and spacing constraints */}
      <style>{`
        .cust-form-input .form-control,
        .cust-form-input .form-select,
        .cust-form-input .input-group {
          margin-top: 4px !important;
          margin-bottom: 4px !important;
        }
        .cust-form-input label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--bs-body-color);
        }
        .autocomplete-select-input input {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 14px 10px !important;
          padding-right: 2.25rem !important;
        }
        [data-bs-theme="dark"] .autocomplete-select-input input {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cccccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
        }
      `}</style>
    </Form>
  );
};

export default AddDoctor;
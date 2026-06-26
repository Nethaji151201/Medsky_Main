import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";

const AddReferrerOrg = ({
    referrerData,
    onSuccess,
    onDelete,
    onClose,
}) => {
    const [orgName, setOrgName] = useState("");
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (referrerData) {
            setOrgName(referrerData.orgName || "");
        } else {
            setOrgName("");
        }
        setFormErrors({});
    }, [referrerData]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};

        if (!orgName.trim()) {
            errors.orgName = "Referrer Name is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: referrerData ? referrerData.id : Date.now(),
            name: orgName,
        };

        onSuccess(record);
    };

    const handleDelete = () => {
        if (referrerData && onDelete) {
            onDelete(referrerData.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="org-form" noValidate className="p-1">
            <Row className="g-2">
                {/* Referrer Name */}
                <Col md={6} className="d-flex align-items-center gap-2">
                    <label htmlFor="referrerNameInput">Organisation</label>
                    <CommonTextField
                        id="referrerNameInput"
                        placeholder="Enter organisation name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        error={formErrors.orgName}
                        required
                        className="mb-0"
                    />
                </Col>
            </Row>

            {/* Action Buttons (Mimicking the user mockup but with modern style) */}
            {/* <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                {referrerData && (
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="px-4"
                        style={{ minWidth: "120px", height: "38px" }}
                    >
                        <i className="ri-delete-bin-line me-1"></i> Delete
                    </Button>
                )}
                <Button
                    variant="outline-secondary"
                    onClick={onClose}
                    className="px-4"
                    style={{ minWidth: "120px", height: "38px" }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    className="px-4"
                    style={{ minWidth: "120px", height: "38px" }}
                >
                    <i className="ri-save-line me-1"></i> Save
                </Button>
            </div> */}
        </form>
    );
};

export default AddReferrerOrg;
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";

const AddSpeciality = ({
    referrerData,
    onSuccess,
}) => {
    const [speciality, setSpeciality] = useState("");
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (referrerData) {
            setSpeciality(referrerData.specialityName || "");
        } else {
            setSpeciality("");
        }
        setFormErrors({});
    }, [referrerData]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};

        if (!speciality.trim()) {
            errors.speciality = "Speciality Name is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: referrerData ? referrerData.id : Date.now(),
            specialityName: speciality,
        };

        onSuccess(record);
    };

    return (
        <form onSubmit={handleSubmit} id="speciality-form" noValidate className="p-1">
            <Row className="g-2">
                <Col md={12}>
                    <CommonTextField
                        label="Speciality Name"
                        id="specialityNameInput"
                        placeholder="Enter speciality name"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        error={formErrors.speciality}
                        required
                        className="mb-0"
                    />
                </Col>
            </Row>
        </form>
    );
};

export default AddSpeciality;
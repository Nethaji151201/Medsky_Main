import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonAutocomplete from "../../../components/common/autocomplete";

const typeOptions = [
    { label: "TPA", value: "TPA" },
    { label: "Insurance Company", value: "Insurance Company" },
    { label: "Both", value: "Both" },
];

const AddInsuranceCompany = ({
    insuranceData,
    onSuccess,
}) => {
    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [fax, setFax] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (insuranceData) {
            setCompanyName(insuranceData.companyName || "");
            setCompanyType(insuranceData.companyType || "");
            setPhone(insuranceData.phone || "");
            setEmail(insuranceData.email || "");
            setFax(insuranceData.fax || "");
            setStatus(insuranceData.status !== undefined ? insuranceData.status : 1);
        } else {
            setCompanyName("");
            setCompanyType("");
            setPhone("");
            setEmail("");
            setFax("");
            setStatus(1);
        }
        setFormErrors({});
    }, [insuranceData]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};

        if (!companyName.trim()) {
            errors.companyName = "Insurance Company/TPA Name is required";
        }
        if (!companyType) {
            errors.companyType = "Type is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: insuranceData ? insuranceData.id : Date.now(),
            companyName,
            companyType,
            phone,
            email,
            fax,
            status,
        };

        onSuccess(record);
    };

    return (
        <form onSubmit={handleSubmit} id="insurance-form" noValidate className="p-1">
            <Row className="g-2">
                {/* Company/TPA Name */}
                <Col md={6}>
                    <CommonTextField
                        label="Insurance Company / TPA Name"
                        id="companyNameInput"
                        placeholder="Enter name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        error={formErrors.companyName}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Company Type */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="Type"
                        id="companyTypeSelect"
                        placeholder="Select Type"
                        options={typeOptions}
                        value={companyType}
                        onChange={(val) => setCompanyType(val || "")}
                        error={formErrors.companyType}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Phone No */}
                <Col md={6}>
                    <CommonTextField
                        label="Phone No"
                        id="phoneInput"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Email ID */}
                <Col md={6}>
                    <CommonTextField
                        label="Email ID"
                        id="emailInput"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Fax No */}
                <Col md={6}>
                    <CommonTextField
                        label="Fax No"
                        id="faxInput"
                        placeholder="Enter fax number"
                        value={fax}
                        onChange={(e) => setFax(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Active Status */}
                <Col md={12}>
                    <CommonCheckbox
                        label="Active"
                        id="insuranceStatusInput"
                        checked={status === 1}
                        onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                        className="mt-2"
                    />
                </Col>
            </Row>
        </form>
    );
};

export default AddInsuranceCompany;
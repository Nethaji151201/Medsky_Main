import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonAutocomplete from "../../../components/common/autocomplete";

const cityOptions = [
    { label: "Chennai", value: "Chennai" },
    { label: "Bangalore", value: "Bangalore" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Gurgaon", value: "Gurgaon" },
    { label: "Hosur", value: "Hosur" },
];

const AddCorporateMaster = ({
    corporateData,
    onSuccess,
}) => {
    const [corporateName, setCorporateName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [fax, setFax] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (corporateData) {
            setCorporateName(corporateData.corporateName || "");
            setAddress(corporateData.address || "");
            setCity(corporateData.city || "");
            setPincode(corporateData.pincode || "");
            setPhone(corporateData.phone || "");
            setEmail(corporateData.email || "");
            setFax(corporateData.fax || "");
            setStatus(corporateData.status !== undefined ? corporateData.status : 1);
        } else {
            setCorporateName("");
            setAddress("");
            setCity("");
            setPincode("");
            setPhone("");
            setEmail("");
            setFax("");
            setStatus(1);
        }
        setFormErrors({});
    }, [corporateData]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};

        if (!corporateName.trim()) {
            errors.corporateName = "Corporate Name is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: corporateData ? corporateData.id : Date.now(),
            corporateName,
            address,
            city,
            pincode,
            phone,
            email,
            fax,
            status,
        };

        onSuccess(record);
    };

    return (
        <form onSubmit={handleSubmit} id="corporate-form" noValidate className="p-1">
            <Row className="g-2">
                {/* Corporate Name */}
                <Col md={6}>
                    <CommonTextField
                        label="Corporate Name"
                        id="corporateNameInput"
                        placeholder="Enter corporate name"
                        value={corporateName}
                        onChange={(e) => setCorporateName(e.target.value)}
                        error={formErrors.corporateName}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* City */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="City"
                        id="citySelect"
                        placeholder="Select City"
                        options={cityOptions}
                        value={city}
                        onChange={(val) => setCity(val || "")}
                        className="mb-0"
                    />
                </Col>

                {/* Address Text Area */}
                <Col md={12}>
                    <CommonTextField
                        label="Address"
                        id="addressInput"
                        placeholder="Enter corporate address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        as="textarea"
                        height="auto"
                        rows={3}
                        className="mb-0"
                    />
                </Col>

                {/* Pincode */}
                <Col md={6}>
                    <CommonTextField
                        label="Pincode"
                        id="pincodeInput"
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
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

                {/* Email */}
                <Col md={6}>
                    <CommonTextField
                        label="Email"
                        id="emailInput"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* FAX */}
                <Col md={6}>
                    <CommonTextField
                        label="FAX"
                        id="faxInput"
                        placeholder="Enter FAX number"
                        value={fax}
                        onChange={(e) => setFax(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Active Status */}
                <Col md={12}>
                    <CommonCheckbox
                        label="Active"
                        id="corporateStatusInput"
                        checked={status === 1}
                        onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                        className="mt-2"
                    />
                </Col>
            </Row>
        </form>
    );
};

export default AddCorporateMaster;
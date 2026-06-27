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
];

const AddReferrerPro = ({
    referrerData,
    onSuccess,
}) => {
    const [name, setName] = useState("");
    const [pincode, setPincode] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [emailId, setEmailId] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (referrerData) {
            setName(referrerData.proName || "");
            setPincode(referrerData.speciality || "");
            setAddress(referrerData.address || "");
            setCity(referrerData.city || ""); // Mapping city to city
            setEmailId(referrerData.emailId || "");
            setMobileNo(referrerData.mobileNo || "");
            setStatus(referrerData.status !== undefined ? referrerData.status : 1);
        } else {
            setName("");
            setPincode("");
            setAddress("");
            setCity("");
            setEmailId("");
            setMobileNo("");
            setStatus(1);
        }
        setFormErrors({});
    }, [referrerData]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};

        if (!name.trim()) {
            errors.name = "Referrer Name is required";
        }
        if (!pincode) {
            errors.pincode = "Pincode is required";
        }
        if (!city) {
            errors.city = "City is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: referrerData ? referrerData.id : Date.now(),
            name,
            pincode,
            address,
            area,
            city, // Mapping city to city for the list
            emailId,
            mobileNo,
            tariff,
            status,
        };

        onSuccess(record);
    };



    return (
        <form onSubmit={handleSubmit} id="pro-form" noValidate className="p-1">
            <Row className="g-2">
                {/* Referrer Name */}
                <Col md={6}>
                    <CommonTextField
                        label="PRO Name"
                        id="referrerNameInput"
                        placeholder="Enter referrer name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={formErrors.name}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Address 1 */}
                <Col md={6}>
                    <CommonTextField
                        label="Address"
                        id="addressInput"
                        placeholder="Enter address line 1"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* city */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="City"
                        id="citySelect"
                        placeholder="Select City"
                        options={cityOptions}
                        value={city}
                        onChange={(val) => setCity(val || "")}
                        error={formErrors.city}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Speciality */}
                <Col md={6}>
                    <CommonTextField
                        label="Pincode"
                        id="pincodeInput"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        error={formErrors.pincode}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Email ID */}
                <Col md={6}>
                    <CommonTextField
                        label="Email ID"
                        id="emailInput"
                        placeholder="Enter email address"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Mobile No */}
                <Col md={6}>
                    <CommonTextField
                        label="Mobile No"
                        id="mobileInput"
                        placeholder="Enter mobile number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Active Status */}
                <Col md={12}>
                    <CommonCheckbox
                        label="Active"
                        id="referrerStatusInput"
                        checked={status === 1}
                        onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                        className="mt-2"
                    />
                </Col>
            </Row>

        </form>
    );
};

export default AddReferrerPro;
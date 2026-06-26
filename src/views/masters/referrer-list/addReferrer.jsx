import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonAutocomplete from "../../../components/common/autocomplete";

// Options lists matching standard master data
const specialityOptions = [
    { label: "Cardiology", value: "Cardiology" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "General Medicine", value: "General Medicine" },
    { label: "Dermatology", value: "Dermatology" },
    { label: "Gynecology", value: "Gynecology" },
];

const areaOptions = [
    { label: "T. Nagar", value: "T. Nagar" },
    { label: "Adyar", value: "Adyar" },
    { label: "Indiranagar", value: "Indiranagar" },
    { label: "Koramangala", value: "Koramangala" },
    { label: "Andheri", value: "Andheri" },
];

const districtOptions = [
    { label: "Chennai", value: "Chennai" },
    { label: "Bangalore", value: "Bangalore" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Hyderabad", value: "Hyderabad" },
];

const proNameOptions = [
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "David Miller", value: "David Miller" },
];

const tariffOptions = [
    { label: "Standard Tariff", value: "Standard Tariff" },
    { label: "Premium Tariff", value: "Premium Tariff" },
    { label: "Corporate Tariff", value: "Corporate Tariff" },
];

const AddReferrer = ({
    referrerData,
    onSuccess,
}) => {
    const [name, setName] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [orgName, setOrgName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [area, setArea] = useState("");
    const [district, setDistrict] = useState("");
    const [emailId, setEmailId] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [proName, setProName] = useState("");
    const [tariff, setTariff] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (referrerData) {
            setName(referrerData.name || "");
            setSpeciality(referrerData.speciality || "");
            setOrgName(referrerData.orgName || "");
            setAddress1(referrerData.address1 || "");
            setAddress2(referrerData.address2 || "");
            setArea(referrerData.area || "");
            setDistrict(referrerData.city || ""); // Mapping city to district
            setEmailId(referrerData.emailId || "");
            setMobileNo(referrerData.mobileNo || "");
            setPhoneNo(referrerData.phoneNo || "");
            setProName(referrerData.proName || "");
            setTariff(referrerData.tariff || "");
            setStatus(referrerData.status !== undefined ? referrerData.status : 1);
        } else {
            setName("");
            setSpeciality("");
            setOrgName("");
            setAddress1("");
            setAddress2("");
            setArea("");
            setDistrict("");
            setEmailId("");
            setMobileNo("");
            setPhoneNo("");
            setProName("");
            setTariff("");
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
        if (!speciality) {
            errors.speciality = "Speciality is required";
        }
        if (!orgName.trim()) {
            errors.orgName = "Org Name is required";
        }
        if (!area) {
            errors.area = "Area is required";
        }
        if (!district) {
            errors.district = "District is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: referrerData ? referrerData.id : Date.now(),
            name,
            speciality,
            orgName,
            address1,
            address2,
            area,
            city: district, // Mapping district to city for the list
            emailId,
            mobileNo,
            phoneNo,
            proName,
            tariff,
            status,
        };

        onSuccess(record);
    };



    return (
        <form onSubmit={handleSubmit} id="referrer-form" noValidate className="p-1">
            <Row className="g-2">
                {/* Referrer Name */}
                <Col md={6}>
                    <CommonTextField
                        label="Referrer Name"
                        id="referrerNameInput"
                        placeholder="Enter referrer name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={formErrors.name}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Speciality */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="Speciality"
                        id="specialitySelect"
                        placeholder="Select Speciality"
                        options={specialityOptions}
                        value={speciality}
                        onChange={(val) => setSpeciality(val || "")}
                        error={formErrors.speciality}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* Org Name */}
                <Col md={6}>
                    <CommonTextField
                        label="Org Name"
                        id="orgNameInput"
                        placeholder="Enter organization name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        error={formErrors.orgName}
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

                {/* Phone No */}
                <Col md={6}>
                    <CommonTextField
                        label="Phone No"
                        id="phoneInput"
                        placeholder="Enter phone number"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Address 1 */}
                <Col md={6}>
                    <CommonTextField
                        label="Address 1"
                        id="address1Input"
                        placeholder="Enter address line 1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Address 2 */}
                <Col md={6}>
                    <CommonTextField
                        label="Address 2"
                        id="address2Input"
                        placeholder="Enter address line 2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="mb-0"
                    />
                </Col>

                {/* Area */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="Area"
                        id="areaSelect"
                        placeholder="Select Area"
                        options={areaOptions}
                        value={area}
                        onChange={(val) => setArea(val || "")}
                        error={formErrors.area}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* District */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="District"
                        id="districtSelect"
                        placeholder="Select District"
                        options={districtOptions}
                        value={district}
                        onChange={(val) => setDistrict(val || "")}
                        error={formErrors.district}
                        required
                        className="mb-0"
                    />
                </Col>

                {/* PRO Name */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="PRO Name"
                        id="proSelect"
                        placeholder="Select PRO Name"
                        options={proNameOptions}
                        value={proName}
                        onChange={(val) => setProName(val || "")}
                        className="mb-0"
                    />
                </Col>

                {/* Referrer Tariff */}
                <Col md={6}>
                    <CommonAutocomplete
                        label="Referrer Tariff"
                        id="tariffSelect"
                        placeholder="Select Tariff"
                        options={tariffOptions}
                        value={tariff}
                        onChange={(val) => setTariff(val || "")}
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

export default AddReferrer;
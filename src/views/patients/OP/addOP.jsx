import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonDatePicker from "../../../components/common/datepicker";
import CommonAutocomplete from "../../../components/common/autocomplete";
import CommonDialog from "../../../components/common/dialog";
import CommonTextArea from "../../../components/common/textarea";

// Dummy datasets for address autocompletes
const countryOptions = ["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates"];
const stateOptions = ["Tamil Nadu", "Karnataka", "Maharashtra", "Delhi", "Kerala", "Telangana", "New York", "California", "Oregon"];
const cityOptions = ["Chennai", "Coimbatore", "Bengaluru", "Mumbai", "Pune", "Hyderabad", "New York City", "Portland", "Hillsboro"];
const areaOptions = ["Adyar", "Anna Nagar", "T. Nagar", "Velachery", "Mylapore", "Nungambakkam", "Downtown", "Hillsboro", "Beaverton"];

// New autocomplete datasets for OP list fields
const referrerOptions = ["Self", "Dr. Ramesh Kumar", "Dr. Priya Sharma", "Dr. Amit Patel", "Dr. Sneha Reddy"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const knownThroughOptions = ["Direct", "Friend", "Doctor Referral", "Online Search", "Social Media", "Advertisement"];
const paymentTypeOptions = ["CASH", "CARD", "UPI", "INSURANCE", "NET BANKING"];
const insuranceCompanyOptions = ["None", "Star Health", "HDFC Ergo", "ICICI Lombard", "Niva Bupa", "Care Health", "LIC Insurance"];
const remarksOptions = ["Routine Checkup", "Follow-up", "Consultation", "Emergency", "VIP Patient"];


const AddOP = ({ clickedRow, onClose, onSave }) => {
    // Form States
    const [uhidPrefix, setUhidPrefix] = useState("UHID");
    const [uhidNumber, setUhidNumber] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [patientTitle, setPatientTitle] = useState("Mr.");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [regDate, setRegDate] = useState(new Date());
    const [dob, setDob] = useState(null);
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [guardianRelationship, setGuardianRelationship] = useState("Father");
    const [guardianName, setGuardianName] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [religion, setReligion] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [landlineNumber, setLandlineNumber] = useState("");
    const [email, setEmail] = useState("");
    const [referrer, setReferrer] = useState("");
    const [bloodGrp, setBloodGrp] = useState("001");
    const [knownThrough, setKnownThrough] = useState("");
    const [paymentType, setPaymentType] = useState("CASH");
    const [insurenceCompany, setInsurenceCompany] = useState("");
    const [remarks, setRemarks] = useState("");

    // ABHA States
    const [abhaMode, setAbhaMode] = useState("Mobile");
    const [abhaValue, setAbhaValue] = useState("");

    // Address States
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("India");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [pincode, setPincode] = useState("");
    const [aadhaar, setAadhaar] = useState("");

    const [abhaAddress, setAbhaAddress] = useState("");
    const [abhaNumber, setAbhaNumber] = useState("")

    // Validation Errors (Using formErrors to match user's requested style)
    const [formErrors, setFormErrors] = useState({});

    // Token and Photo States & Refs
    const [tokenNo, setTokenNo] = useState(clickedRow ? (clickedRow.token || "15") : "15");
    const [photo, setPhoto] = useState(clickedRow ? (clickedRow.photo || null) : null);
    const [showCameraModal, setShowCameraModal] = useState(false);

    const fileInputRef = React.useRef(null);
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    // Populate data if editing
    useEffect(() => {
        if (clickedRow) {
            // UHID parsing
            let prefix = "UHID";
            let num = clickedRow.uhid || "";
            if (num.startsWith("UHID-")) {
                prefix = "UHID";
                num = num.substring(5);
            } else if (num.startsWith("EMR-")) {
                prefix = "EMR";
                num = num.substring(4);
            } else if (num.startsWith("OPD-")) {
                prefix = "OPD";
                num = num.substring(4);
            }
            setUhidPrefix(prefix);
            setUhidNumber(num);

            setDoctorName(clickedRow.doctorName || "Dr. Ramesh Kumar");

            // Patient Name title & First/Last name parsing
            let title = "Mr.";
            let fullName = clickedRow.patientName || "";
            const prefixParts = fullName.split(" ");
            let nameWithoutPrefix = fullName;
            if (["Mr.", "Mrs.", "Ms.", "Dr."].includes(prefixParts[0])) {
                title = prefixParts[0];
                nameWithoutPrefix = prefixParts.slice(1).join(" ");
            }
            setPatientTitle(title);

            const nameParts = nameWithoutPrefix.trim().split(" ");
            if (nameParts.length > 1) {
                setFirstName(nameParts[0]);
                setLastName(nameParts.slice(1).join(" "));
            } else {
                setFirstName(nameWithoutPrefix);
                setLastName("");
            }

            setRegDate(clickedRow.regDate ? new Date(clickedRow.regDate) : new Date());
            setAge(clickedRow.age || "");

            if (clickedRow.dob) {
                setDob(new Date(clickedRow.dob));
            } else if (clickedRow.age) {
                const today = new Date();
                const birthYear = today.getFullYear() - parseInt(clickedRow.age, 10);
                setDob(new Date(birthYear, 0, 1));
            } else {
                setDob(null);
            }

            setGender(clickedRow.gender || "");

            // Guardian parsing
            let rShip = "Father";
            let gName = clickedRow.guardianName || "";
            const gSpaceIdx = gName.indexOf(" ");
            if (gSpaceIdx !== -1) {
                const gFirstPart = gName.substring(0, gSpaceIdx);
                if (["Father:", "Mother:", "Spouse:", "Guardian:"].includes(gFirstPart)) {
                    rShip = gFirstPart.replace(":", "");
                    gName = gName.substring(gSpaceIdx + 1);
                }
            }
            setGuardianRelationship(rShip);
            setGuardianName(gName);

            setMaritalStatus(clickedRow.maritalStatus || "Single");
            setReligion(clickedRow.religion || "Hinduism");
            setMobileNumber(clickedRow.mobileNumber || "");
            setLandlineNumber(clickedRow.landlineNumber || "");
            setEmail(clickedRow.email || "");

            // ABHA
            setAbhaMode(clickedRow.abhaMode || "Mobile");
            setAbhaValue(clickedRow.abhaValue || "");

            // Address
            setAddress(clickedRow.address || "");
            setCountry(clickedRow.country || "India");
            setState(clickedRow.state || "New York");
            setCity(clickedRow.city || "New York City");
            setArea(clickedRow.area || "Downtown");
            setPincode(clickedRow.pincode || "10001");
            setAadhaar(clickedRow.aadhaar || "123456789012");

            // Token and Photo
            setTokenNo(clickedRow.token || "15");
            setPhoto(clickedRow.photo || null);
        } else {
            // Default Reset
            setUhidPrefix("UHID");
            setUhidNumber("");
            setDoctorName("");
            setPatientTitle("Mr.");
            setFirstName("");
            setLastName("");
            setRegDate(new Date());
            setDob(null);
            setAge("");
            setGender("");
            setGuardianRelationship("Father");
            setGuardianName("");
            setMaritalStatus("");
            setReligion("");
            setMobileNumber("");
            setLandlineNumber("");
            setEmail("");
            setAbhaMode("Mobile");
            setAbhaValue("");
            setAddress("");
            setCountry("India");
            setState("");
            setCity("");
            setArea("");
            setPincode("");
            setAadhaar("");

            setTokenNo("15");
            setPhoto(null);
        }
        setFormErrors({});
    }, [clickedRow]);

    // DOB to Age Auto-calculation
    const handleDobChange = (date) => {
        setDob(date);
        if (date) {
            const today = new Date();
            const birthDate = new Date(date);
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge >= 0 ? calculatedAge : "");
        } else {
            setAge("");
        }
    };

    // Age to DOB rough calculation
    const handleAgeChange = (e) => {
        const val = e.target.value;
        setAge(val);
        if (val && !isNaN(val)) {
            const today = new Date();
            const birthYear = today.getFullYear() - parseInt(val, 10);
            setDob(new Date(birthYear, 0, 1));
        } else {
            setDob(null);
        }
    };

    // Photo management and HTML5 Webcam capture handlers
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Unable to access camera. Please check permissions.");
            setShowCameraModal(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        if (showCameraModal) {
            setTimeout(startCamera, 100);
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [showCameraModal]);

    const captureSnapshot = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = 320;
            canvas.height = 240;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg");
            setPhoto(dataUrl);
            setShowCameraModal(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ABHA verification and action handlers
    const handleVerifyAbha = () => {
        if (!abhaValue) {
            alert("Please enter the ABHA verification value first.");
            return;
        }
        alert(`Verifying ABHA account linked to ${abhaMode}: ${abhaValue}. OTP has been sent successfully.`);
    };

    const handleOpenSharedList = () => {
        alert("Loading shared patient consent list from national health network...");
    };

    const handleCreateAbha = () => {
        alert("Redirecting to national portal to create a new Ayushman Bharat Health Account...");
    };

    // Form Submission Validation matching user's exact structure
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (!uhidNumber) {
            errors.uhidNumber = "UHID Number is required";
        }
        if (!doctorName) {
            errors.doctorName = "Doctor Name is required";
        }
        if (!firstName.trim()) {
            errors.firstName = "First Name is required";
        }
        if (!gender) {
            errors.gender = "Gender is required";
        }
        if (!mobileNumber) {
            errors.mobileNumber = "Mobile Number is required";
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            errors.mobileNumber = "Mobile Number must be exactly 10 digits";
        }
        if (!address.trim()) {
            errors.address = "Address is required";
        }
        if (!age) {
            errors.age = "age is required";
        }
        if (!area) {
            errors.area = "area is required";
        }
        // if (!city) {
        //     errors.city = "city is required";
        // }
        // if (!state) {
        //     errors.state = "state is required";
        // }
        if (!pincode) {
            errors.pincode = "pincode is required";
        }
        // if (!country) {
        //     errors.country = "country is required";
        // }
        // if (!aadhaar) {
        //     errors.aadhaar = "aadhaar is required";
        // }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Prepare saved patient object
        const savedPatient = {
            token: tokenNo,
            photo,
            uhid: `${uhidPrefix}-${uhidNumber}`,
            doctorName,
            patientName: `${patientTitle} ${firstName} ${lastName}`.trim(),
            regDate: regDate ? regDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            dob: dob ? dob.toISOString().split("T")[0] : null,
            age: age ? parseInt(age, 10) : "",
            gender,
            guardianName: `${guardianRelationship}: ${guardianName}`,
            maritalStatus,
            religion,
            mobileNumber,
            landlineNumber,
            email,
            abhaMode,
            abhaValue,
            address,
            country,
            state,
            city,
            area,
            pincode,
            aadhaar,
            userName: clickedRow ? clickedRow.userName : `patient_${Date.now().toString().slice(-6)}`
        };

        if (onSave) {
            onSave(savedPatient);
        }
    };

    return (
        <Form onSubmit={handleSubmit} id="out-patient-registration-form" className="px-1 py-1" noValidate>
            <Row>
                <Col md="8">

                    <Row className="">
                        <Col md="3">
                            <CommonAutocomplete
                                label="ABHA Verification Mode"
                                id="abhaMode"
                                placeholder="Select Mode"
                                options={["Mobile", "Aadhaar"]}
                                value={abhaMode}
                                onChange={(val) => {
                                    setAbhaMode(val);
                                    setAbhaValue("");
                                }}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        {/* Row 8: ABHA Number/Value Input with Tooltipped Icon Buttons & Address */}
                        <Col md="9">
                            <Form.Group className="cust-form-input">
                                <Form.Label className="mb-0 fw-semibold text-body">
                                    ABHA Verification Value
                                </Form.Label>
                                <div className="split-field-container align-items-start mt-1">
                                    <CommonTextField
                                        id="abhaValue"
                                        placeholder={abhaMode === "Aadhaar" ? "Enter 12-digit Aadhaar" : "Enter 10-digit Mobile"}
                                        value={abhaValue}
                                        onChange={(e) => setAbhaValue(e.target.value.replace(/\D/g, ""))}
                                        className="flex-grow-1 mb-0"
                                    />
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="tooltip-verify">Verify ABHA</Tooltip>}
                                    >
                                        <Button
                                            variant="primary"
                                            className="btn-icon d-flex align-items-center justify-content-center"
                                            style={{ height: "32px", width: "36px", minWidth: "36px" }}
                                            onClick={handleVerifyAbha}
                                        >
                                            <i className="ri-shield-check-line" style={{ fontSize: "1.15rem" }}></i>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="tooltip-shared-list">Shared List</Tooltip>}
                                    >
                                        <Button
                                            variant="primary"
                                            className="btn-icon d-flex align-items-center justify-content-center"
                                            style={{ height: "32px", width: "36px", minWidth: "36px" }}
                                            onClick={handleOpenSharedList}
                                        >
                                            <i className="ri-folder-shared-line" style={{ fontSize: "1.15rem" }}></i>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="tooltip-create-abha">Create New ABHA</Tooltip>}
                                    >
                                        <Button
                                            variant="primary"
                                            className="btn-icon d-flex align-items-center justify-content-center"
                                            style={{ height: "32px", width: "36px", minWidth: "36px" }}
                                            onClick={handleCreateAbha}
                                        >
                                            <i className="ri-user-add-line" style={{ fontSize: "1.15rem" }}></i>
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <CommonTextField
                                label="Abha Address"
                                id="abhaAddress"
                                placeholder="Enter Abha Address"
                                value={abhaAddress}
                                onChange={(e) => setAbhaAddress(e.target.value)}
                                className="mb-0"
                            />
                        </Col>

                        <Col md="6">
                            <CommonTextField
                                label="Abha Number"
                                id="abhaNumber"
                                placeholder="Enter Abha Number"
                                value={abhaNumber}
                                onChange={(e) => setAbhaNumber(e.target.value)}
                                className="mb-0"
                            />
                        </Col>

                        {/* Row 1: UHID & Doctor Name */}
                        <Col md="6">
                            <Form.Group className="cust-form-input">
                                <Form.Label className="mb-0 fw-semibold text-body">
                                    UHID <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="split-field-container mt-1">
                                    <CommonAutocomplete
                                        id="uhidPrefix"
                                        options={["UHID", "EMR", "OPD"]}
                                        value={uhidPrefix}
                                        onChange={(val) => setUhidPrefix(val)}
                                        width="110px"
                                        className="mb-0 autocomplete-select-input"
                                    />
                                    <CommonTextField
                                        id="uhidNumber"
                                        placeholder="Enter UHID Number"
                                        value={uhidNumber}
                                        onChange={(e) => setUhidNumber(e.target.value.replace(/\D/g, ""))}
                                        error={formErrors.uhidNumber}
                                        required
                                        className="flex-grow-1 mb-0"
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Doctor Name"
                                id="doctorName"
                                placeholder="Select Doctor"
                                options={[
                                    { label: "Dr. Ramesh Kumar (Cardiologist)", value: "Dr. Ramesh Kumar" },
                                    { label: "Dr. Priya Sharma (Pediatrician)", value: "Dr. Priya Sharma" },
                                    { label: "Dr. Amit Patel (General Physician)", value: "Dr. Amit Patel" },
                                    { label: "Dr. Sneha Reddy (Gynecologist)", value: "Dr. Sneha Reddy" }
                                ]}
                                value={doctorName}
                                onChange={(val) => setDoctorName(val)}
                                required
                                error={formErrors.doctorName}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        {/* Row 2: First Name & Last Name */}
                        <Col md="6">
                            <Form.Group className="cust-form-input">
                                <Form.Label className="mb-0 fw-semibold text-body">
                                    First Name <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="split-field-container mt-1">
                                    <CommonAutocomplete
                                        id="patientTitle"
                                        options={["Mr.", "Mrs.", "Ms.", "Dr."]}
                                        value={patientTitle}
                                        onChange={(val) => setPatientTitle(val)}
                                        width="110px"
                                        className="mb-0 autocomplete-select-input"
                                    />
                                    <CommonTextField
                                        id="firstName"
                                        placeholder="Enter First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        error={formErrors.firstName}
                                        required
                                        className="flex-grow-1 mb-0"
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <CommonTextField
                                label="Last Name"
                                id="lastName"
                                placeholder="Enter Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mb-0"
                            />
                        </Col>

                        {/* Row 3: Registration Date & Date of Birth & Age */}
                        {/* <Col md="6">
                    <CommonDatePicker
                        label="Registration Date"
                        id="regDate"
                        placeholder="Select Registration Date"
                        value={regDate}
                        onChange={(date) => setRegDate(date)}
                        required
                        className="mb-0"
                    />
                </Col> */}

                        <Col md="6">
                            <Form.Group className="cust-form-input">
                                <Form.Label className="mb-0 fw-semibold text-body">
                                    Date of Birth & Age <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="split-field-container mt-1">
                                    <div style={{ width: "110px" }}>
                                        <CommonTextField
                                            id="age"
                                            placeholder="Age"
                                            type="number"
                                            value={age}
                                            onChange={handleAgeChange}
                                            error={formErrors.age}
                                            className="mb-0"
                                            min="0"
                                            max="120"
                                        />
                                    </div>
                                    <div className="flex-grow-1 position-relative">
                                        <CommonDatePicker
                                            id="dob"
                                            placeholder="Select DOB"
                                            value={dob}
                                            onChange={handleDobChange}
                                            className="mb-0 w-100 position-relative"
                                            style={{ paddingTop: "-10px" }}
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>

                        {/* Row 4: Gender & Guardian Details */}
                        <Col md="6">
                            <CommonAutocomplete
                                label="Gender"
                                id="gender"
                                placeholder="Select Gender"
                                options={["Male", "Female", "Other"]}
                                value={gender}
                                onChange={(val) => setGender(val)}
                                required
                                error={formErrors.gender}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        {/* Row 6: Mobile Number & Landline Number */}
                        <Col md="6">
                            <CommonTextField
                                label="Mobile Number"
                                id="mobileNumber"
                                placeholder="Enter 10-digit mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                                required
                                error={formErrors.mobileNumber}
                                className="mb-0"
                            />
                        </Col>

                        {/* Row 7: Email Address & ABHA Verification Mode */}
                        <Col md="6">
                            <CommonTextField
                                label="Email Address"
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={formErrors.email}
                                className="mb-0"
                            />
                        </Col>

                        <Col md="6">
                            <Form.Group className="cust-form-input">
                                <Form.Label className="mb-0 fw-semibold text-body">
                                    Guardian Details
                                </Form.Label>
                                <div className="split-field-container mt-1">
                                    <CommonAutocomplete
                                        id="guardianRelationship"
                                        options={["Father", "Mother", "Spouse", "Guardian"]}
                                        value={guardianRelationship}
                                        onChange={(val) => setGuardianRelationship(val)}
                                        width="110px"
                                        className="mb-0 autocomplete-select-input"
                                    />
                                    <CommonTextField
                                        id="guardianName"
                                        placeholder="Guardian Name"
                                        value={guardianName}
                                        onChange={(e) => setGuardianName(e.target.value)}
                                        error={formErrors.guardianName}
                                        className="flex-grow-1 mb-0"
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md="6">
                            <CommonTextArea
                                label="Address"
                                id="address"
                                placeholder="Enter full address details"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                error={formErrors.address}
                                className="mb-0"
                                rows={1}
                            />
                        </Col>

                        {/* Row 9: Country (TextField) & State (TextField) */}
                        {/* <Col md="6">
                    <CommonTextField
                        label="Country"
                        id="country"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        error={formErrors.country}
                        className="mb-0"
                    />
                </Col>

                <Col md="6">
                    <CommonTextField
                        label="State"
                        id="state"
                        placeholder="Enter State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        error={formErrors.state}
                        className="mb-0"
                    />
                </Col>

                <Col md="6">
                    <CommonAutocomplete
                        label="City"
                        id="city"
                        placeholder="Select City"
                        options={cityOptions}
                        value={city}
                        onChange={(val) => setCity(val)}
                        required
                        error={formErrors.city}
                        className="mb-0 autocomplete-select-input"
                    />
                </Col> */}

                        <Col md="6">
                            <CommonAutocomplete
                                label="Area"
                                id="area"
                                placeholder="Select Area"
                                options={areaOptions}
                                value={area}
                                onChange={(val) => setArea(val)}
                                required
                                error={formErrors.area}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        {/* Row 11: Pincode & Aadhaar Number */}
                        <Col md="6">
                            <CommonTextField
                                label="Pincode"
                                id="pincode"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                                required
                                error={formErrors.pincode}
                                className="mb-0"
                            />
                        </Col>

                        {/* <Col md="6">
                    <CommonTextField
                        label="Aadhaar Number"
                        id="aadhaar"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                        required
                        error={formErrors.aadhaar}
                        className="mb-0"
                    />
                </Col> */}

                        {/* Row 5: Marital Status & Religion */}
                        <Col md="6">
                            <CommonAutocomplete
                                label="Marital Status"
                                id="maritalStatus"
                                placeholder="Select Marital Status"
                                options={["Single", "Married", "Divorced", "Widowed"]}
                                value={maritalStatus}
                                onChange={(val) => setMaritalStatus(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Religion"
                                id="religion"
                                placeholder="Select Religion"
                                options={["Hinduism", "Islam", "Christianity", "Sikhism", "Buddhism", "Jainism", "Other"]}
                                value={religion}
                                onChange={(val) => setReligion(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Referrer"
                                id="referrer"
                                placeholder="Select Referrer"
                                options={referrerOptions}
                                value={referrer}
                                onChange={(val) => setReferrer(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Blood Group"
                                id="bloodGrp"
                                placeholder="Select Blood Group"
                                options={bloodGroupOptions}
                                value={bloodGrp}
                                onChange={(val) => setBloodGrp(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Known Through"
                                id="knownThrough"
                                placeholder="Select Known Through"
                                options={knownThroughOptions}
                                value={knownThrough}
                                onChange={(val) => setKnownThrough(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Payment Type"
                                id="paymentType"
                                placeholder="Select Payment Type"
                                options={paymentTypeOptions}
                                value={paymentType}
                                onChange={(val) => setPaymentType(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonAutocomplete
                                label="Insurance Company"
                                id="insuranceCompany"
                                placeholder="Select Insurance Company"
                                options={insuranceCompanyOptions}
                                value={insurenceCompany}
                                onChange={(val) => setInsurenceCompany(val)}
                                className="mb-0 autocomplete-select-input"
                            />
                        </Col>

                        <Col md="6">
                            <CommonTextArea
                                label="Remarks"
                                id="remarks"
                                placeholder="Enter Remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="mb-0"
                                rows={1}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md="4" className="d-flex flex-column align-items-center gap-3 mt-2">
                    {/* Token Number Card */}
                    <div className="d-flex flex-column align-items-center w-100" style={{ maxWidth: "280px" }}>
                        <span className="text-center fw-bold fs-6 mb-1 text-primary">Token No</span>
                        <div className="border rounded p-2 bg-body d-flex justify-content-center align-items-center w-100" style={{ minHeight: "120px" }}>
                            <span className="fw-extrabold text-primary" style={{ fontSize: "3.5rem", fontWeight: 800 }}>{tokenNo}</span>
                        </div>
                    </div>

                    {/* Photo Capture Card */}
                    <div className="border rounded p-3 bg-body d-flex flex-column justify-content-center align-items-center w-100 mt-2" style={{ maxWidth: "280px" }}>
                        <div
                            className="d-flex justify-content-center align-items-center rounded-circle overflow-hidden border border-2 border-white shadow-sm position-relative cursor-pointer"
                            style={{ width: "160px", height: "160px", backgroundColor: "#dbe4ee" }}
                            onClick={triggerFileSelect}
                        >
                            {photo ? (
                                <img src={photo} alt="Patient Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <i className="ri-user-fill" style={{ fontSize: "4.5rem", color: "#7992b4" }}></i>
                            )}
                        </div>
                        <div className="d-flex gap-2 justify-content-center align-items-center flex-wrap mt-3 w-100">
                            <Button
                                variant="outline-primary"
                                className="px-3 btn-sm fw-semibold"
                                onClick={triggerFileSelect}
                            >
                                Select
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="px-3 btn-sm fw-semibold"
                                onClick={removePhoto}
                            >
                                Remove
                            </Button>
                            <Button
                                variant="outline-primary"
                                className="px-3 btn-sm fw-semibold"
                                onClick={() => setShowCameraModal(true)}
                            >
                                Capture Image
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Webcam Live Capture Dialog */}
            <CommonDialog
                open={showCameraModal}
                onClose={() => setShowCameraModal(false)}
                title="Capture Patient Photo"
                maxWidth="400px"
                titleIcon={<i className="ri-camera-line fs-4 text-white"></i>}
                footer={
                    <div className="d-flex justify-content-end gap-2 w-100">
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowCameraModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={captureSnapshot}
                        >
                            <i className="ri-camera-switch-line me-1"></i> Capture
                        </Button>
                    </div>
                }
            >
                <div className="d-flex flex-column align-items-center p-3">
                    <div className="position-relative border rounded-3 overflow-hidden bg-dark" style={{ width: "320px", height: "240px" }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{ width: "320px", height: "240px", objectFit: "cover" }}
                        />
                        <div className="position-absolute top-50 start-50 translate-middle pointer-events-none text-white opacity-25">
                            <i className="ri-user-fill" style={{ fontSize: "6rem" }}></i>
                        </div>
                    </div>
                    <span className="text-muted small mt-2">Center the patient's face in the camera frame and click Capture.</span>
                </div>
            </CommonDialog>

            {/* Custom Scoped CSS Styles to perfectly align split elements, compact margins and solve z-index issues */}
            <style>{`
                /* Reduce extra padding and gutter spaces */
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
                
                /* Perfect alignment for side-by-side elements in split columns */
                .split-field-container {
                    display: flex;
                    gap: 8px;
                    align-items: stretch;
                }
                .split-field-container > div {
                    margin: 0 !important;
                }
                .split-field-container .form-group {
                    margin: 0 !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                .split-field-container .form-control {
                    margin: 0 !important;
                }
                
                /* Premium Chevron Down arrow overlay icon on all CommonAutocomplete inputs */
                .autocomplete-select-input input {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                    background-repeat: no-repeat !important;
                    background-position: right 0.75rem center !important;
                    background-size: 14px 10px !important;
                    padding-right: 2.25rem !important;
                }
                
                /* Dark mode adjustment for dropdown arrow icon */
                [data-bs-theme="dark"] .autocomplete-select-input input {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cccccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
                }

                /* Z-INDEX OVERLAPPING SOLUTIONS */
                /* Force active column/row to float above to avoid datepicker being covered by lower elements */
                .row > .col-md-6 {
                    position: relative;
                }
                .row > .col-md-6:focus-within {
                    z-index: 1050 !important;
                }
                .datepicker-container {
                    position: relative;
                    z-index: 1;
                }
                .datepicker-container:focus-within {
                    z-index: 1050 !important;
                }
                /* Ensure Flatpickr calendar popup stays completely on top */
                .flatpickr-calendar {
                    z-index: 999999 !important;
                    opacity: 1 !important;
                }
                /* Ensure autocomplete dropdown list stays on top of inputs */
                .position-relative .list-group {
                    z-index: 1060 !important;
                }
            `}</style>
        </Form>
    );
};

export default AddOP;
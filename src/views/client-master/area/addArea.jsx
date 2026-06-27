import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonAutocomplete from "../../../components/common/autocomplete";

const ClientAddArea = ({
    areaData,
    cities = [],
    onSuccess,
    onClose,
}) => {
    const [areaName, setAreaName] = useState("");
    const [cityName, setCityName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [pincode, setPincode] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive
    const [formErrors, setFormErrors] = useState({});

    // Map cities list to options expected by CommonAutocomplete
    const cityOptions = cities.map(c => ({
        label: c.cityName,
        value: c.cityName
    }));

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!areaName.trim()) {
            errors.areaName = "Area Name is required";
        }
        if (!cityName) {
            errors.cityName = "City selection is required";
        }
        if (!pincode.trim()) {
            errors.pincode = "Pincode is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: areaData ? areaData.id : Date.now(),
            areaName: areaName,
            cityName: cityName,
            sortOrder: parseInt(sortOrder),
            status: status,
        };

        onSuccess(record);
    };

    useEffect(() => {
        if (areaData) {
            setAreaName(areaData.areaName || "");
            setCityName(areaData.cityName || "");
            setPincode(areaData.pincode || "");
            setSortOrder(areaData.sortOrder !== undefined ? areaData.sortOrder : "");
            setStatus(areaData.status !== undefined ? areaData.status : 1);
        } else {
            setAreaName("");
            setCityName("");
            setPincode("");
            setSortOrder("");
            setStatus(1);
        }
        setFormErrors({});
    }, [areaData]);

    return (
        <form onSubmit={handleSubmit} id="area-form" noValidate>
            <div className="d-flex flex-column gap-1">
                <CommonTextField
                    label="Area Name"
                    id="areaNameInput"
                    placeholder="e.g. T. Nagar"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    error={formErrors.areaName}
                    required
                />

                <CommonAutocomplete
                    label="City"
                    id="citySelectInput"
                    placeholder="Select City"
                    options={cityOptions}
                    value={cityName}
                    onChange={(val) => setCityName(val)}
                    error={formErrors.cityName}
                    required
                    className="mb-0"
                />

                <CommonTextField
                    label="Pincode"
                    id="pincodeInput"
                    placeholder="e.g. 600001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    error={formErrors.pincode}
                    required
                />

                <CommonCheckbox
                    label="Active Status"
                    id="statusCheckbox"
                    checked={status === 1}
                    onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                />
            </div>
        </form>
    );
};

export default ClientAddArea;
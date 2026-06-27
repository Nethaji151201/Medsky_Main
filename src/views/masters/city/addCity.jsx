import React, { useEffect, useState } from "react";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonAutocomplete from "../../../components/common/autocomplete";

const stateOptions = [
    { value: 1, label: "Tamil Nadu" },
    { value: 2, label: "Karnataka" },
    { value: 3, label: "Maharashtra" },
    { value: 4, label: "Telangana" }
];

const AddCity = ({
    cityData,
    onSuccess,
    onClose,
}) => {
    const [cityName, setCityName] = useState("");
    const [stateName, setStateName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!cityName.trim()) {
            errors.cityName = "City Name is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: cityData ? cityData.id : Date.now(),
            cityName: cityName,
            stateName: stateName,
            sortOrder: parseInt(sortOrder),
            status: status,
        };

        onSuccess(record);
    };

    useEffect(() => {
        if (cityData) {
            setCityName(cityData.cityName || "");
            setSortOrder(cityData.sortOrder !== undefined ? cityData.sortOrder : "");
            setStatus(cityData.status !== undefined ? cityData.status : 1);
        } else {
            setCityName("");
            setSortOrder("");
            setStatus(1);
        }
        setFormErrors({});
    }, [cityData]);

    return (
        <form onSubmit={handleSubmit} id="city-form" noValidate>
            <div className="d-flex flex-column gap-1">
                <CommonTextField
                    label="City Name"
                    id="cityNameInput"
                    placeholder="e.g. Chennai"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    error={formErrors.cityName}
                    required
                />

                <CommonAutocomplete
                    label="State"
                    id="stateSelectInput"
                    placeholder="Select State"
                    options={stateOptions}
                    value={stateName}
                    onChange={(val) => setStateName(val)}
                    error={formErrors.stateName}
                    required
                    className="mb-0"
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

export default AddCity;
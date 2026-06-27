import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";

const AddState = ({
    stateData,
    onSuccess,
    onClose,
}) => {
    const [stateName, setStateName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!stateName.trim()) {
            errors.stateName = "State Name is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: stateData ? stateData.id : Date.now(),
            stateName: stateName,
            sortOrder: parseInt(sortOrder),
            status: status,
        };

        onSuccess(record);
    };

    useEffect(() => {
        if (stateData) {
            setStateName(stateData.stateName || "");
            setSortOrder(stateData.sortOrder !== undefined ? stateData.sortOrder : "");
            setStatus(stateData.status !== undefined ? stateData.status : 1);
        } else {
            setStateName("");
            setSortOrder("");
            setStatus(1);
        }
        setFormErrors({});
    }, [stateData]);

    return (
        <form onSubmit={handleSubmit} id="state-form" noValidate>
            <div className="d-flex flex-column gap-1">
                <CommonTextField
                    label="State Name"
                    id="stateNameInput"
                    placeholder="e.g. Chennai"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    error={formErrors.stateName}
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

export default AddState;
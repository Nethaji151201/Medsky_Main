import React, { useEffect, useState } from "react";
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";

const AddBillingModality = ({
    billingModalityData,
    onSuccess,
    onClose,
}) => {
    const [billingModalityName, setBillingModalityName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!billingModalityName.trim()) {
            errors.billingModalityName = "Billing Modality Name is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const record = {
            id: billingModalityData ? billingModalityData.id : Date.now(),
            billingModalityName: billingModalityName,
            sortOrder: parseInt(sortOrder),
            status: status,
        };

        onSuccess(record);
    };

    useEffect(() => {
        if (billingModalityData) {
            setBillingModalityName(billingModalityData.billingModalityName || "");
            setSortOrder(billingModalityData.sortOrder !== undefined ? billingModalityData.sortOrder : "");
            setStatus(billingModalityData.status !== undefined ? billingModalityData.status : 1);
        } else {
            setBillingModalityName("");
            setSortOrder("");
            setStatus(1);
        }
        setFormErrors({});
    }, [billingModalityData]);

    return (
        <form onSubmit={handleSubmit} id="billingModality-form" noValidate>
            <div className="d-flex flex-column gap-1">
                <CommonTextField
                    label="Billing Modality Name"
                    id="billingModalityNameInput"
                    placeholder="e.g. Chennai"
                    value={billingModalityName}
                    onChange={(e) => setBillingModalityName(e.target.value)}
                    error={formErrors.billingModalityName}
                    required
                />

                <CommonTextField
                    label="Sort Order"
                    id="sortOrderInput"
                    value={sortOrder}
                    placeholder="e.g. 1"
                    onChange={(e) => setSortOrder(e.target.value)}
                    error={formErrors.sortOrder}
                    type="number"
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

export default AddBillingModality;
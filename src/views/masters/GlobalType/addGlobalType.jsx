import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import CommonTextField from "../../../components/common/textfield";
import CommonCheckbox from "../../../components/common/checkbox";
import CommonDatePicker from "../../../components/common/datepicker";
import { saveGlobalType } from "../../../services/Masters/GlobalType";

const AddGlobalType = ({
    masterDetails,
    masterData,
    onSuccess,
    onClose,
}) => {
    const [typeName, setTypeName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [status, setStatus] = useState(1); // 1 = Active, 0 = Inactive
    const [effectiveDate, setEffectiveDate] = useState(new Date());
    const [formErrors, setFormErrors] = useState({});

    const handleSaveGlobalType = async (payload) => {
        try {
            const response = await saveGlobalType(masterDetails?.value, payload);
            if (response && response.success) {
                console.log('success');
                setTypeName("");
                setSortOrder("");
                setStatus(1);
                setEffectiveDate(new Date());
                setFormErrors({});
                onSuccess();
            }
        } catch (error) {
            console.error("Error saving master data:", error);
        } finally {
            onClose();
        }
    }

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!typeName.trim()) {
            errors.typeName = "Master Name is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newRecord = {
            masterName: typeName,
            sortOrder: parseInt(sortOrder),
            status: status,
            effectiveDate: effectiveDate ? effectiveDate.toISOString().split('T')[0] : null
        };

        handleSaveGlobalType(newRecord);
    };

    useEffect(() => {
        if (masterData) {
            setTypeName(masterData.masterName || "");
            setSortOrder(masterData.sortOrder !== undefined ? masterData.sortOrder : "");
            setStatus(masterData.status !== undefined ? masterData.status : 1);
            setEffectiveDate(masterData.effectiveDate ? new Date(masterData.effectiveDate) : new Date());
        } else {
            setTypeName("");
            setSortOrder("");
            setStatus(1); // Default to active for new entries
            setEffectiveDate(new Date());
        }
    }, [masterData])

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column">
                    {/* CommonTextField for master name input */}
                    <CommonTextField
                        label={`${masterDetails?.label} Name`}
                        id="typeNameInput"
                        placeholder={`e.g. ${masterDetails?.label}`}
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        error={formErrors.typeName}
                        required
                    />

                    {/* CommonTextField for sort index input */}
                    <CommonTextField
                        label="Sort Order"
                        id="sortOrderInput"
                        type="number"
                        placeholder="e.g. 11"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        error={formErrors.sortOrder}
                        required
                    />

                    {/* CommonDatePicker for effective date */}
                    <CommonDatePicker
                        label="Effective Date"
                        id="effectiveDateInput"
                        placeholder="Select Date..."
                        value={effectiveDate}
                        onChange={(date) => setEffectiveDate(date)}
                    />

                    {/* CommonCheckbox status input */}
                    <CommonCheckbox
                        label="Active Status"
                        id="statusCheckbox"
                        checked={status === 1}
                        onChange={(e) => setStatus(e.target.checked ? 1 : 0)}
                    />
                </div>
                <div className="d-flex justify-content-end gap-2 w-100 bg-body-tertiary p-3 rounded mt-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSubmit} className="px-3">
                        Save
                    </Button>
                </div>
            </form>
        </>
    )
}

export default AddGlobalType;
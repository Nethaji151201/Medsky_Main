import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import CommonTextField from "../../../components/common/textfield";
import CommonAutocomplete from "../../../components/common/autocomplete";
import { StatusOption } from "../../../constant";
import { saveGlobalType } from "../../../services/Masters/GlobalType";


const AddGlobalType = ({
    globalId,
    globalTypeData,
    onSuccess,
    onClose,
}) => {
    const [typeName, setTypeName] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [status, setStatus] = useState("");
    // const [parentCategory, setParentCategory] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const handleSaveGlobalType = async (payload) => {
        try {
            const response = await saveGlobalType(globalId, payload);
            if (response && response.success) {
                console.log('success');
                setTypeName("");
                setSortOrder("");
                setStatus("2");
                setFormErrors({});
                onSuccess();
            }

        } catch (error) {
            console.error("Error saving global type:", error);
        } finally {
            onClose();
        }
    }

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const errors = {};
        if (!typeName.trim()) {
            errors.typeName = "Global Type Name is required";
        }
        if (!sortOrder) {
            errors.sortOrder = "Sort Order is required";
        }
        if (!status) {
            errors.status = "Status is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const newRecord = {
            globalTypeName: typeName,
            sortOrder: parseInt(sortOrder),
            status: status || 1
        };

        handleSaveGlobalType(newRecord);
    };

    useEffect(() => {
        if (globalTypeData) {
            setTypeName(globalTypeData.globalTypeName);
            setSortOrder(globalTypeData.sortOrder);
            setStatus(globalTypeData.status)
        }
    }, [globalTypeData])

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-3">
                    {/* CommonTextField with dynamic input custom height and width */}
                    <CommonTextField
                        label="Global Type Name"
                        id="typeNameInput"
                        placeholder="e.g. Ward Tier"
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

                    {/* CommonAutocomplete with search filtering and custom height */}
                    {/* <CommonAutocomplete
                                        label="Parent Category Group"
                                        id="categoryGroupInput"
                                        placeholder="Search or type parent category..."
                                        options={categoryOptions}
                                        value={parentCategory}
                                        onChange={(val) => setParentCategory(val)}
                                        onInputChange={(e) => setParentCategory(e.target.value)}
                                    /> */}

                    {/* CommonAutocomplete status choice */}
                    <CommonAutocomplete
                        label="Status"
                        id="statusSelectInput"
                        placeholder="Select status..."
                        options={StatusOption}
                        value={status}
                        onChange={(val) => setStatus(val)}
                        onInputChange={(e) => setStatus(e.target.value)}
                        required
                        error={formErrors.status}
                    />
                </div>
                <div className="divider"></div>
                <div className="d-flex justify-content-end gap-2 w-100">
                    <Button variant="outline-secondary" size="sm" onClick={() => onClose()}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSubmit}>
                        Save Type
                    </Button>
                </div>
            </form>
        </>
    )
}

export default AddGlobalType;
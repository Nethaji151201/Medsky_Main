import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button, Badge } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import CommonAutocomplete from "../../../components/common/autocomplete";
import AddGlobalType from "./addGlobalType";
import { getGlobalType } from "../../../services/Masters/GlobalType";

const GlobalType = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);

    // Form Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [globalId, setGlobalId] = useState(null);

    const globalOption = [
        { label: "Patient", value: 1 },
        { label: "Guardian", value: 2 },
        { label: "Gender", value: 3 },
        { label: "Registration Type", value: 4 },
        { label: "Marital Status", value: 5 },
        { label: "Blood Group", value: 6 },
        { label: "Religion", value: 7 },
        { label: "Known Throgh", value: 8 },
        { label: "Patient Bill Type", value: 9 },
        { label: "Master Units", value: 10 },
        { label: "File Types", value: 11 },
    ];

    // Define columns matching the user's specification
    const columns = [
        {
            data: "globalTypeName",
            title: "Global Type Name"
        },
        {
            data: "sortOrder",
            title: "Sort Order",
            className: "text-center",
            width: "120px"
        },
        {
            data: "status",
            title: "Status",
            className: "text-center",
            width: "140px",
            render: function (data) {
                if (data === 1) {
                    return '<span class="badge bg-success-subtle text-success py-1 px-2">Active</span>';
                }
                return '<span class="badge bg-danger-subtle text-danger py-1 px-2">Inactive</span>';
            }
        }
    ];

    // Premium sample records stored in local React state so they redraw reactively on update
    const [tableData, setTableData] = useState([
        { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
        { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
        { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
        { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
        { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
        { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
        { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
        { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
        { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
        { globalTypeName: "Diagnostic Specialty", parentCategory: "Clinical", sortOrder: 10, status: 0 }
    ]);


    // Initialize our premium hook with all requested props
    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: tableData,
        isFilterColumn: false, // Enables header-level column filters
        bordered: true,       // Enable premium small grid borders
        selectable: true,      // Prepend a premium row selection checkbox column
        showSerialNo: true,    // Enable serial number column
        onSelectionChange: (rows) => {
            console.log("Selected Rows changed:", rows);
            setSelectedRows(rows);
        },
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,           // Toggle alternate row grey backgrounds
        isLoading: isLoading,  // Toggle premium loading overlay state
        emptyMessage: "No global types found", // Scoped empty message
    });

    const setData = () => {
        if (globalId == 1) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
            ]);
        }

        if (globalId == 2) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
            ]);
        }

        if (globalId == 3) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
            ]);
        }

        if (globalId == 4) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
            ]);
        }

        if (globalId == 5) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
            ]);
        }

        if (globalId == 6) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
            ]);
        }

        if (globalId == 7) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
            ]);
        }

        if (globalId == 8) {
            setTableData([
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Diagnostic Specialty", parentCategory: "Clinical", sortOrder: 10, status: 0 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { globalTypeName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { globalTypeName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { globalTypeName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { globalTypeName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { globalTypeName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { globalTypeName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { globalTypeName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { globalTypeName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { globalTypeName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
            ]);
        }
    }

    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await getGlobalType(globalId);
            if (response && response.success) {
                setTableData(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching global types:", error);
        } finally {
            setData()
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (globalId) {
            getData(globalId);
        }
    }, [globalId]);

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <Card.Header.Title className="header-title">
                                <h4 className="card-title mb-0">Global Type Master</h4>
                            </Card.Header.Title>
                            <div className="d-flex align-items-center gap-3">
                                {selectedRows.length > 0 && (
                                    <Badge bg="primary" className="py-2 px-3">
                                        {selectedRows.length} Row{selectedRows.length > 1 ? "s" : ""} Selected
                                    </Badge>
                                )}

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        setClickedRow(null);
                                        setShowAddModal(true);
                                    }}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <i className="ri-add-line"></i>
                                    Add Global Type
                                </Button>

                                {/* <Button
                                    variant={isLoading ? "success" : "outline-primary"}
                                    size="sm"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <i className={isLoading ? "ri-play-line" : "ri-loader-4-line"}></i>
                                    {isLoading ? "Show Table Data" : "Test Loading State"}
                                </Button> */}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted mb-3">
                                <CommonAutocomplete
                                    label="Global Type"
                                    id="globalTypeSelectInput"
                                    placeholder="Select Global Type..."
                                    options={globalOption}
                                    value={globalId}
                                    onChange={(val) => setGlobalId(val)}
                                    onInputChange={(e) => setGlobalId(e.target.value)}
                                    width="300px"
                                />
                            </p>

                            <div className="table-responsive custom-table-search">
                                <table
                                    ref={tableRef}
                                    className="table dataTable"
                                    style={{ width: "100%" }}
                                ></table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Premium Create Global Type Dialog Modal using Common Components */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Create Global Type"
                maxWidth="lg"
            >
                <AddGlobalType globalTypeData={clickedRow} onClose={() => setShowAddModal(false)} onSuccess={() => setShowAddModal(false)} />
            </CommonDialog>
        </div>
    );
};

export default GlobalType;
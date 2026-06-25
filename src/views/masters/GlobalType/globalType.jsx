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
    const [masterId, setMasterId] = useState(1);
    const [selectedOptionJson, setSelectedOptionJson] = useState(JSON.stringify({ label: "Patient", value: 1 }));

    const masterOption = [
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
            data: "masterName",
            title: `${JSON.parse(selectedOptionJson)?.label}`
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
        { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
        { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
        { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
        { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
        { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
        { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
        { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
        { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
        { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
        { masterName: "Diagnostic Specialty", parentCategory: "Clinical", sortOrder: 10, status: 0 }
    ]);


    // Initialize our premium hook with all requested props
    const { columnVisibility, visibleColumns, hiddenColumns, allColumns } = useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: tableData,
        isFilterColumn: false, // Enables header-level column filters
        bordered: true,       // Enable premium small grid borders
        selectable: false,      // Prepend a premium row selection checkbox column
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
        emptyMessage: "No master data found", // Scoped empty message
        initialColumnVisibility: {
            masterName: true,   // Show on load
            sortOrder: true,       // Hide on load
            status: true            // Show on load
        },
    });

    // Console print the visible and non-visible columns data reactively
    useEffect(() => {
        console.log("DataTable Column Visibility Data:", {
            columnVisibility,
            visibleColumns,
            hiddenColumns,
            allColumns
        });
    }, [columnVisibility]);

    const setData = () => {
        if (masterId == 1) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
            ]);
        }

        if (masterId == 2) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
            ]);
        }

        if (masterId == 3) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
            ]);
        }

        if (masterId == 4) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
            ]);
        }

        if (masterId == 5) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
            ]);
        }

        if (masterId == 6) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
            ]);
        }

        if (masterId == 7) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
            ]);
        }

        if (masterId == 8) {
            setTableData([
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Diagnostic Specialty", parentCategory: "Clinical", sortOrder: 10, status: 0 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
                { masterName: "Hospital Unit", parentCategory: "Administrative", sortOrder: 1, status: 1 },
                { masterName: "Specialty Category", parentCategory: "Clinical", sortOrder: 2, status: 1 },
                { masterName: "Designation Tier", parentCategory: "Administrative", sortOrder: 3, status: 1 },
                { masterName: "Billing Category", parentCategory: "Financial", sortOrder: 4, status: 0 },
                { masterName: "Vendor Type", parentCategory: "Operations", sortOrder: 5, status: 1 },
                { masterName: "DCR Region", parentCategory: "Operations", sortOrder: 6, status: 0 },
                { masterName: "Account Type", parentCategory: "Financial", sortOrder: 7, status: 1 },
                { masterName: "Insurance Partner", parentCategory: "Financial", sortOrder: 8, status: 1 },
                { masterName: "Ward Type", parentCategory: "Clinical", sortOrder: 9, status: 1 },
            ]);
        }
    }

    const getData = async () => {
        try {
            setIsLoading(true);
            const response = await getGlobalType(masterId);
            if (response && response.success) {
                setTableData(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching masters data:", error);
        } finally {
            setData()
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (masterId) {
            getData(masterId);
        }
    }, [masterId]);

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-1">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0 me-3">Master</h4>
                                <CommonAutocomplete
                                    id="masterSelectInput"
                                    placeholder="Select Master..."
                                    options={masterOption}
                                    value={masterId}
                                    onChange={(val) => {
                                        setMasterId(val)
                                    }}
                                    onChangeJson={(json) => {
                                        console.log(json, "json");

                                        setSelectedOptionJson(json)
                                    }}
                                    onInputChange={(e) => setMasterId(e.target.value)}
                                    width="300px"
                                    className="pt-1"
                                />
                            </Card.Header.Title>
                            <div className="d-flex align-items-center gap-3">

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
                                    Add Master
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
                            {/* <p className="text-muted mb-3 d-flex align-items-center gap-2">
                                <span>Master:</span>
                                <CommonAutocomplete
                                    id="masterSelectInput"
                                    placeholder="Select Master..."
                                    options={masterOption}
                                    value={masterId}
                                    onChange={(val) => setMasterId(val)}
                                    onInputChange={(e) => setMasterId(e.target.value)}
                                    width="300px"
                                />
                            </p> */}

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

            {/* Premium Create Master Dialog Modal using Common Components */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? `Edit ${JSON.parse(selectedOptionJson)?.label}` : `Create ${JSON.parse(selectedOptionJson)?.label}`}
                maxWidth="400px"
            >
                <AddGlobalType masterDetails={JSON.parse(selectedOptionJson)} masterData={clickedRow} onClose={() => setShowAddModal(false)} onSuccess={() => setShowAddModal(false)} />
            </CommonDialog>
        </div>
    );
};

export default GlobalType;
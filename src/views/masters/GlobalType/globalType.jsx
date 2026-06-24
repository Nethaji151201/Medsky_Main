import React, { useRef, useState } from "react";
import { Row, Col, Button, Badge } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";

const GlobalType = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);

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
                if (data === "Active") {
                    return '<span class="badge bg-success-subtle text-success py-1 px-2">Active</span>';
                }
                return '<span class="badge bg-danger-subtle text-danger py-1 px-2">Inactive</span>';
            }
        }
    ];

    // Premium sample records
    const sampleData = [
        { globalTypeName: "Hospital Unit", sortOrder: 1, status: "Active" },
        { globalTypeName: "Specialty Category", sortOrder: 2, status: "Active" },
        { globalTypeName: "Designation Tier", sortOrder: 3, status: "Active" },
        { globalTypeName: "Billing Category", sortOrder: 4, status: "Inactive" },
        { globalTypeName: "Vendor Type", sortOrder: 5, status: "Active" },
        { globalTypeName: "DCR Region", sortOrder: 6, status: "Inactive" },
        { globalTypeName: "Account Type", sortOrder: 7, status: "Active" },
        { globalTypeName: "Insurance Partner", sortOrder: 8, status: "Active" },
        { globalTypeName: "Ward Type", sortOrder: 9, status: "Active" },
        { globalTypeName: "Diagnostic Specialty", sortOrder: 10, status: "Inactive" }
    ];

    // Initialize our premium hook with all requested props
    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: sampleData,
        isFilterColumn: false, // Enables header-level column filters
        bordered: true,       // Enable premium small grid borders
        selectable: true,      // Prepend a premium row selection checkbox column
        onSelectionChange: (rows) => {
            console.log("Selected Rows changed:", rows);
            setSelectedRows(rows);
        },
        onRowClick: (row) => {
            console.log("Row Clicked:", row);
            setClickedRow(row);
        },
        zebra: true,           // Toggle alternate row grey backgrounds
        isLoading: isLoading,  // Toggle premium loading overlay state
        emptyMessage: "No global types found", // Scoped empty message
    });

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
                                    variant={isLoading ? "success" : "outline-primary"}
                                    size="sm"
                                    onClick={() => setIsLoading(!isLoading)}
                                    className="d-flex align-items-center gap-1"
                                >
                                    <i className={isLoading ? "ri-play-line" : "ri-loader-4-line"}></i>
                                    {isLoading ? "Show Table Data" : "Test Loading State"}
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted mb-3">
                                Manage global classifications and sorting hierarchies. Drag and drop column borders to resize,
                                export records to CSV, Excel, or PDF, and test premium features like row selection, zebra striping,
                                and loading overlays.
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
        </div>
    );
};

export default GlobalType;
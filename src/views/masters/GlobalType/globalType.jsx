import React, { useRef } from "react";
import { Row, Col } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";

const GlobalType = () => {
    const tableRef = useRef(null);

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

    // Initialize our premium hook
    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: sampleData,
        isFilterColumn: false, // Enables header-level column filters
        addSNo: true,         // Adds automatic Serial Number column
        autoSize: true,       // Enables automatic column resizing
        bordered: true,
    });

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Header.Title className="header-title">
                                <h4 className="card-title mb-0">Global Type Master</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted mb-4">
                                Manage global classifications and sorting hierarchies. Drag and drop column headers to reorder,
                                toggle column visibility using the Columns checklist, or use dynamic header filters to search records.
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
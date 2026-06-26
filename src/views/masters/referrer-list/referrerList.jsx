import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddReferrer from "./addReferrer";

const initialReferrersData = [
    {
        id: 1,
        name: "Dr. Alok Sharma",
        orgName: "Sharma Clinic",
        speciality: "Cardiology",
        address1: "12, MG Road",
        address2: "Nungambakkam",
        area: "T. Nagar",
        city: "Chennai",
        emailId: "alok@sharmaclinic.com",
        mobileNo: "9876543210",
        phoneNo: "044-1234567",
        proName: "John Doe",
        tariff: "Standard Tariff",
        status: 1,
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        orgName: "Apollo Hospitals",
        speciality: "Pediatrics",
        address1: "21, Greams Road",
        address2: "Thousand Lights",
        area: "Adyar",
        city: "Chennai",
        emailId: "priya@apollo.com",
        mobileNo: "9876543211",
        phoneNo: "044-7654321",
        proName: "Jane Smith",
        tariff: "Premium Tariff",
        status: 1,
    },
];

const ReferrerList = () => {
    const tableRef = useRef(null);
    const [referrers, setReferrers] = useState(initialReferrersData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Columns configuration
    const columns = [
        {
            data: "name",
            title: "Name",
        },
        {
            data: "orgName",
            title: "Org. Name",
        },
        {
            data: "speciality",
            title: "Speciality",
        },
        {
            data: "area",
            title: "Area",
        },
        {
            data: "city",
            title: "City",
        },
        {
            data: "proName",
            title: "PRO Name",
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
            },
        },
    ];

    // Initialize premium hook
    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: referrers,
        bordered: true,
        selectable: false,
        showSerialNo: true,
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,
        emptyMessage: "No referrer records found",
    });

    const handleSaveReferrer = (savedReferrer) => {
        if (clickedRow) {
            // Edit mode
            setReferrers((prev) =>
                prev.map((r) => (r.id === clickedRow.id ? { ...r, ...savedReferrer } : r))
            );
        } else {
            // Add mode
            setReferrers((prev) => [...prev, savedReferrer]);
        }
        setShowAddModal(false);
    };

    const handleDeleteReferrer = (id) => {
        setReferrers((prev) => prev.filter((r) => r.id !== id));
        setShowAddModal(false);
    };

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0">Referrer List</h4>
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
                                    Add Referrer
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
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

            {/* Create/Edit Referrer Dialog Modal */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Referrer" : "Add Referrer"}
                maxWidth="750px"
                footer={
                    <div className={`d-flex ${clickedRow ? "justify-content-between" : "justify-content-end"} align-items-center w-100`}>
                        <div>
                            {clickedRow && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteReferrer(clickedRow.id)}
                                    className="px-4"
                                    style={{ minWidth: "120px", height: "38px" }}
                                >
                                    <i className="ri-delete-bin-line me-1"></i> Delete
                                </Button>
                            )}
                        </div>
                        <div className="d-flex gap-3">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowAddModal(false)}
                                className="px-4"
                                style={{ minWidth: "120px", height: "38px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="referrer-form"
                                variant="primary"
                                className="px-4"
                                style={{ minWidth: "120px", height: "38px" }}
                            >
                                <i className="ri-save-line me-1"></i> Save
                            </Button>
                        </div>
                    </div>
                }
            >
                <AddReferrer
                    referrerData={clickedRow}
                    onSuccess={handleSaveReferrer}
                />
            </CommonDialog>
        </div>
    );
};

export default ReferrerList;
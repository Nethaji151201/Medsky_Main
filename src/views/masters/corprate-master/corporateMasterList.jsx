import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddCorporateMaster from "./addCorporateMaster";

const initialCorporateData = [
    {
        id: 1,
        corporateName: "APOLLO TYRES",
        address: "Industrial Area Phase 1",
        city: "Chennai",
        phone: "044-12345678",
        email: "contact@apollotyres.com",
        pincode: "600001",
        fax: "044-12345679",
        status: 1,
    },
    {
        id: 2,
        corporateName: "MARUTI SUZUKI",
        address: "Palam Gurgaon Road",
        city: "Gurgaon",
        phone: "0124-4345678",
        email: "contact@marutisuzuki.com",
        pincode: "122015",
        fax: "0124-4345679",
        status: 1,
    },
    {
        id: 3,
        corporateName: "RANE INTERNATIONAL",
        address: "Velachery Road",
        city: "Chennai",
        phone: "044-22345678",
        email: "info@rane.co.in",
        pincode: "600042",
        fax: "044-22345679",
        status: 1,
    },
    {
        id: 4,
        corporateName: "TVS MOTOR",
        address: "Harita, Hosur",
        city: "Hosur",
        phone: "04344-276780",
        email: "customercare@tvsmotor.com",
        pincode: "635109",
        fax: "04344-276781",
        status: 0,
    },
];

const CorporateMaster = () => {
    const tableRef = useRef(null);
    const [corporates, setCorporates] = useState(initialCorporateData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const columns = [
        {
            data: "corporateName",
            title: "Corporate Name",
        },
        {
            data: "address",
            title: "Address",
        },
        {
            data: "city",
            title: "City",
        },
        {
            data: "phone",
            title: "Phone",
        },
        {
            data: "email",
            title: "Email",
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

    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: corporates,
        bordered: true,
        selectable: false,
        showSerialNo: true,
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,
        emptyMessage: "No corporate records found",
        columnReorder: false,
    });

    const handleSaveCorporate = (savedCorporate) => {
        if (clickedRow) {
            // Edit mode
            setCorporates((prev) =>
                prev.map((c) => (c.id === clickedRow.id ? { ...c, ...savedCorporate } : c))
            );
        } else {
            // Add mode
            setCorporates((prev) => [...prev, savedCorporate]);
        }
        setShowAddModal(false);
    };

    const handleDeleteCorporate = (id) => {
        setCorporates((prev) => prev.filter((c) => c.id !== id));
        setShowAddModal(false);
    };

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0">Corporate Master</h4>
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
                                    Add
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

            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Corporate" : "Add Corporate"}
                maxWidth="750px"
                footer={
                    <div className={`d-flex ${clickedRow ? "justify-content-between" : "justify-content-end"} align-items-center w-100`}>
                        <div>
                            {clickedRow && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCorporate(clickedRow.id)}
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
                                form="corporate-form"
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
                <AddCorporateMaster
                    corporateData={clickedRow}
                    onSuccess={handleSaveCorporate}
                />
            </CommonDialog>
        </div>
    );
};

export default CorporateMaster;
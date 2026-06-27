import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddReferrerPro from "./addReferrerPro";

const initialReferrersData = [
    {
        id: 1,
        proName: "PRO 1",
    },
    {
        id: 2,
        proName: "PRO 2",
    },
];

const ReferrerProList = () => {
    const tableRef = useRef(null);
    const [referrers, setReferrers] = useState(initialReferrersData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Columns configuration
    const columns = [
        {
            data: "proName",
            title: "PRO Name",
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
                                <h4 className="card-title mb-0">Referrer PRO</h4>
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
                                    Add Referrer PRO
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
                title={clickedRow ? "Edit Referrer Organisation" : "Add Referrer Organisation"}
                maxWidth="750px"
                footer={
                    <div className="d-flex justify-content-end gap-3 w-100">
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
                            form="pro-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddReferrerPro
                    referrerData={clickedRow}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleSaveReferrer}
                    onDelete={handleDeleteReferrer}
                />
            </CommonDialog>
        </div>
    );
};

export default ReferrerProList;
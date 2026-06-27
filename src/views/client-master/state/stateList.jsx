import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddClientState from "./addState";

const initialStateData = [
    { id: 1, stateName: "Chennai", sortOrder: 1, status: 1 },
    { id: 2, stateName: "Bangalore", sortOrder: 2, status: 1 },
    { id: 3, stateName: "Mumbai", sortOrder: 3, status: 1 },
    { id: 4, stateName: "Hyderabad", sortOrder: 4, status: 0 }
];

const ClientStateList = () => {
    const tableRef = useRef(null);
    const [state, setState] = useState(initialStateData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Columns configuration
    const columns = [
        {
            data: "stateName",
            title: "State Name"
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

    // Initialize premium hook
    useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: state,
        bordered: true,
        selectable: false,
        showSerialNo: true,
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,
        emptyMessage: "No state records found"
    });

    const handleSaveState = (savedState) => {
        if (clickedRow) {
            // Edit mode
            setState((prev) =>
                prev.map((c) => (c.id === clickedRow.id ? { ...c, ...savedState } : c))
            );
        } else {
            // Add mode
            setState((prev) => [...prev, savedState]);
        }
        setShowAddModal(false);
    };

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0">State</h4>
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
                                    Add State
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

            {/* Create/Edit State Dialog Modal */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit State" : "Add State"}
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
                            form="state-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddClientState
                    stateData={clickedRow}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleSaveState}
                />
            </CommonDialog>
        </div>
    );
};

export default ClientStateList;
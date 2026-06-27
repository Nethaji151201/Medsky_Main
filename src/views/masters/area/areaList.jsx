import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddArea from "./addArea";

const initialCitiesData = [
    { id: 1, cityName: "Chennai", sortOrder: 1, status: 1 },
    { id: 2, cityName: "Bangalore", sortOrder: 2, status: 1 },
    { id: 3, cityName: "Mumbai", sortOrder: 3, status: 1 },
    { id: 4, cityName: "Hyderabad", sortOrder: 4, status: 0 }
];

const initialAreasData = [
    { id: 1, areaName: "T. Nagar", cityName: "Chennai", pincode: "600017", sortOrder: 1, status: 1 },
    { id: 2, areaName: "Adyar", cityName: "Chennai", pincode: "600020", sortOrder: 2, status: 1 },
    { id: 3, areaName: "Indiranagar", cityName: "Bangalore", pincode: "560038", sortOrder: 3, status: 1 },
    { id: 4, areaName: "Koramangala", cityName: "Bangalore", pincode: "560034", sortOrder: 4, status: 1 },
    { id: 5, areaName: "Andheri", cityName: "Mumbai", pincode: "400053", sortOrder: 5, status: 1 }
];

const AreaList = () => {
    const tableRef = useRef(null);
    const [areas, setAreas] = useState(initialAreasData);
    const [cities] = useState(initialCitiesData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Columns configuration
    const columns = [
        {
            data: "areaName",
            title: "Area"
        },
        {
            data: "cityName",
            title: "City"
        },
        {
            data: "pincode",
            title: "Pincode"
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
        data: areas,
        bordered: true,
        selectable: false,
        showSerialNo: true,
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,
        emptyMessage: "No area records found"
    });

    const handleSaveArea = (savedArea) => {
        if (clickedRow) {
            // Edit mode
            setAreas((prev) =>
                prev.map((a) => (a.id === clickedRow.id ? { ...a, ...savedArea } : a))
            );
        } else {
            // Add mode
            setAreas((prev) => [...prev, savedArea]);
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
                                <h4 className="card-title mb-0">Areas</h4>
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
                                    Add Area
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

            {/* Create/Edit Area Dialog Modal */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Area" : "Add Area"}
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
                            form="area-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddArea
                    areaData={clickedRow}
                    cities={cities}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleSaveArea}
                />
            </CommonDialog>
        </div>
    );
};

export default AreaList;
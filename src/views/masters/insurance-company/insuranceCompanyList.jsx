import React, { useRef, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonDialog from "../../../components/common/dialog";
import AddInsuranceCompany from "./addInsuranceCompany";

const initialInsuranceData = [
    {
        id: 1,
        companyName: "Star Health Insurance",
        companyType: "Insurance Company",
        phone: "1800-425-2255",
        email: "info@starhealth.in",
        fax: "044-22340001",
        status: 1,
    },
    {
        id: 2,
        companyName: "Medi Assist TPA",
        companyType: "TPA",
        phone: "1800-425-9449",
        email: "info@mediassist.in",
        fax: "080-22340002",
        status: 1,
    },
    {
        id: 3,
        companyName: "ICICI Lombard",
        companyType: "Insurance Company",
        phone: "1800-2666",
        email: "customersupport@icicilombard.com",
        fax: "022-22340003",
        status: 1,
    },
    {
        id: 4,
        companyName: "United Health Care Parekh TPA",
        companyType: "Both",
        phone: "1800-200-3666",
        email: "contact@uhcp.co.in",
        fax: "022-22340004",
        status: 0,
    },
];

const InsuranceCompanyList = () => {
    const tableRef = useRef(null);
    const [insuranceCompanies, setInsuranceCompanies] = useState(initialInsuranceData);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const columns = [
        {
            data: "companyName",
            title: "Name",
        },
        {
            data: "companyType",
            title: "Type",
        },
        {
            data: "phone",
            title: "Contact No",
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
        data: insuranceCompanies,
        bordered: true,
        selectable: false,
        showSerialNo: true,
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        },
        zebra: true,
        emptyMessage: "No insurance company/TPA records found",
        columnReorder: false,
    });

    const handleSaveInsurance = (savedCompany) => {
        if (clickedRow) {
            // Edit mode
            setInsuranceCompanies((prev) =>
                prev.map((c) => (c.id === clickedRow.id ? { ...c, ...savedCompany } : c))
            );
        } else {
            // Add mode
            setInsuranceCompanies((prev) => [...prev, savedCompany]);
        }
        setShowAddModal(false);
    };

    const handleDeleteInsurance = (id) => {
        setInsuranceCompanies((prev) => prev.filter((c) => c.id !== id));
        setShowAddModal(false);
    };

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0">Insurance Company / TPA</h4>
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
                title={clickedRow ? "Edit Insurance Company / TPA" : "Add Insurance Company / TPA"}
                maxWidth="750px"
                footer={
                    <div className={`d-flex ${clickedRow ? "justify-content-between" : "justify-content-end"} align-items-center w-100`}>
                        <div>
                            {clickedRow && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteInsurance(clickedRow.id)}
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
                                form="insurance-form"
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
                <AddInsuranceCompany
                    insuranceData={clickedRow}
                    onSuccess={handleSaveInsurance}
                />
            </CommonDialog>
        </div>
    );
};

export default InsuranceCompanyList;
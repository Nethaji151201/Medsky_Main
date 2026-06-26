import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../components/Card";
import useDataTableMS from "../../components/hooks/useDatatableMS";
import CommonTextField from "../../components/common/textfield";
import CommonCollapse from "../../components/common/collapse";
import CommonDialog from "../../components/common/dialog";
import CommonAutocomplete from "../../components/common/autocomplete";
import AddDoctor from "./addDocter";
import { StatusOption } from "../../constant";

// Enhanced dummy data for Doctors List
const initialDoctorsData = [
    {
        id: 1,
        docterName: "Dr. Ramesh Kumar",
        specality: "Cardiology",
        regNo: "REG1001",
        tokenPrefix: "RK",
        degree: "MD, DM (Cardiology)",
        availableTiming: "10:00 AM - 01:00 PM",
        emailId: "ramesh.kumar@medsky.com",
        personalNo: "9876543210",
        officialNo: "044-2456781",
        docterNoteType: "OPD Note",
        status: 1
    },
    {
        id: 2,
        docterName: "Dr. Priya Sharma",
        specality: "Pediatrics",
        regNo: "REG1002",
        tokenPrefix: "PS",
        degree: "MBBS, DCH",
        availableTiming: "02:00 PM - 05:00 PM",
        emailId: "priya.sharma@medsky.com",
        personalNo: "8765432109",
        officialNo: "044-2456782",
        docterNoteType: "Prescription Only",
        status: 1
    },
    {
        id: 3,
        docterName: "Dr. Amit Patel",
        specality: "General Medicine",
        regNo: "REG1003",
        tokenPrefix: "AP",
        degree: "MD (Medicine)",
        availableTiming: "09:00 AM - 12:00 PM",
        emailId: "amit.patel@medsky.com",
        personalNo: "7654321098",
        officialNo: "044-2456783",
        docterNoteType: "General Note",
        status: 1
    },
    {
        id: 4,
        docterName: "Dr. Sneha Reddy",
        specality: "Gynecology",
        regNo: "REG1004",
        tokenPrefix: "SR",
        degree: "MS (OBG)",
        availableTiming: "04:00 PM - 07:00 PM",
        emailId: "sneha.reddy@medsky.com",
        personalNo: "6543210987",
        officialNo: "044-2456784",
        docterNoteType: "OPD Note",
        status: 0
    }
];

const DoctersList = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        docterName: "",
        specality: "",
        regNo: "",
        degree: ""
    });

    const [doctors, setDoctors] = useState(initialDoctorsData);
    const [filteredData, setFilteredData] = useState(initialDoctorsData);
    const [status, setStatus] = useState("1");

    // Debounced search logic for filters
    useEffect(() => {
        const handler = setTimeout(() => {
            const filtered = doctors.filter((item) => {
                const matchesName =
                    !filters.docterName ||
                    (item.docterName &&
                        item.docterName.toLowerCase().includes(filters.docterName.toLowerCase()));
                const matchesSpeciality =
                    !filters.specality ||
                    (item.specality &&
                        item.specality.toLowerCase().includes(filters.specality.toLowerCase()));
                const matchesRegNo =
                    !filters.regNo ||
                    (item.regNo && item.regNo.toLowerCase().includes(filters.regNo.toLowerCase()));
                const matchesDegree =
                    !filters.degree ||
                    (item.degree && item.degree.toLowerCase().includes(filters.degree.toLowerCase()));

                return matchesName && matchesSpeciality && matchesRegNo && matchesDegree;
            });
            setFilteredData(filtered);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, doctors]);

    // Save doctor record (Add or Edit)
    const handleSaveDoctor = (savedDoctor) => {
        if (clickedRow) {
            // Edit
            setDoctors((prev) =>
                prev.map((d) => (d.id === clickedRow.id ? { ...d, ...savedDoctor } : d))
            );
        } else {
            // Add
            setDoctors((prev) => [savedDoctor, ...prev]);
        }
        setShowAddModal(false);
    };

    // Define columns matching the user's specification and data structure
    const columns = [
        {
            data: "docterName",
            title: "Doctor Name",
            render: function (data) {
                return '<span class="font-monospace text-primary fw-semibold">' + data + '</span>';
            }
        },
        {
            data: "specality",
            title: "Speciality",
            className: "text-center",
            width: "140px"
        },
        {
            data: "status",
            title: "Status",
            className: "text-center",
            width: "110px",
            render: function (data) {
                if (data == 1) {
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
        data: filteredData,
        bordered: true,
        selectable: false,
        zebra: true,
        isLoading: isLoading,
        columnReorder: false,
        isColumnHidden: true,
        emptyMessage: "No doctor records found",
        onRowClick: (row) => {
            setClickedRow(row);
            setShowAddModal(true);
        }
    });

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0 me-3">Doctors</h4>
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
                                    Add Doctor
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body style={{ minHeight: "400px" }}>
                            {/* Collapsible filter section */}
                            <CommonCollapse
                                title="Filter Doctors List"
                                titleIcon={<i className="ri-filter-3-line"></i>}
                                defaultOpen={true}
                                rightActions={
                                    (filters.docterName || filters.specality || filters.regNo || filters.degree) && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-decoration-none text-muted p-0 small fw-semibold"
                                            onClick={() =>
                                                setFilters({
                                                    docterName: "",
                                                    specality: "",
                                                    regNo: "",
                                                    degree: ""
                                                })
                                            }
                                        >
                                            <i className="ri-refresh-line me-1"></i> Clear Filters
                                        </Button>
                                    )
                                }
                            >
                                <Row className="row-cols-1 row-cols-md-3 g-2">
                                    <Col>
                                        <CommonTextField
                                            label="Doctor Name"
                                            id="filter-doctorName"
                                            placeholder="Search Doctor..."
                                            value={filters.docterName}
                                            onChange={(e) =>
                                                setFilters((prev) => ({ ...prev, docterName: e.target.value }))
                                            }
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="Speciality"
                                            id="filter-speciality"
                                            placeholder="Search Speciality..."
                                            value={filters.specality}
                                            onChange={(e) =>
                                                setFilters((prev) => ({ ...prev, specality: e.target.value }))
                                            }
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonAutocomplete
                                            label="Status"
                                            id="status"
                                            placeholder="Select Status"
                                            options={StatusOption}
                                            value={status}
                                            onChange={(val) => setStatus(val)}
                                            className="mb-0 autocomplete-select-input"
                                        />
                                    </Col>


                                </Row>
                            </CommonCollapse>

                            <div className="table-responsive custom-table-search mt-3">
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

            {/* Premium Create/Edit Doctor Dialog Modal */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Doctor Details" : "Doctor Registration"}
                maxWidth="lg"
                titleIcon={<i className="ri-user-add-line fs-4 text-white"></i>}
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
                            form="doctor-registration-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddDoctor
                    clickedRow={clickedRow}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSaveDoctor}
                />
            </CommonDialog>
        </div>
    );
};

export default DoctersList;
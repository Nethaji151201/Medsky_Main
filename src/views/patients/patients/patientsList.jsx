import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonTextField from "../../../components/common/textfield";
import CommonCollapse from "../../../components/common/collapse";
import CommonDialog from "../../../components/common/dialog";
import AddPatients from "./addPatients";

// Dummy data for Patients List
const tableData = [
    {
        userName: "john_doe",
        regDate: "2026-05-10",
        uhid: "UHID-100234",
        patientName: "John Doe",
        guardianName: "Richard Doe",
        mobileNumber: "9876543210",
        landlineNumber: "044-24567890",
        age: 34,
        gender: "Male",
        address: "123 Main St, New York"
    },
    {
        userName: "jane_smith",
        regDate: "2026-06-01",
        uhid: "UHID-100235",
        patientName: "Jane Smith",
        guardianName: "David Smith",
        mobileNumber: "8765432109",
        landlineNumber: "044-24567891",
        age: 28,
        gender: "Female",
        address: "456 Oak Ave, Boston"
    },
    {
        userName: "robert_jones",
        regDate: "2026-06-12",
        uhid: "UHID-100236",
        patientName: "Robert Jones",
        guardianName: "Thomas Jones",
        mobileNumber: "7654321098",
        landlineNumber: "044-24567892",
        age: 45,
        gender: "Male",
        address: "789 Pine Rd, Chicago"
    },
    {
        userName: "mary_davis",
        regDate: "2026-06-20",
        uhid: "UHID-100237",
        patientName: "Mary Davis",
        guardianName: "James Davis",
        mobileNumber: "6543210987",
        landlineNumber: "",
        age: 62,
        gender: "Female",
        address: "101 Elm St, Seattle"
    },
    {
        userName: "william_wilson",
        regDate: "2026-06-24",
        uhid: "UHID-100238",
        patientName: "William Wilson",
        guardianName: "Charles Wilson",
        mobileNumber: "5432109876",
        landlineNumber: "044-24567893",
        age: 19,
        gender: "Male",
        address: "202 Maple Dr, Austin"
    }
];

const PatientsList = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);

    // Form Modal states
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        uhid: "",
        patientName: "",
        guardianName: "",
        mobileNumber: "",
        landlineNumber: "",
        address: ""
    });

    const [patients, setPatients] = useState(tableData);
    const [filteredData, setFilteredData] = useState(tableData);

    // Debounced search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            const filtered = patients.filter(item => {
                const matchesUhid = !filters.uhid || (item.uhid && item.uhid.toLowerCase().includes(filters.uhid.toLowerCase()));
                const matchesPatientName = !filters.patientName || (item.patientName && item.patientName.toLowerCase().includes(filters.patientName.toLowerCase()));
                const matchesGuardianName = !filters.guardianName || (item.guardianName && item.guardianName.toLowerCase().includes(filters.guardianName.toLowerCase()));
                const matchesMobile = !filters.mobileNumber || (item.mobileNumber && item.mobileNumber.toLowerCase().includes(filters.mobileNumber.toLowerCase()));
                const matchesLandline = !filters.landlineNumber || (item.landlineNumber && item.landlineNumber.toLowerCase().includes(filters.landlineNumber.toLowerCase()));
                const matchesAddress = !filters.address || (item.address && item.address.toLowerCase().includes(filters.address.toLowerCase()));

                return matchesUhid && matchesPatientName && matchesGuardianName && matchesMobile && matchesLandline && matchesAddress;
            });
            setFilteredData(filtered);
            console.log("Search filters applied via debounce:", filters);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, patients]);

    // Save Patient details handler (Add and Edit)
    const handleSavePatient = (savedPatient) => {
        if (clickedRow) {
            // Edit mode
            setPatients(prev => prev.map(p => p.uhid === clickedRow.uhid ? { ...p, ...savedPatient } : p));
        } else {
            // Add mode: check if UHID already exists to prevent duplication, otherwise prepend
            setPatients(prev => {
                const exists = prev.some(p => p.uhid === savedPatient.uhid);
                if (exists) {
                    return prev.map(p => p.uhid === savedPatient.uhid ? { ...p, ...savedPatient } : p);
                }
                return [savedPatient, ...prev];
            });
        }
        setShowAddModal(false);
    };

    // Define columns matching the user's specification
    const columns = [
        // {
        //     data: "userName",
        //     title: "User Name",
        // },
        {
            data: "regDate",
            title: "Reg Date",
            className: "text-center",
            width: "120px"
        },
        {
            data: "uhid",
            title: "UHID",
            className: "text-center",
            width: "140px",
            render: function (data) {
                return '<span class="font-monospace text-primary fw-semibold">' + data + '</span>';
            }
        },
        {
            data: "patientName",
            title: "Patient Name",
            className: "text-center",
            width: "120px"
        },
        // {
        //     data: "guardianName",
        //     title: "Guardian Name",
        //     className: "text-center",
        //     width: "120px"
        // },
        {
            data: "mobileNumber",
            title: "Mobile Number",
            className: "text-center",
            width: "120px"
        },
        // {
        //     data: "landlineNumber",
        //     title: "Landline Number",
        //     className: "text-center",
        //     width: "120px"
        // },
        {
            data: "age",
            title: "Age",
            className: "text-center",
            width: "120px"
        },
        {
            data: "gender",
            title: "Gender",
            className: "text-center",
            width: "120px"
        },
        {
            data: "address",
            title: "Address",
            className: "text-center",
            width: "120px"
        },
    ];

    // Initialize our premium hook with all requested props
    const { columnVisibility, visibleColumns, hiddenColumns, allColumns } = useDataTableMS({
        tableRef: tableRef,
        columns: columns,
        data: filteredData,
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
            userName: true,
            regDate: true,
            uhid: true,
            patientName: true,
            guardianName: true,
            mobileNumber: true,
            landlineNumber: true,
            age: true,
            gender: true,
            address: true
        },
        columnReorder: true,
    });
    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0 me-3">Patients</h4>
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
                                    Add Patients List
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body style={{ minHeight: "400px" }}>
                            {/* Collapsible Filter Section (3 columns per row using CommonCollapse) */}
                            <CommonCollapse
                                title="Filter Patients"
                                titleIcon={<i className="ri-filter-3-line"></i>}
                                defaultOpen={true}
                                rightActions={
                                    (filters.uhid || filters.patientName || filters.guardianName || filters.mobileNumber || filters.landlineNumber || filters.address) && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-decoration-none text-muted p-0 small fw-semibold"
                                            onClick={() => setFilters({
                                                uhid: "",
                                                patientName: "",
                                                guardianName: "",
                                                mobileNumber: "",
                                                landlineNumber: "",
                                                address: ""
                                            })}
                                        >
                                            <i className="ri-refresh-line me-1"></i> Clear Filters
                                        </Button>
                                    )
                                }
                            >
                                <Row className="">
                                    <Col md="3">
                                        <CommonTextField
                                            label="UHID"
                                            id="filter-uhid"
                                            placeholder="Search UHID..."
                                            value={filters.uhid}
                                            onChange={(e) => setFilters(prev => ({ ...prev, uhid: e.target.value }))}
                                        />
                                    </Col>
                                    <Col md="3">
                                        <CommonTextField
                                            label="Patient Name"
                                            id="filter-patientName"
                                            placeholder="Search Patient Name..."
                                            value={filters.patientName}
                                            onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value }))}
                                        />
                                    </Col>
                                    {/* <Col md="4">
                                        <CommonTextField
                                            label="Guardian Name"
                                            id="filter-guardianName"
                                            placeholder="Search Guardian Name..."
                                            value={filters.guardianName}
                                            onChange={(e) => setFilters(prev => ({ ...prev, guardianName: e.target.value }))}
                                        
                                        />
                                    </Col> */}
                                    <Col md="3">
                                        <CommonTextField
                                            label="Mobile No"
                                            id="filter-mobileNumber"
                                            placeholder="Search Mobile No..."
                                            value={filters.mobileNumber}
                                            onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                        />
                                    </Col>
                                    {/* <Col md="4">
                                        <CommonTextField
                                            label="Landline No"
                                            id="filter-landlineNumber"
                                            placeholder="Search Landline No..."
                                            value={filters.landlineNumber}
                                            onChange={(e) => setFilters(prev => ({ ...prev, landlineNumber: e.target.value }))}
                                        
                                        />
                                    </Col> */}
                                    <Col md="3">
                                        <CommonTextField
                                            label="Address"
                                            id="filter-address"
                                            placeholder="Search Address..."
                                            value={filters.address}
                                            onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </Col>
                                </Row>
                            </CommonCollapse>

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

            {/* Premium Patient Registration / Edit Dialog */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Patient Details" : "Patient Registration"}
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
                            form="patient-registration-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddPatients
                    clickedRow={clickedRow}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSavePatient}
                />
            </CommonDialog>
        </div>
    );
};

export default PatientsList;
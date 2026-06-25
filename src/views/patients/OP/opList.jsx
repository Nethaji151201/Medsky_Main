import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Card from "../../../components/Card";
import useDataTableMS from "../../../components/hooks/useDatatableMS";
import CommonTextField from "../../../components/common/textfield";
import CommonCollapse from "../../../components/common/collapse";
import CommonDialog from "../../../components/common/dialog";
import CommonDatePicker from "../../../components/common/datepicker";
import CommonAutocomplete from "../../../components/common/autocomplete";
import AddOP from "./addOP";

// Enhanced dummy data for OP List representing outpatient records
const tableData = [
    {
        token: "1",
        uhid: "UHID-100234",
        patientName: "John Doe",
        age: 34,
        gender: "Male",
        docter: "Dr. Ramesh Kumar",
        regType: "Self",
        opNumber: "OP-2026-0001",
        regDate: "2026-05-10",
        mobileNumber: "9876543210",
        billNo: "BILL-2026-0501",
        status: "Active",
        referrer: "Self"
    },
    {
        token: "2",
        uhid: "UHID-100235",
        patientName: "Jane Smith",
        age: 28,
        gender: "Female",
        docter: "Dr. Savitha Nair",
        regType: "Referral",
        opNumber: "OP-2026-0002",
        regDate: "2026-06-01",
        mobileNumber: "8765432109",
        billNo: "BILL-2026-0602",
        status: "Active",
        referrer: "Dr. Ramesh Kumar"
    },
    {
        token: "3",
        uhid: "UHID-100236",
        patientName: "Robert Jones",
        age: 45,
        gender: "Male",
        docter: "Dr. Ramesh Kumar",
        regType: "Self",
        opNumber: "OP-2026-0003",
        regDate: "2026-06-12",
        mobileNumber: "7654321098",
        billNo: "BILL-2026-0603",
        status: "Inactive",
        referrer: "Self"
    },
    {
        token: "4",
        uhid: "UHID-100237",
        patientName: "Mary Davis",
        age: 62,
        gender: "Female",
        docter: "Dr. Savitha Nair",
        regType: "Self",
        opNumber: "OP-2026-0004",
        regDate: "2026-06-20",
        mobileNumber: "6543210987",
        billNo: "BILL-2026-0604",
        status: "Active",
        referrer: "Self"
    },
    {
        token: "5",
        uhid: "UHID-100238",
        patientName: "William Wilson",
        age: 19,
        gender: "Male",
        docter: "Dr. Rajesh K.",
        regType: "Referral",
        opNumber: "OP-2026-0005",
        regDate: "2026-06-24",
        mobileNumber: "5432109876",
        billNo: "BILL-2026-0605",
        status: "Active",
        referrer: "Dr. Savitha Nair"
    }
];

const OPList = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);

    // Form Modal states
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter states matching the exact layout row by row
    const [filters, setFilters] = useState({
        uhid: "",
        opNumber: "",
        patientName: "",
        mobileNumber: "",
        status: "All",
        dateFrom: null,
        dateTo: null,
        doctor: "",
        referrer: "",
        regType: ""
    });

    const [patients, setPatients] = useState(tableData);
    const [filteredData, setFilteredData] = useState(tableData);

    // Debounced search logic covering all new filter fields
    useEffect(() => {
        const handler = setTimeout(() => {
            const filtered = patients.filter(item => {
                const matchesUhid = !filters.uhid || (item.uhid && item.uhid.toLowerCase().includes(filters.uhid.toLowerCase()));
                const matchesOpNumber = !filters.opNumber || (item.opNumber && item.opNumber.toLowerCase().includes(filters.opNumber.toLowerCase()));
                const matchesPatientName = !filters.patientName || (item.patientName && item.patientName.toLowerCase().includes(filters.patientName.toLowerCase()));
                const matchesMobile = !filters.mobileNumber || (item.mobileNumber && item.mobileNumber.toLowerCase().includes(filters.mobileNumber.toLowerCase()));
                const matchesStatus = filters.status === "All" || !filters.status || (item.status && item.status.toLowerCase() === filters.status.toLowerCase());
                const matchesDoctor = !filters.doctor || (item.docter && item.docter.toLowerCase().includes(filters.doctor.toLowerCase())) || (item.doctor && item.doctor.toLowerCase().includes(filters.doctor.toLowerCase()));
                const matchesReferrer = !filters.referrer || (item.referrer && item.referrer.toLowerCase().includes(filters.referrer.toLowerCase()));
                const matchesRegType = !filters.regType || filters.regType === "---SELECT---" || (item.regType && item.regType.toLowerCase() === filters.regType.toLowerCase());

                // Date range checking against registration date
                let matchesDate = true;
                if (item.regDate) {
                    const itemDate = new Date(item.regDate);
                    if (filters.dateFrom) {
                        const fromDate = new Date(filters.dateFrom);
                        fromDate.setHours(0, 0, 0, 0);
                        if (itemDate < fromDate) matchesDate = false;
                    }
                    if (filters.dateTo) {
                        const toDate = new Date(filters.dateTo);
                        toDate.setHours(23, 59, 59, 999);
                        if (itemDate > toDate) matchesDate = false;
                    }
                }

                return matchesUhid && matchesOpNumber && matchesPatientName && matchesMobile && matchesStatus && matchesDoctor && matchesReferrer && matchesRegType && matchesDate;
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
                const nextToken = (prev.length + 1).toString();
                const nextOpNumber = `OP-2026-00${prev.length + 1}`;
                const nextBillNo = `BILL-2026-06${prev.length + 1}`;
                const completeSaved = {
                    token: nextToken,
                    opNumber: nextOpNumber,
                    billNo: nextBillNo,
                    docter: savedPatient.doctorName || "Dr. Ramesh Kumar",
                    regType: "Self",
                    status: "Active",
                    referrer: "Self",
                    ...savedPatient
                };
                return [completeSaved, ...prev];
            });
        }
        setShowAddModal(false);
    };

    // Define columns matching the outpatient details list layout
    const columns = [
        {
            data: "token",
            title: "Token",
            className: "text-center",
            width: "80px"
        },
        {
            data: "uhid",
            title: "UHID",
            className: "text-center",
            width: "120px"
        },
        {
            data: "patientName",
            title: "Patient Name",
            className: "text-center",
            width: "140px",
            render: function (data) {
                return '<span class="font-monospace text-primary fw-semibold">' + data + '</span>';
            }
        },
        {
            data: "age",
            title: "Age",
            className: "text-center",
            width: "80px"
        },
        {
            data: "gender",
            title: "Gender",
            className: "text-center",
            width: "100px"
        },
        {
            data: "docter",
            title: "Doctor",
            className: "text-center",
            width: "140px"
        },
        {
            data: "referrer",
            title: "Referrer",
            className: "text-center",
            width: "140px"
        },
        {
            data: "regType",
            title: "Reg. Type",
            className: "text-center",
            width: "120px"
        },
        {
            data: "opNumber",
            title: "OP. Number",
            className: "text-center",
            width: "120px"
        },
        {
            data: "regDate",
            title: "Reg. Date",
            className: "text-center",
            width: "120px"
        },
        {
            data: "mobileNumber",
            title: "Mobile Number",
            className: "text-center",
            width: "120px"
        },
        {
            data: "billNo",
            title: "Bill No",
            className: "text-center",
            width: "120px"
        },
    ];

    // Initialize our premium hook with all columns and data properties
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
        emptyMessage: "No outpatient records found", // Scoped empty message
        initialColumnVisibility: {
            token: true,
            uhid: true,
            patientName: true,
            age: true,
            gender: true,
            docter: true,
            regType: true,
            opNumber: true,
            regDate: true,
            mobileNumber: true,
            billNo: true
        },
    });

    return (
        <div id="page_layout" className="cust-datatable">
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <Card.Header.Title className="header-title d-flex align-items-center flex-wrap gap-2">
                                <h4 className="card-title mb-0 me-3">Outpatient List</h4>
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
                                    Add Outpatient
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body style={{ minHeight: "400px" }}>
                            {/* Collapsible Filter Section */}
                            <CommonCollapse
                                title="Filter Outpatient List"
                                titleIcon={<i className="ri-filter-3-line"></i>}
                                defaultOpen={true}
                                rightActions={
                                    (filters.uhid || filters.opNumber || filters.patientName || filters.mobileNumber || filters.status !== "All" || filters.dateFrom || filters.dateTo || filters.doctor || filters.referrer || filters.regType) && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="text-decoration-none text-muted p-0 small fw-semibold"
                                            onClick={() => setFilters({
                                                uhid: "",
                                                opNumber: "",
                                                patientName: "",
                                                mobileNumber: "",
                                                status: "All",
                                                dateFrom: null,
                                                dateTo: null,
                                                doctor: "",
                                                referrer: "",
                                                regType: ""
                                            })}
                                        >
                                            <i className="ri-refresh-line me-1"></i> Clear Filters
                                        </Button>
                                    )
                                }
                            >
                                {/* 5 columns per row alignment */}
                                <Row className="row-cols-1 row-cols-md-5 g-2">
                                    {/* Row 1 */}
                                    <Col>
                                        <CommonTextField
                                            label="UHID"
                                            id="filter-uhid"
                                            placeholder="Search UHID..."
                                            value={filters.uhid}
                                            onChange={(e) => setFilters(prev => ({ ...prev, uhid: e.target.value }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="OP Number"
                                            id="filter-opNumber"
                                            placeholder="Search OP Number..."
                                            value={filters.opNumber}
                                            onChange={(e) => setFilters(prev => ({ ...prev, opNumber: e.target.value }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="Patient Name"
                                            id="filter-patientName"
                                            placeholder="Search Patient Name..."
                                            value={filters.patientName}
                                            onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="Mobile No"
                                            id="filter-mobileNumber"
                                            placeholder="Search Mobile No..."
                                            value={filters.mobileNumber}
                                            onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                            className="mb-0 flex-grow-1"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonAutocomplete
                                            label="Status"
                                            id="filter-status"
                                            placeholder="Select Status"
                                            options={["All", "Active", "Inactive"]}
                                            value={filters.status}
                                            onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                                            className="mb-0 autocomplete-select-input"
                                        />
                                    </Col>

                                    {/* Row 2 */}
                                    <Col>
                                        <CommonDatePicker
                                            label="Date From"
                                            id="filter-dateFrom"
                                            placeholder="Select Date From"
                                            value={filters.dateFrom}
                                            onChange={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonDatePicker
                                            label="Date To"
                                            id="filter-dateTo"
                                            placeholder="Select Date To"
                                            value={filters.dateTo}
                                            onChange={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="Doctor"
                                            id="filter-doctor"
                                            placeholder="Search Doctor..."
                                            value={filters.doctor}
                                            onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonTextField
                                            label="Referrer"
                                            id="filter-referrer"
                                            placeholder="Search Referrer..."
                                            value={filters.referrer}
                                            onChange={(e) => setFilters(prev => ({ ...prev, referrer: e.target.value }))}
                                            className="mb-0"
                                        />
                                    </Col>
                                    <Col>
                                        <CommonAutocomplete
                                            label="Reg Type"
                                            id="filter-regType"
                                            placeholder="Select Reg Type"
                                            options={["---SELECT---", "Self", "Referral"]}
                                            value={filters.regType}
                                            onChange={(val) => setFilters(prev => ({ ...prev, regType: val }))}
                                            className="mb-0 autocomplete-select-input"
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

            {/* Outpatient Registration / Edit Dialog using AddPatients component */}
            <CommonDialog
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={clickedRow ? "Edit Outpatient Details" : "Outpatient Registration"}
                maxWidth="lg"
                fullScreen={true}
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
                            form="out-patient-registration-form"
                            variant="primary"
                            className="px-4"
                            style={{ minWidth: "120px", height: "38px" }}
                        >
                            <i className="ri-save-line me-1"></i> Save
                        </Button>
                    </div>
                }
            >
                <AddOP
                    clickedRow={clickedRow}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSavePatient}
                />
            </CommonDialog>
        </div>
    );
};

export default OPList;
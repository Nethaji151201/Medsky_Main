import React, { useMemo, useState } from "react";
import { Badge, Button, ButtonGroup, Table } from "react-bootstrap";
import Card from "../../components/Card";
import CommonAutocomplete from "../../components/common/autocomplete";
import CommonCheckbox from "../../components/common/checkbox";
import CommonDatePicker from "../../components/common/datepicker";

const doctorOptions = [
    { label: "Dr.Oneglance Doctor", value: "Dr.Oneglance Doctor" },
    { label: "Dr. Jane Doe", value: "Dr. Jane Doe" },
    { label: "Dr. John Smith", value: "Dr. John Smith" },
    { label: "Dr. Ayesha Al-Mansoori", value: "Dr. Ayesha Al-Mansoori" },
];

const timeSplitOptions = [
    { label: "05 Minutes", value: "05 Minutes" },
    { label: "10 Minutes", value: "10 Minutes" },
    { label: "15 Minutes", value: "15 Minutes" },
    { label: "20 Minutes", value: "20 Minutes" },
    { label: "25 Minutes", value: "25 Minutes" },
    { label: "30 Minutes", value: "30 Minutes" },
];

const dayKeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

const initialSlots = [
    {
        id: "1",
        fromTime: "12:00 PM",
        toTime: "02:00 PM",
        days: {
            sunday: false,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
        },
    },
    {
        id: "2",
        fromTime: "02:30 PM",
        toTime: "04:00 PM",
        days: {
            sunday: true,
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
        },
    },
];

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formatDay = (day) => day.charAt(0).toUpperCase() + day.slice(1);

const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + days);

    return nextDate;
};

const getEnabledCount = (slot) => Object.values(slot.days).filter(Boolean).length;

const DoctersCalander = () => {
    const [viewMode, setViewMode] = useState("day");
    const [selectedDoctor, setSelectedDoctor] = useState("Dr.Oneglance Doctor");
    const [timeSplit, setTimeSplit] = useState("");
    const [weekStartDate, setWeekStartDate] = useState(null);
    const [slots, setSlots] = useState(initialSlots);

    const weekDates = useMemo(
        () =>
            dayKeys.map((day, index) => ({
                day,
                date: weekStartDate ? addDays(weekStartDate, index) : null,
            })),
        [weekStartDate]
    );

    const activeDayCount = useMemo(
        () => slots.reduce((count, slot) => count + getEnabledCount(slot), 0),
        [slots]
    );

    const bulkDays = useMemo(() => {
        return dayKeys.reduce((days, day) => {
            days[day] = slots.length > 0 && slots.every((slot) => slot.days[day]);
            return days;
        }, {});
    }, [slots]);

    const weekRangeLabel = weekStartDate
        ? `${formatDate(weekDates[0].date)} - ${formatDate(weekDates[6].date)}`
        : "";

    const handleViewModeChange = (mode) => {
        setViewMode(mode);

        if (mode === "day") {
            setWeekStartDate(null);
        }
    };

    const handleWeekDateChange = (value) => {
        if (value) {
            setViewMode("date");
            setWeekStartDate(value);
        }
    };

    const handleAddSlot = () => {
        const newSlot = {
            id: Date.now().toString(),
            fromTime: "10:00 AM",
            toTime: "10:30 AM",
            days: {
                sunday: false,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
            },
        };

        setSlots((currentSlots) => [...currentSlots, newSlot]);
    };

    const handleUpdateSlotField = (id, field, value) => {
        setSlots((currentSlots) =>
            currentSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
        );
    };

    const handleUpdateSlotDay = (slotId, dayKey, checked) => {
        setSlots((currentSlots) =>
            currentSlots.map((slot) =>
                slot.id === slotId
                    ? {
                        ...slot,
                        days: {
                            ...slot.days,
                            [dayKey]: checked,
                        },
                    }
                    : slot
            )
        );
    };

    const handleBulkToggleDay = (dayKey, checked) => {
        setSlots((currentSlots) =>
            currentSlots.map((slot) => ({
                ...slot,
                days: {
                    ...slot.days,
                    [dayKey]: checked,
                },
            }))
        );
    };

    const handleDeleteSlot = (id) => {
        setSlots((currentSlots) => currentSlots.filter((slot) => slot.id !== id));
    };

    const handleSave = () => {
        console.log("Saving Doctors Calendar slots...", {
            selectedDoctor,
            viewMode,
            timeSplit,
            weekRangeLabel: viewMode === "date" ? weekRangeLabel : "",
            slots,
        });
        alert("Doctor calendar saved successfully!");
    };

    return (
        <Card className="doctor-calendar-card">
            <Card.Header className="doctor-calendar-header py-3 px-4">
                <Card.Header.Title className="doctor-calendar-heading">
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="doctor-calendar-title-icon">
                            <i className="ri-calendar-check-line"></i>
                        </span>
                        <h4 className="card-title mb-0">Doctor's Calendar</h4>
                    </div>
                    <div className="text-secondary small">
                        Manage weekly availability slots.
                    </div>
                </Card.Header.Title>

                <Card.Header.Action className="doctor-calendar-actions">
                    <ButtonGroup size="sm" className="doctor-calendar-view-switch">
                        <Button
                            variant={viewMode === "day" ? "primary" : "light"}
                            onClick={() => handleViewModeChange("day")}
                        >
                            <i className="ri-calendar-line me-1"></i>
                            Day wise
                        </Button>
                        <Button
                            variant={viewMode === "date" ? "primary" : "light"}
                            onClick={() => handleViewModeChange("date")}
                        >
                            <i className="ri-calendar-2-line me-1"></i>
                            Date wise
                        </Button>
                    </ButtonGroup>

                    {viewMode === "date" && (
                        <div className="doctor-calendar-week-picker">
                            <CommonDatePicker
                                className="mb-0"
                                placeholder="Select week start"
                                value={weekStartDate}
                                onChange={handleWeekDateChange}
                                options={{ dateFormat: "d/m/Y" }}
                                height="34px"
                            />
                        </div>
                    )}

                    <div className="doctor-calendar-filter doctor-calendar-doctor">
                        <span className="text-secondary small text-nowrap">Doctor Name</span>
                        <CommonAutocomplete
                            id="doctor-select"
                            placeholder="Select Doctor"
                            options={doctorOptions}
                            value={selectedDoctor}
                            onChange={(value) => setSelectedDoctor(value || "")}
                            height="34px"
                        />
                    </div>

                    <div className="doctor-calendar-filter doctor-calendar-time-split">
                        <span className="text-secondary small text-nowrap">Time split</span>
                        <CommonAutocomplete
                            id="time-split-select"
                            placeholder="Time split"
                            options={timeSplitOptions}
                            value={timeSplit}
                            onChange={(value) => setTimeSplit(value || "")}
                            height="34px"
                        />
                    </div>

                    <Button size="sm" variant="primary" className="px-3 doctor-calendar-add" onClick={handleAddSlot}>
                        <i className="ri-add-line me-1"></i>
                        Add New
                    </Button>
                </Card.Header.Action>
            </Card.Header>

            <Card.Body className="p-0">
                <div className={`doctor-calendar-summary px-4 py-3 ${viewMode === "day" ? "doctor-calendar-summary-day" : ""}`}>
                    {viewMode === "date" && (
                        <div className="doctor-calendar-week-summary">
                            <span className="text-secondary small d-block">Selected Week</span>
                            <span className="fw-semibold">
                                {weekRangeLabel || "Select a date to view week range"}
                            </span>
                        </div>
                    )}
                    <div>
                        <span className="text-secondary small d-block">Schedule Slots</span>
                        <span className="fw-semibold">{slots.length}</span>
                    </div>
                    <div>
                        <span className="text-secondary small d-block">Active Days</span>
                        <span className="fw-semibold">{activeDayCount}</span>
                    </div>
                    <Badge bg="success-subtle" text="success" className="doctor-calendar-badge">
                        {viewMode === "day" ? "Day wise setup" : "Date wise setup"}
                    </Badge>
                </div>

                <div className="table-responsive doctor-calendar-table-wrap">
                    <Table className="align-middle text-center table-bordered mb-0 doctor-calendar-table">
                        <thead>
                            <tr>
                                <th>From (hrs)</th>
                                <th>To (hrs)</th>
                                {weekDates.map(({ day, date }) => (
                                    <th key={day} className="doctor-calendar-day-col">
                                        <div className="doctor-calendar-day-head">
                                            {viewMode === "date" && date && (
                                                <span className="doctor-calendar-date">{formatDate(date)}</span>
                                            )}
                                            <span>{formatDay(day)}</span>
                                            <CommonCheckbox
                                                id={`bulk-${day}`}
                                                checked={bulkDays[day]}
                                                onChange={(event) => handleBulkToggleDay(day, event.target.checked)}
                                                className="doctor-calendar-check m-0"
                                                aria-label={`Toggle all ${day} slots`}
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="doctor-calendar-action-col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slots.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-5">
                                        <div className="doctor-calendar-empty">
                                            <i className="ri-calendar-event-line"></i>
                                            <span>No availability slots added.</span>
                                            <Button size="sm" variant="primary" onClick={handleAddSlot}>
                                                <i className="ri-add-line me-1"></i>
                                                Add Slot
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                slots.map((slot) => (
                                    <tr key={slot.id}>
                                        <td>
                                            <CommonDatePicker
                                                className="mb-0 doctor-calendar-time-input"
                                                placeholder="12:00 PM"
                                                value={slot.fromTime}
                                                onChange={(value) => handleUpdateSlotField(slot.id, "fromTime", value)}
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "h:i K",
                                                }}
                                                height="34px"
                                            />
                                        </td>
                                        <td>
                                            <CommonDatePicker
                                                className="mb-0 doctor-calendar-time-input"
                                                placeholder="02:00 PM"
                                                value={slot.toTime}
                                                onChange={(value) => handleUpdateSlotField(slot.id, "toTime", value)}
                                                options={{
                                                    enableTime: true,
                                                    noCalendar: true,
                                                    dateFormat: "h:i K",
                                                }}
                                                height="34px"
                                            />
                                        </td>
                                        {dayKeys.map((day) => (
                                            <td key={day}>
                                                <CommonCheckbox
                                                    id={`day-${slot.id}-${day}`}
                                                    checked={slot.days[day]}
                                                    onChange={(event) =>
                                                        handleUpdateSlotDay(slot.id, day, event.target.checked)
                                                    }
                                                    className="doctor-calendar-check m-0"
                                                    aria-label={`Toggle ${formatDay(day)} for slot ${slot.id}`}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <Button
                                                variant="link"
                                                className="doctor-calendar-delete"
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                aria-label="Delete slot"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-end align-items-center py-3 px-4 border-top">
                <Button variant="primary" size="sm" className="px-4" onClick={handleSave}>
                    <i className="ri-save-3-line me-1"></i>
                    Save
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default DoctersCalander;

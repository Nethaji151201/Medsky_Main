import React, { useContext, useState } from "react";
import { Accordion, AccordionContext, Nav, OverlayTrigger, Tooltip, useAccordionButton } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export const MenuListNew = [
    {
        isHeader: true,
        title: 'Masters',
        content: [
            {
                title: 'Global Type',
                to: '/masters/globalType',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Area',
                to: '/masters/area',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'City',
                to: '/masters/city',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
        ]
    },
    {
        isHeader: true,
        title: 'Docters',
        content: [
            {
                title: 'Docters List',
                to: '/docters/docters-list',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
        ]
    },
    {
        isHeader: true,
        title: 'Patients',
        content: [
            {
                title: 'Patient List',
                to: '/patients/patient-list',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'OP List',
                to: '/patients/op-list',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
        ]
    },
    {
        isHeader: true,
        title: 'Dashboard',
        content: [
            {
                title: 'Doctor Dashboard',
                to: '/',
                icon: 'ri-hospital-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Hospital Dashboard 1',
                to: '/dashboard-pages/dashboard-1',
                icon: 'ri-home-8-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Hospital Dashboard 2',
                to: '/dashboard-pages/dashboard-2',
                icon: 'ri-briefcase-4-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Patient Dashboard',
                to: '/dashboard-pages/patient-dashboard',
                icon: 'ri-briefcase-4-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Covid-19 Dashboard',
                to: '/dashboard-pages/dashboard-4',
                icon: 'ri-hospital-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            }
        ]
    },
    {
        divider: true
    },
    {
        isHeader: true,
        title: 'Apps',
        content: [
            {
                title: 'Email',
                icon: 'ri-mail-open-fill',
                content: [
                    {
                        title: 'Inbox',
                        to: '/email/inbox',
                        icon: 'ri-inbox-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Email Compose',
                        to: '/email/email-compose',
                        icon: 'ri-edit-2-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Doctor',
                icon: 'doctor-svg',
                content: [
                    {
                        title: 'All Doctor',
                        to: '/doctor/doctor-list',
                        icon: 'ri-file-list-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Add Doctor',
                        to: '/doctor/add-doctor',
                        icon: 'ri-user-add-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Doctor Profile',
                        to: '/doctor/doctor-profile',
                        icon: 'ri-profile-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Edit Doctor',
                        to: '/doctor/edit-doctor',
                        icon: 'ri-file-edit-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Calendar',
                to: '/calendar',
                icon: 'ri-calendar-2-line',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            },
            {
                title: 'Chat',
                to: '/chat',
                icon: 'ri-message-fill',
                addPermission: true,
                editPermission: true,
                deletePermission: true,
                viewPermission: true
            }
        ]
    },
    {
        divider: true
    },
    {
        isHeader: true,
        title: 'Components',
        content: [
            {
                title: 'UI Elements',
                icon: 'ri-apps-fill',
                content: [
                    {
                        title: 'Colors',
                        to: '/ui-elements/colors',
                        icon: 'ri-font-color',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Typography',
                        to: '/ui-elements/typography',
                        icon: 'ri-text',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Alerts',
                        to: '/ui-elements/alerts',
                        icon: 'ri-alert-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Badges',
                        to: '/ui-elements/badges',
                        icon: 'ri-building-3-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Breadcrumb',
                        to: '/ui-elements/breadcrumb',
                        icon: 'ri-guide-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Buttons',
                        to: '/ui-elements/buttons',
                        icon: 'ri-checkbox-blank-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Cards',
                        to: '/ui-elements/cards',
                        icon: 'ri-bank-card-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Carousel',
                        to: '/ui-elements/carousel',
                        icon: 'ri-slideshow-4-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Video',
                        to: '/ui-elements/video',
                        icon: 'ri-movie-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Grid',
                        to: '/ui-elements/grid',
                        icon: 'ri-grid-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Images',
                        to: '/ui-elements/images',
                        icon: 'ri-image-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'List Group',
                        to: '/ui-elements/list-group',
                        icon: 'ri-file-list-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Modal',
                        to: '/ui-elements/modal',
                        icon: 'ri-checkbox-blank-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Notifications',
                        to: '/ui-elements/notifications',
                        icon: 'ri-notification-3-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Pagination',
                        to: '/ui-elements/pagination',
                        icon: 'ri-more-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Popovers',
                        to: '/ui-elements/popovers',
                        icon: 'ri-folder-shield-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Progressbars',
                        to: '/ui-elements/progressbars',
                        icon: 'ri-battery-low-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Tabs',
                        to: '/ui-elements/tabs',
                        icon: 'ri-database-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Tooltips',
                        to: '/ui-elements/tooltips',
                        icon: 'ri-record-mail-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Forms',
                icon: 'ri-device-fill',
                content: [
                    {
                        title: 'Form Elements',
                        to: '/forms/form-elements',
                        icon: 'ri-tablet-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Form Validation',
                        to: '/forms/form-validations',
                        icon: 'ri-device-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Form Switch',
                        to: '/forms/form-switch',
                        icon: 'ri-toggle-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Form Checkbox',
                        to: '/forms/form-checkbox',
                        icon: 'ri-chat-check-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Form Radio',
                        to: '/forms/form-radio',
                        icon: 'ri-radio-button-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Form Wizard',
                icon: 'ri-file-word-fill',
                content: [
                    {
                        title: 'Simple Wizard',
                        to: '/wizard/simple-wizard',
                        icon: 'ri-anticlockwise-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Validate Wizard',
                        to: '/wizard/validate-wizard',
                        icon: 'ri-anticlockwise-2-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Vertical Wizard',
                        to: '/wizard/vertical-wizard',
                        icon: 'ri-clockwise-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Table',
                icon: 'ri-table-fill',
                content: [
                    {
                        title: 'Basic Tables',
                        to: '/tables/basic-table',
                        icon: 'ri-table-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Data Tables',
                        to: '/tables/data-table',
                        icon: 'ri-table-2',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Editable Tables',
                        to: '/tables/editable-table',
                        icon: 'ri-archive-drawer-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Charts',
                icon: 'ri-bar-chart-2-fill',
                content: [
                    {
                        title: 'Chart Page',
                        to: '/charts/chart-page',
                        icon: 'ri-file-chart-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'ECharts',
                        to: '/charts/e-chart',
                        icon: 'ri-bar-chart-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Am Charts',
                        to: '/charts/chart-am',
                        icon: 'ri-bar-chart-box-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Apex Chart',
                        to: '/charts/apex-chart',
                        icon: 'ri-bar-chart-box-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Icons',
                icon: 'ri-bar-chart-2-fill',
                content: [
                    {
                        title: 'Dripicons',
                        to: '/icons/dripicons',
                        icon: 'ri-stack-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Font Awesome 5',
                        to: '/icons/fontawesome-5',
                        icon: 'ri-facebook-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Line Awesome',
                        to: '/icons/line-awesome',
                        icon: 'ri-keynote-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Remixicon',
                        to: '/icons/remixicon',
                        icon: 'ri-remixicon-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Unicons',
                        to: '/icons/unicons',
                        icon: 'ri-underline',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            }
        ]
    },
    {
        divider: true
    },
    {
        isHeader: true,
        title: 'Pages',
        content: [
            {
                title: 'Authentication',
                icon: 'ri-server-fill',
                content: [
                    {
                        title: 'Login',
                        to: '/auth/sign-in',
                        icon: 'ri-login-box-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Register',
                        to: '/auth/sign-up',
                        icon: 'ri-logout-box-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Recover Password',
                        to: '/auth/recover-password',
                        icon: 'ri-record-mail-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Confirm Mail',
                        to: '/auth/confirm-mail',
                        icon: 'ri-chat-check-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Lock Screen',
                        to: '/auth/lock-screen',
                        icon: 'ri-file-lock-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Maps',
                icon: 'ri-map-pin-2-fill',
                content: [
                    {
                        title: 'Google Map',
                        to: '/masters/google-map',
                        icon: 'ri-google-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            },
            {
                title: 'Extra Pages',
                icon: 'ri-folders-fill',
                content: [
                    {
                        title: 'Timeline',
                        to: '/extra-pages/pages-timeline',
                        icon: 'ri-map-pin-time-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Invoice',
                        to: '/extra-pages/pages-invoice',
                        icon: 'ri-question-answer-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Blank Page',
                        to: '/extra-pages/blank-page',
                        icon: 'ri-checkbox-blank-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Error 404',
                        to: '/extra-pages/pages-error-404',
                        icon: 'ri-error-warning-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Error 500',
                        to: '/extra-pages/pages-error-500',
                        icon: 'ri-error-warning-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Pricing',
                        to: '/extra-pages/pages-pricing',
                        icon: 'ri-price-tag-3-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Pricing 1',
                        to: '/extra-pages/pages-pricing-one',
                        icon: 'ri-price-tag-2-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Maintenance',
                        to: '/extra-pages/pages-maintenance',
                        icon: 'ri-git-repository-commits-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Coming Soon',
                        to: '/extra-pages/pages-comingsoon',
                        icon: 'ri-run-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    },
                    {
                        title: 'Faq',
                        to: '/extra-pages/pages-faq',
                        icon: 'ri-compasses-2-fill',
                        addPermission: true,
                        editPermission: true,
                        deletePermission: true,
                        viewPermission: true
                    }
                ]
            }
        ]
    },
    {
        divider: true
    }
];

const renderIcon = (iconName) => {
    if (iconName === "doctor-svg") {
        return (
            <i className="icon">
                <svg
                    className="icon-20"
                    width="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        opacity="0.4"
                        d="M12.0865 22C11.9627 22 11.8388 21.9716 11.7271 21.9137L8.12599 20.0496C7.10415 19.5201 6.30481 18.9259 5.68063 18.2336C4.31449 16.7195 3.5544 14.776 3.54232 12.7599L3.50004 6.12426C3.495 5.35842 3.98931 4.67103 4.72826 4.41215L11.3405 2.10679C11.7331 1.96656 12.1711 1.9646 12.5707 2.09992L19.2081 4.32684C19.9511 4.57493 20.4535 5.25742 20.4575 6.02228L20.4998 12.6628C20.5129 14.676 19.779 16.6274 18.434 18.1581C17.8168 18.8602 17.0245 19.4632 16.0128 20.0025L12.4439 21.9088C12.3331 21.9686 12.2103 21.999 12.0865 22Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M11.3194 14.3209C11.1261 14.3219 10.9328 14.2523 10.7838 14.1091L8.86695 12.2656C8.57097 11.9793 8.56795 11.5145 8.86091 11.2262C9.15387 10.9369 9.63207 10.934 9.92906 11.2193L11.3083 12.5451L14.6758 9.22479C14.9698 8.93552 15.448 8.93258 15.744 9.21793C16.041 9.50426 16.044 9.97004 15.751 10.2574L11.8519 14.1022C11.7049 14.2474 11.5127 14.3199 11.3194 14.3209Z"
                        fill="currentColor"
                    ></path>
                </svg>
            </i>
        );
    }
    return <i className={iconName}></i>;
};

const VerticalNav = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(false);
    const [active, setActive] = useState("");

    function CustomToggle({ children, eventKey, onClick, activeClass }) {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(eventKey, (activeVal) =>
            onClick({ state: !activeVal, eventKey: eventKey })
        );
        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <Link
                to="#"
                aria-expanded={isCurrentEventKey ? "true" : "false"}
                className={`nav-link ${activeEventKey === active || (eventKey === active && "active")} ${activeClass === true ? "active" : ""
                    }`}
                role="button"
                onClick={(e) => {
                    decoratedOnClick(isCurrentEventKey);
                }}
            >
                {children}
            </Link>
        );
    }

    return (
        <>
            <ul className="navbar-nav iq-main-menu" id="sidebar-menu">
                <Accordion bsPrefix="bg-none" onSelect={(e) => setActiveMenu(e)}>
                    {MenuListNew.map((group, groupIndex) => {
                        if (group.divider) {
                            return (
                                <li key={`divider-${groupIndex}`}>
                                    <hr className="hr-horizontal" />
                                </li>
                            );
                        }

                        if (group.isHeader) {
                            return (
                                <React.Fragment key={`group-${groupIndex}`}>
                                    <Nav.Item as="li" className="static-item ms-2">
                                        <Link
                                            className="nav-link static-item disabled text-start"
                                            tabIndex="-1"
                                            to="#"
                                        >
                                            <span className="default-icon">{group.title}</span>
                                            <OverlayTrigger
                                                key={group.title}
                                                placement="right"
                                                overlay={
                                                    <Tooltip id={`tooltip-header-${groupIndex}`}>{group.title}</Tooltip>
                                                }
                                            >
                                                <span className="mini-icon">-</span>
                                            </OverlayTrigger>
                                        </Link>
                                    </Nav.Item>

                                    {group.content && group.content.map((item, itemIndex) => {
                                        const hasSubContent = item.content && item.content.length > 0;

                                        if (hasSubContent) {
                                            const isSubActive = item.content.some((sub) => location.pathname === sub.to);
                                            return (
                                                <Accordion.Item
                                                    as="li"
                                                    key={`item-${groupIndex}-${itemIndex}`}
                                                    className={`nav-item ${active === item.title || isSubActive ? "active" : ""}`}
                                                    onClick={() => setActive(item.title)}
                                                >
                                                    <div className="colors">
                                                        <CustomToggle
                                                            eventKey={item.title}
                                                            activeClass={isSubActive}
                                                            onClick={(activeKey) => setActiveMenu(activeKey)}
                                                        >
                                                            <OverlayTrigger
                                                                key={item.title}
                                                                placement="right"
                                                                overlay={
                                                                    <Tooltip id={`tooltip-${groupIndex}-${itemIndex}`}>{item.title}</Tooltip>
                                                                }
                                                            >
                                                                {renderIcon(item.icon)}
                                                            </OverlayTrigger>
                                                            <span className="item-name">{item.title}</span>
                                                            <i className="right-icon">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    className="icon-18"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                            </i>
                                                        </CustomToggle>

                                                        <Accordion.Collapse
                                                            eventKey={item.title}
                                                            as="ul"
                                                            className="sub-nav"
                                                            id={item.title}
                                                        >
                                                            <>
                                                                {item.content.map((subItem, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <Link
                                                                            className={`nav-link ${location.pathname === subItem.to ? "active" : ""
                                                                                }`}
                                                                            to={subItem.to}
                                                                        >
                                                                            <i className={subItem.icon}></i>
                                                                            <span className="item-name">{subItem.title}</span>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </>
                                                        </Accordion.Collapse>
                                                    </div>
                                                </Accordion.Item>
                                            );
                                        } else {
                                            const isActive = location.pathname === item.to;
                                            return (
                                                <Nav.Item as="li" key={`item-${groupIndex}-${itemIndex}`} className={`${isActive ? "active" : ""}`}>
                                                    <Link
                                                        to={item.to}
                                                        className={`nav-link ${isActive ? "active" : ""}`}
                                                    >
                                                        <OverlayTrigger
                                                            key={item.title}
                                                            placement="right"
                                                            overlay={
                                                                <Tooltip id={`tooltip-${groupIndex}-${itemIndex}`}>{item.title}</Tooltip>
                                                            }
                                                        >
                                                            {renderIcon(item.icon)}
                                                        </OverlayTrigger>
                                                        <span className="item-name">{item.title}</span>
                                                    </Link>
                                                </Nav.Item>
                                            );
                                        }
                                    })}
                                </React.Fragment>
                            );
                        }
                        return null;
                    })}
                </Accordion>
            </ul>
        </>
    );
};

export default VerticalNav;
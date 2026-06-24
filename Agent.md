# Medsky Workspace Agent Guidelines (AGENTS.md)

Welcome to the Medsky Main UI development environment. As an AI coding agent, you must adhere to the following rules, component usages, and coding styles established in this project.

---

## 🛠️ Technology Stack
- **Framework:** React (v19.2.0) with Vite
- **UI & Styling:** React Bootstrap (Bootstrap v5.3.3), Custom Sass/SCSS (`src/assets/scss/`, `src/assets/custom/custom.scss`)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` and `react-redux`)
- **Routing:** React Router DOM (v6.26.1 - using `createBrowserRouter` & `RouterProvider`)
- **Tables & Grids:** jQuery DataTables integrated via custom React hooks (`datatables.net-bs5`)
- **Icons:** Ionicons, Remixicon (font classes like `ri-`), Phosphor Icons, Font Awesome 5

---

## 🧩 Core Reusable Components

Always check and reuse existing components before writing custom elements.

### 1. Card Container (`src/components/Card.jsx`)
Standard component for grouping items, sections, and grids. Do not write raw `<div className="card">` elements.
- **Import:**
  ```javascript
  import Card from "../../../components/Card";
  ```
- **Structure & Subcomponents:**
  - `Card`: Outer container. Props: `className`
  - `Card.Header`: Container for title and actions. Props: `className`
  - `Card.Header.Title`: Wrapper for title headings. Props: `className`
  - `Card.Header.Action`: Wrapper for action elements (buttons, badges). Props: `className`
  - `Card.Body`: Inner container for card contents. Props: `className`, `style`
  - `Card.Footer`: Card footer.
- **Usage Example:**
  ```jsx
  <Card>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Card.Header.Title>
              <h4 className="card-title mb-0">Title Name</h4>
          </Card.Header.Title>
          <Card.Header.Action>
              <Button size="sm">Action</Button>
          </Card.Header.Action>
      </Card.Header>
      <Card.Body>
          {/* Main content goes here */}
      </Card.Body>
  </Card>
  ```

### 2. CommonDialog (`src/components/common/dialog.jsx`)
Standard Modal component mapping to Bootstrap Modal with preconfigured settings.
- **Import:**
  ```javascript
  import CommonDialog from "../../../components/common/dialog";
  ```
- **Properties:**
  - `open` (boolean): Shows or hides the dialog.
  - `onClose` (function): Triggered when closing.
  - `title` (string): Header text.
  - `children` (React Node): Modal body content.
  - `maxWidth` (`xs`, `sm`, `lg`, `xl`): Dialog width mapping.
  - `fullWidth` (boolean): Sets width to `100%` and padding constraints.
  - `persistent` (boolean): If `true`, backdrop is static (does not close on click outside) and keyboard ESC is disabled.
  - `titleIcon` (element): Icon shown next to title.
  - `fullScreen` (boolean): Enables fullscreen mode.
  - `footer` (element): Optional custom action footer.

### 3. Logo (`src/components/logo.jsx`)
Standard Medsky branding logo component.
- **Import:**
  ```javascript
  import Logo from "../../logo";
  ```

---

## 📊 Tables & Data Grid Hooks (CRITICAL)

Medsky relies heavily on custom hooks wrapping DataTables.net rather than raw table rendering.

### 1. Premium DataTable Hook: `useDataTableMS` (`src/components/hooks/useDatatableMS.jsx`)
Use this for advanced grids, master tables, infinite scroll lists, and selected row action tables.
- **Import:**
  ```javascript
  import useDataTableMS from "../../../components/hooks/useDatatableMS";
  ```
- **Configuration Properties:**
  - `tableRef` (ref): Ref of the HTML `<table>` element.
  - `columns` (array of objects): Column definitions. e.g. `{ data: 'fieldName', title: 'Header Title', className: 'text-center', render: (val) => string_or_html }`.
  - `data` (array): Local dataset.
  - `isFilterColumn` (boolean): Prepend column-level header input filters.
  - `bordered` (boolean): Toggle grid borders.
  - `selectable` (boolean): Prepend selection checkboxes.
  - `onSelectionChange` (function): Triggers when rows are selected/deselected.
  - `onRowClick` (function): Callback when a row is clicked.
  - `zebra` (boolean, default: `true`): Alternating light gray backgrounds.
  - `isLoading` (boolean): Standard loading indicator state overlay.
  - `enableInfiniteScroll` (boolean): Activates infinite loading.
  - `apiFunction` (function): Pagination fetch API function.
- **Usage Example:**
  ```jsx
  const tableRef = useRef(null);
  useDataTableMS({
      tableRef: tableRef,
      columns: columns,
      data: sampleData,
      bordered: true,
      selectable: true,
      onSelectionChange: (selectedRows) => console.log(selectedRows),
  });
  
  return (
      <div className="table-responsive custom-table-search">
          <table ref={tableRef} className="table dataTable w-100"></table>
      </div>
  );
  ```

### 2. Standard DataTable Hook: `useDataTable` (`src/components/hooks/useDatatable.jsx`)
Simple DataTable utility hook for quick local table render or basic AJAX endpoint loading.
- **Import:**
  ```javascript
  import useDataTable from "../../../components/hooks/useDatatable";
  ```

---

## 🗺️ Adding a New Screen/Route
When building a new view page:
1. **Create the View Component:** Inside a relevant subfolder in `src/views/` (e.g. `src/views/masters/NewMaster/newMaster.jsx`).
2. **Add to Router Config:** Import your view in `src/router/default-router.jsx` and add it to `DefaultRoute.children` layout route:
   ```javascript
   {
     path: '/masters/new-master-path',
     element: <NewMasterComponent />
   }
   ```
3. **Add to Sidebar Navigation:** Edit `MenuListNew` inside `src/components/partials/sidebar/vertical-nav.jsx` to append your menu item:
   ```javascript
   {
       title: 'New Master Name',
       to: '/masters/new-master-path',
       icon: 'ri-home-8-fill',
       addPermission: true,
       editPermission: true,
       deletePermission: true,
       viewPermission: true
   }
   ```

---

## 🎨 Design & Styling Guidelines
- **Use Bootstrap Utilities:** Use standard Bootstrap utility classes (`d-flex`, `justify-content-between`, `align-items-center`, `gap-2`, `py-3`, `px-4`, etc.).
- **Typography & Clean Grids:** Follow existing typography hierarchy. Use headings like `<h4 className="card-title mb-0">`.
- **Badges and Status Colors:** Keep badges clean and professional using sub-colors. For example:
  - Active: `badge bg-success-subtle text-success py-1 px-2`
  - Inactive: `badge bg-danger-subtle text-danger py-1 px-2`
  - Warning/Pending: `badge bg-warning-subtle text-warning py-1 px-2`
- **Icon Standard:** Default to Remixicon (classes prefixed with `ri-`) for uniform styling across sidebars, tables, and buttons.

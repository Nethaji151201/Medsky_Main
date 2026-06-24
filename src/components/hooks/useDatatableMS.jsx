import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5";

// Helper to serialize columns including render functions to prevent unnecessary re-initializations
const serializeColumns = (cols) => {
  if (!cols) return "";
  try {
    return JSON.stringify(cols, (key, value) => {
      if (typeof value === "function") {
        return value.toString();
      }
      return value;
    });
  } catch (e) {
    return "";
  }
};

// Helper to reorder an array
const reorderArray = (arr, from, to) => {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  let target = to;
  if (from < to) {
    target = to - 1;
  }
  result.splice(target, 0, removed);
  return result;
};

const useDataTableMS = ({
  tableRef,
  columns,
  data = [],
  url = null,
  actionCallback,
  isColumnHidden = false,
  isColumnHiddenClass = ".toggle-vis",
  isFilterColumn = false,
  isFooter = false,
  isMultilang = false,
  bordered = false, // Dynamic and optional border parameter

  // Selection & Row interaction
  isLoading = false,
  emptyMessage = "No data found",
  onRowClick,
  selectable = false,
  onSelectionChange,
  zebra = true, // ON by default — odd rows gray, even rows white

  // Infinite Scroll
  enableInfiniteScroll = false,
  apiFunction,
  pageSize = 50,
  scrollHeight = null,
  onLoadMore,
}) => {
  // 1. Keep orderedColumns state to manage native HTML5 drag and drop reordering
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const serializedParentColumns = serializeColumns(columns);

  // Sync state if parent columns prop changes
  useEffect(() => {
    setOrderedColumns(columns);
  }, [serializedParentColumns]);

  // 2. Ref-wrap volatile callbacks to prevent React state re-render cycles from destroying the table
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onRowClickRef = useRef(onRowClick);
  const onLoadMoreRef = useRef(onLoadMore);
  const apiFunctionRef = useRef(apiFunction);
  const actionCallbackRef = useRef(actionCallback);

  useEffect(() => { onSelectionChangeRef.current = onSelectionChange; }, [onSelectionChange]);
  useEffect(() => { onRowClickRef.current = onRowClick; }, [onRowClick]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);
  useEffect(() => { apiFunctionRef.current = apiFunction; }, [apiFunction]);
  useEffect(() => { actionCallbackRef.current = actionCallback; }, [actionCallback]);

  // 3. Infinite Scroll State
  const isServerInfinite = enableInfiniteScroll && typeof apiFunction === "function";
  const [internalData, setInternalData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);

  const displayData = isServerInfinite ? internalData : data;
  const displayLoading = isServerInfinite ? internalLoading : isLoading;

  // Refs for Infinite Scroll control
  const pageRef = useRef(1);
  const searchRef = useRef("");
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const searchDebounceTimeoutRef = useRef(null);

  // 4. Selection State preservation
  const selectedRowIdsRef = useRef(new Set());

  // Helper to get unique row ID
  const getRowId = (row) => {
    if (!row) return "";
    if (typeof row === "string" || typeof row === "number") return row.toString();
    const idFields = ["id", "_id", "globalTypeId", "code", "globalTypeName"];
    for (const field of idFields) {
      if (row[field] !== undefined && row[field] !== null) {
        return row[field].toString();
      }
    }
    return JSON.stringify(row);
  };

  // Fetch more data for server-side infinite scroll
  const fetchMoreData = async (isReset = false) => {
    if (!isServerInfinite || isFetchingRef.current) return;
    if (!isReset && !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setInternalLoading(true);

    const currentPage = isReset ? 1 : pageRef.current;
    const currentSearch = searchRef.current;

    try {
      const response = await apiFunctionRef.current({
        page: currentPage,
        pageSize: pageSize,
        search: currentSearch,
      });

      let newItems = [];
      let total = null;

      if (Array.isArray(response)) {
        newItems = response;
      } else if (response && Array.isArray(response.data)) {
        newItems = response.data;
        total = response.total;
      } else if (response && Array.isArray(response.records)) {
        newItems = response.records;
        total = response.totalRecords;
      }

      setInternalData((prev) => {
        const updated = isReset ? newItems : [...prev, ...newItems];
        if (total !== null && total !== undefined) {
          hasMoreRef.current = updated.length < total;
        } else {
          hasMoreRef.current = newItems.length >= pageSize;
        }
        return updated;
      });

      pageRef.current = currentPage + 1;
    } catch (error) {
      console.error("Error fetching infinite scroll data:", error);
    } finally {
      isFetchingRef.current = false;
      setInternalLoading(false);
    }
  };

  const fetchMoreDataRef = useRef(null);
  fetchMoreDataRef.current = fetchMoreData;

  // Fetch initial page when apiFunction is provided
  useEffect(() => {
    if (isServerInfinite) {
      pageRef.current = 1;
      hasMoreRef.current = true;
      setInternalData([]);
      fetchMoreData(true);
    }
  }, [isServerInfinite, apiFunction, pageSize]);

  // Clean up search debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimeoutRef.current) {
        clearTimeout(searchDebounceTimeoutRef.current);
      }
    };
  }, []);

  const serializedColumns = serializeColumns(orderedColumns);

  useEffect(() => {
    // 1. Inject styles programmatically (completely scoped to .dt-ms-table and .dt-ms-instance)
    if (!document.getElementById("dt-col-resizer-style")) {
      const style = document.createElement("style");
      style.id = "dt-col-resizer-style";
      style.innerHTML = `
        /* Scoped light shade for table headers */
        table.dataTable.dt-ms-table thead th {
          background-color: #f8f9fa !important;
          color: #495057 !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #dee2e6 !important;
          position: relative !important;
          overflow: visible !important; /* Ensure resizer handle is visible */
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table thead th {
          background-color: #1a1e29 !important;
          color: #f8f9fa !important;
          border-bottom: 2px solid #2d3748 !important;
        }

        /* Scoped small borders - only active when bordered parameter is true */
        table.dataTable.dt-ms-table.dt-bordered-grid {
          border: 1px solid #dee2e6 !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          border-radius: 6px !important;
          overflow: hidden !important;
        }
        table.dataTable.dt-ms-table.dt-bordered-grid thead th,
        table.dataTable.dt-ms-table.dt-bordered-grid tbody td,
        table.dataTable.dt-ms-table.dt-bordered-grid tfoot th {
          border-right: 1px solid #dee2e6 !important;
          border-bottom: 1px solid #dee2e6 !important;
        }
        table.dataTable.dt-ms-table.dt-bordered-grid thead th:last-child,
        table.dataTable.dt-ms-table.dt-bordered-grid tbody td:last-child,
        table.dataTable.dt-ms-table.dt-bordered-grid tfoot th:last-child {
          border-right: none !important;
        }
        table.dataTable.dt-ms-table.dt-bordered-grid tbody tr:last-child td {
          border-bottom: none !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-bordered-grid {
          border-color: #2d3748 !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-bordered-grid thead th,
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-bordered-grid tbody td,
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-bordered-grid tfoot th {
          border-right-color: #2d3748 !important;
          border-bottom-color: #2d3748 !important;
        }

        /* Scoped Custom Column Resizer handle (AG-Grid-style) */
        .dt-ms-table .dt-resizer {
          position: absolute !important;
          top: 0 !important;
          right: -6px !important; /* Centered on the border line */
          width: 12px !important; /* Wide enough to easily grab */
          height: 100% !important;
          cursor: col-resize !important;
          user-select: none !important;
          z-index: 1000 !important;
          background: transparent !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }
        /* The visible vertical line inside the handle */
        .dt-ms-table .dt-resizer::after {
          content: '' !important;
          display: block !important;
          width: 1px !important;
          height: 50% !important; /* 50% height of header, centered */
          background-color: #dee2e6 !important; /* Subtle grey vertical line separator by default */
          transition: background-color 0.15s ease, width 0.15s ease, height 0.15s ease !important;
        }
        [data-bs-theme="dark"] .dt-ms-table .dt-resizer::after {
          background-color: #4a5568 !important;
        }
        /* Hover & active states (AG Grid style highlight) */
        .dt-ms-table .dt-resizer:hover::after,
        .dt-ms-table .dt-resizer.resizing::after {
          background-color: #3f46fa !important; /* Bright blue highlight on hover/drag */
          width: 2px !important; /* Thicker line */
          height: 100% !important; /* Full height line indicator during interaction */
        }
        /* Enforce fixed layout for smooth resizing */
        table.dataTable.dt-ms-table.dt-layout-fixed {
          table-layout: fixed !important;
          width: 100% !important;
        }

        /* Scoped Zebra Striping */
        table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.odd td {
          background-color: #ffffff !important;
          box-shadow: none !important;
        }
        table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.even td {
          background-color: #f8f9fa !important;
          box-shadow: none !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.odd td {
          background-color: #11141c !important;
          box-shadow: none !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.even td {
          background-color: #161a23 !important;
          box-shadow: none !important;
        }

        /* Scoped Row Selection highlighting (ensures override of zebra stripe backgrounds) */
        table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.selected td,
        table.dataTable.dt-ms-table tbody tr.selected td {
          background-color: rgba(63, 70, 250, 0.12) !important;
          box-shadow: none !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table.dt-zebra-stripes tbody tr.selected td,
        [data-bs-theme="dark"] table.dataTable.dt-ms-table tbody tr.selected td {
          background-color: rgba(63, 70, 250, 0.25) !important;
          box-shadow: none !important;
        }

        /* Scoped Drag and Drop Column Reordering styles (AG Grid style) */
        .dt-reorder-ghost {
          background-color: #ffffff !important;
          border: 1px solid #dee2e6 !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04) !important;
          border-radius: 6px !important;
          padding: 6px 12px !important;
          opacity: 0.95 !important;
          pointer-events: none !important;
          z-index: 9999 !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          color: #212529 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        [data-bs-theme="dark"] .dt-reorder-ghost {
          background-color: #1a1e29 !important;
          border-color: #2d3748 !important;
          color: #f8f9fa !important;
        }
        .dt-reorder-icon {
          color: #6c757d !important;
          font-weight: bold !important;
          font-size: 14px !important;
        }
        .dt-reorder-line {
          width: 2px !important;
          background-color: #3f46fa !important;
          z-index: 9998 !important;
          pointer-events: none !important;
        }
        table.dataTable.dt-ms-table thead th.dt-dragging-original {
          opacity: 0.4 !important;
          background-color: rgba(63, 70, 250, 0.05) !important;
        }

        /* Custom empty message styling */
        table.dataTable.dt-ms-table td.dataTables_empty {
          text-align: center !important;
          padding: 40px 20px !important;
          color: #6c757d !important;
          font-size: 14px !important;
          background-color: transparent !important;
        }
        [data-bs-theme="dark"] table.dataTable.dt-ms-table td.dataTables_empty {
          color: #a0aec0 !important;
        }

        /* Premium loading overlay styling */
        .dt-ms-instance .dt-loading-overlay {
          background-color: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(1px) !important;
          z-index: 1050 !important;
        }
        [data-bs-theme="dark"] .dt-ms-instance .dt-loading-overlay {
          background-color: rgba(21, 25, 34, 0.7) !important;
        }

        /* Infinite scroll bottom loader */
        .dt-ms-instance .dt-infinite-loading-spinner {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 10px 0 !important;
          background: transparent !important;
        }

        /* Scoped Export and Pagination Alignment: Pushed to the far right (end) */
        .dt-ms-instance .row > div:has(.dataTables_filter),
        .dt-ms-instance .row > div:has(.dataTables_paginate) {
          display: flex !important;
          justify-content: flex-end !important;
          align-items: center;
        }
        .dt-ms-instance .dataTables_filter {
          display: inline-flex !important;
          align-items: center !important;
          gap: 12px !important;
          flex-wrap: wrap !important;
        }
        .dt-ms-instance .dataTables_filter label {
          margin-bottom: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .dt-ms-instance .dataTables_filter input {
          margin-left: 0 !important;
          padding: 5px 10px !important;
          font-size: 13px !important;
          border-radius: 4px !important;
          border: 1px solid #ced4da !important;
        }
        [data-bs-theme="dark"] .dt-ms-instance .dataTables_filter input {
          background-color: #151922 !important;
          border-color: #2d3748 !important;
          color: #f8f9fa !important;
        }

        /* Mobile responsive stacking and centering */
        @media (max-width: 767.98px) {
          .dt-ms-instance .row > div:has(.dataTables_filter),
          .dt-ms-instance .row > div:has(.dataTables_paginate) {
            justify-content: center !important;
            margin-top: 10px !important;
          }
          .dt-ms-instance .dataTables_filter {
            justify-content: center !important;
            width: 100% !important;
          }
          .dt-ms-instance .dataTables_length {
            text-align: center !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const timer = setTimeout(() => {
      // Prepend dynamic Row Selection checkbox column if selectable is true
      let finalColumns = [...orderedColumns];
      if (selectable) {
        finalColumns.unshift({
          data: null,
          defaultContent: "",
          orderable: false,
          className: "dt-select-cell text-center",
          width: "40px",
          title: `<input class="form-check-input dt-select-all" type="checkbox" style="cursor: pointer; width: 16px; height: 16px;">`,
          render: function () {
            return `<input class="form-check-input dt-row-select" type="checkbox" style="cursor: pointer; width: 16px; height: 16px;">`;
          },
        });
      }

      let datatableObj = {
        dom: enableInfiniteScroll
          ? '<"row align-items-center"<"col-md-6" f>><"table-responsive" rt><"clear">'
          : '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
        autoWidth: false,
        columns: finalColumns,
        destroy: true,
        language: {
          zeroRecords: emptyMessage,
          emptyTable: emptyMessage,
        },
      };

      if (url) {
        datatableObj = {
          ...datatableObj,
          processing: true,
          serverSide: true,
          ajax: {
            url: url,
          },
        };
      }

      // Initialize with displayData
      if (displayData) {
        datatableObj = {
          ...datatableObj,
          data: displayData,
        };
      }

      if (isFooter) {
        datatableObj = {
          ...datatableObj,
          initComplete: function () {
            const footerRow = document.createElement("tr");
            finalColumns.forEach((column) => {
              const footerCell = document.createElement("th");
              if (column.className && column.className.includes("dt-select-cell")) {
                footerCell.innerHTML = "";
              } else {
                footerCell.append(column.title);
              }
              footerRow.append(footerCell);
            });

            $(tableRef.current).append($("<tfoot>").append(footerRow));
          },
        };
      }
      if (isFilterColumn) {
        datatableObj = {
          ...datatableObj,
          initComplete: function () {
            const footerRow = document.createElement("tr");
            const table = $(tableRef.current).DataTable();
            finalColumns.forEach((column) => {
              const footerCell = document.createElement("td");
              if (column.className && column.className.includes("dt-select-cell")) {
                footerRow.append(footerCell);
                return;
              }
              const input = document.createElement("input");
              input.type = "text";
              input.className = "form-control form-control-sm";
              input.placeholder = column.title;
              input.addEventListener("keyup", (event) => {
                const columnIndex = finalColumns.findIndex(
                  (c) => c.title === column.title
                );
                table.columns(columnIndex).search(event.target.value).draw();
              });
              footerCell.append(input);
              footerRow.append(footerCell);
            });

            $(tableRef.current).append($("<tfoot>").append(footerRow));
          },
        };
      }

      function languageSelect() {
        if (tableRef.current) {
          return Array.from(document.querySelector("#langSelector").options)
            .filter((option) => option.selected)
            .map((option) => option.getAttribute("data-path"));
        }
      }

      const setMultiLang = () => {
        datatableObj = {
          ...datatableObj,
          language: {
            ...datatableObj.language,
            url: languageSelect(),
          },
        };
      };
      if (isMultilang) {
        setMultiLang();
      }

      if (enableInfiniteScroll) {
        datatableObj = {
          ...datatableObj,
          scrollY: scrollHeight || "400px",
          paging: false,
          scrollCollapse: true,
        };
      }

      // Initialize DataTable
      const $table = $(tableRef.current);
      $table.addClass("dt-ms-table");
      if (bordered) {
        $table.addClass("dt-bordered-grid");
      }
      if (zebra) {
        $table.addClass("dt-zebra-stripes");
      }

      let datatable = $table.DataTable(datatableObj);

      // Scopes the parent wrapper instance
      const $wrapper = $table.closest(".dataTables_wrapper");
      $wrapper.addClass("dt-ms-instance");

      // 2. Implement Draggable Column Resizing (AG-Grid-style) with redraw preservation
      const enableColumnResizing = () => {
        const isLayoutFixed = $table.hasClass("dt-layout-fixed");

        $table.find("thead th").each(function () {
          const $th = $(this);

          // Re-apply stored width if layout is fixed to prevent jumpiness on redraw
          const storedWidth = $th.attr("data-resized-width");
          if (isLayoutFixed && storedWidth) {
            $th.css({
              "width": storedWidth + "px",
              "min-width": storedWidth + "px",
              "max-width": storedWidth + "px"
            });
          }

          // Only add resizer if it doesn't exist yet and it's not a helper/empty column or select cell
          if (
            !$th.find(".dt-resizer").length &&
            !$th.find(".dt-select-all").length &&
            $th.text() !== "Action" &&
            $th.text() !== ""
          ) {
            const $resizer = $('<div class="dt-resizer"></div>');
            $th.css("position", "relative");
            $th.append($resizer);

            let startX, startWidth;
            $resizer.off("mousedown").on("mousedown", function (e) {
              startX = e.pageX;
              startWidth = $th.outerWidth();
              $resizer.addClass("resizing");

              // Lock all header column widths in pixels before starting fixed-layout resize
              if (!$table.hasClass("dt-layout-fixed")) {
                $table.find("thead th").each(function () {
                  const $cell = $(this);
                  const currentWidth = $cell.outerWidth();
                  $cell.attr("data-resized-width", currentWidth);
                  $cell.css({
                    "width": currentWidth + "px",
                    "min-width": currentWidth + "px",
                    "max-width": currentWidth + "px"
                  });
                });
                $table.addClass("dt-layout-fixed");
              }

              $(document).on("mousemove.colResize", function (e) {
                const newWidth = Math.max(50, startWidth + (e.pageX - startX));
                $th.attr("data-resized-width", newWidth);
                $th.css({
                  "width": newWidth + "px",
                  "min-width": newWidth + "px",
                  "max-width": newWidth + "px"
                });
              });

              $(document).on("mouseup.colResize", function () {
                $resizer.removeClass("resizing");
                $(document).off("mousemove.colResize mouseup.colResize");
                datatable.columns.adjust();
              });

              e.preventDefault();
              e.stopPropagation();
            });
          }
        });
      };

      // 3. Implement AG-Grid-style Column Reordering with a Custom Ghost Helper and full vertical Insertion Line
      const enableDragAndDropReordering = () => {
        const $headers = $table.find("thead th");

        $headers.each(function (index) {
          const $th = $(this);

          // Skip selection checkbox column
          if (selectable && index === 0) return;
          if ($th.text() === "Action" || $th.text() === "") return;

          $th.css("cursor", "grab");

          $th.off("mousedown.dtDrag").on("mousedown.dtDrag", function (downEvent) {
            // Ignore if clicking on resizer handle, input, checkbox, or buttons
            if ($(downEvent.target).closest(".dt-resizer, input, checkbox, .btn, .dropdown").length) {
              return;
            }

            downEvent.preventDefault();

            const startX = downEvent.pageX;
            const startY = downEvent.pageY;
            let isDragging = false;
            let $ghost = null;
            let $line = null;
            let lastInsertIdx = -1;

            $(document).on("mousemove.dtDrag", function (moveEvent) {
              const deltaX = moveEvent.pageX - startX;
              const deltaY = moveEvent.pageY - startY;

              // Start drag only after moving past threshold (5px)
              if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                isDragging = true;
                $th.addClass("dt-dragging-original");

                // Create AG-Grid style ghost helper
                $ghost = $('<div class="dt-reorder-ghost"></div>');
                $ghost.html(`<span class="dt-reorder-icon">✥</span> <span class="dt-reorder-title">${$th.text().trim()}</span>`);
                $("body").append($ghost);

                // Create vertical insertion line indicator
                $line = $('<div class="dt-reorder-line"></div>');
                $("body").append($line);
              }

              if (isDragging) {
                // Track mouse cursor with ghost helper
                $ghost.css({
                  left: (moveEvent.pageX + 12) + "px",
                  top: (moveEvent.pageY + 12) + "px",
                  position: "absolute"
                });

                // Find which column header the mouse is over
                let targetIdx = -1;
                let insertIdx = -1;
                let targetRect = null;
                let isLeftHalf = true;

                $headers.each(function (idx) {
                  const rect = this.getBoundingClientRect();
                  const pageLeft = rect.left + window.scrollX;
                  const pageRight = rect.right + window.scrollX;

                  if (moveEvent.pageX >= pageLeft && moveEvent.pageX <= pageRight) {
                    targetIdx = idx;
                    targetRect = rect;
                    isLeftHalf = moveEvent.pageX < (pageLeft + rect.width / 2);
                    insertIdx = isLeftHalf ? idx : idx + 1;
                    return false; // Break loop
                  }
                });

                // Enforce boundary constraints (don't move checkbox or move columns before it)
                if (selectable && (insertIdx <= 1 || targetIdx === 0)) {
                  $line.css("display", "none");
                  lastInsertIdx = -1;
                  return;
                }

                if (targetIdx !== -1 && targetRect) {
                  // Position vertical blue insertion line running down the entire table
                  const lineX = isLeftHalf ? targetRect.left : targetRect.right;
                  const tableRect = $table[0].getBoundingClientRect();

                  $line.css({
                    left: (window.scrollX + lineX) + "px",
                    top: (window.scrollY + targetRect.top) + "px",
                    height: (tableRect.bottom - targetRect.top) + "px",
                    position: "absolute",
                    display: "block",
                  });
                  
                  lastInsertIdx = insertIdx;
                } else {
                  $line.css("display", "none");
                  lastInsertIdx = -1;
                }
              }
            });

            $(document).on("mouseup.dtDrag", function () {
              $(document).off("mousemove.dtDrag mouseup.dtDrag");

              if (isDragging) {
                $th.removeClass("dt-dragging-original");
                if ($ghost) $ghost.remove();
                if ($line) $line.remove();

                if (lastInsertIdx !== -1 && lastInsertIdx !== index && lastInsertIdx !== index + 1) {
                  handleColumnReorder(index, lastInsertIdx);
                }
              }
            });
          });
        });
      };

      const handleColumnReorder = (fromIdx, toIdx) => {
        const fromUserIdx = selectable ? fromIdx - 1 : fromIdx;
        const toUserIdx = selectable ? toIdx - 1 : toIdx;

        // Clear layout fixed class and inline styles on the table and headers to let them recalculate perfectly
        $table.removeClass("dt-layout-fixed");
        $table.find("thead th").css({
          width: "",
          "min-width": "",
          "max-width": ""
        }).removeAttr("data-resized-width");

        setOrderedColumns((prev) => {
          const nextColumns = reorderArray(prev, fromUserIdx, toUserIdx);
          
          const visualColumnsOrder = nextColumns.map((col, idx) => ({
            title: col.title,
            dataKey: col.data,
            index: idx,
          }));

          console.log("Column Reorder Event Details:", {
            fromIndex: fromUserIdx,
            toIndex: toUserIdx,
            draggedColumn: prev[fromUserIdx]?.title,
          });
          console.log("New Column Order (Visual):", visualColumnsOrder);

          return nextColumns;
        });
      };

      enableColumnResizing();
      enableDragAndDropReordering();

      // A function to restore the selections (checked checkboxes and .selected class) on redraw
      const restoreSelection = () => {
        if (!selectable) return;
        let checkedCount = 0;
        let totalCount = 0;

        $table.find("tbody tr").each(function () {
          const rowData = datatable.row(this).data();
          if (rowData) {
            totalCount++;
            const rowId = getRowId(rowData);
            const isSelected = selectedRowIdsRef.current.has(rowId);
            $(this).toggleClass("selected", isSelected);
            $(this).find(".dt-row-select").prop("checked", isSelected);
            if (isSelected) {
              checkedCount++;
            }
          }
        });

        const $selectAll = $table.find(".dt-select-all");
        if (totalCount > 0) {
          $selectAll.prop("checked", checkedCount === totalCount);
          $selectAll.prop("indeterminate", checkedCount > 0 && checkedCount < totalCount);
        } else {
          $selectAll.prop("checked", false).prop("indeterminate", false);
        }
      };

      // Re-apply features when columns are drawn (e.g. pagination, sorting)
      datatable.on("draw", () => {
        enableColumnResizing();
        enableDragAndDropReordering();
        restoreSelection();
      });

      // 4. Inject Export dropdown (CSV, Excel, PDF) to the left of the native Search box
      const $filterContainer = $wrapper.find(".dataTables_filter");
      if ($filterContainer.length) {
        // Remove any old buttons to avoid duplicates
        $filterContainer.find(".dt-custom-buttons").remove();

        const buttonsHtml = `
          <div class="dt-custom-buttons d-inline-flex align-items-center gap-2 me-2">
            <!-- Custom Export Dropdown -->
            <div class="dropdown d-inline-block">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="ri-download-2-line"></i> Export
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item export-csv-btn" href="#"><i class="ri-file-text-line me-2"></i>CSV</a></li>
                <li><a class="dropdown-item export-excel-btn" href="#"><i class="ri-file-excel-line me-2"></i>Excel</a></li>
                <li><a class="dropdown-item export-pdf-btn" href="#"><i class="ri-file-pdf-line me-2"></i>PDF</a></li>
              </ul>
            </div>
          </div>
        `;
        $filterContainer.prepend(buttonsHtml);

        const $customButtons = $filterContainer.find(".dt-custom-buttons");
        const $toggleBtn = $customButtons.find(".dropdown-toggle");
        const $dropdownMenu = $customButtons.find(".dropdown-menu");

        // Robust manual click handler for the dropdown toggle
        $toggleBtn.off("click").on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = $dropdownMenu.hasClass("show");
          $(".dt-custom-buttons .dropdown-menu").removeClass("show");
          if (!isOpen) {
            $dropdownMenu.addClass("show");
          }
        });

        // Close dropdown when clicking anywhere outside
        $(document).off("click.dtExportDropdown").on("click.dtExportDropdown", function (e) {
          if (!$(e.target).closest(".dt-custom-buttons .dropdown").length) {
            $(".dt-custom-buttons .dropdown-menu").removeClass("show");
          }
        });

        // Bind Export Actions
        const exportData = (type) => {
          const visualIndexes = datatable.columns().indexes().toArray();
          const headersInVisualOrder = visualIndexes.map(idx => {
            const headerCell = datatable.column(idx).header();
            return $(headerCell).text().replace(/Filter.*$/, '').trim();
          });

          const exportHeaders = [];
          const exportOriginalIndexes = [];

          visualIndexes.forEach((origIdx, visIdx) => {
            const title = headersInVisualOrder[visIdx];
            if (title && title !== "S.No" && title !== "Action" && title !== "") {
              exportHeaders.push(title);
              exportOriginalIndexes.push(origIdx);
            }
          });

          const tableData = datatable.rows({ search: "applied" }).data().toArray();

          if (type === "pdf") {
            const printWindow = window.open("", "_blank");
            let html = `
              <html>
                <head>
                  <title>Exported Table</title>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                      color: #333;
                      padding: 20px;
                    }
                    h2 {
                      margin-bottom: 20px;
                      color: #2b3a42;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-top: 10px;
                    }
                    th, td {
                      border: 1px solid #dee2e6;
                      padding: 10px 12px;
                      text-align: left;
                      font-size: 13px;
                    }
                    th {
                      background-color: #f8f9fa;
                      font-weight: bold;
                      color: #495057;
                    }
                    tr:nth-child(even) {
                      background-color: #fcfcfc;
                    }
                  </style>
                </head>
                <body>
                  <h2>Exported Records</h2>
                  <table>
                    <thead>
                      <tr>
            `;

            exportHeaders.forEach(h => {
              html += `<th>${h}</th>`;
            });

            html += `
                      </tr>
                    </thead>
                    <tbody>
            `;

            tableData.forEach((row) => {
              html += "<tr>";
              exportOriginalIndexes.forEach((origIdx) => {
                let cell = "";
                if (Array.isArray(row)) {
                  cell = row[origIdx] !== undefined && row[origIdx] !== null ? row[origIdx] : "";
                } else if (typeof row === "object") {
                  const colKey = orderedColumns[origIdx]?.data;
                  cell = colKey && row[colKey] !== undefined && row[colKey] !== null ? row[colKey] : "";
                }
                if (typeof cell === "object") cell = cell.text || cell.toString() || "";
                html += `<td>${cell.toString()}</td>`;
              });
              html += "</tr>";
            });

            html += `
                    </tbody>
                  </table>
                  <script>
                    window.onload = function() {
                      window.print();
                      setTimeout(function() { window.close(); }, 500);
                    };
                  </script>
                </body>
              </html>
            `;
            printWindow.document.write(html);
            printWindow.document.close();
            return;
          }

          let fileContent = "";
          if (type === "csv") {
            fileContent = "\uFEFF"; // UTF-8 BOM
            fileContent += exportHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
            tableData.forEach((row) => {
              const rowData = exportOriginalIndexes.map((origIdx) => {
                let cell = "";
                if (Array.isArray(row)) {
                  cell = row[origIdx] !== undefined && row[origIdx] !== null ? row[origIdx] : "";
                } else if (typeof row === "object") {
                  const colKey = orderedColumns[origIdx]?.data;
                  cell = colKey && row[colKey] !== undefined && row[colKey] !== null ? row[colKey] : "";
                }
                if (typeof cell === "object") cell = cell.text || cell.toString() || "";
                return `"${cell.toString().replace(/"/g, '""')}"`;
              });
              fileContent += rowData.join(",") + "\n";
            });
          } else {
            fileContent = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="hdr"><Font ss:Bold="1"/><Interior ss:Color="#f2f2f2" ss:Pattern="Solid"/></Style></Styles><Worksheet ss:Name="Sheet1"><Table>`;
            fileContent += "<Row>";
            exportHeaders.forEach((h) => {
              fileContent += `<Cell ss:StyleID="hdr"><Data ss:Type="String">${h}</Data></Cell>`;
            });
            fileContent += "</Row>";
            tableData.forEach((row) => {
              fileContent += "<Row>";
              exportOriginalIndexes.forEach((origIdx) => {
                let cell = "";
                if (Array.isArray(row)) {
                  cell = row[origIdx] !== undefined && row[origIdx] !== null ? row[origIdx] : "";
                } else if (typeof row === "object") {
                  const colKey = orderedColumns[origIdx]?.data;
                  cell = colKey && row[colKey] !== undefined && row[colKey] !== null ? row[colKey] : "";
                }
                if (typeof cell === "object") cell = cell.text || cell.toString() || "";
                const cellType = isNaN(cell) || cell === "" ? "String" : "Number";
                fileContent += `<Cell><Data ss:Type="${cellType}">${cell}</Data></Cell>`;
              });
              fileContent += "</Row>";
            });
            fileContent += "</Table></Worksheet></Workbook>";
          }

          const blob = new Blob([fileContent], {
            type: type === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel",
          });
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.setAttribute("href", downloadUrl);
          link.setAttribute("download", `export_${new Date().getTime()}.${type === "csv" ? "csv" : "xls"}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        $customButtons.find(".export-csv-btn").on("click", (e) => {
          e.preventDefault();
          exportData("csv");
        });
        $customButtons.find(".export-excel-btn").on("click", (e) => {
          e.preventDefault();
          exportData("xls");
        });
        $customButtons.find(".export-pdf-btn").on("click", (e) => {
          e.preventDefault();
          exportData("pdf");
        });
      }

      // 5. Bind Row Selection Event Handlers
      if (selectable) {
        $table.off("change", ".dt-row-select").on("change", ".dt-row-select", function (e) {
          e.stopPropagation();
          const $tr = $(this).closest("tr");
          const rowData = datatable.row($tr[0]).data();
          if (!rowData) return;

          const rowId = getRowId(rowData);
          const isChecked = $(this).is(":checked");

          if (isChecked) {
            selectedRowIdsRef.current.add(rowId);
          } else {
            selectedRowIdsRef.current.delete(rowId);
          }

          $tr.toggleClass("selected", isChecked);

          // Update Select All checkbox state
          const allCheckboxes = $table.find(".dt-row-select");
          const checkedCheckboxes = allCheckboxes.filter(":checked");
          $table.find(".dt-select-all").prop("checked", allCheckboxes.length === checkedCheckboxes.length);
          $table.find(".dt-select-all").prop("indeterminate", checkedCheckboxes.length > 0 && checkedCheckboxes.length < allCheckboxes.length);

          triggerSelectionChange();
        });

        $table.off("change", ".dt-select-all").on("change", ".dt-select-all", function (e) {
          e.stopPropagation();
          const isChecked = $(this).is(":checked");

          $table.find("tbody tr").each(function () {
            const rowData = datatable.row(this).data();
            if (rowData) {
              const rowId = getRowId(rowData);
              if (isChecked) {
                selectedRowIdsRef.current.add(rowId);
              } else {
                selectedRowIdsRef.current.delete(rowId);
              }
              $(this).toggleClass("selected", isChecked);
              $(this).find(".dt-row-select").prop("checked", isChecked);
            }
          });

          triggerSelectionChange();
        });

        const triggerSelectionChange = () => {
          if (typeof onSelectionChangeRef.current === "function") {
            const selectedData = [];
            displayData.forEach((item) => {
              const rowId = getRowId(item);
              if (selectedRowIdsRef.current.has(rowId)) {
                selectedData.push(item);
              }
            });
            onSelectionChangeRef.current(selectedData);
          }
        };
      }

      // 6. Bind Row Click Handlers
      if (typeof onRowClickRef.current === "function") {
        $table.off("click", "tbody tr").on("click", "tbody tr", function (e) {
          if ($(e.target).closest(".dt-select-cell, [data-table='action'], .btn, .dropdown, input").length) {
            return;
          }
          const rowData = datatable.row(this).data();
          if (rowData) {
            onRowClickRef.current(rowData);
          }
        });
      }

      // 7. Bind Infinite Scroll events
      if (enableInfiniteScroll) {
        const $scrollBody = $wrapper.find(".dataTables_scrollBody");
        $scrollBody.off("scroll.dtInfinite").on("scroll.dtInfinite", function () {
          const scrollTop = $(this).scrollTop();
          const scrollHeightVal = $(this)[0].scrollHeight;
          const clientHeight = $(this)[0].clientHeight;

          if (scrollTop + clientHeight >= scrollHeightVal - 20) {
            const isLoadingRefVal = isServerInfinite ? internalLoading : isLoading;
            if (!isLoadingRefVal) {
              if (isServerInfinite) {
                fetchMoreDataRef.current?.();
              } else if (typeof onLoadMoreRef.current === "function") {
                onLoadMoreRef.current();
              }
            }
          }
        });
      }

      // 8. Bind Search event listener for Server Infinite Scroll
      if (isServerInfinite) {
        datatable.on("search.dt", () => {
          const query = datatable.search();
          if (query !== searchRef.current) {
            searchRef.current = query;
            pageRef.current = 1;
            hasMoreRef.current = true;

            if (searchDebounceTimeoutRef.current) {
              clearTimeout(searchDebounceTimeoutRef.current);
            }

            searchDebounceTimeoutRef.current = setTimeout(() => {
              fetchMoreDataRef.current?.(true);
            }, 400);
          }
        });
      }

      if (typeof actionCallback === "function") {
        $(datatable.table().body()).on(
          "click",
          '[data-table="action"]',
          function () {
            actionCallback({
              id: $(this).data("id"),
              method: $(this).data("method"),
            });
          }
        );
      }

      if (isColumnHidden) {
        $(isColumnHiddenClass).on("click", function (e) {
          e.preventDefault();
          const column = datatable.column($(this).attr("data-column"));
          column.visible(!column.visible());
        });
      }

      if (isMultilang) {
        document
          .querySelector("#langSelector")
          .addEventListener("change", () => {
            $(tableRef.current).DataTable().destroy();
            setMultiLang();
            datatable = $(tableRef.current).DataTable(datatableObj);
          });
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      if (tableRef.current && $.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).empty();
    };
  }, [
    tableRef,
    serializedColumns,
    url,
    isColumnHidden,
    isColumnHiddenClass,
    isFilterColumn,
    isFooter,
    isMultilang,
    bordered,
    selectable,
    zebra,
    enableInfiniteScroll,
    scrollHeight,
    pageSize,
    emptyMessage,
  ]);

  // 4. Perform dynamic data loading/append updates (optimized for smooth infinite scrolls)
  useEffect(() => {
    if (tableRef.current && $.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
      const datatable = $(tableRef.current).DataTable();

      if (enableInfiniteScroll) {
        const currentCount = datatable.rows().count();
        if (displayData.length > currentCount) {
          const newRows = displayData.slice(currentCount);
          datatable.rows.add(newRows).draw(false);
        } else if (displayData.length !== currentCount) {
          // Data got replaced or reset
          datatable.clear().rows.add(displayData).draw(false);
        }
      } else {
        // Standard paging mode: clear and draw all records preserving the page position
        datatable.clear().rows.add(displayData).draw(false);
      }
    }
  }, [displayData, enableInfiniteScroll, tableRef]);

  // 5. Toggle loading overlays on changes to displayLoading
  useEffect(() => {
    if (tableRef.current && $.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
      const $wrapper = $(tableRef.current).closest(".dataTables_wrapper");
      if ($wrapper.length) {
        // Remove any existing loaders first
        $wrapper.find(".dt-loading-overlay").remove();
        $wrapper.find(".dt-infinite-loading-spinner").remove();

        if (displayLoading) {
          if (enableInfiniteScroll && displayData.length > 0) {
            // Bottom spinner for infinite scroll
            const $scrollBody = $wrapper.find(".dataTables_scrollBody");
            if ($scrollBody.length) {
              $scrollBody.append(`
                <div class="dt-infinite-loading-spinner text-center py-2">
                  <div class="spinner-border spinner-border-sm text-primary" role="status" style="width: 1.2rem; height: 1.2rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              `);
              $scrollBody.scrollTop($scrollBody[0].scrollHeight);
            }
          } else {
            // Full-table overlay (for standard mode or when table is empty)
            $wrapper.css("position", "relative");
            $wrapper.append(`
              <div class="dt-loading-overlay d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100">
                <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            `);
          }
        }
      }
    }
  }, [displayLoading, displayData, tableRef]);
};

export default useDataTableMS;

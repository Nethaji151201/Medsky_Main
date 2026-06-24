import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-bs5";

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
}) => {
  useEffect(() => {
    // 1. Inject resizer, border, and export alignment styles programmatically (completely scoped to .dt-ms-table and .dt-ms-instance)
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

        /* Scoped Export and Pagination Alignment: Pushed to the far right (end) */
        .dt-ms-instance .row > div:has(.dataTables_filter),
        .dt-ms-instance .row > div:has(.dataTables_paginate) {
          display: flex !important;
          justify-content: flex-end !important;
          align-items: center !important;
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

    setTimeout(() => {
      let datatableObj = {
        dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
        autoWidth: false,
        columns: columns,
        destroy: true,
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

      if (data) {
        datatableObj = {
          ...datatableObj,
          data: data,
        };
      }

      if (isFooter) {
        datatableObj = {
          ...datatableObj,
          initComplete: function () {
            const footerRow = document.createElement("tr");
            columns.forEach((column) => {
              const footerCell = document.createElement("th");
              footerCell.append(column.title);
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
            columns.forEach((column) => {
              const footerCell = document.createElement("td");
              const input = document.createElement("input");
              input.type = "text";
              input.className = "form-control form-control-sm";
              input.placeholder = column.title;
              input.addEventListener("keyup", (event) => {
                const columnIndex = columns.findIndex(
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
            url: languageSelect(),
          },
        };
      };
      if (isMultilang) {
        setMultiLang();
      }

      // Initialize DataTable
      const $table = $(tableRef.current);
      $table.addClass("dt-ms-table");
      if (bordered) {
        $table.addClass("dt-bordered-grid");
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

          // Only add resizer if it doesn't exist yet and it's not a helper/empty column
          if (!$th.find(".dt-resizer").length && $th.text() !== "Action" && $th.text() !== "") {
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

      enableColumnResizing();

      // Re-apply resizers and enforce locked widths when columns are drawn (e.g. pagination, sorting)
      datatable.on("draw", () => {
        enableColumnResizing();
      });

      // 3. Inject Export dropdown (CSV, Excel, PDF) to the left of the native Search box
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
                  const colKey = columns[origIdx]?.data;
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
                  const colKey = columns[origIdx]?.data;
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
                  const colKey = columns[origIdx]?.data;
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
      if (tableRef.current && $.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      $(tableRef.current).empty();
    };
  }, [
    tableRef,
    columns,
    data,
    url,
    actionCallback,
    isColumnHidden,
    isColumnHiddenClass,
    isFilterColumn,
    isFooter,
    isMultilang,
    bordered,
  ]);
};

export default useDataTableMS;

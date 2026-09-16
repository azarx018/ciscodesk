import { ReactNode, useMemo, useState } from "react";
import "./DataTable.css";
import { LoadingState } from "../LoadingState";
import { EmptyState } from "../EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  width?: string;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
}

type SortDir = "asc" | "desc" | null;

/**
 * Generic, dense data table shared across every list view (Devices,
 * Interfaces, VLANs, Routes, ACLs, Logs, …). Individual pages supply
 * columns + rows; this component owns sorting, selection and the
 * loading/empty states so those don't get reimplemented per page.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading,
  emptyTitle = "No results",
  emptyBody = "There is no data to display yet.",
  selectable,
  selectedIds = [],
  onSelectionChange,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  function toggleSort(col: DataTableColumn<T>) {
    if (!col.sortValue) return;
    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  function toggleAll() {
    if (!onSelectionChange) return;
    if (selectedIds.length === rows.length) onSelectionChange([]);
    else onSelectionChange(rows.map(getRowId));
  }

  function toggleRow(id: string) {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  }

  return (
    <div className="cd-table-wrap">
      <table className="cd-table">
        <thead>
          <tr>
            {selectable && (
              <th className="cd-table-checkcol">
                <input
                  type="checkbox"
                  checked={rows.length > 0 && selectedIds.length === rows.length}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align }}
                className={col.sortValue ? "cd-table-sortable" : undefined}
                onClick={() => toggleSort(col)}
              >
                {col.header}
                {sortKey === col.key && (sortDir === "asc" ? " ▲" : sortDir === "desc" ? " ▼" : "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                <LoadingState rows={5} />
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                <EmptyState title={emptyTitle} body={emptyBody} />
              </td>
            </tr>
          ) : (
            sorted.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cd-table-row-clickable" : undefined}
                >
                  {selectable && (
                    <td className="cd-table-checkcol" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => toggleRow(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align }}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

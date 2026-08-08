import React, { useState, useMemo } from 'react';

/**
 * Generic sortable table.
 * columns: [{ key, label, sortable }]
 * data: array of row objects
 * renderCell: optional (row, col) => node, for custom cells
 */
export default function SortableTable({ columns, data, renderCell, rowKey = 'id' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col)}
                className={`px-4 py-3 text-left font-semibold select-none ${col.sortable ? 'cursor-pointer hover:text-brand-600' : ''}`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                No records found.
              </td>
            </tr>
          )}
          {sorted.map((row) => (
            <tr key={row[rowKey]} className="border-t border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {renderCell ? renderCell(row, col) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

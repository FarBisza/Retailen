import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown } from 'lucide-react';

// ─── Generic DataGrid Component (TanStack Table) ───

interface DataGridProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
    loading?: boolean;
    emptyMessage?: string;
    loadingMessage?: string;
    pageSize?: number;
}

export function DataGrid<T>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data found',
    loadingMessage = 'Loading...',
    pageSize = 20,
}: DataGridProps<T>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    return (
        <div>
            {/* Search / Filter Bar */}
            <div className="px-6 py-3 border-b border-gray-50">
                <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search…"
                    className="w-full max-w-xs px-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                />
            </div>

            {/* Table */}
            <table className="w-full text-left">
                <thead className="bg-white border-b border-gray-50 text-[9px] font-black uppercase text-gray-400">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-8 py-4 select-none"
                                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center gap-1">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' && <ChevronUp size={12} />}
                                        {header.column.getIsSorted() === 'desc' && <ChevronDown size={12} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="px-8 py-10 text-center text-gray-400">
                                {loadingMessage}
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-8 py-10 text-center text-gray-400">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50/20 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-8 py-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination footer */}
            {!loading && (
                <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()} — {table.getFilteredRowModel().rows.length} row(s)
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-700 hover:bg-gray-200 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-slate-700 hover:bg-gray-200 transition-all rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataGrid;

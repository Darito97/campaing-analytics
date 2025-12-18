import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Campaign } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const columnHelper = createColumnHelper<Campaign>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Nombre',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('tipo_campania', {
        header: 'Tipo',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('fecha_inicio', {
        header: 'Inicio',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('fecha_fin', {
        header: 'Fin',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('impactos_personas', {
        header: 'Impactos',
        cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('alcance', {
        header: 'Alcance',
        cell: info => info.getValue().toLocaleString(),
    }),
];

interface Props {
    data: Campaign[];
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (newPage: number) => void;
}

const CampaignTable = ({ data, total, page, pageSize, onPageChange }: Props) => {
    const navigate = useNavigate();
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: <ArrowUp className="h-4 w-4" />,
                                            desc: <ArrowDown className="h-4 w-4" />,
                                        }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            onClick={() => navigate(`/campanias/${row.original.name}`)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando página <span className="font-medium">{page + 1}</span> de <span className="font-medium">{totalPages}</span> ({total} resultados)
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px gap-2" aria-label="Pagination">
                            <button
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 0}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-white disabled:text-gray-600 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => onPageChange(page + 1)}
                                disabled={page >= totalPages - 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-white disabled:text-gray-600 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignTable;

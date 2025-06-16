import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ExpandedState,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for regulatory data
interface RegulatoryEvent {
  id: string;
  title: string;
  description: string;
  regulation: string;
  jurisdiction: string;
  effectiveDate: Date;
  status: 'draft' | 'proposed' | 'final' | 'effective' | 'superseded';
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
  source: string;
  lastUpdated: Date;
  assignedTo?: string;
  complianceDeadline?: Date;
  implementationStatus?: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  riskScore?: number;
  estimatedCost?: number;
  relatedEvents?: string[];
}

interface DataGridProps {
  data: RegulatoryEvent[];
  loading?: boolean;
  onRowSelect?: (selectedRows: RegulatoryEvent[]) => void;
  onExport?: (data: RegulatoryEvent[]) => void;
  enableSelection?: boolean;
  enableExpansion?: boolean;
}

const RegulatoryDataGrid: React.FC<DataGridProps> = ({
  data,
  loading = false,
  onRowSelect,
  onExport,
  enableSelection = true,
  enableExpansion = true,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);

  // Define columns
  const columns = useMemo<ColumnDef<RegulatoryEvent>[]>(
    () => [
      // Selection column
      ...(enableSelection
        ? [
            {
              id: 'select',
              header: ({ table }) => (
                <Checkbox
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              ),
              enableSorting: false,
              enableHiding: false,
              size: 40,
            } as ColumnDef<RegulatoryEvent>,
          ]
        : []),
      
      // Expansion column
      ...(enableExpansion
        ? [
            {
              id: 'expand',
              header: '',
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => row.toggleExpanded()}
                  className="p-1"
                >
                  {row.getIsExpanded() ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </Button>
              ),
              enableSorting: false,
              enableHiding: false,
              size: 40,
            } as ColumnDef<RegulatoryEvent>,
          ]
        : []),

      // Data columns
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className="max-w-xs">
            <div className="font-medium truncate">{row.getValue('title')}</div>
            <div className="text-sm text-gray-500 truncate">
              {row.original.regulation}
            </div>
          </div>
        ),
        size: 250,
      },
      {
        accessorKey: 'jurisdiction',
        header: 'Jurisdiction',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('jurisdiction')}</Badge>
        ),
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const statusColors = {
            draft: 'bg-gray-100 text-gray-800',
            proposed: 'bg-blue-100 text-blue-800',
            final: 'bg-green-100 text-green-800',
            effective: 'bg-emerald-100 text-emerald-800',
            superseded: 'bg-red-100 text-red-800',
          };
          return (
            <Badge className={statusColors[status as keyof typeof statusColors]}>
              {status}
            </Badge>
          );
        },
        filterFn: 'includesString',
        size: 100,
      },
      {
        accessorKey: 'impact',
        header: 'Impact',
        cell: ({ row }) => {
          const impact = row.getValue('impact') as string;
          const impactColors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
          };
          return (
            <Badge className={impactColors[impact as keyof typeof impactColors]}>
              {impact}
            </Badge>
          );
        },
        filterFn: 'includesString',
        size: 100,
      },
      {
        accessorKey: 'effectiveDate',
        header: 'Effective Date',
        cell: ({ row }) => {
          const date = row.getValue('effectiveDate') as Date;
          return date ? date.toLocaleDateString() : 'N/A';
        },
        sortingFn: 'datetime',
        size: 120,
      },
      {
        accessorKey: 'complianceDeadline',
        header: 'Deadline',
        cell: ({ row }) => {
          const deadline = row.getValue('complianceDeadline') as Date;
          if (!deadline) return 'N/A';
          
          const now = new Date();
          const isOverdue = deadline < now;
          const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div className={`text-sm ${
              isOverdue ? 'text-red-600 font-medium' : 
              daysUntil <= 30 ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {deadline.toLocaleDateString()}
              {isOverdue && <div className="text-xs">Overdue</div>}
              {!isOverdue && daysUntil <= 30 && (
                <div className="text-xs">{daysUntil} days left</div>
              )}
            </div>
          );
        },
        sortingFn: 'datetime',
        size: 120,
      },
      {
        accessorKey: 'implementationStatus',
        header: 'Implementation',
        cell: ({ row }) => {
          const status = row.getValue('implementationStatus') as string;
          if (!status) return 'N/A';
          
          const statusColors = {
            'not-started': 'bg-gray-100 text-gray-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'overdue': 'bg-red-100 text-red-800',
          };
          
          return (
            <Badge className={statusColors[status as keyof typeof statusColors]}>
              {status.replace('-', ' ')}
            </Badge>
          );
        },
        filterFn: 'includesString',
        size: 120,
      },
      {
        accessorKey: 'riskScore',
        header: 'Risk Score',
        cell: ({ row }) => {
          const score = row.getValue('riskScore') as number;
          if (score === undefined) return 'N/A';
          
          const scoreColor = score >= 80 ? 'text-red-600' : 
                           score >= 60 ? 'text-orange-600' : 
                           score >= 40 ? 'text-yellow-600' : 'text-green-600';
          
          return <span className={`font-medium ${scoreColor}`}>{score}</span>;
        },
        sortingFn: 'basic',
        size: 100,
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({ row }) => {
          const assignee = row.getValue('assignedTo') as string;
          return assignee ? (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{assignee}</span>
            </div>
          ) : 'Unassigned';
        },
        filterFn: 'includesString',
        size: 150,
      },
    ],
    [enableSelection, enableExpansion]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: 'includesString',
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Handle row selection callback
  useEffect(() => {
    if (onRowSelect) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onRowSelect(selectedRows);
    }
  }, [rowSelection, onRowSelect, table]);

  // Handle export
  const handleExport = () => {
    if (onExport) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const dataToExport = selectedRows.length > 0 
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original);
      onExport(dataToExport);
    }
  };

  // Render expanded row content
  const renderSubComponent = ({ row }: { row: any }) => {
    const event = row.original as RegulatoryEvent;
    return (
      <div className="p-4 bg-gray-50 border-t">
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Source:</strong> {event.source}</div>
                  <div><strong>Category:</strong> {event.category}</div>
                  <div><strong>Last Updated:</strong> {event.lastUpdated.toLocaleDateString()}</div>
                  {event.estimatedCost && (
                    <div><strong>Estimated Cost:</strong> ${event.estimatedCost.toLocaleString()}</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <strong>Created:</strong> {event.lastUpdated.toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <strong>Effective Date:</strong> {event.effectiveDate.toLocaleDateString()}
                </div>
              </div>
              {event.complianceDeadline && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="text-sm">
                    <strong>Compliance Deadline:</strong> {event.complianceDeadline.toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="mt-4">
            {event.relatedEvents && event.relatedEvents.length > 0 ? (
              <div className="space-y-2">
                {event.relatedEvents.map((relatedId, index) => (
                  <div key={index} className="p-2 bg-white rounded border text-sm">
                    Related Event: {relatedId}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No related events found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regulatory Events</CardTitle>
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-8 max-w-sm"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center space-x-2">
            {enableSelection && (
              <div className="text-sm text-gray-600">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center space-x-1 ${
                              header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            {header.column.getCanSort() && (
                              <span className="ml-1">
                                {header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDownIcon className="h-4 w-4" />
                                ) : header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUpIcon className="h-4 w-4" />
                                ) : (
                                  <div className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`border-b hover:bg-gray-50 ${
                          row.getIsSelected() ? 'bg-blue-50' : ''
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {row.getIsExpanded() && (
                        <tr>
                          <td colSpan={row.getVisibleCells().length}>
                            {renderSubComponent({ row })}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">
              Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} entries
            </p>
            
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                .filter((page) => {
                  const current = table.getState().pagination.pageIndex + 1;
                  return Math.abs(page - current) <= 2 || page === 1 || page === table.getPageCount();
                })
                .map((page, index, array) => {
                  const current = table.getState().pagination.pageIndex + 1;
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                      <Button
                        variant={current === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => table.setPageIndex(page - 1)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryDataGrid;
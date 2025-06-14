import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  GroupingState,
  ExpandedState,
  PaginationState,
  Row,
  Table as TanStackTable
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Search,
  Settings,
  Eye,
  EyeOff,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Building,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Enhanced types for GRC data
export interface GRCDataRow {
  id: string;
  title: string;
  type: 'regulation' | 'policy' | 'procedure' | 'assessment' | 'incident' | 'audit';
  status: 'active' | 'draft' | 'archived' | 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  framework: string;
  jurisdiction: string;
  department: string;
  owner: string;
  assignee?: string;
  dueDate?: string;
  lastUpdated: string;
  createdDate: string;
  complianceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  description?: string;
  attachments?: number;
  comments?: number;
  progress?: number;
  metadata?: Record<string, any>;
}

export interface TableAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: GRCDataRow) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: (row: GRCDataRow) => boolean;
}

export interface ColumnConfig {
  key: keyof GRCDataRow;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: GRCDataRow) => React.ReactNode;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'multiselect';
  filterOptions?: { label: string; value: string }[];
}

interface EnhancedDataTableProps {
  data: GRCDataRow[];
  columns?: ColumnConfig[];
  actions?: TableAction[];
  className?: string;
  title?: string;
  description?: string;
  enableSelection?: boolean;
  enableGrouping?: boolean;
  enableExport?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onSelectionChange?: (selectedRows: GRCDataRow[]) => void;
  onRowClick?: (row: GRCDataRow) => void;
  onExport?: (data: GRCDataRow[], format: 'csv' | 'excel' | 'pdf') => void;
  loading?: boolean;
  emptyMessage?: string;
}

// Default column configurations
const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    filterable: true,
    width: 300,
    format: (value, row) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.type)}
        <div>
          <p className="font-medium">{value}</p>
          {row.description && (
            <p className="text-xs text-gray-500 truncate max-w-xs">
              {row.description}
            </p>
          )}
        </div>
      </div>
    )
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Regulation', value: 'regulation' },
      { label: 'Policy', value: 'policy' },
      { label: 'Procedure', value: 'procedure' },
      { label: 'Assessment', value: 'assessment' },
      { label: 'Incident', value: 'incident' },
      { label: 'Audit', value: 'audit' }
    ],
    format: (value) => (
      <Badge variant="outline" className="capitalize">
        {value}
      </Badge>
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' },
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' }
    ],
    format: (value) => getStatusBadge(value)
  },
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' }
    ],
    format: (value) => getPriorityBadge(value)
  },
  {
    key: 'framework',
    label: 'Framework',
    sortable: true,
    filterable: true,
    groupable: true,
    format: (value) => (
      <Badge variant="secondary">{value}</Badge>
    )
  },
  {
    key: 'jurisdiction',
    label: 'Jurisdiction',
    sortable: true,
    filterable: true,
    groupable: true,
    format: (value) => (
      <div className="flex items-center gap-1">
        <Globe className="h-3 w-3" />
        {value}
      </div>
    )
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    filterable: true,
    groupable: true,
    format: (value) => (
      <div className="flex items-center gap-1">
        <Building className="h-3 w-3" />
        {value}
      </div>
    )
  },
  {
    key: 'owner',
    label: 'Owner',
    sortable: true,
    filterable: true,
    format: (value) => (
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {value}
      </div>
    )
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    sortable: true,
    filterable: true,
    filterType: 'date',
    format: (value) => value ? (
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {format(new Date(value), 'MMM dd, yyyy')}
      </div>
    ) : null
  },
  {
    key: 'complianceScore',
    label: 'Compliance',
    sortable: true,
    filterable: true,
    filterType: 'number',
    align: 'center',
    format: (value) => value !== undefined ? (
      <div className="flex items-center justify-center">
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium',
          value >= 90 ? 'bg-green-100 text-green-800' :
          value >= 70 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        )}>
          {value}%
        </div>
      </div>
    ) : null
  },
  {
    key: 'riskLevel',
    label: 'Risk Level',
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' }
    ],
    format: (value) => value ? getRiskBadge(value) : null
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    sortable: true,
    filterable: true,
    filterType: 'date',
    format: (value) => (
      <div className="text-sm text-gray-600">
        {format(new Date(value), 'MMM dd, yyyy')}
      </div>
    )
  }
];

// Helper functions for rendering
function getTypeIcon(type: string) {
  const icons = {
    regulation: <FileText className="h-4 w-4 text-blue-500" />,
    policy: <FileText className="h-4 w-4 text-green-500" />,
    procedure: <FileText className="h-4 w-4 text-purple-500" />,
    assessment: <CheckCircle className="h-4 w-4 text-orange-500" />,
    incident: <AlertTriangle className="h-4 w-4 text-red-500" />,
    audit: <Search className="h-4 w-4 text-gray-500" />
  };
  return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
}

function getStatusBadge(status: string) {
  const variants = {
    active: 'default',
    draft: 'secondary',
    archived: 'outline',
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive'
  } as const;
  
  const colors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  
  return (
    <Badge className={cn('capitalize', colors[status as keyof typeof colors])}>
      {status}
    </Badge>
  );
}

function getPriorityBadge(priority: string) {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  
  return (
    <Badge className={cn('capitalize', colors[priority as keyof typeof colors])}>
      {priority}
    </Badge>
  );
}

function getRiskBadge(riskLevel: string) {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };
  
  return (
    <Badge className={cn('capitalize', colors[riskLevel as keyof typeof colors])}>
      {riskLevel}
    </Badge>
  );
}

export const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({
  data,
  columns = DEFAULT_COLUMNS,
  actions = [],
  className,
  title,
  description,
  enableSelection = true,
  enableGrouping = true,
  enableExport = true,
  enableFiltering = true,
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  onSelectionChange,
  onRowClick,
  onExport,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Create table columns
  const tableColumns = useMemo<ColumnDef<GRCDataRow>[]>(() => {
    const cols: ColumnDef<GRCDataRow>[] = [];

    // Selection column
    if (enableSelection) {
      cols.push({
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
        size: 40
      });
    }

    // Data columns
    columns.forEach((col) => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: ({ column }) => {
          if (!enableSorting || !col.sortable) {
            return <div className={cn('font-medium', col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}>{col.label}</div>;
          }
          
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={cn(
                'h-auto p-0 font-medium hover:bg-transparent',
                col.align === 'center' && 'justify-center',
                col.align === 'right' && 'justify-end'
              )}
            >
              {col.label}
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ getValue, row }) => {
          const value = getValue();
          const formatted = col.format ? col.format(value, row.original) : value;
          
          return (
            <div className={cn(
              col.align === 'center' && 'text-center',
              col.align === 'right' && 'text-right'
            )}>
              {formatted}
            </div>
          );
        },
        enableSorting: enableSorting && col.sortable,
        enableGrouping: enableGrouping && col.groupable,
        size: col.width,
        minSize: col.minWidth,
        maxSize: col.maxWidth
      });
    });

    // Actions column
    if (actions.length > 0) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuCheckboxItem
                  key={action.id}
                  onClick={() => action.onClick(row.original)}
                  disabled={action.disabled?.(row.original)}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 60
      });
    }

    return cols;
  }, [columns, actions, enableSelection, enableSorting, enableGrouping]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      expanded,
      pagination,
      globalFilter
    },
    enableRowSelection: enableSelection,
    enableGrouping,
    enableSorting,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: false,
    debugTable: false
  });

  // Handle selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  // Export functionality
  const handleExport = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const dataToExport = selectedRows.length > 0 
      ? selectedRows.map(row => row.original)
      : table.getFilteredRowModel().rows.map(row => row.original);
    
    onExport?.(dataToExport, format);
  }, [table, onExport]);

  // Filter components
  const renderColumnFilter = (column: any, config: ColumnConfig) => {
    if (!config.filterable) return null;

    switch (config.filterType) {
      case 'select':
        return (
          <Select
            value={(column.getFilterValue() as string) ?? ''}
            onValueChange={(value) => column.setFilterValue(value || undefined)}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder={`Filter ${config.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {config.filterOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'multiselect':
        // Implementation for multiselect filter
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {config.filterOptions?.map((option) => (
                <DropdownMenuCheckboxItem key={option.value}>
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      
      default:
        return (
          <Input
            placeholder={`Filter ${config.label}...`}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8"
          />
        );
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardHeader>
      )}
      
      <CardContent className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex items-center space-x-2">
            {/* Global search */}
            {enableFiltering && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search all columns..."
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            )}
            
            {/* Grouping controls */}
            {enableGrouping && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Group by <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Group by column</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.filter(col => col.groupable).map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={grouping.includes(col.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setGrouping([...grouping, col.key]);
                        } else {
                          setGrouping(grouping.filter(g => g !== col.key));
                        }
                      }}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Column visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const config = columns.find(c => c.key === column.id);
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {config?.label || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Export */}
            {enableExport && onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onClick={() => handleExport('excel')}>
                    Export as Excel
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Column filters */}
        {enableFiltering && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 py-2">
            {table.getHeaderGroups()[0]?.headers
              .filter(header => {
                const config = columns.find(c => c.key === header.id);
                return config?.filterable;
              })
              .map((header) => {
                const config = columns.find(c => c.key === header.id);
                return config ? (
                  <div key={header.id}>
                    {renderColumnFilter(header.column, config)}
                  </div>
                ) : null;
              })
            }
          </div>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'cursor-pointer hover:bg-gray-50',
                      row.getIsSelected() && 'bg-blue-50'
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {cell.getIsGrouped() ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                row.getToggleExpandedHandler()();
                              }}
                            >
                              {row.getIsExpanded() ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                            <Badge variant="secondary" className="ml-2">
                              {row.subRows.length}
                            </Badge>
                          </div>
                        ) : cell.getIsAggregated() ? (
                          flexRender(
                            cell.column.columnDef.aggregatedCell ??
                              cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) : cell.getIsPlaceholder() ? null : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{' '}
                of{' '}
                <span className="font-medium">
                  {table.getFilteredRowModel().rows.length}
                </span>{' '}
                results
              </p>
              {enableSelection && (
                <p className="text-sm text-gray-700">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {table.getFilteredRowModel().rows.length} row(s) selected
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDataTable;
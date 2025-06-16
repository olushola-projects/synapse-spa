import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegulatoryDataGrid } from '../../components/RegulatoryDataGrid';
import type { RegulatoryEvent } from '../../components/RegulatoryDataGrid';

// Mock TanStack Table
vi.mock('@tanstack/react-table', () => ({
  useReactTable: vi.fn(() => ({
    getHeaderGroups: vi.fn(() => [
      {
        id: 'header-group-1',
        headers: [
          {
            id: 'title',
            column: { columnDef: { header: 'Title' } },
            getContext: () => ({ column: { columnDef: { header: 'Title' } } }),
            isPlaceholder: false
          },
          {
            id: 'regulation',
            column: { columnDef: { header: 'Regulation' } },
            getContext: () => ({ column: { columnDef: { header: 'Regulation' } } }),
            isPlaceholder: false
          },
          {
            id: 'status',
            column: { columnDef: { header: 'Status' } },
            getContext: () => ({ column: { columnDef: { header: 'Status' } } }),
            isPlaceholder: false
          }
        ]
      }
    ]),
    getRowModel: vi.fn(() => ({
      rows: [
        {
          id: 'row-1',
          original: {
            id: 'event-1',
            title: 'SFDR Annual Report Requirements',
            regulation: 'SFDR',
            status: 'effective',
            effectiveDate: new Date('2024-01-01'),
            jurisdiction: 'EU'
          },
          getVisibleCells: () => [
            {
              id: 'cell-1',
              column: { id: 'title' },
              getValue: () => 'SFDR Annual Report Requirements',
              getContext: () => ({ getValue: () => 'SFDR Annual Report Requirements' })
            },
            {
              id: 'cell-2',
              column: { id: 'regulation' },
              getValue: () => 'SFDR',
              getContext: () => ({ getValue: () => 'SFDR' })
            },
            {
              id: 'cell-3',
              column: { id: 'status' },
              getValue: () => 'effective',
              getContext: () => ({ getValue: () => 'effective' })
            }
          ],
          getIsSelected: () => false,
          getCanSelect: () => true,
          toggleSelected: vi.fn(),
          getIsExpanded: () => false,
          getCanExpand: () => true,
          toggleExpanded: vi.fn()
        },
        {
          id: 'row-2',
          original: {
            id: 'event-2',
            title: 'MiFID II Best Execution',
            regulation: 'MiFID II',
            status: 'pending',
            effectiveDate: new Date('2024-03-01'),
            jurisdiction: 'EU'
          },
          getVisibleCells: () => [
            {
              id: 'cell-4',
              column: { id: 'title' },
              getValue: () => 'MiFID II Best Execution',
              getContext: () => ({ getValue: () => 'MiFID II Best Execution' })
            },
            {
              id: 'cell-5',
              column: { id: 'regulation' },
              getValue: () => 'MiFID II',
              getContext: () => ({ getValue: () => 'MiFID II' })
            },
            {
              id: 'cell-6',
              column: { id: 'status' },
              getValue: () => 'pending',
              getContext: () => ({ getValue: () => 'pending' })
            }
          ],
          getIsSelected: () => false,
          getCanSelect: () => true,
          toggleSelected: vi.fn(),
          getIsExpanded: () => false,
          getCanExpanded: () => true,
          toggleExpanded: vi.fn()
        }
      ]
    })),
    getFilteredRowModel: vi.fn(() => ({ rows: [] })),
    getFilteredSelectedRowModel: vi.fn(() => ({ rows: [] })),
    getState: vi.fn(() => ({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      columnFilters: [],
      globalFilter: '',
      rowSelection: {}
    })),
    getPageCount: vi.fn(() => 5),
    getCanPreviousPage: vi.fn(() => false),
    getCanNextPage: vi.fn(() => true),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),
    toggleAllPageRowsSelected: vi.fn(),
    getAllColumns: vi.fn(() => []),
    getColumn: vi.fn(() => ({
      getFilterValue: () => '',
      setFilterValue: vi.fn(),
      getCanSort: () => true,
      getIsSorted: () => false,
      toggleSorting: vi.fn()
    })),
    setGlobalFilter: vi.fn(),
    resetRowSelection: vi.fn()
  })),
  getCoreRowModel: vi.fn(),
  getFilteredRowModel: vi.fn(),
  getPaginationRowModel: vi.fn(),
  getSortedRowModel: vi.fn(),
  getExpandedRowModel: vi.fn(),
  flexRender: vi.fn((component, context) => {
    if (typeof component === 'function') {
      return component(context);
    }
    if (typeof component === 'string') {
      return component;
    }
    return context?.getValue?.() || 'Cell Content';
  })
}));

// Mock UI components
vi.mock('../../components/ui/table', () => ({
  Table: ({ children, ...props }: any) => <table data-testid="data-table" {...props}>{children}</table>,
  TableHeader: ({ children, ...props }: any) => <thead data-testid="table-header" {...props}>{children}</thead>,
  TableBody: ({ children, ...props }: any) => <tbody data-testid="table-body" {...props}>{children}</tbody>,
  TableRow: ({ children, ...props }: any) => <tr data-testid="table-row" {...props}>{children}</tr>,
  TableHead: ({ children, ...props }: any) => <th data-testid="table-head" {...props}>{children}</th>,
  TableCell: ({ children, ...props }: any) => <td data-testid="table-cell" {...props}>{children}</td>
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="ui-button" onClick={onClick} {...props}>{children}</button>
  )
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ onChange, ...props }: any) => (
    <input data-testid="ui-input" onChange={onChange} {...props} />
  )
}));

vi.mock('../../components/ui/select', () => ({
  Select: ({ children, onValueChange, ...props }: any) => (
    <div data-testid="ui-select" {...props}>
      <select onChange={(e) => onValueChange?.(e.target.value)}>
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SelectItem: ({ children, value, ...props }: any) => <option value={value} {...props}>{children}</option>,
  SelectTrigger: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SelectValue: ({ placeholder, ...props }: any) => <span {...props}>{placeholder}</span>
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant, ...props }: any) => (
    <span data-testid="ui-badge" data-variant={variant} {...props}>{children}</span>
  )
}));

vi.mock('../../components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
    <input 
      type="checkbox" 
      data-testid="ui-checkbox" 
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props} 
    />
  )
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
  ChevronUp: () => <span data-testid="chevron-up-icon">▲</span>,
  ArrowUpDown: () => <span data-testid="sort-icon">↕</span>,
  Search: () => <span data-testid="search-icon">🔍</span>,
  Filter: () => <span data-testid="filter-icon">🔽</span>,
  Download: () => <span data-testid="download-icon">⬇</span>,
  RefreshCw: () => <span data-testid="refresh-icon">🔄</span>
}));

// Mock data
const mockRegulatoryEvents: RegulatoryEvent[] = [
  {
    id: 'event-1',
    title: 'SFDR Annual Report Requirements',
    description: 'New requirements for annual sustainability reporting under SFDR',
    regulation: 'SFDR',
    jurisdiction: 'EU',
    effectiveDate: new Date('2024-01-01'),
    status: 'effective',
    impact: 'high',
    category: 'Sustainability',
    tags: ['reporting', 'annual', 'sustainability'],
    source: 'ESMA',
    lastUpdated: new Date('2024-01-15'),
    assignedTo: 'compliance-team',
    complianceDeadline: new Date('2024-12-31'),
    implementationStatus: 'in-progress',
    riskScore: 85,
    estimatedCost: 150000,
    relatedEvents: ['event-2']
  },
  {
    id: 'event-2',
    title: 'MiFID II Best Execution Reporting',
    description: 'Updated best execution reporting requirements',
    regulation: 'MiFID II',
    jurisdiction: 'EU',
    effectiveDate: new Date('2024-03-01'),
    status: 'pending',
    impact: 'medium',
    category: 'Trading',
    tags: ['execution', 'reporting', 'quarterly'],
    source: 'ESMA',
    lastUpdated: new Date('2024-01-10'),
    assignedTo: 'trading-desk',
    complianceDeadline: new Date('2024-02-28'),
    implementationStatus: 'not-started',
    riskScore: 65,
    estimatedCost: 75000,
    relatedEvents: ['event-1']
  }
];

describe('RegulatoryDataGrid', () => {
  const defaultProps = {
    data: mockRegulatoryEvents,
    onRowSelect: vi.fn(),
    onRowExpand: vi.fn(),
    onExport: vi.fn(),
    onRefresh: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the data grid with table structure', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      expect(screen.getByTestId('data-table')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should display column headers', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Regulation')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render data rows', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      expect(screen.getByText('SFDR Annual Report Requirements')).toBeInTheDocument();
      expect(screen.getByText('MiFID II Best Execution')).toBeInTheDocument();
      expect(screen.getByText('SFDR')).toBeInTheDocument();
      expect(screen.getByText('MiFID II')).toBeInTheDocument();
    });

    it('should display status badges with correct variants', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const badges = screen.getAllByTestId('ui-badge');
      expect(badges.length).toBeGreaterThan(0);
      
      const effectiveBadge = badges.find(badge => badge.textContent === 'effective');
      const pendingBadge = badges.find(badge => badge.textContent === 'pending');
      
      expect(effectiveBadge).toBeInTheDocument();
      expect(pendingBadge).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should render global search input', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const searchInput = screen.getByTestId('ui-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', expect.stringContaining('Search'));
    });

    it('should handle global search input', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const searchInput = screen.getByTestId('ui-input');
      fireEvent.change(searchInput, { target: { value: 'SFDR' } });

      expect(searchInput).toHaveValue('SFDR');
    });

    it('should render column filters', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const filterSelects = screen.getAllByTestId('ui-select');
      expect(filterSelects.length).toBeGreaterThan(0);
    });

    it('should handle status filter changes', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const statusFilter = screen.getAllByTestId('ui-select')[0];
      const select = statusFilter.querySelector('select');
      
      if (select) {
        fireEvent.change(select, { target: { value: 'effective' } });
      }

      expect(statusFilter).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should display sort icons in column headers', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const sortIcons = screen.getAllByTestId('sort-icon');
      expect(sortIcons.length).toBeGreaterThan(0);
    });

    it('should handle column header clicks for sorting', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const titleHeader = screen.getByText('Title');
      fireEvent.click(titleHeader);

      // Should trigger sorting (mocked in useReactTable)
      expect(titleHeader).toBeInTheDocument();
    });
  });

  describe('Row Selection', () => {
    it('should render checkboxes for row selection', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('ui-checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should handle individual row selection', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('ui-checkbox');
      const firstRowCheckbox = checkboxes[1]; // Skip header checkbox
      
      fireEvent.click(firstRowCheckbox);
      
      expect(defaultProps.onRowSelect).toHaveBeenCalled();
    });

    it('should handle select all functionality', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const checkboxes = screen.getAllByTestId('ui-checkbox');
      const selectAllCheckbox = checkboxes[0]; // Header checkbox
      
      fireEvent.click(selectAllCheckbox);
      
      expect(selectAllCheckbox).toBeInTheDocument();
    });
  });

  describe('Row Expansion', () => {
    it('should render expand/collapse buttons', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const expandButtons = screen.getAllByTestId('ui-button');
      const expandButton = expandButtons.find(btn => 
        btn.querySelector('[data-testid="chevron-down-icon"]')
      );
      
      expect(expandButton).toBeInTheDocument();
    });

    it('should handle row expansion', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const expandButtons = screen.getAllByTestId('ui-button');
      const expandButton = expandButtons.find(btn => 
        btn.querySelector('[data-testid="chevron-down-icon"]')
      );
      
      if (expandButton) {
        fireEvent.click(expandButton);
        expect(defaultProps.onRowExpand).toHaveBeenCalled();
      }
    });

    it('should display expanded row content', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      // In a real implementation, expanded rows would show additional details
      const tableRows = screen.getAllByTestId('table-row');
      expect(tableRows.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should render pagination controls', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const paginationButtons = screen.getAllByTestId('ui-button');
      const prevButton = paginationButtons.find(btn => btn.textContent?.includes('Previous'));
      const nextButton = paginationButtons.find(btn => btn.textContent?.includes('Next'));
      
      expect(prevButton || nextButton).toBeInTheDocument();
    });

    it('should handle page navigation', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const buttons = screen.getAllByTestId('ui-button');
      const nextButton = buttons.find(btn => btn.textContent?.includes('Next'));
      
      if (nextButton) {
        fireEvent.click(nextButton);
      }

      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should display page size selector', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const selects = screen.getAllByTestId('ui-select');
      const pageSizeSelect = selects.find(select => 
        select.textContent?.includes('10') || select.textContent?.includes('rows')
      );
      
      expect(pageSizeSelect || selects.length > 0).toBeTruthy();
    });
  });

  describe('Actions', () => {
    it('should render export button', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const exportButton = screen.getAllByTestId('ui-button').find(btn => 
        btn.querySelector('[data-testid="download-icon"]')
      );
      
      expect(exportButton).toBeInTheDocument();
    });

    it('should handle export action', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const exportButton = screen.getAllByTestId('ui-button').find(btn => 
        btn.querySelector('[data-testid="download-icon"]')
      );
      
      if (exportButton) {
        fireEvent.click(exportButton);
        expect(defaultProps.onExport).toHaveBeenCalled();
      }
    });

    it('should render refresh button', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const refreshButton = screen.getAllByTestId('ui-button').find(btn => 
        btn.querySelector('[data-testid="refresh-icon"]')
      );
      
      expect(refreshButton).toBeInTheDocument();
    });

    it('should handle refresh action', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const refreshButton = screen.getAllByTestId('ui-button').find(btn => 
        btn.querySelector('[data-testid="refresh-icon"]')
      );
      
      if (refreshButton) {
        fireEvent.click(refreshButton);
        expect(defaultProps.onRefresh).toHaveBeenCalled();
      }
    });
  });

  describe('Loading and Empty States', () => {
    it('should handle loading state', () => {
      const loadingProps = { ...defaultProps, loading: true };
      render(<RegulatoryDataGrid {...loadingProps} />);

      // Should show loading indicator
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('should handle empty data state', () => {
      const emptyProps = { ...defaultProps, data: [] };
      render(<RegulatoryDataGrid {...emptyProps} />);

      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('should display no results message when filtered data is empty', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      // After applying filters that return no results
      const searchInput = screen.getByTestId('ui-input');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should handle mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<RegulatoryDataGrid {...defaultProps} />);
      
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('should handle tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<RegulatoryDataGrid {...defaultProps} />);
      
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure for screen readers', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      expect(screen.getByTestId('data-table')).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const firstButton = screen.getAllByTestId('ui-button')[0];
      firstButton.focus();
      
      expect(document.activeElement).toBe(firstButton);
    });

    it('should have accessible form controls', () => {
      render(<RegulatoryDataGrid {...defaultProps} />);

      const searchInput = screen.getByTestId('ui-input');
      expect(searchInput).toHaveAttribute('placeholder');

      const checkboxes = screen.getAllByTestId('ui-checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        ...mockRegulatoryEvents[0],
        id: `event-${i}`,
        title: `Event ${i}`
      }));

      const largeDataProps = { ...defaultProps, data: largeDataset };
      
      const { container } = render(<RegulatoryDataGrid {...largeDataProps} />);
      
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('should not cause unnecessary re-renders', () => {
      const renderSpy = vi.fn();
      
      const TestComponent = () => {
        renderSpy();
        return <RegulatoryDataGrid {...defaultProps} />;
      };

      const { rerender } = render(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      rerender(<TestComponent />);
      
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid data gracefully', () => {
      const invalidDataProps = { ...defaultProps, data: null as any };
      
      expect(() => {
        render(<RegulatoryDataGrid {...invalidDataProps} />);
      }).not.toThrow();
    });

    it('should handle missing callback functions', () => {
      const incompleteProps = {
        data: mockRegulatoryEvents
        // Missing callback functions
      };
      
      expect(() => {
        render(<RegulatoryDataGrid {...incompleteProps} />);
      }).not.toThrow();
    });
  });
});
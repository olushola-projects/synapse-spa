import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  ButtonGroup,
  Button,
  Box
} from '@mui/material';
import { InfoOutlined, Download, History } from '@mui/icons-material';

interface SFDRItem {
  id: string;
  name: string;
  value: string;
  aiModel: string;
}

interface XAITooltipProps {
  algorithm: string;
}

const XAITooltip: React.FC<XAITooltipProps> = ({ algorithm }) => (
  <Tooltip title={`${algorithm} model updated ${new Date().toLocaleDateString()}`}>
    <IconButton size="small" aria-label="AI explanation">
      <InfoOutlined fontSize="inherit" />
    </IconButton>
  </Tooltip>
);

const SFDRTable: React.FC<{ items: SFDRItem[] }> = ({ items }) => {
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size={density === 'compact' ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>Indicator</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <DataRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

const DataRow: React.FC<{ item: SFDRItem }> = ({ item }) => {
  const [elevation, setElevation] = useState(0);

  return (
    <TableRow 
      hover
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(0)}
      sx={{ transition: 'box-shadow 0.3s', boxShadow: elevation }}
    >
      <TableCell>
        <Box display="flex" alignItems="center">
          <span>{item.name}</span>
          <XAITooltip algorithm={item.aiModel} />
        </Box>
      </TableCell>
      <TableCell align="right">{item.value}</TableCell>
      <TableCell>
        <ButtonGroup variant="contained" size="small">
          <Button startIcon={<Download />}>Export</Button>
          <Button startIcon={<History />}>History</Button>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default SFDRTable;
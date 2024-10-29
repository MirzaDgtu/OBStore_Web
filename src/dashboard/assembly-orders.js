import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterAlt as FilterIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import OrderDetails from './orderDetails-component';
import { getAssemblyOrders } from '../api/api';

const getStatusChipProps = (statusId) => {
  switch (statusId) {
    case 1:
      return { label: 'Новый', color: 'primary' };
    case 2:
      return { label: 'В работе', color: 'warning' };
    case 3:
      return { label: 'Завершен', color: 'success' };
    default:
      return { label: 'Неизвестно', color: 'default' };
  }
};

const AssemblyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    getAssemblyOrdersData();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      Object.values(order).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
    setPage(0);
  }, [searchTerm, orders]);

  const getAssemblyOrdersData = async () => {
    try {
      setLoading(true);
      let data;
      if (startDate && endDate) {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        data = await getAssemblyOrders(formattedStartDate, formattedEndDate);
      } else {
        data = await getAssemblyOrders();
      }
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      setMessage('Ошибка при загрузке собранных заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      getAssemblyOrdersData();
    } else {
      setMessage('Пожалуйста, выберите обе даты');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
            Собранные заказы
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            alignItems: 'center',
            mb: 2
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
              <DatePicker
                label="Дата начала"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small',
                    sx: { width: 200 }
                  } 
                }}
                format="dd.MM.yyyy"
              />
              <DatePicker
                label="Дата окончания"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small',
                    sx: { width: 200 }
                  } 
                }}
                format="dd.MM.yyyy"
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={handleDateRangeSubmit}
              disabled={!startDate || !endDate}
            >
              Применить фильтр
            </Button>

            <TextField
              size="small"
              variant="outlined"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300, ml: 'auto' }}
            />
          </Box>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Дата документа</TableCell>
                <TableCell>Сборщик</TableCell>
                <TableCell>Начало сборки</TableCell>
                <TableCell>Окончание сборки</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell align="right">Вес</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Загрузка...</TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Заказы не найдены</TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    const statusProps = getStatusChipProps(order.status_id);
                    return (
                      <TableRow key={order.ID}>
                        <TableCell>{order.ID}</TableCell>
                        <TableCell>{formatDate(order.date_doc)}</TableCell>
                        <TableCell>{order.user_id}</TableCell>
                        <TableCell>{formatDate(order.start_at)}</TableCell>
                        <TableCell>{formatDate(order.finish_at)}</TableCell>
                        <TableCell align="right">{formatPrice(order.sum_doc)}</TableCell>
                        <TableCell align="right">{order.weight_doc} кг</TableCell>
                        <TableCell>
                          <Chip {...statusProps} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(order)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count !== -1 ? count : `более чем ${to}`}`
          }
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      <OrderDetails 
        order={selectedOrder} 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
      />
    </Container>
  );
};

export default AssemblyOrders;

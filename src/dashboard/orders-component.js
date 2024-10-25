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
  Snackbar,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterAlt as FilterIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { getOrders } from '../api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    getOrdersData();
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

  const getOrdersData = async () => {
    try {
      setLoading(true);
      if (startDate && endDate) {
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        const data = await getOrders(formattedStartDate, formattedEndDate);
        setOrders(data);
        setFilteredOrders(data);
      } else {
        const data = await getOrders();
        setOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      setMessage('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      getOrdersData();
    } else {
      setMessage('Пожалуйста, выберите обе даты');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(price);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 2 }}>
            Заказы
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
                <TableCell>Номер заказа</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Код клиента</TableCell>
                <TableCell>Наименование клиента</TableCell>
                <TableCell align="right">Сумма заказа</TableCell>
                <TableCell>Водитель</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.number}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.clientCode}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell align="right">{formatPrice(order.amount)}</TableCell>
                    <TableCell>{order.driver}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {/* Обработка редактирования */}}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {/* Обработка удаления */}}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {loading ? 'Загрузка...' : 'Заказы не найдены'}
                  </TableCell>
                </TableRow>
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

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Container>
  );
};

export default Orders;

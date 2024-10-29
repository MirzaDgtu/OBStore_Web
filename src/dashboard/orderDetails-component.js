import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const OrderDetails = ({ order, open, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Заказ №{order.order_uid}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Основная информация</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Уникальный номер:</strong> {order.unicum_num}</Typography>
                  <Typography><strong>Дата заказа:</strong> {order.order_date}</Typography>
                  <Typography><strong>Сумма заказа:</strong> {formatPrice(order.order_sum)}</Typography>
                  <Typography><strong>Водитель:</strong> {order.driver || 'Не назначен'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography><strong>Агент:</strong> {order.agent}</Typography>
                  <Typography><strong>ID клиента:</strong> {order.client_Id}</Typography>
                  <Typography><strong>Клиент:</strong> {order.client_name}</Typography>
                  <Typography><strong>Адрес:</strong> {order.client_address}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Детали заказа</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Артикул</TableCell>
                    <TableCell>Наименование</TableCell>
                    <TableCell align="right">Количество</TableCell>
                    <TableCell align="right">Собрано</TableCell>
                    <TableCell align="right">Цена</TableCell>
                    <TableCell align="right">Скидка</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.order_details.map((detail) => (
                    <TableRow key={detail.ID}>
                      <TableCell>{detail.articul || '-'}</TableCell>
                      <TableCell>{detail.name_articul || '-'}</TableCell>
                      <TableCell align="right">{detail.qty}</TableCell>
                      <TableCell align="right">{detail.qty_sbor}</TableCell>
                      <TableCell align="right">{formatPrice(detail.cena)}</TableCell>
                      <TableCell align="right">{detail.discount}%</TableCell>
                      <TableCell align="right">{formatPrice(detail.sum_artucul)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
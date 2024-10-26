import React, { useState } from 'react';
import {
Container,
Typography,
Grid,
Card,
CardContent,
CardActions,
Button,
Icon,
Modal,
Box,
TextField,
MenuItem,
} from '@mui/material';
import {
Person as PersonIcon,
DateRange as DateRangeIcon,
Warehouse as WarehouseIcon,
Timer as TimerIcon,
Assignment as AssignmentIcon,
People as PeopleIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ruLocale from 'date-fns/locale/ru';

const reports = [
{ id: 1, name: 'Отчет по сборщику', icon: <PersonIcon />, description: 'Анализ производительности сборщиков.' },
{ id: 2, name: 'Отчет за выбранный период', icon: <DateRangeIcon />, description: 'Данные за указанный временной интервал.' },
{ id: 3, name: 'Отчет по складам', icon: <WarehouseIcon />, description: 'Информация о состоянии складов.' },
{ id: 4, name: 'Отчет по среднему времени сборки заказов', icon: <TimerIcon />, description: 'Среднее время, затраченное на сборку заказов.' },
{ id: 5, name: 'Отчет по проектам', icon: <AssignmentIcon />, description: 'Обзор текущих и завершенных проектов.' },
{ id: 6, name: 'Отчет по клиентам', icon: <PeopleIcon />, description: 'Анализ клиентской базы и активности.' },
];

const warehouses = ['Склад 1', 'Склад 2', 'Склад 3'];
const assemblers = ['Сборщик 1', 'Сборщик 2', 'Сборщик 3'];
const projects = ['Проект 1', 'Проект 2', 'Проект 3'];
const clients = ['Клиент 1', 'Клиент 2', 'Клиент 3'];

const ReportsForm = () => {
const [open, setOpen] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);
const [format, setFormat] = useState('Excel');
const [selectedWarehouse, setSelectedWarehouse] = useState('');
const [selectedAssembler, setSelectedAssembler] = useState('');
const [selectedProject, setSelectedProject] = useState('');
const [selectedClient, setSelectedClient] = useState('');
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

const handleOpen = (report) => {
    setSelectedReport(report);
    setOpen(true);
};

const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
    setSelectedWarehouse('');
    setSelectedAssembler('');
    setSelectedProject('');
    setSelectedClient('');
    setStartDate(null);
    setEndDate(null);
};

const handleFormatChange = (event) => {
    setFormat(event.target.value);
};

return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
     <Typography variant="h5" component="h2" sx={{ color: 'primary.main', mb: 3 }}>
        Список отчетов
     </Typography>
     <Grid container spacing={3}>
        {reports.map((report) => (
         <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card>
             <CardContent>
                <Icon sx={{ fontSize: 40, mb: 1 }}>{report.icon}</Icon>
                <Typography variant="h6" component="div">
                 {report.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                 {report.description}
                </Typography>
             </CardContent>
             <CardActions>
                <Button size="small" variant="contained" color="primary" onClick={() => handleOpen(report)}>
                 Открыть
                </Button>
             </CardActions>
            </Card>
         </Grid>
        ))}
     </Grid>

     <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
         <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {selectedReport?.name}
         </Typography>

         <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
             <DatePicker
                label="Дата начала"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                 textField: {
                    size: 'small',
                    sx: { width: '48%' }
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
                    sx: { width: '48%' }
                 }
                }}
                format="dd.MM.yyyy"
             />
            </Box>
         </LocalizationProvider>

         {selectedReport?.id === 1 && (
            <TextField
             select
             label="Выберите сборщика"
             value={selectedAssembler}
             onChange={(e) => setSelectedAssembler(e.target.value)}
             fullWidth
             sx={{ mb: 2 }}
            >
             {assemblers.map((assembler) => (
                <MenuItem key={assembler} value={assembler}>
                 {assembler}
                </MenuItem>
             ))}
            </TextField>
         )}

         {selectedReport?.id === 3 && (
            <TextField
             select
             label="Выберите склад"
             value={selectedWarehouse}
             onChange={(e) => setSelectedWarehouse(e.target.value)}
             fullWidth
             sx={{ mb: 2 }}
            >
             {warehouses.map((warehouse) => (
                <MenuItem key={warehouse} value={warehouse}>
                 {warehouse}
                </MenuItem>
             ))}
            </TextField>
         )}

         {selectedReport?.id === 5 && (
            <TextField
             select
             label="Выберите проект"
             value={selectedProject}
             onChange={(e) => setSelectedProject(e.target.value)}
             fullWidth
             sx={{ mb: 2 }}
            >
             {projects.map((project) => (
                <MenuItem key={project} value={project}>
                 {project}
                </MenuItem>
             ))}
            </TextField>
         )}

         {selectedReport?.id === 6 && (
            <TextField
             select
             label="Выберите клиента"
             value={selectedClient}
             onChange={(e) => setSelectedClient(e.target.value)}
             fullWidth
             sx={{ mb: 2 }}
            >
             {clients.map((client) => (
                <MenuItem key={client} value={client}>
                 {client}
                </MenuItem>
             ))}
            </TextField>
         )}

         <TextField
            select
            label="Формат"
            value={format}
            onChange={handleFormatChange}
            fullWidth
            sx={{ mb: 2 }}
         >
            <MenuItem value="Excel">Excel</MenuItem>
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="CSV">CSV</MenuItem>
            <MenuItem value="JSON">JSON</MenuItem>
         </TextField>

         <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="contained" color="primary">
             Сформировать
            </Button>
            <Button variant="outlined" color="primary">
             Скачать
            </Button>
            <Button variant="text" color="secondary" onClick={handleClose}>
             Отмена
            </Button>
         </Box>
        </Box>
     </Modal>
    </Container>
);
};

export default ReportsForm;
import { useState, useEffect, useCallback } from 'react';
import Stats from './components/Stats';
import Calendar from './components/Calendar';
import Chart from './components/Chart';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { fetchRevenues, saveRevenue, deleteRevenue } from './services/api';

export default function App() {
    const [data, setData] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const loadData = useCallback(async () => {
        try {
            const revenues = await fetchRevenues();
            setData(revenues);
            setIsOnline(true);
        } catch (error) {
            console.error(error);
            setIsOnline(false);
            showToast('Lỗi kết nối: ' + error.message, 'error');
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const handleCloseModal = () => {
        setSelectedDay(null);
    };

    const handleSave = async (day, revenue, note) => {
        const today = new Date().getDate();
        const dayData = data.find(d => d.day === day);
        const hasRevenue = dayData && dayData.revenue > 0;

        if (day < today && hasRevenue) {
            showToast('Ngày này đã khóa sổ, không thể sửa!', 'error');
            return;
        }

        try {
            await saveRevenue(day, revenue, note);
            await loadData();
            handleCloseModal();
            showToast('✓ Đã lưu ngày ' + day);
        } catch (error) {
            showToast('Lỗi: ' + error.message, 'error');
        }
    };

    const handleDelete = async (day, id) => {
        const today = new Date().getDate();
        if (day < today) {
            showToast('Ngày này đã khóa sổ, không thể xóa!', 'error');
            return;
        }

        try {
            await deleteRevenue(id);
            await loadData();
            handleCloseModal();
            showToast('✓ Đã xóa dữ liệu ngày ' + day);
        } catch (error) {
            showToast('Lỗi: ' + error.message, 'error');
        }
    };

    const selectedDayData = data.find(d => d.day === selectedDay);

    return (
        <div className="app">
            <header className="header">
                <h1>Doanh Thu Tháng 1</h1>
                <p className="subtitle">Mốc mục tiêu: 250,000 / ngày</p>
                <div className={`connection-status ${!isOnline ? 'error' : ''}`}>
                    <span className="dot"></span>
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </header>

            <Stats data={data} />

            <div className="main-section">
                <Calendar data={data} onDayClick={handleDayClick} />
                <Chart data={data} />
            </div>

            <Modal
                isOpen={selectedDay !== null}
                day={selectedDay}
                dayData={selectedDayData}
                onClose={handleCloseModal}
                onSave={handleSave}
                onDelete={handleDelete}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: 'success' })}
            />
        </div>
    );
}

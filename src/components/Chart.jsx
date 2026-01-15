import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart as ChartComponent } from 'react-chartjs-2';
import { formatMoney, THRESHOLD } from '../utils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart({ data }) {
    const sortedData = [...data].sort((a, b) => a.day - b.day);

    const chartData = {
        labels: sortedData.map(d => d.day),
        datasets: [
            {
                label: 'Doanh thu',
                data: sortedData.map(d => d.revenue),
                backgroundColor: sortedData.map(d =>
                    d.revenue >= THRESHOLD ? '#10b981' : '#ef4444'
                ),
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 12,
                type: 'bar',
            },
            {
                label: 'Mục tiêu 250K',
                data: new Array(sortedData.length).fill(THRESHOLD),
                type: 'line',
                borderColor: '#f59e0b',
                borderWidth: 2,
                borderDash: [6, 4],
                pointRadius: 0,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#18181b',
                padding: 12,
                callbacks: {
                    title: items => 'Ngày ' + items[0].label,
                    label: item => {
                        if (item.datasetIndex === 0) {
                            return 'Doanh thu: ' + formatMoney(item.raw);
                        }
                        return 'Mục tiêu: 250,000';
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' },
            },
            y: {
                grid: { color: '#f4f4f5' },
                ticks: {
                    color: '#64748b',
                    callback: value => formatMoney(value),
                },
                beginAtZero: true,
            },
        },
    };

    if (sortedData.length === 0) {
        return (
            <div className="chart-section">
                <div className="section-title">Xu hướng</div>
                <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                    Chưa có dữ liệu
                </div>
            </div>
        );
    }

    return (
        <div className="chart-section">
            <div className="section-title">Xu hướng</div>
            <div className="chart-container">
                <ChartComponent type="bar" data={chartData} options={options} />
            </div>
        </div>
    );
}

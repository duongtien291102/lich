import { formatMoney, THRESHOLD } from '../utils';

export default function Stats({ data }) {
    const total = data.reduce((sum, d) => sum + d.revenue, 0);
    const goodDays = data.filter(d => d.revenue >= THRESHOLD).length;
    const badDays = data.filter(d => d.revenue > 0 && d.revenue < THRESHOLD).length;
    const avg = data.length > 0 ? total / data.length : 0;

    return (
        <div className="stats-grid">
            <div className="stat-item">
                <div className="label">Tổng doanh thu</div>
                <div className="value">{formatMoney(total)}</div>
            </div>
            <div className="stat-item">
                <div className="label">Đạt mục tiêu</div>
                <div className="value">{goodDays}</div>
            </div>
            <div className="stat-item">
                <div className="label">Chưa đạt</div>
                <div className="value">{badDays}</div>
            </div>
            <div className="stat-item">
                <div className="label">Trung bình ngày</div>
                <div className="value">{formatMoney(Math.round(avg))}</div>
            </div>
        </div>
    );
}

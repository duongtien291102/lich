import DayCell from './DayCell';
import { DAYS_IN_MONTH, FIRST_DAY_INDEX } from '../utils';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function Calendar({ data, onDayClick }) {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const isCurrentMonth = currentMonth === 0 && today.getFullYear() === 2026;

    const emptyCells = [];
    for (let i = 0; i < FIRST_DAY_INDEX; i++) {
        emptyCells.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
    }

    const dayCells = [];
    for (let day = 1; day <= DAYS_IN_MONTH; day++) {
        const dayData = data.find(d => d.day === day);
        const isToday = isCurrentMonth && day === currentDay;
        dayCells.push(
            <DayCell
                key={day}
                day={day}
                dayData={dayData}
                isToday={isToday}
                onClick={onDayClick}
            />
        );
    }

    return (
        <div className="calendar-wrapper">
            <div className="section-title">
                <span>Lịch</span>
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-tertiary)' }}>
                    Tháng 1/2026
                </span>
            </div>

            <div className="calendar-header">
                {WEEKDAYS.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {emptyCells}
                {dayCells}
            </div>
        </div>
    );
}

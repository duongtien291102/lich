import { formatMoney, THRESHOLD } from '../utils';

export default function DayCell({ day, dayData, isToday, onClick }) {
    const hasRevenue = dayData && dayData.revenue > 0;
    const isGood = hasRevenue && dayData.revenue >= THRESHOLD;
    const isBad = hasRevenue && dayData.revenue < THRESHOLD;
    const hasNote = dayData && dayData.note;

    let classes = 'day-cell';
    if (hasRevenue) classes += ' has-data';
    if (isGood) classes += ' good';
    if (isBad) classes += ' bad';
    if (isToday) classes += ' today';

    return (
        <div className={classes} onClick={() => onClick(day)}>
            <span className="day-num">{day}</span>
            {hasNote && <span className="note-preview">{dayData.note}</span>}
            {hasRevenue && <span className="amount">{formatMoney(dayData.revenue)}</span>}
            <div className="status-dot"></div>
        </div>
    );
}

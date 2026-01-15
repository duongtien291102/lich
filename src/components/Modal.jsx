import { useState, useEffect, useRef } from 'react';
import { parseMoney } from '../utils';

export default function Modal({ isOpen, day, dayData, onClose, onSave, onDelete }) {
    const [revenue, setRevenue] = useState('');
    const [note, setNote] = useState('');
    const inputRef = useRef(null);

    const today = new Date().getDate();
    const hasRevenue = dayData && dayData.revenue > 0;
    const isPast = day < today;
    const isLocked = isPast && hasRevenue;

    useEffect(() => {
        if (isOpen) {
            setRevenue(dayData?.revenue || '');
            setNote(dayData?.note || '');
            if (!isLocked && inputRef.current) {
                setTimeout(() => {
                    inputRef.current.focus();
                    if (inputRef.current.value) {
                        inputRef.current.select();
                    }
                }, 100);
            }
        }
    }, [isOpen, dayData, isLocked]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Enter' && !e.shiftKey && !isLocked) {
                e.preventDefault();
                handleSave();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLocked, revenue, note]);

    const handleSave = () => {
        const parsedRevenue = parseMoney(revenue);
        if (parsedRevenue <= 0 && !note) {
            return;
        }
        onSave(day, parsedRevenue, note.trim());
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-backdrop ${isOpen ? 'active' : ''}`} onClick={handleBackdropClick}>
            <div className="modal" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <h3 className="modal-title">Ngày {day}</h3>
                </div>

                <div className="form-group">
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-input large"
                        placeholder="0"
                        inputMode="numeric"
                        autoComplete="off"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        disabled={isLocked}
                    />
                    <p className="input-hint">Nhập số tiền (VD: 350k)</p>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ghi chú..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={isLocked}
                    />
                </div>

                {isLocked ? (
                    <p className="lock-message">Đã chốt sổ, không thể chỉnh sửa.</p>
                ) : (
                    <div className="modal-actions">
                        <button className="btn btn-close" onClick={onClose}>Đóng</button>
                        <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
                    </div>
                )}

                {!isLocked && dayData && (
                    <button className="btn-delete" onClick={() => onDelete(day, dayData._id)}>
                        Xóa dữ liệu ngày này
                    </button>
                )}

                {isLocked && (
                    <div className="modal-actions" style={{ marginTop: '24px' }}>
                        <button className="btn btn-close" onClick={onClose} style={{ gridColumn: 'span 2' }}>
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

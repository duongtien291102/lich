const API_URL = '/api/revenues';

export async function fetchRevenues() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Không thể kết nối server');
    return response.json();
}

export async function saveRevenue(day, revenue, note) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, revenue, note })
    });
    if (!response.ok) throw new Error('Lỗi khi lưu');
    return response.json();
}

export async function deleteRevenue(id) {
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Lỗi khi xóa');
    return response.json();
}

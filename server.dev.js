import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jaika:123455@cluster0.f9naak2.mongodb.net/doanhThuDB?retryWrites=true&w=majority&appName=Cluster0';

const revenueSchema = new mongoose.Schema({
    day: { type: Number, required: true, min: 1, max: 31, unique: true },
    revenue: { type: Number, required: true },
    note: { type: String, default: '' }
}, { timestamps: true });

const Revenue = mongoose.model('Revenue', revenueSchema);

// GET - Lấy tất cả doanh thu
app.get('/api/revenues', async (req, res) => {
    try {
        const revenues = await Revenue.find().sort({ day: 1 });
        res.json(revenues);
    } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST - Thêm hoặc cập nhật doanh thu
app.post('/api/revenues', async (req, res) => {
    try {
        const { day, revenue, note } = req.body;
        const updatedRevenue = await Revenue.findOneAndUpdate(
            { day },
            { day, revenue, note: note || '' },
            { upsert: true, new: true }
        );
        res.status(201).json(updatedRevenue);
    } catch (error) {
        console.error('POST Error:', error);
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Xóa doanh thu
app.delete('/api/revenues', async (req, res) => {
    try {
        const { id } = req.query;
        await Revenue.findByIdAndDelete(id);
        res.json({ message: 'Đã xóa thành công' });
    } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Connect to MongoDB first, then start server
async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Đã kết nối MongoDB Atlas thành công!');

        app.listen(PORT, () => {
            console.log(`🚀 API Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Lỗi kết nối MongoDB:', err);
        process.exit(1);
    }
}

start();

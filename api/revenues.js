import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jaika:123455@cluster0.f9naak2.mongodb.net/doanhThuDB?retryWrites=true&w=majority&appName=Cluster0';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const revenueSchema = new mongoose.Schema({
    day: { type: Number, required: true, min: 1, max: 31, unique: true },
    revenue: { type: Number, required: true },
    note: { type: String, default: '' }
}, { timestamps: true });

const Revenue = mongoose.models.Revenue || mongoose.model('Revenue', revenueSchema);

export default async function handler(req, res) {
    await connectDB();

    // GET - Lấy tất cả doanh thu
    if (req.method === 'GET') {
        try {
            const revenues = await Revenue.find().sort({ day: 1 });
            return res.status(200).json(revenues);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // POST - Thêm hoặc cập nhật doanh thu
    if (req.method === 'POST') {
        try {
            const { day, revenue, note } = req.body;
            const updatedRevenue = await Revenue.findOneAndUpdate(
                { day },
                { day, revenue, note: note || '' },
                { upsert: true, new: true }
            );
            return res.status(201).json(updatedRevenue);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // DELETE - Xóa doanh thu
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            await Revenue.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Đã xóa thành công' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

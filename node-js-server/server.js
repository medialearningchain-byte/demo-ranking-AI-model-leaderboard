// server.js
// Proxy server để tránh lỗi CORS khi gọi https://api.vmlu.ai từ frontend

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = "https://api.vmlu.ai/leaderboard/get/list";

app.use(cors()); // Cho phép mọi origin, hoặc cấu hình cụ thể nếu cần
app.use(express.json());

// Endpoint proxy chính
app.get("/api/ai-leaderboard", async (req, res) => {
  try {
    const response = await fetch(TARGET_URL, {
      headers: { "User-Agent": "AI-Leaderboard-Proxy/1.0" },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "VMLU API error", status: response.status });
    }

    const data = await response.json();
    res.json(data); // trả nguyên dữ liệu gốc
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("AI Leaderboard Proxy Server đang chạy ✅");
});

app.listen(PORT, () =>
  console.log(`✅ Server chạy tại http://localhost:${PORT}`)
);
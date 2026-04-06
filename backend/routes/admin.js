const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

router.get('/stats', (req, res) => {
  let fileCount = 0;
  let totalSize = 0;
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    fileCount = files.length;
    for (const f of files) {
      try {
        totalSize += fs.statSync(path.join(uploadsDir, f)).size;
      } catch {}
    }
  }
  res.json({
    uploads: fileCount,
    totalSizeBytes: totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
  });
});

router.get('/uploads', (req, res) => {
  if (!fs.existsSync(uploadsDir)) {
    return res.json({ files: [] });
  }
  const files = fs.readdirSync(uploadsDir).map((f) => {
    try {
      const stat = fs.statSync(path.join(uploadsDir, f));
      return { name: f, size: stat.size, mtime: stat.mtime };
    } catch {
      return { name: f, size: 0, mtime: null };
    }
  });
  res.json({ files });
});

module.exports = router;

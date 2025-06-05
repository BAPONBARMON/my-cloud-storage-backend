const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STORAGE_DIR = path.join(__dirname, 'storage');

app.use(cors());
app.use(express.json());

// Create storage directory if not exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

// Setup multer for file uploads
const upload = multer({ dest: path.join(STORAGE_DIR, 'uploads_tmp') });

// List files and folders
app.get('/api/list', (req, res) => {
  const dir = req.query.path ? path.join(STORAGE_DIR, req.query.path) : STORAGE_DIR;
  if (!dir.startsWith(STORAGE_DIR)) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const list = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));
    res.json(list);
  });
});

// Create folder
app.post('/api/folder', (req, res) => {
  const folderName = req.body.name;
  if (!folderName) return res.status(400).json({ error: 'Folder name required' });
  const folderPath = path.join(STORAGE_DIR, folderName);
  if (!folderPath.startsWith(STORAGE_DIR)) {
    return res.status(400).json({ error: 'Invalid folder name' });
  }
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(folderPath, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Folder created' });
    });
  } else {
    res.status(400).json({ error: 'Folder already exists' });
  }
});

// Upload files
app.post('/api/upload', upload.array('files'), (req, res) => {
  const files = req.files;
  if (!files) return res.status(400).json({ error: 'No files uploaded' });
  files.forEach(file => {
    const destPath = path.join(STORAGE_DIR, file.originalname);
    fs.renameSync(file.path, destPath);
  });
  res.json({ message: 'Files uploaded' });
});

// Delete file or folder
app.delete('/api/delete', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Path required' });
  const absPath = path.join(STORAGE_DIR, filePath);
  if (!absPath.startsWith(STORAGE_DIR)) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  if (!fs.existsSync(absPath)) {
    return res.status(404).json({ error: 'File/Folder not found' });
  }
  try {
    if (fs.lstatSync(absPath).isDirectory()) {
      fs.rmdirSync(absPath, { recursive: true });
    } else {
      fs.unlinkSync(absPath);
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve files for download or preview
app.get('/api/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Path required' });
  const absPath = path.join(STORAGE_DIR, filePath);
  if (!absPath.startsWith(STORAGE_DIR)) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  if (!fs.existsSync(absPath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.sendFile(absPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

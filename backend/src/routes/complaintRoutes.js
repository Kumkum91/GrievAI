import express from 'express';
import multer from 'multer';
import { uploadAudio, processComplaint, getGrievance, listGrievances, updateGrievanceStatus } from '../services/complaintService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload audio file to S3
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audioUrl = await uploadAudio(req.file);
    res.json({ audioUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio' });
  }
});

// Process complaint (transcribe + AI analysis)
router.post('/process-complaint', async (req, res) => {
  try {
    const { audioUrl } = req.body;
    
    if (!audioUrl) {
      return res.status(400).json({ error: 'Audio URL is required' });
    }

    const result = await processComplaint(audioUrl);
    res.json(result);
  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({ error: 'Failed to process complaint' });
  }
});

// Get single grievance
router.get('/grievance/:id', async (req, res) => {
  try {
    const grievance = await getGrievance(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }

    res.json(grievance);
  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({ error: 'Failed to fetch grievance' });
  }
});

// List all grievances
router.get('/grievances', async (req, res) => {
  try {
    const grievances = await listGrievances();
    res.json(grievances);
  } catch (error) {
    console.error('List grievances error:', error);
    res.status(500).json({ error: 'Failed to fetch grievances' });
  }
});

// Update grievance status (admin)
router.post('/grievance/:id/update', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    await updateGrievanceStatus(req.params.id, status);
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;

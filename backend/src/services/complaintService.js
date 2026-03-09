import { v4 as uuidv4 } from 'uuid';
import { uploadToS3 } from './s3Service.js';
import { transcribeAudio } from './transcribeService.js';
import { analyzeComplaint } from './bedrockService.js';
import { saveGrievance, getGrievanceById, getAllGrievances, updateGrievance } from './dynamoService.js';

export async function uploadAudio(file) {
  try {
    const fileName = `audio/${Date.now()}-${file.originalname}`;
    const audioUrl = await uploadToS3(file.buffer, fileName, file.mimetype);
    return audioUrl;
  } catch (error) {
    console.error('Upload audio error:', error);
    throw new Error('Failed to upload audio');
  }
}

export async function processComplaint(audioUrl) {
  try {
    // Step 1: Transcribe audio
    console.log('Transcribing audio...');
    const transcript = await transcribeAudio(audioUrl);
    
    if (!transcript) {
      throw new Error('Failed to transcribe audio');
    }

    // Step 2: Analyze with AI
    console.log('Analyzing complaint with AI...');
    const aiAnalysis = await analyzeComplaint(transcript);

    // Step 3: Save to DynamoDB
    const grievanceId = `GRV-${new Date().getFullYear()}-${uuidv4().split('-')[0].toUpperCase()}`;
    
    const grievance = {
      grievanceId,
      audioUrl,
      transcript,
      formalComplaint: aiAnalysis.formal_complaint,
      category: aiAnalysis.category,
      urgency: aiAnalysis.urgency,
      department: aiAnalysis.department,
      summary: aiAnalysis.summary,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    await saveGrievance(grievance);

    return {
      grievanceId,
      formalComplaint: aiAnalysis.formal_complaint,
      category: aiAnalysis.category,
      urgency: aiAnalysis.urgency,
      department: aiAnalysis.department,
      summary: aiAnalysis.summary
    };
  } catch (error) {
    console.error('Process complaint error:', error);
    throw error;
  }
}

export async function getGrievance(grievanceId) {
  try {
    return await getGrievanceById(grievanceId);
  } catch (error) {
    console.error('Get grievance error:', error);
    throw error;
  }
}

export async function listGrievances() {
  try {
    return await getAllGrievances();
  } catch (error) {
    console.error('List grievances error:', error);
    throw error;
  }
}

export async function updateGrievanceStatus(grievanceId, status) {
  try {
    await updateGrievance(grievanceId, { status });
  } catch (error) {
    console.error('Update grievance status error:', error);
    throw error;
  }
}

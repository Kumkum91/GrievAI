import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function transcribeAudio(audioUrl) {
  try {
    const jobName = `transcribe-${Date.now()}`;

    // Start transcription job
    const startCommand = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US', // or 'hi-IN' for Hindi
      MediaFormat: 'wav',
      Media: {
        MediaFileUri: audioUrl
      }
    });

    await transcribeClient.send(startCommand);

    // Poll for completion
    let jobStatus = 'IN_PROGRESS';
    let transcript = '';

    while (jobStatus === 'IN_PROGRESS') {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

      const getCommand = new GetTranscriptionJobCommand({
        TranscriptionJobName: jobName
      });

      const response = await transcribeClient.send(getCommand);
      jobStatus = response.TranscriptionJob.TranscriptionJobStatus;

      if (jobStatus === 'COMPLETED') {
        const transcriptFileUri = response.TranscriptionJob.Transcript.TranscriptFileUri;
        
        // Fetch transcript
        const transcriptResponse = await fetch(transcriptFileUri);
        const transcriptData = await transcriptResponse.json();
        transcript = transcriptData.results.transcripts[0].transcript;
      } else if (jobStatus === 'FAILED') {
        throw new Error('Transcription job failed');
      }
    }

    return transcript;
  } catch (error) {
    console.error('Transcribe error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

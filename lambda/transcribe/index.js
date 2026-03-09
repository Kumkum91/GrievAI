const { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');

const transcribeClient = new TranscribeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    console.log('Transcribe Lambda triggered');
    
    // Parse input
    const { audioUrl } = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    
    if (!audioUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing audioUrl' })
      };
    }
    
    const jobName = `transcribe-${Date.now()}`;
    
    // Start transcription job
    const startCommand = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US',
      MediaFormat: 'wav',
      Media: { MediaFileUri: audioUrl }
    });
    
    await transcribeClient.send(startCommand);
    console.log('Transcription job started:', jobName);
    
    // Poll for completion
    let jobStatus = 'IN_PROGRESS';
    let transcript = '';
    let attempts = 0;
    const maxAttempts = 60; // 3 minutes max
    
    while (jobStatus === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
      
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
        
        console.log('Transcription completed:', transcript);
      } else if (jobStatus === 'FAILED') {
        throw new Error('Transcription job failed');
      }
    }
    
    if (jobStatus === 'IN_PROGRESS') {
      throw new Error('Transcription timeout');
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript })
    };
  } catch (error) {
    console.error('Transcribe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to transcribe audio', details: error.message })
    };
  }
};

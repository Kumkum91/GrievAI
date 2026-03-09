const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

// Helper function to invoke Lambda
async function invokeLambda(functionName, payload) {
  const command = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(payload)
  });
  
  const response = await lambdaClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.Payload));
  
  if (result.statusCode !== 200) {
    throw new Error(result.body ? JSON.parse(result.body).error : 'Lambda invocation failed');
  }
  
  return JSON.parse(result.body);
}

exports.handler = async (event) => {
  try {
    console.log('Process Complaint Lambda triggered');
    
    // Parse request body
    const { audioUrl } = JSON.parse(event.body);
    
    if (!audioUrl) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing audioUrl' })
      };
    }
    
    console.log('Step 1: Transcribing audio...');
    // Step 1: Transcribe audio
    const transcribeResult = await invokeLambda(
      process.env.TRANSCRIBE_FUNCTION_NAME || 'GrievAI-Transcribe-dev',
      { audioUrl }
    );
    
    const transcript = transcribeResult.transcript;
    console.log('Transcript:', transcript);
    
    if (!transcript) {
      throw new Error('Failed to get transcript');
    }
    
    console.log('Step 2: Classifying complaint...');
    // Step 2: Classify complaint with AI
    const classifyResult = await invokeLambda(
      process.env.CLASSIFY_FUNCTION_NAME || 'GrievAI-ClassifyComplaint-dev',
      { transcript }
    );
    
    console.log('AI Analysis:', classifyResult);
    
    // Step 3: Generate grievance ID
    const grievanceId = `GRV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    
    // Step 4: Prepare grievance data
    const grievance = {
      grievanceId,
      audioUrl,
      transcript,
      formalComplaint: classifyResult.formal_complaint,
      category: classifyResult.category,
      urgency: classifyResult.urgency,
      department: classifyResult.department,
      summary: classifyResult.summary,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };
    
    console.log('Step 3: Saving grievance...');
    // Step 5: Save to DynamoDB
    await invokeLambda(
      process.env.SAVE_FUNCTION_NAME || 'GrievAI-SaveGrievance-dev',
      grievance
    );
    
    console.log('Complaint processed successfully:', grievanceId);
    
    // Return result
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        grievanceId,
        formalComplaint: classifyResult.formal_complaint,
        category: classifyResult.category,
        urgency: classifyResult.urgency,
        department: classifyResult.department,
        summary: classifyResult.summary,
        message: 'Complaint processed successfully'
      })
    };
  } catch (error) {
    console.error('Process complaint error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Failed to process complaint', 
        details: error.message 
      })
    };
  }
};

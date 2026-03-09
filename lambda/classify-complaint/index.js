const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    console.log('Classify Complaint Lambda triggered');
    
    // Parse input
    const { transcript } = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    
    if (!transcript) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing transcript' })
      };
    }
    
    const prompt = `You are an AI assistant helping citizens file formal government complaints.

A citizen submitted a complaint in informal language.

Your tasks:
1. Convert the complaint into formal language suitable for a government report.
2. Identify the complaint category.
3. Detect urgency level.
4. Identify the responsible government department.

Return response strictly in JSON format.

Categories:
- Road Infrastructure
- Electricity
- Water Supply
- Sanitation
- Public Safety
- Other

Urgency Levels:
- Low
- Medium
- High

Complaint: ${transcript}

Return JSON:
{
  "formal_complaint": "",
  "category": "",
  "urgency": "",
  "department": "",
  "summary": ""
}`;
    
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };
    
    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });
    
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract JSON from Claude's response
    const content = responseBody.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }
    
    const aiAnalysis = JSON.parse(jsonMatch[0]);
    
    console.log('AI Analysis completed:', aiAnalysis);
    
    return {
      statusCode: 200,
      body: JSON.stringify(aiAnalysis)
    };
  } catch (error) {
    console.error('Classify error:', error);
    
    // Fallback response
    const fallback = {
      formal_complaint: `Subject: Citizen Complaint\n\nDear Sir/Madam,\n\nI would like to report the following issue: ${event.transcript || 'Issue reported'}\n\nI request immediate attention to this matter.\n\nThank you.`,
      category: 'Other',
      urgency: 'Medium',
      department: 'General Administration',
      summary: (event.transcript || '').substring(0, 100) + '...'
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(fallback)
    };
  }
};

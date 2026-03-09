import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function analyzeComplaint(transcript) {
  try {
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
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Extract the text content from Claude's response
    const content = responseBody.content[0].text;
    
    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const aiAnalysis = JSON.parse(jsonMatch[0]);
    
    return aiAnalysis;
  } catch (error) {
    console.error('Bedrock error:', error);
    
    // Fallback response if AI fails
    return {
      formal_complaint: `Subject: Citizen Complaint\n\nDear Sir/Madam,\n\nI would like to report the following issue: ${transcript}\n\nI request immediate attention to this matter.\n\nThank you.`,
      category: 'Other',
      urgency: 'Medium',
      department: 'General Administration',
      summary: transcript.substring(0, 100) + '...'
    };
  }
}

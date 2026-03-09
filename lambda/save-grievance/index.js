const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log('Save Grievance Lambda triggered');
    
    // Parse input
    const grievance = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    
    if (!grievance.grievanceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing grievanceId' })
      };
    }
    
    // Add timestamps
    grievance.createdAt = grievance.createdAt || new Date().toISOString();
    grievance.updatedAt = new Date().toISOString();
    grievance.status = grievance.status || 'Submitted';
    
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: grievance
    });
    
    await docClient.send(command);
    
    console.log('Grievance saved:', grievance.grievanceId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Grievance saved successfully',
        grievanceId: grievance.grievanceId
      })
    };
  } catch (error) {
    console.error('Save error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save grievance', details: error.message })
    };
  }
};

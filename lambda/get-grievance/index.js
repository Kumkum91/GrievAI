const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log('Get Grievance Lambda triggered');
    
    // Extract grievanceId from path parameters
    const grievanceId = event.pathParameters?.id;
    
    if (!grievanceId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing grievanceId' })
      };
    }
    
    const command = new GetCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { grievanceId }
    });
    
    const response = await docClient.send(command);
    
    if (!response.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Grievance not found' })
      };
    }
    
    console.log('Grievance retrieved:', grievanceId);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(response.Item)
    };
  } catch (error) {
    console.error('Get error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get grievance', details: error.message })
    };
  }
};

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log('List Grievances Lambda triggered');
    
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE
    });
    
    const response = await docClient.send(command);
    
    // Sort by createdAt descending
    const items = response.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`Retrieved ${items.length} grievances`);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ grievances: items, count: items.length })
    };
  } catch (error) {
    console.error('List error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to list grievances', details: error.message })
    };
  }
};

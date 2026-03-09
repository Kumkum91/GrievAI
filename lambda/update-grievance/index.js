const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    console.log('Update Grievance Lambda triggered');
    
    // Extract grievanceId from path parameters
    const grievanceId = event.pathParameters?.id;
    
    if (!grievanceId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing grievanceId' })
      };
    }
    
    // Parse request body
    const updates = JSON.parse(event.body);
    
    if (!updates || Object.keys(updates).length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No updates provided' })
      };
    }
    
    // Build update expression
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    
    Object.keys(updates).forEach((key, index) => {
      updateExpression.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = updates[key];
    });
    
    // Add updatedAt timestamp
    const attrIndex = Object.keys(updates).length;
    updateExpression.push(`#attr${attrIndex} = :val${attrIndex}`);
    expressionAttributeNames[`#attr${attrIndex}`] = 'updatedAt';
    expressionAttributeValues[`:val${attrIndex}`] = new Date().toISOString();
    
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { grievanceId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    
    const response = await docClient.send(command);
    
    console.log('Grievance updated:', grievanceId);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        message: 'Grievance updated successfully',
        grievance: response.Attributes
      })
    };
  } catch (error) {
    console.error('Update error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to update grievance', details: error.message })
    };
  }
};

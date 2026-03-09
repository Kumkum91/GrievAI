import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'grievances';

export async function saveGrievance(grievance) {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: grievance
    });

    await docClient.send(command);
    return grievance;
  } catch (error) {
    console.error('DynamoDB save error:', error);
    throw new Error('Failed to save grievance');
  }
}

export async function getGrievanceById(grievanceId) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        grievanceId
      }
    });

    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error('DynamoDB get error:', error);
    throw new Error('Failed to get grievance');
  }
}

export async function getAllGrievances() {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME
    });

    const response = await docClient.send(command);
    
    // Sort by createdAt descending
    const items = response.Items || [];
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return items;
  } catch (error) {
    console.error('DynamoDB scan error:', error);
    throw new Error('Failed to get grievances');
  }
}

export async function updateGrievance(grievanceId, updates) {
  try {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpression.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = updates[key];
    });

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        grievanceId
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error('DynamoDB update error:', error);
    throw new Error('Failed to update grievance');
  }
}

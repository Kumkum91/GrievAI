const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    console.log('Upload Audio Lambda triggered');
    
    // Parse request body
    const body = JSON.parse(event.body);
    const { audioData, fileName, contentType } = body;
    
    if (!audioData || !fileName) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing audioData or fileName' })
      };
    }
    
    // Decode base64 audio data
    const buffer = Buffer.from(audioData, 'base64');
    
    // Generate unique file name
    const key = `audio/${Date.now()}-${fileName}`;
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'audio/wav'
    });
    
    await s3Client.send(command);
    
    // Generate S3 URL
    const audioUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    console.log('Audio uploaded successfully:', audioUrl);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ audioUrl, message: 'Audio uploaded successfully' })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to upload audio', details: error.message })
    };
  }
};

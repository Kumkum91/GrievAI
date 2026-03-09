# GrievAI Infrastructure Deployment Guide

This guide covers deploying the complete GrievAI infrastructure using AWS SAM (Serverless Application Model).

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws --version
   aws configure
   ```

2. **AWS SAM CLI** installed
   ```bash
   sam --version
   ```
   
   Install SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

3. **Node.js 18+** installed
   ```bash
   node --version
   ```

4. **AWS Account** with appropriate permissions:
   - Lambda
   - API Gateway
   - S3
   - DynamoDB
   - Transcribe
   - Bedrock
   - CloudWatch
   - IAM

## Architecture Overview

```
Voice Input
    ↓
S3 (audio storage)
    ↓
Amazon Transcribe
    ↓
Lambda processing
    ↓
Amazon Bedrock (Claude 3 Haiku)
    ↓
DynamoDB storage
    ↓
API response to frontend
```

## Deployment Steps

### 1. Enable Amazon Bedrock Access

Before deploying, ensure you have access to Claude 3 Haiku in Amazon Bedrock:

```bash
# Check Bedrock model access
aws bedrock list-foundation-models --region us-east-1 --query "modelSummaries[?contains(modelId, 'claude-3-haiku')]"
```

If you don't have access, request it in the AWS Console:
- Go to Amazon Bedrock console
- Navigate to "Model access"
- Request access to "Claude 3 Haiku"

### 2. Build the Application

Navigate to the project root and build all Lambda functions:

```bash
# Build all Lambda functions
sam build --template-file infrastructure/template.yaml
```

This will:
- Install dependencies for each Lambda function
- Package the code
- Prepare for deployment

### 3. Deploy to AWS (Guided)

For first-time deployment, use guided mode:

```bash
sam deploy --guided --template-file infrastructure/template.yaml
```

You'll be prompted for:
- **Stack Name**: `grievai-stack` (or your choice)
- **AWS Region**: `us-east-1` (or your preferred region)
- **Parameter Environment**: `dev` (or `staging`, `prod`)
- **Confirm changes**: Y
- **Allow SAM CLI IAM role creation**: Y
- **Disable rollback**: N
- **Save arguments to configuration**: Y

### 4. Deploy to AWS (Subsequent Deployments)

After the first deployment, use:

```bash
sam deploy --template-file infrastructure/template.yaml
```

### 5. Deploy to Different Environments

Deploy to dev:
```bash
sam deploy --config-env dev --template-file infrastructure/template.yaml
```

Deploy to prod:
```bash
sam deploy --config-env prod --template-file infrastructure/template.yaml
```

## Post-Deployment Configuration

### 1. Get API Endpoint

After deployment, SAM will output the API Gateway endpoint:

```bash
# Get stack outputs
aws cloudformation describe-stacks \
  --stack-name grievai-stack \
  --query "Stacks[0].Outputs"
```

Look for `ApiEndpoint` in the outputs.

### 2. Update Frontend Configuration

Update your frontend `.env` file with the API endpoint:

```env
VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

### 3. Test the API

Test the endpoints:

```bash
# Get API endpoint
API_URL=$(aws cloudformation describe-stacks \
  --stack-name grievai-stack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

# Test list grievances
curl $API_URL/api/grievances

# Test get grievance (replace with actual ID)
curl $API_URL/api/grievance/GRV-2024-ABC123
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload-audio` | Upload audio file to S3 |
| POST | `/api/process-complaint` | Process complete complaint pipeline |
| GET | `/api/grievances` | List all grievances |
| GET | `/api/grievance/{id}` | Get single grievance |
| POST | `/api/grievance/{id}/update` | Update grievance status |

## Monitoring

### CloudWatch Logs

View Lambda logs:

```bash
# View logs for a specific function
sam logs --stack-name grievai-stack --name ProcessComplaintFunction --tail

# View logs with filter
sam logs --stack-name grievai-stack --name ProcessComplaintFunction --filter "ERROR"
```

### CloudWatch Alarms

The stack includes alarms for:
- Lambda function errors
- DynamoDB throttling

View alarms:
```bash
aws cloudwatch describe-alarms --alarm-name-prefix GrievAI
```

## Cleanup

To delete all resources:

```bash
sam delete --stack-name grievai-stack
```

This will remove:
- All Lambda functions
- API Gateway
- DynamoDB table (data will be lost!)
- S3 bucket (must be empty first)
- CloudWatch logs
- IAM roles

## Troubleshooting

### Build Failures

If `sam build` fails:

```bash
# Clean and rebuild
rm -rf .aws-sam
sam build --template-file infrastructure/template.yaml --use-container
```

### Deployment Failures

Check CloudFormation events:

```bash
aws cloudformation describe-stack-events \
  --stack-name grievai-stack \
  --max-items 20
```

### Lambda Errors

Check function logs:

```bash
aws logs tail /aws/lambda/GrievAI-ProcessComplaint-dev --follow
```

### Bedrock Access Denied

Ensure:
1. You have requested access to Claude 3 Haiku in Bedrock console
2. Your region supports Bedrock (us-east-1, us-west-2, etc.)
3. IAM role has `bedrock:InvokeModel` permission

### S3 Bucket Already Exists

If the S3 bucket name is taken, the stack will fail. The bucket name includes your AWS Account ID to make it unique, but if you're redeploying, you may need to:

```bash
# Delete the old bucket (WARNING: deletes all data)
aws s3 rb s3://grievai-audio-storage-dev-YOUR_ACCOUNT_ID --force
```

## Cost Estimation

Approximate monthly costs (dev environment, low usage):

- **Lambda**: $0-5 (first 1M requests free)
- **API Gateway**: $0-5 (first 1M requests free)
- **DynamoDB**: $0-5 (on-demand pricing)
- **S3**: $0-2 (storage + requests)
- **Transcribe**: $0.024/minute
- **Bedrock**: $0.00025/1K input tokens, $0.00125/1K output tokens
- **CloudWatch**: $0-2 (logs)

**Total**: ~$10-30/month for development with moderate usage

## Security Best Practices

1. **Enable MFA** on AWS account
2. **Use IAM roles** with least privilege
3. **Enable CloudTrail** for audit logging
4. **Rotate credentials** regularly
5. **Enable S3 encryption** (already configured)
6. **Enable DynamoDB encryption** (already configured)
7. **Use API Gateway authentication** (add Cognito or API keys)
8. **Monitor CloudWatch alarms**

## Next Steps

1. Add authentication (AWS Cognito)
2. Add rate limiting (API Gateway throttling)
3. Add input validation
4. Add automated testing
5. Set up CI/CD pipeline
6. Configure custom domain
7. Add monitoring dashboard
8. Implement backup strategy

## Support

For issues or questions:
- Check CloudWatch logs
- Review CloudFormation events
- Consult AWS documentation
- Check SAM CLI documentation: https://docs.aws.amazon.com/serverless-application-model/

## Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Amazon Transcribe Documentation](https://docs.aws.amazon.com/transcribe/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

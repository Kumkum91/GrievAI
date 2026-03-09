# GrievAI Infrastructure

This directory contains the complete Infrastructure as Code (IaC) for the GrievAI platform using AWS SAM (Serverless Application Model).

## 📁 Structure

```
infrastructure/
├── template.yaml          # SAM CloudFormation template
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md             # This file

lambda/
├── upload-audio/         # Lambda: Upload audio to S3
├── transcribe/           # Lambda: Transcribe audio
├── classify-complaint/   # Lambda: AI classification with Bedrock
├── save-grievance/       # Lambda: Save to DynamoDB
├── get-grievance/        # Lambda: Retrieve single grievance
├── list-grievances/      # Lambda: List all grievances
├── update-grievance/     # Lambda: Update grievance status
└── process-complaint/    # Lambda: Orchestrator function
```

## 🏗️ Architecture

### Microservices Design

The infrastructure follows a microservices architecture with 8 independent Lambda functions:

1. **UploadAudioFunction**: Handles audio file uploads to S3
2. **TranscribeFunction**: Converts speech to text using Amazon Transcribe
3. **ClassifyComplaintFunction**: Analyzes complaints using Amazon Bedrock (Claude 3 Haiku)
4. **SaveGrievanceFunction**: Stores grievances in DynamoDB
5. **GetGrievanceFunction**: Retrieves single grievance by ID
6. **ListGrievancesFunction**: Lists all grievances
7. **UpdateGrievanceFunction**: Updates grievance status (admin)
8. **ProcessComplaintFunction**: Orchestrates the complete pipeline

### Data Flow

```
User → API Gateway → UploadAudioFunction → S3
                  ↓
         ProcessComplaintFunction
                  ↓
         TranscribeFunction → Amazon Transcribe
                  ↓
         ClassifyComplaintFunction → Amazon Bedrock
                  ↓
         SaveGrievanceFunction → DynamoDB
                  ↓
         Response to User
```

## 🚀 Quick Start

### Prerequisites

- AWS CLI configured
- AWS SAM CLI installed
- Node.js 18+
- AWS Account with Bedrock access

### Deploy

```bash
# From project root
./deploy-infrastructure.sh dev --guided
```

### Test

```bash
# Get API endpoint
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text

# Test API
curl https://YOUR_API_ENDPOINT/api/grievances
```

## 📋 Resources Created

### Compute
- 8 Lambda functions (Node.js 18.x runtime)
- API Gateway REST API with CORS

### Storage
- S3 bucket with encryption and versioning
- DynamoDB table with GSI and encryption

### Monitoring
- CloudWatch Log Groups (30-day retention)
- CloudWatch Alarms for errors and throttling

### Security
- IAM roles with least privilege policies
- S3 bucket with public access blocked
- DynamoDB encryption at rest

## 🔧 Configuration

### Environment Variables

All Lambda functions have access to:

```bash
AWS_REGION              # AWS region
S3_BUCKET_NAME          # S3 bucket for audio
DYNAMODB_TABLE          # DynamoDB table name
BEDROCK_MODEL_ID        # Claude 3 Haiku model ID
```

### Parameters

The template accepts one parameter:

- **Environment**: `dev`, `staging`, or `prod`

This parameter is used to:
- Name resources uniquely
- Configure different settings per environment
- Separate dev/prod data

## 📊 Outputs

After deployment, the stack outputs:

- **ApiEndpoint**: API Gateway URL
- **S3BucketName**: Audio storage bucket
- **DynamoDBTableName**: Grievances table
- **Lambda Function ARNs**: All 8 function ARNs
- **Region**: Deployment region

## 💰 Cost Breakdown

### Per Month (Dev Environment, Low Usage)

| Service | Cost |
|---------|------|
| Lambda | $0-5 (1M requests free) |
| API Gateway | $0-5 (1M requests free) |
| DynamoDB | $0-5 (on-demand) |
| S3 | $0-2 (storage + requests) |
| Transcribe | $0.024/minute |
| Bedrock | $0.00025/1K input tokens |
| CloudWatch | $0-2 (logs) |
| **Total** | **~$10-30/month** |

### Production Scaling

For 10,000 complaints/month:
- Lambda: ~$10
- Transcribe: ~$50 (avg 2 min/complaint)
- Bedrock: ~$20
- DynamoDB: ~$10
- S3: ~$5
- **Total**: ~$100-150/month

## 🔒 Security Features

### Network Security
- S3 bucket blocks all public access
- API Gateway with CORS configured
- VPC integration available (optional)

### Data Security
- S3 server-side encryption (AES-256)
- DynamoDB encryption at rest
- CloudWatch logs encrypted

### Access Control
- IAM roles with least privilege
- Lambda execution roles per function
- Resource-based policies

### Compliance
- CloudTrail integration ready
- Point-in-time recovery for DynamoDB
- S3 versioning enabled

## 📈 Monitoring

### CloudWatch Metrics

Each Lambda function tracks:
- Invocations
- Duration
- Errors
- Throttles
- Concurrent executions

### CloudWatch Alarms

Pre-configured alarms:
- **ProcessComplaintErrorAlarm**: Triggers on 5+ errors in 5 minutes
- **DynamoDBThrottleAlarm**: Triggers on 10+ throttles in 5 minutes

### Logs

View logs:
```bash
# Tail logs
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --tail

# Filter errors
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --filter "ERROR"
```

## 🧪 Testing

### Local Testing

Test Lambda functions locally:

```bash
# Invoke function locally
sam local invoke UploadAudioFunction --event events/upload-audio.json

# Start local API
sam local start-api --template-file infrastructure/template.yaml
```

### Integration Testing

```bash
# Test upload
curl -X POST $API_URL/api/upload-audio \
  -H "Content-Type: application/json" \
  -d '{"audioData":"base64data","fileName":"test.wav"}'

# Test process
curl -X POST $API_URL/api/process-complaint \
  -H "Content-Type: application/json" \
  -d '{"audioUrl":"s3://bucket/audio/file.wav"}'
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Infrastructure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: aws-actions/setup-sam@v2
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: sam build --template-file infrastructure/template.yaml
      - run: sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

## 🛠️ Maintenance

### Update Lambda Code

```bash
# Make changes to lambda/*/index.js
# Rebuild and deploy
sam build --template-file infrastructure/template.yaml
sam deploy
```

### Update Infrastructure

```bash
# Edit infrastructure/template.yaml
# Deploy changes
sam deploy
```

### Rollback

```bash
# List stack history
aws cloudformation list-stack-resources --stack-name grievai-stack-dev

# Rollback to previous version
aws cloudformation rollback-stack --stack-name grievai-stack-dev
```

## 🗑️ Cleanup

### Delete Stack

```bash
sam delete --stack-name grievai-stack-dev
```

### Manual Cleanup

If SAM delete fails:

```bash
# Empty S3 bucket first
aws s3 rm s3://grievai-audio-storage-dev-ACCOUNT_ID --recursive

# Delete stack
aws cloudformation delete-stack --stack-name grievai-stack-dev
```

## 📚 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [API Gateway Best Practices](https://docs.aws.amazon.com/apigateway/latest/developerguide/best-practices.html)

## 🤝 Contributing

When modifying infrastructure:

1. Test locally with `sam local`
2. Deploy to dev environment first
3. Test thoroughly
4. Deploy to prod with approval

## 📧 Support

For infrastructure issues:
1. Check CloudWatch logs
2. Review CloudFormation events
3. Consult DEPLOYMENT.md
4. Open GitHub issue

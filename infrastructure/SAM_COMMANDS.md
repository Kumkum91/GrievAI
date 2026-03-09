# AWS SAM Commands Reference

Quick reference for deploying and managing the GrievAI infrastructure.

## 🚀 Deployment Commands

### First Time Deployment

```bash
# Validate template
sam validate --template-file infrastructure/template.yaml

# Build all Lambda functions
sam build --template-file infrastructure/template.yaml

# Deploy with guided setup
sam deploy --guided --template-file infrastructure/template.yaml
```

**Guided Prompts:**
- Stack Name: `grievai-stack-dev`
- AWS Region: `us-east-1` (or your choice)
- Parameter Environment: `dev`
- Confirm changes before deploy: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save arguments to configuration file: `Y`
- SAM configuration file: `samconfig.toml`
- SAM configuration environment: `default`

### Subsequent Deployments

```bash
# Build and deploy
sam build --template-file infrastructure/template.yaml
sam deploy
```

### Deploy to Different Environments

```bash
# Deploy to dev
sam deploy --config-env dev --template-file infrastructure/template.yaml

# Deploy to staging
sam deploy --config-env staging --template-file infrastructure/template.yaml

# Deploy to prod
sam deploy --config-env prod --template-file infrastructure/template.yaml
```

## 🧪 Local Testing

### Invoke Lambda Locally

```bash
# Invoke a specific function
sam local invoke UploadAudioFunction \
  --event events/upload-audio.json \
  --template-file infrastructure/template.yaml

# Invoke with inline event
sam local invoke ProcessComplaintFunction \
  --event '{"audioUrl":"s3://bucket/audio/test.wav"}' \
  --template-file infrastructure/template.yaml
```

### Start Local API

```bash
# Start API Gateway locally
sam local start-api --template-file infrastructure/template.yaml

# API will be available at http://127.0.0.1:3000
```

### Test Local API

```bash
# Test upload endpoint
curl -X POST http://127.0.0.1:3000/api/upload-audio \
  -H "Content-Type: application/json" \
  -d '{"audioData":"base64data","fileName":"test.wav"}'

# Test list endpoint
curl http://127.0.0.1:3000/api/grievances
```

## 📊 Monitoring & Logs

### View Logs

```bash
# Tail logs for a function
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --tail

# View logs with filter
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --filter "ERROR"

# View logs for specific time range
sam logs --stack-name grievai-stack-dev \
  --name ProcessComplaintFunction \
  --start-time '10min ago' \
  --end-time 'now'
```

### View All Function Logs

```bash
# Upload Audio
sam logs --stack-name grievai-stack-dev --name UploadAudioFunction --tail

# Transcribe
sam logs --stack-name grievai-stack-dev --name TranscribeFunction --tail

# Classify Complaint
sam logs --stack-name grievai-stack-dev --name ClassifyComplaintFunction --tail

# Save Grievance
sam logs --stack-name grievai-stack-dev --name SaveGrievanceFunction --tail

# Get Grievance
sam logs --stack-name grievai-stack-dev --name GetGrievanceFunction --tail

# List Grievances
sam logs --stack-name grievai-stack-dev --name ListGrievancesFunction --tail

# Update Grievance
sam logs --stack-name grievai-stack-dev --name UpdateGrievanceFunction --tail

# Process Complaint
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --tail
```

## 🔍 Stack Information

### Get Stack Outputs

```bash
# View all outputs
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs" \
  --output table

# Get API endpoint
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text

# Get S3 bucket name
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" \
  --output text

# Get DynamoDB table name
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='DynamoDBTableName'].OutputValue" \
  --output text
```

### List Stack Resources

```bash
# List all resources
aws cloudformation list-stack-resources \
  --stack-name grievai-stack-dev \
  --output table

# List Lambda functions
aws cloudformation list-stack-resources \
  --stack-name grievai-stack-dev \
  --query "StackResourceSummaries[?ResourceType=='AWS::Lambda::Function']" \
  --output table
```

### View Stack Events

```bash
# View recent events
aws cloudformation describe-stack-events \
  --stack-name grievai-stack-dev \
  --max-items 20 \
  --output table

# Monitor deployment progress
watch -n 5 'aws cloudformation describe-stack-events \
  --stack-name grievai-stack-dev \
  --max-items 10 \
  --output table'
```

## 🔄 Update Stack

### Update Lambda Code Only

```bash
# Build and deploy (only changed functions are updated)
sam build --template-file infrastructure/template.yaml
sam deploy
```

### Update Infrastructure

```bash
# Edit template.yaml, then:
sam build --template-file infrastructure/template.yaml
sam deploy
```

### Force Update All Functions

```bash
# Delete .aws-sam directory and rebuild
rm -rf .aws-sam
sam build --template-file infrastructure/template.yaml
sam deploy
```

## 🗑️ Cleanup

### Delete Stack

```bash
# Delete entire stack
sam delete --stack-name grievai-stack-dev

# Delete with confirmation
sam delete --stack-name grievai-stack-dev --no-prompts
```

### Manual Cleanup (if SAM delete fails)

```bash
# Empty S3 bucket first
aws s3 rm s3://grievai-audio-storage-dev-ACCOUNT_ID --recursive

# Delete stack
aws cloudformation delete-stack --stack-name grievai-stack-dev

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name grievai-stack-dev
```

## 🐛 Troubleshooting

### Build Issues

```bash
# Clean build
rm -rf .aws-sam
sam build --template-file infrastructure/template.yaml

# Build with container (if local build fails)
sam build --template-file infrastructure/template.yaml --use-container

# Build specific function
sam build --template-file infrastructure/template.yaml UploadAudioFunction
```

### Deployment Issues

```bash
# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name grievai-stack-dev \
  --max-items 20

# Check stack status
aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].StackStatus"

# Rollback failed deployment
aws cloudformation rollback-stack --stack-name grievai-stack-dev
```

### Lambda Issues

```bash
# Check function configuration
aws lambda get-function-configuration \
  --function-name GrievAI-ProcessComplaint-dev

# Invoke function directly
aws lambda invoke \
  --function-name GrievAI-ProcessComplaint-dev \
  --payload '{"audioUrl":"s3://bucket/audio/test.wav"}' \
  response.json

# View response
cat response.json
```

### API Gateway Issues

```bash
# Get API ID
aws apigateway get-rest-apis \
  --query "items[?name=='GrievAI-API-dev'].id" \
  --output text

# Test API endpoint
API_URL=$(aws cloudformation describe-stacks \
  --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

curl $API_URL/api/grievances
```

## 📦 Package & Export

### Package Template

```bash
# Package for deployment
sam package \
  --template-file infrastructure/template.yaml \
  --output-template-file packaged.yaml \
  --s3-bucket my-deployment-bucket
```

### Export Stack

```bash
# Export stack template
aws cloudformation get-template \
  --stack-name grievai-stack-dev \
  --query "TemplateBody" \
  > exported-template.json
```

## 🔐 Security

### View IAM Roles

```bash
# List roles created by stack
aws iam list-roles \
  --query "Roles[?contains(RoleName, 'GrievAI')]" \
  --output table
```

### View IAM Policies

```bash
# Get role policy
aws iam get-role-policy \
  --role-name GrievAI-UploadAudioFunction-Role \
  --policy-name GrievAI-UploadAudioFunction-Policy
```

## 📈 Metrics

### View Lambda Metrics

```bash
# Get invocation count
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=GrievAI-ProcessComplaint-dev \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum

# Get error count
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=GrievAI-ProcessComplaint-dev \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

### View API Gateway Metrics

```bash
# Get API request count
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=GrievAI-API-dev \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

## 🎯 Quick Commands

```bash
# Full deployment workflow
sam build --template-file infrastructure/template.yaml && sam deploy

# View logs
sam logs --stack-name grievai-stack-dev --name ProcessComplaintFunction --tail

# Get API endpoint
aws cloudformation describe-stacks --stack-name grievai-stack-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text

# Delete stack
sam delete --stack-name grievai-stack-dev
```

## 📚 Additional Resources

- [AWS SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)
- [SAM Template Specification](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html)
- [SAM Policy Templates](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html)

---

**Tip**: Save commonly used commands as shell aliases or scripts for faster access!

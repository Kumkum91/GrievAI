
# 🎤 GrievAI - Voice First Grievance Intelligence Platform

A production-ready AI-powered web application for voice-based citizen grievance management using AWS services.

## 🌟 Features

- **Voice Recording**: Record complaints using browser microphone
- **AI Processing**: Automatic transcription and analysis using AWS Transcribe and Bedrock
- **Smart Classification**: AI categorizes complaints and detects urgency
- **Department Routing**: Automatic assignment to relevant government departments
- **Real-time Tracking**: Citizens can track complaint status
- **Admin Dashboard**: Manage and update complaint statuses

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- AWS SDK v3 for cloud services

### AWS Services
- **Amazon S3**: Audio file storage
- **Amazon Transcribe**: Speech-to-text conversion
- **Amazon Bedrock (Claude 3 Haiku)**: AI analysis and classification
- **Amazon DynamoDB**: NoSQL database for grievances
- **AWS Lambda**: Serverless backend deployment
- **API Gateway**: REST API endpoints
- **AWS Amplify**: Frontend hosting

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS Account with appropriate permissions
- AWS CLI configured

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/grievai.git
cd grievai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from `.env.example`:

```bash
cp ../.env.example .env
```

Edit `.env` with your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=grievai-audio-storage
DYNAMODB_TABLE=grievances
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. AWS Resources Setup

#### Create S3 Bucket

```bash
aws s3 mb s3://grievai-audio-storage --region us-east-1
```

#### Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name grievances \
  --attribute-definitions AttributeName=grievanceId,AttributeType=S \
  --key-schema AttributeName=grievanceId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### Enable Bedrock Model Access

1. Go to AWS Console → Bedrock
2. Navigate to Model Access
3. Request access to Claude 3 Haiku model

### 5. Run the Application

Start backend (from `backend` directory):

```bash
npm run dev
```

Start frontend (from `frontend` directory):

```bash
npm run dev
```

Access the application at `http://localhost:3000`

## 📦 Production Deployment

### Option 1: Deploy Complete Infrastructure with AWS SAM (Recommended)

Deploy the entire infrastructure (Lambda, API Gateway, S3, DynamoDB) using Infrastructure as Code:

```bash
# Install AWS SAM CLI
# See: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# Deploy infrastructure (guided first time)
./deploy-infrastructure.sh dev --guided

# Subsequent deployments
./deploy-infrastructure.sh dev
```

This will create:
- 8 Lambda functions for microservices architecture
- API Gateway with REST endpoints
- S3 bucket for audio storage
- DynamoDB table for grievances
- CloudWatch logs and alarms
- IAM roles with least privilege

See [infrastructure/DEPLOYMENT.md](infrastructure/DEPLOYMENT.md) for detailed instructions.

### Option 2: Manual Backend Deployment

If you prefer manual deployment or already have infrastructure:

1. Install Serverless Framework:

```bash
npm install -g serverless
```

2. Deploy using existing serverless.yml:

```bash
cd backend
serverless deploy
```

### Deploy Frontend to AWS Amplify

1. Build frontend:

```bash
cd frontend
npm run build
```

2. Deploy to Amplify:

**Option A: Using Amplify Console**
- Go to AWS Amplify Console
- Click "New app" → "Host web app"
- Connect your Git repository
- Configure build settings:
  - Build command: `npm run build`
  - Output directory: `dist`
- Deploy

**Option B: Using Amplify CLI**

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

3. Update API endpoint in frontend:

Edit `frontend/vite.config.ts` to point to your Lambda API Gateway URL.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key | `**************` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | `***********************` |
| `AWS_REGION` | AWS Region | `us-east-1` |
| `S3_BUCKET_NAME` | S3 Bucket for audio | `grievai-audio-storage` |
| `DYNAMODB_TABLE` | DynamoDB table name | `grievances` |
| `BEDROCK_MODEL_ID` | Bedrock model ID | `anthropic.claude-3-haiku-20240307-v1:0` |

### IAM Permissions Required

Your AWS user/role needs the following permissions:
- S3: `PutObject`, `GetObject`
- Transcribe: `StartTranscriptionJob`, `GetTranscriptionJob`
- Bedrock: `InvokeModel`
- DynamoDB: `PutItem`, `GetItem`, `Scan`, `UpdateItem`

## 📊 Database Schema

### DynamoDB Table: `grievances`

```json
{
  "grievanceId": "GRV-2026-ABC123",
  "audioUrl": "https://s3.amazonaws.com/...",
  "transcript": "Original transcribed text",
  "formalComplaint": "Formal version of complaint",
  "category": "Road Infrastructure",
  "urgency": "High",
  "department": "Public Works Department",
  "summary": "Brief summary",
  "status": "Submitted",
  "createdAt": "2026-02-15T10:30:00Z"
}
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload-audio` | Upload audio file to S3 |
| POST | `/api/process-complaint` | Process complaint (transcribe + AI) |
| GET | `/api/grievance/:id` | Get grievance by ID |
| GET | `/api/grievances` | List all grievances |
| POST | `/api/grievance/:id/update` | Update grievance status (admin) |

## 🧪 Testing

### Test Audio Upload

```bash
curl -X POST http://localhost:5000/api/upload-audio \
  -F "audio=@test-audio.wav"
```

### Test Complaint Processing

```bash
curl -X POST http://localhost:5000/api/process-complaint \
  -H "Content-Type: application/json" \
  -d '{"audioUrl": "https://s3.amazonaws.com/..."}'
```

## 🔒 Security

- All API endpoints use HTTPS
- AWS credentials stored in environment variables
- CORS configured for frontend domain only
- Input validation on all endpoints
- Audio files stored in private S3 bucket

## 💰 Cost Estimation

### AWS Services (Monthly)

- **S3**: ~$1-5 (1000 audio files)
- **Transcribe**: ~$10-20 (1000 minutes)
- **Bedrock (Claude 3 Haiku)**: ~$5-15 (1000 requests)
- **DynamoDB**: ~$1-5 (on-demand pricing)
- **Lambda**: ~$0-5 (within free tier)
- **Amplify**: ~$0-15 (hosting)

**Total**: ~$20-65/month for moderate usage

## 🐛 Troubleshooting

### Audio Recording Not Working
- Check browser permissions for microphone
- Ensure HTTPS (required for Web Audio API)

### Transcription Fails
- Verify audio format (WAV/MP3)
- Check S3 bucket permissions
- Ensure Transcribe has access to S3

### Bedrock Errors
- Confirm model access is enabled in AWS Console
- Check IAM permissions for Bedrock
- Verify model ID is correct

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Made with ❤️ for Bharat 🇮🇳**











>>>>>>> 6dacd307dafadddc83a431fa74332dc3e865362a

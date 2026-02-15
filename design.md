# GrievAI - System Design Document
## AI for Bharat Hackathon 

---

## Table of Contents
1. System Architecture Overview
2. Layer 1: Presentation Layer
3. Layer 2: Application & API Layer
4. Layer 3: Data & Storage Layer
5. AI Intelligence Engine
6. Data Flow & Process
7. API Design
8. Database Schema
9. Security Architecture
10. Deployment Strategy
11. Performance & Scalability
12. Testing Strategy

---

## 1. System Architecture Overview

### 1.1 Architecture Style
**Type**: 3-Tier Layered Architecture with AI Intelligence Engine

**Communication Pattern**: 
- Client-Server: HTTPS REST API
- Async Processing: Apache Kafka message queue
- Event-Driven: AI workers process complaints asynchronously

**Design Principles**:
- Separation of Concerns (Presentation, Business Logic, Data)
- Scalability (horizontal scaling at each layer)
- Security First (HTTPS, JWT, input validation)
- AI-Powered Automation (5 AI components)
- Low Bandwidth Optimization (rural India focus)

### 1.2 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                             │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │   Citizen    │   │    Admin     │   │    Public    │            │
│  │   Portal     │   │  Dashboard   │   │ Transparency │            │
│  │ (Voice UI)   │   │ (Analytics)  │   │   Dashboard  │            │
│  └──────────────┘   └──────────────┘   └──────────────┘            │
│                                                                      │
│  React.js + Tailwind CSS + Chart.js                                 │
│  Hosted on AWS Amplify                                               │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS (Secure REST API)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    APPLICATION & API LAYER                           │
│                                                                      │
│                Node.js + Express (Scalable API)                      │
│                Hosted on Render.com                                  │
│                                                                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐      │
│  │   Auth API   │ Complaint API│  Voice API   │ Analytics API│      │
│  │  (JWT)       │ (CRUD + SLA) │(Upload + STT)│(Insights)    │      │
│  └──────────────┴──────────────┴──────────────┴──────────────┘      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                 AI INTELLIGENCE ENGINE                         │  │
│  │                                                                │  │
│  │  1. Speech Processing → Google Speech-to-Text                 │  │
│  │  2. NLP Classification → Sentiment + Category                 │  │
│  │  3. Urgency Scoring Engine (Rule + AI-based)                  │  │
│  │  4. Department Auto-Routing Logic                              │  │
│  │  5. Pattern Detection (Repeated Issues / Area Clustering)     │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         DATA & STORAGE LAYER                         │
│                                                                      │
│  ┌──────────────────┐   ┌──────────────────┐                       │
│  │   MongoDB Atlas  │   │    Amazon S3     │                       │
│  │  Complaint Data  │   │   Audio Storage  │                       │
│  │  Metadata        │   │   Evidence Files │                       │
│  │  Status Logs     │   │                  │                       │
│  └──────────────────┘   └──────────────────┘                       │
│                                                                      │
│  Secure Access + Encrypted Storage                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer 1: Presentation Layer (Frontend)

### 2.1 Overview
**Technology**: React.js 18+ with Tailwind CSS  
**Hosting**: AWS Amplify

### 2.2 Components

#### 2.2.1 Citizen Portal (Voice UI)

**Key Features**:
- Voice recording (Web Audio API + react-media-recorder)
- Real-time waveform visualization
- Language selection (Hindi/English)
- Complaint tracking by ID
- Progress timeline view

**Pages**: Home, Track, Confirmation

**Technology**: React.js 18+, Tailwind CSS, React Router v6, Web Audio API

#### 2.2.2 Admin Dashboard (Analytics)

**Key Features**:
- Real-time complaint management
- Status updates and assignment
- Analytics charts and visualizations
- Pattern detection alerts
- Performance metrics by department

**Pages**: Login, Dashboard, Complaints, Analytics, Patterns

**Technology**: React.js 18+, Chart.js + react-chartjs-2, Tailwind CSS, JWT

#### 2.2.3 Public Transparency Dashboard

**Key Features**:
- Anonymized complaint statistics
- Department performance metrics
- Regional complaint trends
- No authentication required

**Technology**: React.js 18+, Chart.js, Tailwind CSS

### 2.3 Frontend Architecture

**Component Structure**:
```
src/
├── components/
│   ├── citizen/
│   │   ├── VoiceRecorder.jsx
│   │   ├── ComplaintTracker.jsx
│   │   └── ProgressTimeline.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── ComplaintList.jsx
│   │   ├── Analytics.jsx
│   │   └── PatternAlerts.jsx
│   └── public/
│       └── PublicStats.jsx
├── pages/
│   ├── Home.jsx
│   ├── Track.jsx
│   ├── AdminLogin.jsx
│   └── AdminDashboard.jsx
├── services/
│   ├── api.js
│   ├── auth.js
│   └── audio.js
└── utils/
    ├── audioProcessor.js
    └── validators.js
```

### 2.4 Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-optimized buttons (min 44x44px)

### 2.5 Performance Optimization
- Code splitting (React.lazy)
- Image optimization (WebP)
- Lazy loading for charts
- Bundle size: <500KB
- CDN delivery via AWS Amplify

---

## 3. Layer 2: Application & API Layer (Backend)

### 3.1 Overview
**Technology**: Node.js 18+ LTS with Express.js  
**Hosting**: Render.com  
**Architecture**: Modular monolith with AI engine

### 3.2 Core Modules

#### 3.2.1 Auth API (JWT)

**Endpoints**:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/verify

**Features**:
- JWT token generation (15-min expiry)
- bcrypt password hashing
- Role-based access control

**Technology**: jsonwebtoken, bcrypt

#### 3.2.2 Complaint API (CRUD + SLA)

**Endpoints**:
- POST /api/complaints (create)
- GET /api/complaints/:id (read)
- GET /api/complaints/track/:complaintNumber (track)
- PUT /api/complaints/:id (update)
- POST /api/complaints/:id/progress (add progress)
- POST /api/complaints/:id/comment (citizen comment)
- POST /api/complaints/:id/feedback (rating)
- GET /api/complaints (list with filters)

**Features**:
- CRUD operations
- Status management (registered → assigned → in_progress → resolved)
- Progress tracking with timestamps
- SLA monitoring (72-hour target)
- Auto-generate unique complaint ID (GRV-2026-XXXXX)

#### 3.2.3 Voice API (Upload + STT)

**Endpoints**:
- POST /api/voice/upload (audio upload)
- POST /api/voice/transcribe (STT processing)
- GET /api/voice/:id (retrieve audio URL)

**Features**:
- Audio file upload (Multer)
- File validation (format, size <10MB)
- Upload to AWS S3
- Google Cloud Speech-to-Text integration
- Language detection (Hindi/English)

**Technology**: Multer, AWS S3 SDK, Google Cloud Speech-to-Text API

#### 3.2.4 Analytics API (Insights)

**Endpoints**:
- GET /api/analytics/dashboard (admin stats)
- GET /api/analytics/patterns (AI-detected patterns)
- GET /api/analytics/department/:id (department metrics)
- GET /api/analytics/trends (time-series data)
- GET /api/public/stats (public aggregated data)

**Metrics**:
- Total complaints, status breakdown
- Average resolution time
- Category distribution
- Department performance
- Regional statistics

### 3.3 Backend Architecture

**Directory Structure**:
```
server/
├── config/
│   ├── database.js
│   ├── aws.js
│   └── google-cloud.js
├── controllers/
│   ├── authController.js
│   ├── complaintController.js
│   ├── voiceController.js
│   └── analyticsController.js
├── models/
│   ├── Complaint.js
│   ├── Admin.js
│   └── Department.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── routes/
│   ├── auth.js
│   ├── complaints.js
│   ├── voice.js
│   └── analytics.js
├── services/
│   ├── aiService.js
│   ├── sttService.js
│   ├── routingService.js
│   └── patternService.js
├── utils/
│   ├── logger.js
│   └── validators.js
└── server.js
```

### 3.4 Middleware Stack
1. Helmet.js (security headers)
2. cors (cross-origin resource sharing)
3. express-rate-limit (100 req/15min)
4. express.json() (JSON parsing)
5. auth middleware (JWT verification)
6. validation middleware (input sanitization)
7. error handler (centralized error handling)

### 3.5 Security Features
- HTTPS only
- JWT authentication
- Input validation and sanitization
- XSS protection
- Rate limiting
- Audit logging

---

## 4. AI Intelligence Engine

### 4.1 Overview
**Architecture**: Modular AI services integrated into backend  
**Processing**: Synchronous (STT, categorization) + Asynchronous (pattern detection via Kafka)

### 4.2 AI Component #1: Speech Processing

**Tool**: Google Cloud Speech-to-Text API

**Input**: Audio file (MP3/WAV, <10MB)  
**Output**: Transcribed text + confidence score + language

**Languages**: Hindi (hi-IN), English (en-IN)  
**Accuracy Target**: 85%+  
**Processing Time**: <15 seconds

### 4.3 AI Component #2: NLP Classification

**Tools**: Hugging Face Transformers + BERT + TF-IDF + Logistic Regression

**Models**:
- distilbert-base-multilingual-cased
- ai4bharat/indic-bert

**Input**: Transcribed text  
**Output**: Category + confidence score

**Categories**: Water Supply, Electricity, Roads, Healthcare, Police

**Keyword Mapping**:
- **Water**: पानी, नल, जल, water, tap, supply, leak
- **Electricity**: बिजली, लाइट, electricity, power, light
- **Roads**: सड़क, गड्ढा, road, pothole, street
- **Healthcare**: अस्पताल, डॉक्टर, hospital, doctor, medicine
- **Police**: पुलिस, चोरी, police, crime, safety

**Accuracy Target**: 80%+  
**Fallback**: If confidence < 0.5, flag for manual review

### 4.4 AI Component #3: Urgency Scoring Engine

**Tools**: scikit-learn + Rule-based AI

**Input**: Transcribed text + category  
**Output**: Urgency level (High/Medium/Low)

**Urgency Keywords**:
- **High**: तुरंत, आपातकाल, emergency, urgent, critical, danger
- **Medium**: समस्या, परेशानी, problem, issue, broken
- **Low**: निवेदन, सुझाव, request, suggestion

**Scoring Logic**:
- Keyword matching (40%)
- Sentiment analysis (30%)
- Category-based priority (30%)

**Output Levels**:
- **High**: <24 hours
- **Medium**: 24-72 hours
- **Low**: 72+ hours

### 4.5 AI Component #4: Department Auto-Routing

**Tool**: Rule-based AI + ML-enhanced routing

**Input**: Category + Location + Urgency  
**Output**: Assigned department + officer

**Department Mapping**:
- Water Supply → Water Supply Department
- Electricity → Electricity Board
- Roads → Public Works Department (PWD)
- Healthcare → Health Department
- Police → Police Department

**Load Balancing**: Round-robin assignment with workload consideration

### 4.6 AI Component #5: Pattern Detection

**Tools**: scikit-learn (DBSCAN) + Pandas + NumPy

**Input**: Historical complaint data  
**Output**: Patterns, hotspots, alerts

**Patterns Detected**:
1. **Regional Hotspots**: 5+ similar complaints in same area
2. **Department Delays**: >72 hour average resolution time
3. **Trending Keywords**: Frequent complaint terms
4. **Repeated Issues**: Same complaint filed multiple times

**Algorithm**: DBSCAN (Density-Based Spatial Clustering)  
**Processing**: Asynchronous via Apache Kafka (runs every 6 hours)

---

## 5. Layer 3: Data & Storage Layer

### 5.1 Overview
**Architecture**: NoSQL database + Object storage  
**Security**: Encrypted at rest and in transit

### 5.2 MongoDB Atlas

**Deployment**: Cloud-hosted (AWS ap-south-1 Mumbai)  
**Tier**: M10 (production), M0 (prototype)

**Collections**:

#### 5.2.1 Complaints Collection

**Schema**:
```
{
  _id: ObjectId,
  complaintNumber: String (unique, indexed),
  audioUrl: String (S3 URL),
  transcribedText: String,
  language: String (hi-IN, en-IN),
  
  // AI Results
  category: String (Water/Electricity/Roads/Healthcare/Police),
  categoryConfidence: Number (0-1),
  urgency: String (High/Medium/Low),
  urgencyScore: Number (0-100),
  
  // Location
  state: String,
  district: String,
  block: String,
  pincode: String,
  coordinates: { lat: Number, lng: Number },
  
  // Assignment
  assignedDepartment: String,
  assignedOfficer: ObjectId (ref: Admins),
  
  // Status
  status: String (registered/assigned/in_progress/resolved),
  progressUpdates: [{
    timestamp: Date,
    status: String,
    officerName: String,
    actionTaken: String,
    attachments: [String]
  }],
  
  // Timestamps
  createdAt: Date (indexed),
  updatedAt: Date,
  assignedAt: Date,
  resolvedAt: Date,
  
  // Resolution
  resolutionNotes: String,
  resolutionAttachments: [String],
  
  // Citizen Feedback
  citizenComments: [{ text: String, timestamp: Date }],
  citizenRating: Number (1-5),
  citizenFeedback: String
}
```

**Indexes**:
- complaintNumber (unique)
- status (for filtering)
- category (for analytics)
- createdAt (for time-series queries)
- district + category (compound, for regional analysis)

#### 5.2.2 Departments Collection

**Schema**:
```
{
  _id: ObjectId,
  name: String,
  category: String,
  contactEmail: String,
  contactPhone: String,
  district: String,
  officers: [ObjectId] (ref: Admins),
  createdAt: Date
}
```

#### 5.2.3 Admins Collection

**Schema**:
```
{
  _id: ObjectId,
  username: String (unique),
  passwordHash: String (bcrypt),
  role: String (admin/officer),
  department: ObjectId (ref: Departments),
  fullName: String,
  email: String,
  phone: String,
  createdAt: Date,
  lastLogin: Date
}
```

**Database Features**:
- Auto-scaling storage
- Automated daily backups
- 99.9% uptime SLA
- AES-256 encryption

### 5.3 AWS S3 (Object Storage)  
**Bucket Structure**:
```
grievai-storage/
├── audio/
│   ├── 2026/
│   │   ├── 02/
│   │   │   └── GRV-2026-001.mp3
│   │   └── 03/
│   └── ...
└── evidence/
    ├── 2026/
    │   └── 02/
    │       └── GRV-2026-001-evidence-1.jpg
    └── ...
```

**Configuration**:
- Region: ap-south-1 (Mumbai)
- Storage class: Standard
- Lifecycle: Archive to Glacier after 1 year
- Encryption: AES-256
- Access: Private (pre-signed URLs)

**Security**:
- Deny public access
- IAM roles for backend
- Pre-signed URLs (15-min expiry)
- CORS configuration

---

## 6. Data Flow & Process

### 6.1 Complete Complaint Registration Flow

1. **Citizen Interaction**: Select language → Record complaint → Submit
2. **Voice Processing**: Audio recorded → Uploaded to S3 → Return S3 URL
3. **Speech-to-Text**: Call Google Cloud STT API → Receive transcription
4. **AI Processing**: Categorization → Urgency Detection → Department Routing
5. **Database Storage**: Store in MongoDB → Generate complaint ID
6. **Tracking ID**: Return ID to frontend → Display confirmation
7. **Dashboard Updates**: Emit Kafka event → Update admin dashboard
8. **Officer Action**: View complaint → Update status → Add progress notes
9. **Pattern Detection**: Background worker → Identify patterns → Display alerts

### 6.2 Admin Dashboard Flow

1. **Authentication**: Login → Verify credentials → Generate JWT → Redirect
2. **Dashboard Load**: Calculate statistics → Return data → Render charts
3. **Complaint Management**: View list → Filter → Update status → Add progress
4. **Pattern Detection**: Query results → Display alerts and visualizations

### 6.3 Public Dashboard Flow

1. **Public Access**: Navigate to /public/stats (no auth)
2. **Statistics Load**: Calculate aggregated stats → Render charts

---

## 7. API Design

### 7.1 API Conventions

**Base URL**: `https://api.grievai.com/api/v1`  
**Protocol**: HTTPS only  
**Format**: JSON  
**Authentication**: JWT Bearer token (admin endpoints)  
**Rate Limiting**: 100 requests per 15 minutes per IP

**HTTP Status Codes**:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

**Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2026-02-15T10:30:00Z"
}
```

**Error Format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  },
  "timestamp": "2026-02-15T10:30:00Z"
}
```

### 7.2 API Endpoints

#### 7.2.1 Authentication Endpoints

**POST /api/auth/login**
- Purpose: Admin login
- Auth: None
- Body: { username, password }
- Response: { token, user }

**POST /api/auth/logout**
- Purpose: Admin logout
- Auth: JWT required
- Response: { success: true }

**GET /api/auth/verify**
- Purpose: Verify JWT token
- Auth: JWT required
- Response: { valid: true, user }

#### 7.2.2 Complaint Endpoints

**POST /api/complaints**
- Purpose: Create new complaint
- Auth: None (public)
- Body: { audioUrl, transcribedText, language, location }
- Response: { complaintNumber, trackingUrl }

**GET /api/complaints/:id**
- Purpose: Get complaint details
- Auth: JWT required (admin)
- Response: { complaint }

**GET /api/complaints/track/:complaintNumber**
- Purpose: Track complaint (public)
- Auth: None
- Response: { complaint, progressUpdates }

**PUT /api/complaints/:id**
- Purpose: Update complaint
- Auth: JWT required (admin)
- Body: { status, assignedOfficer }
- Response: { complaint }

**POST /api/complaints/:id/progress**
- Purpose: Add progress update
- Auth: JWT required (admin)
- Body: { actionTaken, notes, attachments }
- Response: { progressUpdate }

**POST /api/complaints/:id/comment**
- Purpose: Citizen comment
- Auth: None (public)
- Body: { text }
- Response: { comment }

**POST /api/complaints/:id/feedback**
- Purpose: Citizen feedback
- Auth: None (public)
- Body: { rating, feedback }
- Response: { success: true }

**GET /api/complaints**
- Purpose: List complaints (with filters)
- Auth: JWT required (admin)
- Query: ?status=in_progress&category=Water&page=1&limit=20
- Response: { complaints, total, page, pages }

#### 7.2.3 Voice Endpoints

**POST /api/voice/upload**
- Purpose: Upload audio file
- Auth: None (public)
- Body: FormData (audio file)
- Response: { audioUrl, fileId }

**POST /api/voice/transcribe**
- Purpose: Transcribe audio to text
- Auth: None (public)
- Body: { audioUrl, language }
- Response: { transcribedText, confidence, language }

#### 7.2.4 Analytics Endpoints

**GET /api/analytics/dashboard**
- Purpose: Admin dashboard statistics
- Auth: JWT required (admin)
- Response: { totalComplaints, statusBreakdown, categoryDistribution, avgResolutionTime }

**GET /api/analytics/patterns**
- Purpose: AI-detected patterns
- Auth: JWT required (admin)
- Response: { hotspots, delays, trends }

**GET /api/analytics/department/:id**
- Purpose: Department-specific metrics
- Auth: JWT required (admin)
- Response: { department, metrics }

**GET /api/public/stats**
- Purpose: Public aggregated statistics
- Auth: None
- Response: { totalComplaints, resolvedComplaints, avgResolutionTime }

---

## 8. Database Schema (Detailed)

### 8.1 Complaints Collection

**Indexes**:
```javascript
db.complaints.createIndex({ complaintNumber: 1 }, { unique: true })
db.complaints.createIndex({ status: 1 })
db.complaints.createIndex({ category: 1 })
db.complaints.createIndex({ createdAt: -1 })
db.complaints.createIndex({ district: 1, category: 1 })
db.complaints.createIndex({ assignedOfficer: 1 })
```

**Sample Document**:
```json
{
  "_id": "65d1234567890abcdef12345",
  "complaintNumber": "GRV-2026-00001",
  "audioUrl": "https://s3.amazonaws.com/grievai/audio/2026/02/GRV-2026-00001.mp3",
  "transcribedText": "मेरे इलाके में पानी की सप्लाई नहीं आ रही है पिछले 3 दिन से",
  "language": "hi-IN",
  "category": "Water Supply",
  "categoryConfidence": 0.92,
  "urgency": "High",
  "urgencyScore": 85,
  "state": "Uttar Pradesh",
  "district": "Lucknow",
  "block": "Gomti Nagar",
  "pincode": "226010",
  "coordinates": { "lat": 26.8467, "lng": 80.9462 },
  "assignedDepartment": "Water Supply Department",
  "assignedOfficer": "65d9876543210fedcba98765",
  "status": "in_progress",
  "progressUpdates": [
    {
      "timestamp": "2026-02-15T10:30:00Z",
      "status": "registered",
      "officerName": "System",
      "actionTaken": "Complaint registered and assigned",
      "attachments": []
    },
    {
      "timestamp": "2026-02-15T14:20:00Z",
      "status": "in_progress",
      "officerName": "Rajesh Kumar",
      "actionTaken": "Team dispatched to inspect the issue",
      "attachments": ["https://s3.amazonaws.com/grievai/evidence/inspection-1.jpg"]
    }
  ],
  "createdAt": "2026-02-15T10:25:00Z",
  "updatedAt": "2026-02-15T14:20:00Z",
  "assignedAt": "2026-02-15T10:30:00Z",
  "resolvedAt": null,
  "resolutionNotes": null,
  "resolutionAttachments": [],
  "citizenComments": [],
  "citizenRating": null,
  "citizenFeedback": null
}
```

### 8.2 Query Patterns

**Get complaints by status**:
```javascript
db.complaints.find({ status: "in_progress" }).sort({ createdAt: -1 })
```

**Get complaints by department**:
```javascript
db.complaints.find({ assignedDepartment: "Water Supply Department" })
```

**Get high urgency complaints**:
```javascript
db.complaints.find({ urgency: "High", status: { $ne: "resolved" } })
```

**Get regional hotspots**:
```javascript
db.complaints.aggregate([
  { $match: { category: "Water Supply" } },
  { $group: { _id: "$district", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])
```

**Calculate average resolution time**:
```javascript
db.complaints.aggregate([
  { $match: { status: "resolved", resolvedAt: { $ne: null } } },
  { $project: {
      resolutionTime: {
        $subtract: ["$resolvedAt", "$createdAt"]
      }
    }
  },
  { $group: {
      _id: null,
      avgResolutionTime: { $avg: "$resolutionTime" }
    }
  }
])
```

---

## 9. Security Architecture

### 9.1 Authentication & Authorization

**Admin Authentication**:
- JWT-based (15-min expiry)
- bcrypt password hashing (10 rounds)
- Password policy: Min 8 chars, 1 uppercase, 1 number, 1 special char

**Citizen Access**: No authentication required for registration

**RBAC**:
- **Admin**: Full access
- **Officer**: Department-specific access
- **Public**: Read-only aggregated stats

### 9.2 Data Security

**Encryption**:
- In Transit: TLS 1.3 (HTTPS)
- At Rest: AES-256 (MongoDB, S3)
- Passwords: bcrypt hashing

**Input Validation**:
- Audio: Max 10MB, formats (MP3, WAV, AAC)
- Text: Max 5000 characters
- XSS prevention, SQL injection prevention

**API Security**:
- Rate limiting: 100 req/15min per IP
- CORS: Whitelist frontend domain
- Helmet.js security headers

### 9.3 Privacy & Compliance

**Data Privacy**:
- Anonymize public statistics
- No PII in public APIs
- Audio files in private S3 bucket

**Audit Logging**: Log all admin actions, status changes, auth attempts (1-year retention)

**Compliance**: GDPR-ready, India's IT Act 2000, Data residency: India

---

## 10. Deployment Strategy

### 10.1 Hosting Architecture

**Frontend**: AWS Amplify (Global CDN, auto-deploy, HTTPS)  
**Backend**: Render.com (Singapore region, auto-deploy, auto-scaling)  
**Database**: MongoDB Atlas (ap-south-1 Mumbai, M10/M0)  
**Storage**: AWS S3 (ap-south-1 Mumbai, CloudFront CDN)

### 10.2 Environment Configuration

**Environment Variables**:
```
# Node.js
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=...
JWT_EXPIRY=15m

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_APPLICATION_CREDENTIALS=...

# AWS
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=grievai-storage
AWS_REGION=ap-south-1

# Frontend
FRONTEND_URL=https://grievai.com

# Kafka (Production)
KAFKA_BROKERS=...
KAFKA_CLIENT_ID=grievai-backend
```

### 10.3 Deployment Steps

1. **Infrastructure**: Create MongoDB cluster, S3 bucket, CloudFront CDN, DNS, SSL
2. **Backend**: Push to GitHub → Connect Render.com → Configure env vars → Deploy
3. **Frontend**: Push to GitHub → Connect AWS Amplify → Configure build → Deploy
4. **Testing**: API, frontend, E2E, load, security testing
5. **Monitoring**: Setup error tracking, logging, uptime monitoring, alerts

### 10.4 CI/CD Pipeline

**Git Workflow**: main → production, develop → staging, feature → development  
**Automated Deployment**: Push to main → Auto-deploy → Run tests → Rollback on failure

---

## 11. Performance & Scalability

### 11.1 Performance Targets

**Frontend**:
- Initial load: <3 seconds (3G network)
- Time to interactive: <5 seconds
- Bundle size: <500KB
- Lighthouse score: >90

**Backend**:
- API response time (p95): <500ms
- Database query time (p95): <100ms
- Speech-to-text: <15 seconds
- Concurrent users: 1000+

**System**:
- Uptime: >99.5%
- Error rate: <0.1%

### 11.2 Optimization Strategies

**Frontend**: Code splitting, image optimization (WebP), CDN delivery, minification  
**Backend**: Database indexing, query optimization, connection pooling, async processing (Kafka)  
**Database**: Proper indexing, query caching, aggregation optimization

### 11.3 Scalability Plan

**Horizontal Scaling**: Backend auto-scale (2-10 instances), MongoDB auto-scaling, S3 unlimited  
**Vertical Scaling**: Upgrade MongoDB (M10 → M20 → M30), Upgrade Render.com plan  
**Load Balancing**: Render.com built-in, CloudFront for frontend  
**Caching**: CDN caching, API response caching (future: Redis)

### 11.4 Capacity Planning

**Prototype** (100 complaints/day):
- Frontend: AWS Amplify Free
- Backend: Render.com Free
- Database: MongoDB M0 Free
- Cost: $0/month

**Production** (10,000 complaints/day):
- Frontend: AWS Amplify ($20/month)
- Backend: Render.com ($50-100/month)
- Database: MongoDB M10 ($57/month)
- Storage: S3 ($10-20/month)
- STT API: $50-100/month
- Total: $400-500/month

**National Scale** (100,000 complaints/day):
- Frontend: AWS Amplify ($50/month)
- Backend: Render.com ($200-300/month)
- Database: MongoDB M30 ($500/month)
- Storage: S3 ($100/month)
- STT API: $500/month
- CDN: CloudFront ($100/month)
- Total: $1,500-2,000/month

---

## 12. Testing Strategy

### 12.1 Testing Levels

**Unit Testing**: Individual functions, AI components, utilities (70%+ coverage)  
**Integration Testing**: API endpoints, database operations, external APIs  
**End-to-End Testing**: Complete user flows, voice recording → complaint creation  
**Performance Testing**: Load testing, stress testing, API response times

### 12.2 Test Cases

**Citizen Portal**:
- ✓ Voice recording works on mobile
- ✓ Voice recording works on desktop
- ✓ Audio upload succeeds
- ✓ Complaint tracking works
- ✓ Progress timeline displays correctly

**Admin Dashboard**:
- ✓ Login works
- ✓ Dashboard loads statistics
- ✓ Complaint list displays
- ✓ Status update works
- ✓ Charts render correctly

**AI Components**:
- ✓ STT accuracy >85%
- ✓ Categorization accuracy >80%
- ✓ Urgency detection works
- ✓ Routing logic correct
- ✓ Pattern detection identifies issues

**API**:
- ✓ All endpoints return correct status codes
- ✓ Authentication works
- ✓ Rate limiting works
- ✓ Error handling works

### 12.3 Browser Compatibility

**Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (desktop + mobile)  
**Not Supported**: Internet Explorer

---

## 13. Monitoring & Maintenance

### 13.1 Monitoring

**Application**: Error tracking, performance monitoring, API response times  
**Infrastructure**: Server uptime, CPU/Memory usage, disk space, network traffic  
**Business Metrics**: Complaints per day, resolution time, AI accuracy

### 13.2 Logging

**Log Levels**: ERROR, WARN, INFO, DEBUG (dev only)  
**Logged Events**: API requests, auth attempts, complaint operations, AI results, errors

### 13.3 Maintenance

**Regular Tasks**: Daily backups (automated), monthly security updates, quarterly dependency updates  
**Incident Response**: Monitor errors, alert on critical issues, rollback on failures

---

## 14. Future Enhancements

### 14.1 Phase 2 (3-6 months)
- Mobile apps (iOS, Android)
- 15+ regional languages
- SMS notifications
- Email notifications
- Citizen OTP authentication

### 14.2 Phase 3 (6-12 months)
- National deployment
- Integration with existing government systems
- Advanced pattern detection
- Predictive analytics
- Corruption detection

### 14.3 Technical Improvements
- Redis caching
- Microservices architecture
- Real-time WebSocket updates
- Advanced AI models
- Multi-region deployment

---

**Document Version**: 1.0   
**Hackathon**: AI for Bharat  
**Architecture**: 3-Tier with AI Intelligence Engine  
**Tech Stack**: React + Node.js + MongoDB + AI/ML (36 technologies)

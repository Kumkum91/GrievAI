# GrievAI - System Design Document
## AI for Bharat Hackathon 

## 1. High-Level Architecture

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Web Browser)                    │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Citizen    │  │    Admin     │  │    Public    │         │
│  │   Portal     │  │  Dashboard   │  │  Dashboard   │         │
│  │ (Voice UI)   │  │ (Analytics)  │  │(Transparency)│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│         React.js + Tailwind CSS + Chart.js                      │
│         Web Audio API (Voice Recording)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   API SERVER (Node.js + Express)                │
│                                                                  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Auth API   │Complaint API │  Voice API   │Analytics API │ │
│  │  (JWT Auth)  │(CRUD + Track)│(Upload + STT)│(Stats + AI)  │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              AI/ML PROCESSING LAYER                        │ │
│  │                                                            │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │   AI #1     │  │    AI #2     │  │     AI #3       │ │ │
│  │  │ Speech-to-  │→ │     NLP      │→ │   Urgency       │ │ │
│  │  │    Text     │  │Categorization│  │   Detection     │ │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘ │ │
│  │                                                            │ │
│  │  ┌─────────────┐  ┌──────────────┐                       │ │
│  │  │   AI #4     │  │    AI #5     │                       │ │
│  │  │  Routing    │  │   Pattern    │                       │ │
│  │  │   Logic     │  │  Detection   │                       │ │
│  │  └─────────────┘  └──────────────┘                       │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬────────────────┐
        │                │                │                │
   ┌────▼─────┐    ┌────▼──────┐   ┌────▼──────┐   ┌────▼──────┐
   │ MongoDB  │    │  Speech   │   │   AI/ML   │   │   File    │
   │ Database │    │  to Text  │   │  Models   │   │  Storage  │
   │          │    │    API    │   │  (Local)  │   │(Cloudinary│
   │ (Atlas)  │    │  (Google  │   │           │   │ /Local)   │
   │          │    │  Cloud)   │   │           │   │           │
   └──────────┘    └───────────┘   └───────────┘   └───────────┘
```

### 1.2 Complete Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: CITIZEN INTERACTION                                 │
└─────────────────────────────────────────────────────────────┘
    Citizen opens GrievAI web app
    Selects language (Hindi | English | Regional)
    Clicks large "🎤 Record Complaint" button
    Speaks complaint in local language
    "मेरे गांव में पानी की समस्या है"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: VOICE PROCESSING                                    │
└─────────────────────────────────────────────────────────────┘
    Audio recorded via Web Audio API
    Waveform displayed in real-time
    Audio uploaded to server
    File saved to storage
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: AI #1 - SPEECH-TO-TEXT CONVERSION                  │
│ Tool: Google Cloud Speech-to-Text / Web Speech API         │
└─────────────────────────────────────────────────────────────┘
    Audio → Text: "मेरे गांव में पानी की समस्या है"
    Confidence: 92%
    Language: Hindi
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: AI PROCESSING ENGINE                                │
└─────────────────────────────────────────────────────────────┘
    ┌─────────────────────────────────────┐
    │ AI #2: Categorization               │
    │ Output: "Water Supply" (89% conf)   │
    └─────────────────────────────────────┘
              │
    ┌─────────────────────────────────────┐
    │ AI #3: Urgency Detection            │
    │ Output: "High" (essential service)  │
    └─────────────────────────────────────┘
              │
    ┌─────────────────────────────────────┐
    │ AI #4: Department Mapping           │
    │ Output: "Water Supply Department"   │
    └─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: COMPLAINT STORED IN DATABASE                        │
└─────────────────────────────────────────────────────────────┘
    MongoDB stores:
    - Audio URL
    - Transcribed text
    - AI classification results
    - Location data
    - Timestamps
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: TRACKING ID GENERATED                               │
└─────────────────────────────────────────────────────────────┘
    Unique ID: GRV-2026-001
    Confirmation shown to citizen
    QR code for easy tracking
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: GOVERNMENT DASHBOARD UPDATES                        │
└─────────────────────────────────────────────────────────────┘
    Real-time analytics updated
    Admin notified of new complaint
    Pattern detection runs in background
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: ACTION TAKEN → STATUS UPDATED                       │
└─────────────────────────────────────────────────────────────┘
    Officer reviews complaint
    Updates progress with action taken
    Citizen can track in real-time
    Status: Registered → Assigned → In Progress → Resolved
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: AI #5 - PATTERN DETECTION (Background)             │
└─────────────────────────────────────────────────────────────┘
    Analyzes all complaints
    Identifies regional hotspots
    Detects department delays
    Flags systemic issues
    Generates governance insights
```

**Architecture Style**: Monolithic with AI Layer (for rapid development)
**Communication**: RESTful APIs + AI Pipeline
**Deployment**: Single server deployment with external AI services

## 2. Complete Feature List

### 🟢 Citizen-Side Features

**🎤 Voice-Based Complaint Registration**
- Users can file complaints by speaking in their local language
- Large, accessible record button (voice-first design)
- Real-time waveform visualization during recording
- Playback option before submission
- Fallback to text input if needed

**🌍 Multi-Language Support**
- Supports Hindi, English, and regional languages
- Language selector on home screen
- Ensures accessibility across Bharat
- Culturally appropriate UI

**🧠 AI-Based Complaint Categorization**
- Automatically classifies complaints into relevant departments
- 5 categories: Water Supply, Electricity, Roads, Healthcare, Police
- Shows confidence score
- User can edit if needed

**🚨 Urgency Detection**
- Identifies high-priority cases (safety, health, infrastructure failures)
- Three levels: High, Medium, Low
- Based on keywords and context analysis
- Ensures critical issues get immediate attention

**📩 Auto Routing to Correct Department**
- Reduces misrouting and manual intervention
- Instant assignment based on category + location
- 90%+ routing accuracy
- Eliminates 2-3 day manual processing delay

**🔎 Complaint Tracking System**
- Provides unique tracking ID (e.g., GRV-2026-001)
- Real-time status updates
- Progress timeline with action history
- View assigned officer and department
- Add comments and follow-ups
- No login required for tracking

**📱 Progress Updates & Transparency**
- See every action taken by officials
- View timestamps and officer names
- Photo evidence of inspections/repairs
- Estimated resolution date
- Complete complaint journey visible

**📶 Low-Bandwidth Optimized Design**
- Lightweight interface for rural areas
- Compressed audio upload (<500KB/min)
- Works on 2G/3G networks
- Minimal page size (<2MB)
- Progressive loading

### 🔵 Government / Admin-Side Features

**📊 Real-Time Analytics Dashboard**
- Displays complaint trends, volumes, and department performance
- Key metrics: Total, Pending, Resolved, Avg Resolution Time
- Visual charts: Pie, Bar, Line, Heatmap
- Filterable by date, category, location, status
- Export reports functionality

**📍 Region-Based Issue Mapping**
- Identifies recurring problems in specific areas
- Geographic heatmap of complaints
- District-wise statistics
- Hotspot detection (5+ complaints in same area/category)

**⏳ Resolution Time Monitoring**
- Tracks average response and closure time
- Per-department performance metrics
- Identifies bottlenecks
- Flags departments with >72 hour avg resolution time

**⚠ Pattern-Based Risk Alerts**
- Flags unusual complaint clusters
- Detects repeated unresolved cases
- Identifies systemic inefficiencies
- Trending keyword analysis
- Proactive governance insights

**📈 Performance Metrics for Departments**
- Improves accountability
- Data-driven governance decisions
- Officer-level tracking
- Workload distribution analysis
- Comparative performance reports

**👤 Complaint Management**
- View all complaints in filterable table
- Assign to departments and officers
- Update status with progress notes
- Add action taken (visible to citizens)
- Upload evidence photos
- Set estimated resolution dates
- Internal notes (admin only)

**🔐 Admin Authentication**
- Secure JWT-based login
- Role-based access control
- Audit trail of all actions
- Session management

## 2. Component Overview

### 2.1 Frontend (React.js on AWS Amplify)

**Key Technologies**:
- React.js 18+
- Tailwind CSS
- React Router v6
- Web Audio API + react-media-recorder
- Chart.js + react-chartjs-2

**Key Pages**:
- Home: Voice recording interface
- Track: Complaint tracking by ID
- Admin Login: Simple authentication
- Admin Dashboard: Complaint management + analytics
- Public Dashboard: Transparency portal

**Key Features**:
- Web Audio API for voice recording
- Responsive design (mobile-first)
- Chart.js for visualizations
- Real-time audio waveform

**Hosting**: AWS Amplify (auto-deploy from Git, global CDN, HTTPS included)

### 2.2 Backend (Node.js on Render.com)

**Core Technologies**:
- Node.js 18+ LTS
- Express.js
- Multer (file uploads)
- jsonwebtoken (JWT auth)
- bcrypt (password hashing)
- dotenv (environment variables)
- cors (cross-origin requests)
- Helmet.js (security headers)
- express-rate-limit (API protection)

**Core Modules**:
- **Auth Module**: Admin login with JWT
- **Complaint Module**: CRUD operations, status management
- **Voice Module**: Audio upload, STT integration
- **AI Module**: Text classification, urgency detection
- **Analytics Module**: Statistics calculation, pattern detection

**Hosting**: Render.com (auto-deploy from Git, environment variables support)

### 2.3 Database & Storage

**MongoDB Atlas**:
- NoSQL document database
- Stores: Complaints, metadata, status logs, user data
- Why: Flexible schema, JSON-like documents, auto-scaling, 99.9% uptime
- Cost: M10 cluster $57/month (production)

**AWS S3**:
- Object storage for audio files and evidence images
- Why: Unlimited storage, 99.999999999% durability, cost-effective
- Cost: $0.023/GB/month

### 2.4 AI/ML Processing Layer

**AI Component #1: Speech-to-Text**
- **Tool**: Google Cloud Speech-to-Text API
- **Input**: Audio file (MP3/WAV)
- **Output**: Transcribed text + confidence score
- **Languages**: Hindi (hi-IN), English (en-IN)
- **Purpose**: Convert voice complaints to text
- **Accuracy**: 90%+
- **Cost**: $0.006 per 15 seconds

**AI Component #2: NLP Categorization**
- **Tools**: Hugging Face Transformers + BERT models
- **Models**: 
  - distilbert-base-multilingual-cased (104 languages)
  - ai4bharat/indic-bert (Indian languages)
- **Algorithm**: TF-IDF Vectorizer + Logistic Regression
- **Input**: Transcribed text
- **Output**: Category (Water/Electricity/Roads/Health/Police) + confidence
- **Purpose**: Automatically classify complaint type
- **Accuracy Target**: 75%+

**AI Component #3: Urgency Detection**
- **Tools**: scikit-learn + Sentiment analysis
- **Input**: Transcribed text
- **Output**: Urgency level (High/Medium/Low)
- **Purpose**: Prioritize critical complaints

**AI Component #4: Intelligent Routing**
- **Tool**: Rule-based AI + ML-enhanced routing
- **Input**: Category + Location
- **Output**: Assigned department
- **Purpose**: Route complaints to correct department

**AI Component #5: Pattern Detection**
- **Tools**: scikit-learn (DBSCAN) + Pandas + NumPy
- **Algorithms**: DBSCAN clustering for geographic patterns
- **Input**: Historical complaint data
- **Output**: Regional hotspots, departmental delays, trends
- **Purpose**: Identify systemic governance issues

### 2.5 Infrastructure

**Cloudflare CDN**:
- Fast content delivery
- DDoS protection
- SSL/TLS encryption
- Reduces load times by 50% for rural areas

**Let's Encrypt**:
- Free SSL/HTTPS certificates
- Automatic renewal
- Secures all communications

### 2.6 Agent/Messaging Layer (Production)

**Apache Kafka**:
- Distributed event streaming platform
- Async message queue for:
  - Audio processing (speech-to-text)
  - AI scoring (categorization, urgency)
  - Department routing
  - Pattern detection jobs
- **Topics**:
  - `complaint.uploaded`
  - `complaint.transcribed`
  - `complaint.classified`
  - `complaint.routed`

## 3. AI Model Design & Implementation

### 3.1 AI Component #1: Speech-to-Text

**Purpose**: Convert voice complaints to text in Hindi/English

**Implementation Options**:

**Option A: Web Speech API (Browser-based, Free)**
```javascript
// Frontend implementation - No server cost
const recognition = new webkitSpeechRecognition();
recognition.lang = 'hi-IN'; // Hindi
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const confidence = event.results[0][0].confidence;
  
  console.log('Transcript:', transcript);
  console.log('Confidence:', confidence);
  
  // Send to backend for AI processing
  submitComplaint(transcript, confidence);
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
  // Fallback to text input
};

recognition.start();
```

**Option B: Google Cloud Speech-to-Text (Server-side, Free tier: 60 min/month)**
```javascript
// Backend implementation
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

async function transcribeAudio(audioBuffer, language) {
  const audio = {
    content: audioBuffer.toString('base64'),
  };
  
  const config = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: language === 'hi' ? 'hi-IN' : 'en-IN',
    enableAutomaticPunctuation: true,
    model: 'default'
  };

  const request = { audio, config };
  const [response] = await client.recognize(request);
  
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  
  const confidence = response.results[0].alternatives[0].confidence;
  
  return {
    text: transcription,
    confidence: confidence,
    language: language
  };
}
```

**Target Accuracy**: 80%+ for Hindi/English
**Processing Time**: <15 seconds

---

### 3.2 AI Component #2: NLP Complaint Categorization

**Purpose**: Automatically classify complaints into 5 departments

**Approach**: Hybrid (Keyword-based + ML)

**Categories & Keywords**:
```javascript
const categoryKeywords = {
  'Water Supply': {
    hindi: ['पानी', 'नल', 'जल', 'टंकी', 'पाइप', 'लीक'],
    english: ['water', 'tap', 'supply', 'tank', 'pipe', 'leak', 'drinking']
  },
  'Electricity': {
    hindi: ['बिजली', 'लाइट', 'ट्रांसफार्मर', 'तार', 'मीटर'],
    english: ['electricity', 'power', 'light', 'transformer', 'wire', 'meter', 'outage']
  },
  'Roads': {
    hindi: ['सड़क', 'गड्ढा', 'रास्ता', 'पुल'],
    english: ['road', 'pothole', 'street', 'bridge', 'highway', 'path']
  },
  'Healthcare': {
    hindi: ['अस्पताल', 'डॉक्टर', 'दवा', 'इलाज', 'स्वास्थ्य'],
    english: ['hospital', 'doctor', 'medicine', 'health', 'treatment', 'clinic']
  },
  'Police': {
    hindi: ['पुलिस', 'चोरी', 'अपराध', 'सुरक्षा'],
    english: ['police', 'crime', 'theft', 'safety', 'security', 'law']
  }
};

function categorizeComplaint(text) {
  const scores = {};
  const textLower = text.toLowerCase();
  
  // Calculate keyword match scores
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const hindiMatches = keywords.hindi.filter(kw => textLower.includes(kw)).length;
    const englishMatches = keywords.english.filter(kw => textLower.includes(kw)).length;
    scores[category] = hindiMatches + englishMatches;
  }
  
  // Find category with highest score
  const category = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  // Calculate confidence
  const maxScore = Math.max(...Object.values(scores));
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = maxScore / (totalScore || 1);
  
  return { 
    category, 
    confidence: Math.min(confidence, 0.95) // Cap at 95%
  };
}
```

**ML Enhancement** (Optional - if time permits):
```python
# Using Hugging Face Transformers
from transformers import pipeline

# Load pre-trained multilingual model
classifier = pipeline(
    "text-classification",
    model="ai4bharat/indic-bert",
    top_k=1
)

def categorize_with_ml(text):
    result = classifier(text)[0]
    
    # Map model output to categories
    category_map = {
        'LABEL_0': 'Water Supply',
        'LABEL_1': 'Electricity',
        'LABEL_2': 'Roads',
        'LABEL_3': 'Healthcare',
        'LABEL_4': 'Police'
    }
    
    return {
        'category': category_map.get(result['label'], 'Other'),
        'confidence': result['score']
    }
```

**Target Accuracy**: 75%+
**Fallback**: If confidence < 0.5, flag for manual review

---

### 3.3 AI Component #3: Urgency Detection

**Purpose**: Classify complaints as High/Medium/Low priority

**Implementation**:
```javascript
const urgencyKeywords = {
  high: {
    hindi: ['तुरंत', 'आपातकाल', 'खतरा', 'जान', 'मौत', 'गंभीर'],
    english: ['emergency', 'urgent', 'critical', 'danger', 'death', 'life', 'serious', 'immediate']
  },
  medium: {
    hindi: ['समस्या', 'परेशानी', 'खराब', 'बंद'],
    english: ['problem', 'issue', 'broken', 'not working', 'damaged']
  },
  low: {
    hindi: ['निवेदन', 'सुझाव', 'सुधार'],
    english: ['request', 'suggestion', 'improve', 'enhancement']
  }
};

function detectUrgency(text, category) {
  const textLower = text.toLowerCase();
  
  // Check for high urgency keywords
  const highKeywords = [...urgencyKeywords.high.hindi, ...urgencyKeywords.high.english];
  if (highKeywords.some(kw => textLower.includes(kw))) {
    return 'high';
  }
  
  // Healthcare and Police are often high priority
  if (['Healthcare', 'Police'].includes(category)) {
    return 'high';
  }
  
  // Check for low urgency keywords
  const lowKeywords = [...urgencyKeywords.low.hindi, ...urgencyKeywords.low.english];
  if (lowKeywords.some(kw => textLower.includes(kw))) {
    return 'low';
  }
  
  // Default to medium
  return 'medium';
}
```

**Sentiment Analysis Enhancement** (Optional):
```javascript
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function detectUrgencyWithSentiment(text, category) {
  const result = sentiment.analyze(text);
  
  // Very negative sentiment = high urgency
  if (result.score < -3) {
    return 'high';
  }
  
  // Combine with keyword-based detection
  const keywordUrgency = detectUrgency(text, category);
  return keywordUrgency;
}
```

---

### 3.4 AI Component #4: Intelligent Routing

**Purpose**: Route complaints to correct department based on category + location

**Implementation**:
```javascript
const departmentMapping = {
  'Water Supply': 'Water Supply Department',
  'Electricity': 'Electricity Board',
  'Roads': 'Public Works Department (PWD)',
  'Healthcare': 'Health Department',
  'Police': 'Police Department'
};

function routeComplaint(category, location, urgency) {
  // Basic routing by category
  let department = departmentMapping[category];
  
  // Location-based routing (future enhancement)
  // e.g., district-specific departments
  if (location.district === 'Lucknow') {
    department = `${department} - Lucknow District`;
  }
  
  // Urgency-based escalation
  if (urgency === 'high') {
    // Route to senior officer or fast-track queue
    department = `${department} (Priority Queue)`;
  }
  
  return department;
}

// ML-enhanced routing (learns from corrections)
async function mlEnhancedRouting(category, location, historicalData) {
  // Analyze past routing decisions
  // Learn from manual corrections by admins
  // Improve routing accuracy over time
  
  // For MVP: Use rule-based routing
  return routeComplaint(category, location);
}
```

---

### 3.5 AI Component #5: Pattern Detection

**Purpose**: Identify systemic issues through data analysis

**Implementation**:

**Pattern 1: Regional Hotspots**
```javascript
async function detectRegionalHotspots() {
  const hotspots = await Complaint.aggregate([
    {
      $group: {
        _id: { 
          district: '$district', 
          category: '$category' 
        },
        count: { $sum: 1 },
        complaints: { $push: '$complaintNumber' }
      }
    },
    { $match: { count: { $gte: 5 } } }, // 5+ complaints = hotspot
    { $sort: { count: -1 } }
  ]);
  
  return hotspots.map(h => ({
    district: h._id.district,
    category: h._id.category,
    count: h.count,
    severity: h.count >= 10 ? 'critical' : 'high',
    complaints: h.complaints
  }));
}
```

**Pattern 2: Department Delays**
```javascript
async function detectDepartmentDelays() {
  const resolved = await Complaint.find({ 
    status: 'resolved',
    resolvedAt: { $exists: true }
  });
  
  const deptTimes = {};
  
  resolved.forEach(c => {
    const hours = (new Date(c.resolvedAt) - new Date(c.createdAt)) / 3600000;
    
    if (!deptTimes[c.assignedDepartment]) {
      deptTimes[c.assignedDepartment] = [];
    }
    deptTimes[c.assignedDepartment].push(hours);
  });
  
  const delays = Object.entries(deptTimes)
    .map(([dept, times]) => ({
      department: dept,
      avgResolutionHours: times.reduce((a, b) => a + b) / times.length,
      count: times.length,
      maxTime: Math.max(...times),
      minTime: Math.min(...times)
    }))
    .filter(d => d.avgResolutionHours > 72); // >72 hours = delayed
  
  return delays;
}
```

**Pattern 3: Trending Keywords**
```javascript
async function detectTrendingKeywords() {
  const complaints = await Complaint.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  });
  
  const wordFrequency = {};
  
  complaints.forEach(c => {
    const words = c.transcribedText.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
  });
  
  // Get top 10 trending keywords
  const trending = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
  
  return trending;
}
```

**Clustering for Geographic Patterns** (Advanced):
```python
# Using scikit-learn for geographic clustering
from sklearn.cluster import DBSCAN
import numpy as np

def detect_geographic_clusters(complaints_df):
    # Extract coordinates (latitude, longitude)
    coords = complaints_df[['latitude', 'longitude']].values
    
    # DBSCAN clustering
    clustering = DBSCAN(eps=0.05, min_samples=5).fit(coords)
    
    # Identify clusters
    clusters = []
    for cluster_id in set(clustering.labels_):
        if cluster_id != -1:  # Ignore noise
            cluster_complaints = complaints_df[clustering.labels_ == cluster_id]
            clusters.append({
                'cluster_id': cluster_id,
                'location': cluster_complaints['district'].mode()[0],
                'count': len(cluster_complaints),
                'categories': cluster_complaints['category'].value_counts().to_dict()
            })
    
    return clusters
```

**Target**: Identify 5+ patterns in demo data

---

## Important Note on Cloud Services

**Hackathon Approach**: 
- Use free tiers for prototype demonstration
- Focus on core functionality and AI capabilities

**Production Approach**:
- Utilize paid cloud services for optimal performance
- Estimated cost: $400-500/month for 10,000 complaints/day
- ROI: 90-95% cost reduction vs manual processing (₹50-100 per complaint → ₹2-5)

**Why Paid Services Are Necessary**:
1. **Speech-to-Text**: Free tier limited to 60 min/month, paid tier unlimited with better accuracy
2. **Database**: Free tier 512MB, paid tier auto-scales to handle 100,000+ complaints
3. **Hosting**: Free tier has cold starts, paid tier ensures <1 sec response time
4. **CDN**: Essential for fast load times in rural areas (50% faster)
5. **Monitoring**: Critical for 99.9% uptime in government services

**Cost Breakdown**:
- Google Cloud Speech-to-Text: $150-200/month (10,000 complaints/day)
- MongoDB Atlas M10: $57/month
- AWS/Azure Hosting: $50-100/month
- Storage + CDN: $40-80/month
- Monitoring: $30-50/month
- **Total**: $400-500/month

**Scalability**: Cost per complaint decreases with scale (₹5 at 1,000/day → ₹2 at 100,000/day)

---

**Document Version**: 1.0  
**Hackathon**: AI for Bharat  
**Timeline**: 48 hours  
**Tech Stack**: React + Node.js + MongoDB + AI/ML  
**Cloud Strategy**: Free tier for demo, Paid tier for production

## 4. Data Flow

### 4.1 Complete AI-Powered Complaint Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: CITIZEN INTERACTION                                 │
└─────────────────────────────────────────────────────────────┘
    Citizen clicks "Record Complaint" button
    Browser requests microphone permission
    Citizen speaks: "मेरे गांव में पानी की समस्या है"
    Audio recorded via Web Audio API
    Waveform displayed in real-time
    Citizen clicks "Stop" and "Submit"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: AUDIO UPLOAD                                        │
└─────────────────────────────────────────────────────────────┘
    Audio file (MP3/WAV) uploaded to server
    File saved to storage (Cloudinary/Local)
    Audio URL stored: "/uploads/audio/complaint_123.mp3"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: AI #1 - SPEECH-TO-TEXT                             │
│ Tool: Google Cloud Speech-to-Text API / Web Speech API     │
└─────────────────────────────────────────────────────────────┘
    Server sends audio to STT API
    API processes audio with language detection
    Returns: {
      text: "मेरे गांव में पानी की समस्या है",
      confidence: 0.92,
      language: "hi"
    }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: AI #2 - NLP CATEGORIZATION                         │
│ Tool: BERT Model / Keyword-based NLP                       │
└─────────────────────────────────────────────────────────────┘
    Transcribed text analyzed
    Keywords matched: ["पानी", "समस्या"]
    ML model predicts category
    Returns: {
      category: "Water Supply",
      confidence: 0.89
    }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: AI #3 - URGENCY DETECTION                          │
│ Tool: Sentiment Analysis + Keyword Detection               │
└─────────────────────────────────────────────────────────────┘
    Text analyzed for urgency keywords
    Sentiment score calculated
    Context evaluated (health/safety keywords)
    Returns: {
      urgency: "high",
      reason: "Essential service issue"
    }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: AI #4 - INTELLIGENT ROUTING                        │
│ Tool: Rule-based + ML Routing Engine                       │
└─────────────────────────────────────────────────────────────┘
    Category: "Water Supply"
    Location: "Lucknow, Uttar Pradesh"
    Routing logic applied
    Returns: {
      assignedDepartment: "Water Supply Department",
      priority: "high"
    }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: DATABASE STORAGE                                    │
└─────────────────────────────────────────────────────────────┘
    Complaint saved to MongoDB with:
    - Unique ID: "GRV2026021500001"
    - Audio URL
    - Transcribed text
    - AI-generated category & urgency
    - Assigned department
    - Status: "registered"
    - Timestamps
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: CONFIRMATION                                        │
└─────────────────────────────────────────────────────────────┘
    Response sent to citizen:
    {
      complaintNumber: "GRV2026021500001",
      status: "registered",
      category: "Water Supply",
      urgency: "high",
      assignedDepartment: "Water Supply Department"
    }
    Confirmation page displayed with tracking ID
```

### 4.2 Admin Dashboard AI Flow

```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD LOAD                                        │
└─────────────────────────────────────────────────────────────┘
    Admin logs in → JWT token verified
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ REAL-TIME STATISTICS                                        │
└─────────────────────────────────────────────────────────────┘
    MongoDB aggregation queries run
    Calculate: Total, By Status, By Category, Avg Resolution Time
    Charts rendered with Chart.js
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ AI #5 - PATTERN DETECTION (Background Process)             │
│ Tool: Clustering + Anomaly Detection                       │
└─────────────────────────────────────────────────────────────┘
    
    PATTERN 1: Regional Hotspots
    ├─ Group complaints by district + category
    ├─ Identify clusters with 5+ complaints
    └─ Alert: "15 water complaints in Lucknow"
    
    PATTERN 2: Department Delays
    ├─ Calculate avg resolution time per department
    ├─ Flag departments with >72 hour avg
    └─ Alert: "Roads Dept avg: 96 hours"
    
    PATTERN 3: Repeated Keywords
    ├─ Extract frequent complaint terms
    ├─ Identify trending issues
    └─ Alert: "Keyword 'leak' appearing 20 times"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ ALERTS DISPLAYED                                            │
└─────────────────────────────────────────────────────────────┘
    Pattern detection results shown to admin
    Actionable insights provided
    Admin can drill down into specific patterns
```

### 4.3 Public Dashboard Flow

```
Public user visits transparency portal
    ↓
Aggregated statistics loaded (no personal data)
    ↓
Charts display:
- Total complaints
- Resolution rate
- Category breakdown
- District-wise stats
    ↓
AI-generated insights shown (anonymized)
```

## 5. Database Schema

### 5.1 Complaints Collection

```javascript
{
  _id: ObjectId,
  complaintNumber: "GRV2026021500001", // Unique ID
  audioUrl: "/uploads/audio/complaint_1.mp3",
  transcribedText: "मेरे गांव में पानी की समस्या है",
  language: "hi",
  
  // AI Classification
  category: "Water Supply",
  categoryConfidence: 0.89,
  urgency: "high",
  
  // Location
  state: "Uttar Pradesh",
  district: "Lucknow",
  block: "Malihabad",
  
  // Routing
  assignedDepartment: "Water Supply Department",
  assignedOfficer: "Officer Name",
  assignedOfficerId: ObjectId,
  
  // Status
  status: "in_progress", // registered, assigned, in_progress, resolved, closed
  
  // Progress Updates (NEW)
  progressUpdates: [
    {
      timestamp: ISODate("2026-02-15T11:00:00Z"),
      status: "assigned",
      updatedBy: "Admin Name",
      updatedById: ObjectId,
      message: "Complaint assigned to Water Supply Department",
      actionTaken: "",
      isVisibleToCitizen: true
    },
    {
      timestamp: ISODate("2026-02-15T14:30:00Z"),
      status: "in_progress",
      updatedBy: "Officer Name",
      updatedById: ObjectId,
      message: "Site inspection scheduled for tomorrow",
      actionTaken: "Team dispatched for inspection",
      isVisibleToCitizen: true
    },
    {
      timestamp: ISODate("2026-02-16T10:00:00Z"),
      status: "in_progress",
      updatedBy: "Officer Name",
      updatedById: ObjectId,
      message: "Inspection completed. Pipe leak identified.",
      actionTaken: "Repair work order issued",
      isVisibleToCitizen: true,
      attachments: ["/uploads/evidence/inspection_photo.jpg"]
    }
  ],
  
  // Timestamps
  createdAt: ISODate("2026-02-15T10:30:00Z"),
  updatedAt: ISODate("2026-02-16T10:00:00Z"),
  assignedAt: ISODate("2026-02-15T11:00:00Z"),
  resolvedAt: ISODate("2026-02-17T15:00:00Z"),
  
  // Resolution
  resolutionNotes: "Water pipe repaired. Supply restored.",
  resolutionAttachments: ["/uploads/resolution/after_repair.jpg"],
  estimatedResolutionDate: ISODate("2026-02-18T00:00:00Z"),
  
  // Citizen Feedback (NEW)
  citizenComments: [
    {
      timestamp: ISODate("2026-02-16T12:00:00Z"),
      comment: "Thank you for the update. When will repair start?",
      isRead: true
    }
  ],
  citizenRating: 5,
  citizenFeedback: "Very satisfied with the quick response"
}
```

### 5.2 Departments Collection

```javascript
{
  _id: ObjectId,
  name: "Water Supply Department",
  category: "Water Supply",
  contactEmail: "water@gov.in"
}
```

### 5.3 Admins Collection

```javascript
{
  _id: ObjectId,
  username: "admin",
  passwordHash: "$2b$10$...", // bcrypt hash
  createdAt: ISODate("2026-02-15T00:00:00Z")
}
```

## 6. Routing Logic

### 6.1 Department Mapping

```javascript
const departmentMapping = {
  'Water Supply': 'Water Supply Department',
  'Electricity': 'Electricity Board',
  'Roads': 'Public Works Department',
  'Healthcare': 'Health Department',
  'Police': 'Police Department'
};

function routeComplaint(category, location) {
  const department = departmentMapping[category];
  
  // Future: Add location-based routing
  // e.g., district-specific departments
  
  return department;
}
```

### 6.2 Auto-Assignment

```javascript
async function assignComplaint(complaintId, category) {
  const department = routeComplaint(category);
  
  await Complaint.findByIdAndUpdate(complaintId, {
    assignedDepartment: department,
    status: 'assigned',
    updatedAt: new Date()
  });
}
```

## 7. Dashboard Design

### 7.1 Admin Dashboard Metrics

**Key Statistics**:
```javascript
async function getDashboardStats() {
  const total = await Complaint.countDocuments();
  const byStatus = await Complaint.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  // Calculate avg resolution time
  const resolved = await Complaint.find({ status: 'resolved' });
  const avgResolutionTime = resolved.reduce((sum, c) => {
    const hours = (c.resolvedAt - c.createdAt) / 3600000;
    return sum + hours;
  }, 0) / resolved.length;
  
  return { total, byStatus, byCategory, avgResolutionTime };
}
```

**Charts**:
- Pie chart: Status breakdown
- Bar chart: Category distribution
- Line chart: Complaints over time
- Table: District-wise statistics

### 7.2 Citizen Tracking Interface (NEW)

**Complaint Tracking Page UI**:
```
┌─────────────────────────────────────────────────────┐
│  Track Complaint: GRV2026021500001                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Status: In Progress  🟡                            │
│  Category: Water Supply                             │
│  Urgency: High                                      │
│  Department: Water Supply Department                │
│  Officer: Officer Name                              │
│  Estimated Resolution: Feb 18, 2026                 │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  📍 Progress Timeline                               │
│                                                     │
│  ✅ Feb 15, 10:30 AM - Registered                  │
│     Complaint registered successfully               │
│                                                     │
│  ✅ Feb 15, 11:00 AM - Assigned                    │
│     Assigned to Water Supply Department             │
│     By: Admin Name                                  │
│                                                     │
│  🔵 Feb 15, 2:30 PM - In Progress                  │
│     Site inspection scheduled for tomorrow          │
│     Action: Team dispatched for inspection          │
│     By: Officer Name                                │
│                                                     │
│  🔵 Feb 16, 10:00 AM - In Progress                 │
│     Inspection completed. Pipe leak identified.     │
│     Action: Repair work order issued                │
│     By: Officer Name                                │
│     📎 [View Inspection Photo]                      │
│                                                     │
│  🔵 Feb 17, 9:00 AM - In Progress                  │
│     Repair work started                             │
│     Action: Plumber team on site, fixing the leak   │
│     By: Officer Name                                │
│                                                     │
│  ⏳ Estimated Completion: Feb 17, 6:00 PM          │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  💬 Your Comments                                   │
│                                                     │
│  Feb 16, 12:00 PM - You                            │
│  "Thank you for the update. When will repair start?"│
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Add a comment or question...                  │ │
│  └───────────────────────────────────────────────┘ │
│  [Submit Comment]                                   │
│                                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                     │
│  [🔄 Refresh Status]  [📱 Share]  [📞 Contact]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Implementation**:
```javascript
// Frontend: Fetch complaint progress
async function fetchComplaintProgress(complaintNumber) {
  const response = await fetch(`/api/complaints/track/${complaintNumber}`);
  const data = await response.json();
  
  // Render timeline
  renderTimeline(data.progressUpdates);
  
  // Show citizen comments
  renderComments(data.citizenComments);
}

// Auto-refresh every 30 seconds
setInterval(() => {
  fetchComplaintProgress(complaintNumber);
}, 30000);
```

### 7.3 Pattern Detection

**Regional Hotspots**:
```javascript
async function detectRegionalHotspots() {
  const hotspots = await Complaint.aggregate([
    {
      $group: {
        _id: { district: '$district', category: '$category' },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gte: 5 } } },
    { $sort: { count: -1 } }
  ]);
  
  return hotspots.map(h => ({
    district: h._id.district,
    category: h._id.category,
    count: h.count,
    severity: 'high'
  }));
}
```

**Department Delays**:
```javascript
async function detectDelays() {
  const resolved = await Complaint.find({ 
    status: 'resolved',
    resolvedAt: { $exists: true }
  });
  
  const deptTimes = {};
  
  resolved.forEach(c => {
    const hours = (c.resolvedAt - c.createdAt) / 3600000;
    if (!deptTimes[c.assignedDepartment]) {
      deptTimes[c.assignedDepartment] = [];
    }
    deptTimes[c.assignedDepartment].push(hours);
  });
  
  const delays = Object.entries(deptTimes)
    .map(([dept, times]) => ({
      department: dept,
      avgResolutionHours: times.reduce((a, b) => a + b) / times.length,
      count: times.length
    }))
    .filter(d => d.avgResolutionHours > 72);
  
  return delays;
}
```

## 8. API Endpoints

### 8.1 Core APIs

```
POST   /api/auth/login
POST   /api/complaints
GET    /api/complaints/:id
GET    /api/complaints/track/:complaintNumber
GET    /api/complaints
PUT    /api/complaints/:id
POST   /api/complaints/:id/progress
POST   /api/complaints/:id/comment
POST   /api/complaints/:id/feedback
POST   /api/voice/transcribe
POST   /api/ai/categorize
GET    /api/analytics/dashboard
GET    /api/analytics/patterns
GET    /api/public/stats
```

### 8.2 Sample Request/Response

**Register Complaint**:
```javascript
// POST /api/complaints
// Content-Type: multipart/form-data

Request:
{
  audio: File,
  language: "hi",
  state: "Uttar Pradesh",
  district: "Lucknow",
  block: "Malihabad"
}

Response:
{
  success: true,
  data: {
    complaintNumber: "GRV2026021500001",
    status: "registered",
    category: "Water Supply",
    urgency: "high",
    trackingUrl: "/track/GRV2026021500001"
  }
}
```

**Track Complaint** (NEW):
```javascript
// GET /api/complaints/track/:complaintNumber

Response:
{
  success: true,
  data: {
    complaintNumber: "GRV2026021500001",
    status: "in_progress",
    category: "Water Supply",
    urgency: "high",
    assignedDepartment: "Water Supply Department",
    assignedOfficer: "Officer Name",
    createdAt: "2026-02-15T10:30:00Z",
    estimatedResolutionDate: "2026-02-18T00:00:00Z",
    
    // Progress Timeline
    progressUpdates: [
      {
        timestamp: "2026-02-15T10:30:00Z",
        status: "registered",
        message: "Complaint registered successfully",
        icon: "check-circle"
      },
      {
        timestamp: "2026-02-15T11:00:00Z",
        status: "assigned",
        message: "Assigned to Water Supply Department",
        updatedBy: "Admin Name",
        icon: "user-check"
      },
      {
        timestamp: "2026-02-15T14:30:00Z",
        status: "in_progress",
        message: "Site inspection scheduled for tomorrow",
        actionTaken: "Team dispatched for inspection",
        updatedBy: "Officer Name",
        icon: "clock"
      },
      {
        timestamp: "2026-02-16T10:00:00Z",
        status: "in_progress",
        message: "Inspection completed. Pipe leak identified.",
        actionTaken: "Repair work order issued",
        updatedBy: "Officer Name",
        attachments: ["/uploads/evidence/inspection_photo.jpg"],
        icon: "tool"
      }
    ],
    
    // Citizen can add comments
    canComment: true,
    citizenComments: [
      {
        timestamp: "2026-02-16T12:00:00Z",
        comment: "Thank you for the update. When will repair start?"
      }
    ]
  }
}
```

**Add Progress Update** (Admin/Officer):
```javascript
// POST /api/complaints/:id/progress
// Requires authentication

Request:
{
  status: "in_progress",
  message: "Repair work started",
  actionTaken: "Plumber team on site, fixing the leak",
  estimatedCompletion: "2026-02-17T18:00:00Z",
  attachments: ["photo1.jpg"]
}

Response:
{
  success: true,
  message: "Progress update added successfully",
  data: {
    complaintNumber: "GRV2026021500001",
    latestUpdate: {
      timestamp: "2026-02-17T09:00:00Z",
      message: "Repair work started",
      actionTaken: "Plumber team on site, fixing the leak"
    }
  }
}
```

**Add Citizen Comment** (NEW):
```javascript
// POST /api/complaints/:id/comment
// No authentication required (uses complaint ID)

Request:
{
  complaintNumber: "GRV2026021500001",
  comment: "Is the work completed? Water still not coming."
}

Response:
{
  success: true,
  message: "Comment added successfully",
  data: {
    commentId: "comment_123",
    timestamp: "2026-02-17T12:00:00Z"
  }
}
```

**Submit Feedback** (After Resolution):
```javascript
// POST /api/complaints/:id/feedback

Request:
{
  complaintNumber: "GRV2026021500001",
  rating: 5,
  feedback: "Very satisfied with the quick response and resolution"
}

Response:
{
  success: true,
  message: "Thank you for your feedback!"
}
```

## 9. Deployment Plan

### 9.1 Hosting Strategy

**Prototype/Demo Phase** (Free Tier):
- Frontend: Vercel Free
- Backend: Render.com Free
- Database: MongoDB Atlas Free (512MB)
- Total Cost: $0/month

**Production Phase** (Paid Services):
- Frontend: Vercel Pro ($20/month) or AWS CloudFront + S3
- Backend: AWS EC2 / Azure App Service ($50-100/month)
- Database: MongoDB Atlas M10 ($57/month)
- Total Cost: $127-177/month base + usage costs

### 9.2 Cloud Service Providers

**Option 1: AWS (Recommended for Scale)**
- EC2 for backend (t3.medium: $30-50/month)
- S3 for file storage ($20-30/month)
- CloudFront CDN ($20-50/month)
- RDS or MongoDB Atlas
- Total: $200-300/month

**Option 2: Azure**
- App Service (B2: $55/month)
- Blob Storage ($20-30/month)
- Azure CDN ($20-50/month)
- Cosmos DB or MongoDB Atlas
- Total: $200-300/month

**Option 3: Google Cloud Platform**
- Cloud Run (serverless: $30-60/month)
- Cloud Storage ($20-30/month)
- Cloud CDN ($20-50/month)
- Cloud Speech-to-Text (included)
- Total: $150-250/month

### 9.3 Deployment Steps

```bash
# 1. Setup Cloud Infrastructure
# - Create MongoDB Atlas cluster (M10 for production)
# - Setup AWS/Azure/GCP account
# - Configure CDN

# 2. Deploy Backend
# - Build Docker image
# - Push to container registry
# - Deploy to cloud service
# - Configure environment variables
# - Setup auto-scaling (min 2, max 10 instances)

# 3. Deploy Frontend
# - Build production bundle
# - Deploy to Vercel/Netlify or S3+CloudFront
# - Configure custom domain
# - Enable CDN caching

# 4. Configure Services
# - Setup Google Cloud Speech-to-Text API (paid tier)
# - Configure MongoDB connection
# - Setup monitoring (New Relic/Datadog)
# - Configure backup policies

# 5. Testing
# - Load testing (10,000+ concurrent users)
# - API performance testing
# - Security testing
# - End-to-end testing
```

### 9.4 Environment Variables

```env
NODE_ENV=production
PORT=3000

# Database (Paid Tier)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/grievai?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_secret_key_here

# Google Cloud Speech-to-Text (Paid Tier)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_CLOUD_API_KEY=your_api_key

# File Storage (Paid Tier)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=grievai-audio-files
AWS_REGION=ap-south-1

# CDN
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net

# Monitoring (Paid Service)
NEW_RELIC_LICENSE_KEY=your_license_key
DATADOG_API_KEY=your_api_key

# Frontend URL
FRONTEND_URL=https://grievai.com
```

### 9.5 Auto-Scaling Configuration

**Backend Auto-Scaling**:
```yaml
# AWS Auto Scaling Group
MinSize: 2
MaxSize: 10
TargetCPUUtilization: 70%
TargetMemoryUtilization: 80%
ScaleUpCooldown: 60 seconds
ScaleDownCooldown: 300 seconds
```

**Database Scaling**:
- MongoDB Atlas auto-scaling enabled
- Storage: 10GB → 100GB (auto-expand)
- RAM: 2GB → 8GB (based on load)

### 9.6 Cost Optimization

**Strategies**:
- Use reserved instances for predictable workload (30-50% savings)
- Enable auto-scaling to scale down during low traffic
- Use CDN caching to reduce origin requests (70% reduction)
- Compress audio files before storage (50% storage savings)
- Use spot instances for batch processing (70% savings)

**Estimated Monthly Costs by Scale**:
- **Prototype**: $0-50 (free tiers)
- **Pilot (1,000/day)**: $200-300
- **Production (10,000/day)**: $400-500
- **National (100,000/day)**: $1,500-2,000

## 10. Low Bandwidth Considerations

### 10.1 Audio Optimization

```javascript
// Compress audio before upload
function compressAudio(audioBlob) {
  // Convert to MP3 with 32kbps bitrate
  // Target: <500KB per minute
  return compressedBlob;
}
```

### 10.2 Frontend Optimization

- Lazy load images
- Minify JavaScript/CSS
- Use CDN for libraries
- Compress API responses (gzip)
- Limit initial bundle size (<500KB)

### 10.3 Progressive Enhancement

- Core functionality works without JavaScript
- Graceful degradation for older browsers
- Offline capability (PWA features if time permits)

## 11. Security (Basic)

### 11.1 Authentication

```javascript
// JWT-based admin authentication
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

### 11.2 Input Validation

```javascript
// Validate complaint input
function validateComplaint(req, res, next) {
  const { state, district, language } = req.body;
  
  if (!state || !district) {
    return res.status(400).json({ error: 'Location required' });
  }
  
  if (!['hi', 'en'].includes(language)) {
    return res.status(400).json({ error: 'Invalid language' });
  }
  
  next();
}
```

## 12. Scalability (Future Scope)

### 12.1 Architecture Evolution

**Current**: Monolithic
**Phase 2**: Modular monolith
**Phase 3**: Microservices

### 12.2 Scaling Strategy

- **Horizontal Scaling**: Add more server instances
- **Database Sharding**: Partition by state/district
- **Caching**: Redis for frequently accessed data
- **CDN**: Cloudflare for static assets
- **Load Balancing**: Nginx or cloud load balancer

### 12.3 Performance Targets

- Support 10,000+ concurrent users
- Handle 100,000+ complaints/day
- 99.9% uptime
- <1 second API response time

## 13. Testing Strategy

### 13.1 Manual Testing Checklist

- [ ] Voice recording on mobile
- [ ] Voice recording on desktop
- [ ] Speech-to-text accuracy (Hindi/English)
- [ ] AI categorization accuracy
- [ ] Complaint tracking
- [ ] Admin login
- [ ] Dashboard statistics
- [ ] Pattern detection
- [ ] Mobile responsiveness

### 13.2 Demo Preparation

**Demo Flow** (5 minutes):
1. Show problem statement (30 sec)
2. Register complaint via voice in Hindi (1 min)
3. Show AI categorization and routing (30 sec)
4. Track complaint status (30 sec)
5. Admin dashboard walkthrough (1 min)
6. Show pattern detection (1 min)
7. Public dashboard (30 sec)
8. Impact metrics and future scope (1 min)

## 14. Success Metrics

**Technical**:
- ✓ Voice recording works
- ✓ STT accuracy: 80%+
- ✓ AI categorization: 75%+
- ✓ Page load: <3 sec

**Functional**:
- ✓ End-to-end flow works
- ✓ Pattern detection identifies issues
- ✓ Dashboard displays real-time stats

**Impact**:
- ✓ Reduces registration time by 60%
- ✓ Automates 80% of categorization
- ✓ Improves routing accuracy by 50%

---

**Document Version**: 1.0  
**Hackathon**: AI for Bharat  
**Timeline**: 48 hours  
**Tech Stack**: React + Node.js + MongoDB

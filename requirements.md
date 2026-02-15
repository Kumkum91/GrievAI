# GrievAI - Requirements Specification
## AI for Bharat Hackathon 

---

## 1. Problem Statement

**Context**: India receives millions of public grievances annually through platforms like CPGRAMS. Citizens face significant barriers:

- **Literacy Barrier**: 25%+ citizens struggle with text-based forms
- **Language Barrier**: English-only interfaces exclude vernacular speakers
- **Manual Processing**: 2-3 days average delay
- **Misrouting**: 30-40% complaints routed to wrong departments
- **Lack of Transparency**: No real-time tracking
- **No Pattern Analysis**: Systems only store, don't analyze

**Impact**: Delayed resolutions, citizen frustration, administrative inefficiency, missed systemic improvements.

---

## 2. Vision and Objectives

**Vision**: Transform public grievance redressal into an accessible, intelligent, proactive system that converts complaints into actionable governance insights.

**Project Name**: GrievAI

**Objectives**:
1. Enable voice-based complaint registration (Hindi/English)
2. Automate complaint categorization using AI (80% reduction in manual effort)
3. Reduce misrouting through intelligent routing (90%+ accuracy)
4. Provide transparent real-time tracking with progress updates
5. Identify systemic issues through pattern detection
6. Enable data-driven administrative decisions

**How GrievAI is Different**:

1. **Voice-First Design**: Removes literacy barriers through local language voice input
2. **AI-Based Automation**: Instant classification, urgency detection, and routing
3. **Intelligent Pattern Analysis**: Identifies trends, regional hotspots, department delays
4. **Real-Time Transparency**: Measurable insights on resolution time, volume, performance

**How It Solves the Problem**:
- Removes language and literacy barriers
- Reduces misrouting errors via AI
- Shortens response time through urgency detection
- Enables data-driven decisions
- Improves accountability through metrics
- Reduces human dependency by 80%

---

## 3. Stakeholders

**Primary Users**:
- **Citizens**: Register and track complaints via voice
- **Government Officers**: Review, assign, and resolve complaints
- **Administrators**: Monitor system performance and patterns

**Beneficiaries**: Rural citizens, low-literacy users, elderly, visually impaired

---

## 4. MVP Functional Requirements

### 4.1 Citizen Portal

**FR-1: Voice Complaint Registration**
- Record voice complaint (30 sec - 2 min) via browser
- Support Hindi + English
- Real-time waveform visualization
- Playback before submission
- Fallback to text input
- Works on mobile browsers

**FR-2: Complaint Submission**
- Auto-filled category from AI (editable)
- Auto-filled urgency level (editable)
- Location: State, District, Block (dropdown)
- Generate unique complaint ID (GRV-2026-XXXXX)
- Display confirmation with tracking ID

**FR-3: Complaint Tracking & Progress Updates**
- Track by complaint ID (no login required)
- View real-time status: Registered → Assigned → In Progress → Resolved
- View assigned department and officer
- View timestamps for each status change
- View progress updates and action taken
- View resolution notes when completed
- Timeline view showing complete journey
- Option to add citizen comments
- Auto-refresh every 30 seconds

### 4.2 Admin Dashboard

**FR-4: Complaint Management**
- View all complaints (table with filters)
- Filter by status, category, urgency, date
- Search by ID or keywords
- Assign to departments and officers
- Update status with progress notes
- Add action taken updates (visible to citizen)
- Upload resolution evidence (photos/documents)
- Play audio recordings
- Mark as resolved with resolution summary

**FR-5: Analytics Dashboard**
- Total complaints count
- Status breakdown (pie chart)
- Category distribution (bar chart)
- Average resolution time
- District-wise statistics
- Department performance metrics

**FR-6: Pattern Detection**
- Regional hotspots (5+ complaints in same area/category)
- Department delays (>72 hour avg resolution time)
- Trending keywords
- Repeated issues alerts

### 4.3 Public Transparency Portal

**FR-7: Public Dashboard**
- Aggregated statistics (no personal data)
- Total complaints and resolution rate
- Category-wise breakdown
- District-wise statistics
- Department performance (anonymized)

### 4.4 AI Features

**FR-8: Speech-to-Text**
- Convert Hindi/English voice to text
- Target accuracy: 85%+
- Processing time: <15 seconds
- Confidence score tracking

**FR-9: Complaint Categorization**
- Classify into 5 categories:
  - Water Supply
  - Electricity
  - Roads & Infrastructure
  - Healthcare
  - Police & Safety
- Return confidence score
- Target accuracy: 80%+
- Fallback: Manual review if confidence < 0.5

**FR-10: Urgency Detection**
- Classify as High/Medium/Low
- Based on keywords, sentiment, category
- High: <24 hours (emergency, safety, health)
- Medium: 24-72 hours (community impact)
- Low: 72+ hours (individual, routine)

**FR-11: Automatic Routing**
- Route to department based on category + location
- Load balancing across officers
- Urgency-based prioritization

**FR-12: Pattern Detection**
- Regional hotspots clustering (DBSCAN)
- Department delay analysis
- Trending keyword extraction
- Repeated issue identification
- Runs asynchronously via Apache Kafka

---

## 5. Non-Functional Requirements

**NFR-1: Performance**
- Page load: <3 seconds on 3G
- Voice-to-text: <15 seconds
- Complaint submission: <5 seconds
- API response time (p95): <500ms
- Database query time (p95): <100ms

**NFR-2: Usability**
- Mobile-responsive (works on 320px+ screens)
- Voice-first design (large record button)
- 3-step complaint registration
- Hindi/English UI
- Touch-optimized buttons (min 44x44px)

**NFR-3: Browser Compatibility**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (Chrome Mobile, Safari iOS)
- Not supported: Internet Explorer

**NFR-4: Low Bandwidth**
- Compressed audio (<500KB per minute)
- Bundle size: <500KB
- Works on 2G/3G networks
- CDN delivery for faster load times

**NFR-5: Security**
- HTTPS only
- JWT authentication (15-min expiry)
- bcrypt password hashing
- Input validation and sanitization
- XSS protection
- Rate limiting (100 req/15min per IP)
- Audit logging (1-year retention)

**NFR-6: Scalability**
- Backend auto-scaling (2-10 instances)
- MongoDB auto-scaling
- Support for 1000+ concurrent users
- Horizontal and vertical scaling capability

---

## 6. Real Data Usage Strategy

**Training Data Sources**:
- CPGRAMS public grievance data (if accessible)
- State government grievance portal data
- Synthetic data generation based on real patterns
- Manual labeling of 500+ sample complaints

**Dataset Composition**:
- 500-1000 labeled complaints
- 100+ per category
- Mix of Hindi and English
- Representative of real Indian grievances

**Demo Data**:
- 50-100 pre-loaded complaints
- Realistic Indian names, locations, issues
- Varied statuses and timestamps

---

## 7. Measurable KPIs

### 7.1 Efficiency Metrics
- **Complaint Registration Time**: <2 minutes (vs 5-10 min manual)
- **Categorization Accuracy**: 80%+ (vs 100% manual)
- **Auto-routing Success**: 90%+ correct department
- **Processing Time Reduction**: 80% (automated vs manual)

### 7.2 Accessibility Metrics
- **Voice Usage Rate**: Target 60%+ complaints via voice
- **Language Support**: Hindi + English (expandable to 15+)
- **Mobile Compatibility**: 100% mobile browser compatible

### 7.3 Impact Metrics
- **Pattern Detection**: Identify 5+ systemic issues in demo
- **Transparency**: 100% complaints trackable
- **Resolution Tracking**: Average time calculated and displayed
- **Citizen Engagement**: Real-time progress updates
- **Accountability**: Every action logged with timestamp and officer

### 7.4 Technical Metrics
- **Speech-to-Text Accuracy**: 85%+
- **System Uptime**: >99.5%
- **Page Load Time**: <3 seconds on 3G
- **API Response Time**: <500ms (p95)

---

## 8. Constraints & Assumptions


### 8.1 Technical Constraints
- Browser-based audio recording (Web Audio API)
- Google Cloud Speech-to-Text API
- Pre-trained ML models (BERT, distilbert)
- MongoDB Atlas database
- AWS S3 for audio storage
- AWS Amplify for frontend hosting
- Render.com for backend hosting
- Apache Kafka for async processing

### 8.2 Assumptions
- Citizens have smartphones with basic internet
- 2G/3G connectivity available
- Citizens willing to use voice input
- Sample dataset representative of real complaints
- Budget available for cloud services ($400-500/month production)

---

## 9. User Roles

**Citizen** (No login required):
- Register complaints via voice
- Track complaint status
- Add comments and feedback
- View public dashboard

**Admin/Officer** (JWT authentication):
- View and manage all complaints
- Assign to departments
- Update status and add progress notes
- View analytics and patterns
- Upload resolution evidence

**Public** (Anonymous):
- View aggregated statistics only
- No personal data visible


---

## 10. Budget & Cloud Services

### 10.1 Cloud Services Strategy

**Development/Prototype Phase**:
- Use free tiers for initial development and demo
- Estimated cost: $0-50/month

**Production Phase**:
- Utilize paid cloud services for scalability and reliability
- Estimated cost: $400-500/month (10,000 complaints/day)

### 10.2 Cloud Service Breakdown

**Frontend Hosting (AWS Amplify)**:
- Free tier for prototype
- Paid: $20/month (production)
- Features: CDN, auto-deploy, HTTPS

**Backend Hosting (Render.com)**:
- Free tier for prototype
- Paid: $50-100/month (production)
- Features: Auto-scaling, environment variables

**Database (MongoDB Atlas)**:
- Free tier: 512MB (prototype)
- Paid: M10 cluster $57/month (production)
- Features: Auto-scaling, backups, 99.9% uptime

**Storage (AWS S3)**:
- Paid: $10-20/month
- Features: Unlimited storage, CDN integration

**Speech-to-Text (Google Cloud)**:
- Free tier: 60 min/month (prototype)
- Paid: $0.006/15 seconds (production)
- Estimated: $50-100/month (10,000 complaints/day)

**CDN (Cloudflare)**:
- Free tier for prototype
- Paid: $20-50/month (production)
- Features: DDoS protection, faster load times

**Message Queue (Apache Kafka)**:
- Included in backend hosting
- For async pattern detection

### 10.3 Cost Justification

**ROI Analysis**:
- Manual processing: ₹50-100 per complaint (2-3 days)
- Automated processing: ₹2-5 per complaint (instant)
- **Savings**: 90-95% reduction in processing costs

**Total Monthly Cost Estimate**:
- **Prototype**: $0-50/month (free tiers)
- **Pilot (1,000/day)**: $200-300/month
- **Production (10,000/day)**: $400-500/month
- **National Scale (100,000/day)**: $1,500-2,000/month

---

## 11. Technology Stack (36 Technologies)

### Frontend (8)
React.js 18+, Tailwind CSS, React Router v6, Web Audio API, react-media-recorder, Chart.js, react-chartjs-2, AWS Amplify

### Backend (10)
Node.js 18+, Express.js, Multer, jsonwebtoken, bcrypt, dotenv, cors, Helmet.js, express-rate-limit, Render.com

### AI/ML (9)
Google Cloud Speech-to-Text, Hugging Face Transformers, distilbert-base-multilingual-cased, ai4bharat/indic-bert, scikit-learn, TF-IDF Vectorizer, Logistic Regression, DBSCAN, Pandas + NumPy

### Data & Storage (2)
MongoDB Atlas, AWS S3

### Infrastructure (4)
Cloudflare CDN, AWS Amplify, Render.com, Let's Encrypt

### Messaging (1)
Apache Kafka

### Communication (2)
HTTPS REST API, Event-driven messaging

---

## 12. Future Scope

### Phase 2 (3-6 months)
- Mobile apps (iOS, Android)
- 15+ regional languages
- SMS notifications
- Email notifications
- Citizen OTP authentication

### Phase 3 (6-12 months)
- National deployment
- Integration with existing government systems (CPGRAMS)
- Advanced pattern detection
- Predictive analytics
- Corruption detection

### Technical Improvements
- Redis caching
- Microservices architecture
- Real-time WebSocket updates
- Advanced AI models
- Multi-region deployment

---

## 13. Unique Selling Proposition (USP)

**What Makes GrievAI Unique**:
1. **Voice-enabled grievance filing** in local languages
2. **AI-powered real-time complaint intelligence** (not just storage)
3. **Automated urgency and department routing** (instant, no manual intervention)
4. **Scalable cloud-based architecture** (pilot to national scale)
5. **Pattern-based early detection** of systemic inefficiencies
6. **Converts complaints into actionable governance insights**

**Key Differentiator**: GrievAI does not just collect complaints — it converts them into actionable governance insights through AI-powered analysis.

**Innovation**: Voice-first approach removes literacy barriers, AI automation reduces manual work by 80%

**Technical Depth**: 5 AI components (STT, NLP, urgency detection, routing, pattern detection)

**Social Impact**: Improves governance accessibility for 1.4 billion citizens, especially rural and low-literacy populations

**Scalability**: Architecture supports expansion from prototype to national deployment

---

## Important Note on Cloud Services

**For Hackathon Prototype**: We will use free tiers to demonstrate the concept and core functionality.

**For Production Deployment**: The system is designed to utilize paid cloud services where necessary to ensure:
- Better Performance: 90%+ accuracy in speech-to-text vs 80% in free tier
- Scalability: Handle 10,000+ complaints/day with auto-scaling
- Reliability: 99.9% uptime SLA for critical government services
- No Rate Limits: Unlimited API calls vs 60 min/month free tier
- Better Security: Enterprise-grade security features
- Cost Efficiency: Despite paid services, 90-95% cheaper than manual processing

**Estimated Costs**:
- Prototype: $0-50/month (free tiers)
- Production: $400-500/month (10,000 complaints/day)
- National Scale: $1,500-2,000/month (100,000 complaints/day)

**ROI**: Every ₹1 spent on cloud services saves ₹20-50 in manual processing costs.

---

**Document Version**: 1.0   
**Hackathon**: AI for Bharat   
**Platform**: Web-based (Mobile Compatible)  
**Architecture**: 3-Tier with AI Intelligence Engine  
**Tech Stack**: 36 technologies across 6 categories  
**Cloud Strategy**: Free tier for prototype, Paid tier for production




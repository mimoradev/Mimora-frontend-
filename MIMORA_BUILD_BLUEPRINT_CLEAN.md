# Mimora Backend - Complete Build Blueprint

**Project:** Artist & Customer Booking Platform  
**Target Stack:** Python FastAPI + PostgreSQL + SQLAlchemy + GCP  
**Blueprint Date:** January 17, 2026  
**Purpose:** Step-by-step guide for building production-ready backend from scratch

---

## Executive Summary

### Project Overview
Mimora is a platform connecting customers with artists for instant bookings and flexible service arrangements. The backend handles booking workflows, real-time communications, payment processing with escrow, live journey tracking, and safety features.

### Scope
- **In Scope:** Instant Bookings, Flexi Bookings, Payment Integration, Journey Tracking, Admin Dashboard, Real-time Chat
- **Out of Scope:** Workshop features, Native mobile apps

## 1. Platform Requirements

### 1.1 Core Booking Features

#### Instant Booking
- Customer discovers nearby artists (geo-search)
- Select packages and request booking
- 2-minute acceptance window with timer
- Sequential fallback to next artist if declined/expired
- Real-time notifications via WebSocket
- Payment capture before confirmation
- Travel charge calculation based on distance

#### Flexi Booking
- Customer sends booking request without time pressure
- Optional trial session before final booking
- Artist can accept/decline at convenience
- Negotiation via chat
- Payment after final confirmation

#### Booking Lifecycle
- Complete state machine from enquiry to completion
- Automated state transitions
- Cancellation with refund triggers
- No-show handling
- Post-service rating collection

---

### 1.2 Payment & Financial Features

#### Payment Processing
- Razorpay integration for order creation
- Payment capture and verification
- Webhook handling for payment status
- Transaction audit trail
- Failed payment handling

#### Escrow System
- Hold payment after capture
- Release to artist after service completion
- OTP-based service verification
- Automatic release triggers

#### Refunds
- Full refund on artist cancellation
- Partial refund based on cancellation policy
- Automated refund processing
- Refund status tracking

#### Settlement
- Artist bank account verification
- Payout processing
- Settlement reports
- Transaction ledger

---

### 1.3 Journey & Safety Features

#### Journey Tracking
- Artist check-in before journey
- "Start Journey" action
- GPS coordinate streaming (every 30s)
- Live location updates via WebSocket
- "Mark as Arrived" at destination
- Service start/end tracking

#### Live Location Sharing
- Generate temporary shareable link
- Public access without authentication
- Auto-expire after 2 hours
- Share with emergency contacts

#### Safety Features
- SOS emergency button
- Alert emergency contacts with location
- Emergency contact management
- KYC verification badge display
- Masked calling (optional)

#### Service Completion
- OTP generation for customer
- Artist enters OTP to complete
- Payment release trigger
- Completion timestamp

---

### 1.4 Communication Features

#### Real-time Chat
- WebSocket-based messaging
- Text messages
- Image sharing
- File attachments
- Typing indicators
- Read receipts
- Online/offline status
- Chat room per enquiry/booking

#### Notifications
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- Real-time WebSocket updates
- Notification preferences
- Transactional emails (booking confirmations, receipts)

---

### 1.5 User Management

#### Authentication
- OTP-based login (Email + SMS)
- Google OAuth integration
- JWT access tokens (15 min)
- Refresh tokens (7 days)
- Token refresh mechanism
- Logout with token invalidation

#### User Profiles
- Customer profile management
- Emergency contact setup
- Booking history
- Review history

#### Artist Onboarding
- Artist profile creation
- Portfolio upload (images)
- Bio and experience details
- Location and travel preferences
- Profession/category selection

#### KYC Verification
- MEON DigiLocker integration (Aadhaar)
- PAN verification
- Face verification
- KYC status tracking
- Document upload to Cloud Storage
- Admin approval workflow

---

### 1.6 Artist Discovery

#### Search & Filters
- Geo-spatial search (nearby artists)
- Radius-based filtering
- Profession/category filter
- Price range filter
- Rating filter
- 4-day window for instant bookings
- Recently viewed tracking

#### Artist Profiles
- Portfolio display
- Rating and review aggregation
- Package listings
- Availability calendar
- KYC verification badge
- Response time metrics

---

### 1.7 Package Management

#### Package Types
- Instant Booking packages
- Flexi Booking packages

#### Package Features
- CRUD operations
- Name, description, pricing
- Duration and category
- Image upload
- Active/inactive status
- Search and filtering

---

### 1.8 Rating & Review System

#### Reviews
- Post-service rating trigger
- 1-5 star rating
- Written review submission
- Review moderation (admin approval)
- Fake review detection

#### Aggregation
- Artist rating calculation
- Customer rating calculation
- Review count
- Recent reviews display

---

### 1.9 Admin Dashboard

#### Overview Dashboard
- Total users, artists, bookings
- Revenue metrics (today, week, month)
- Active bookings count
- Pending KYC approvals
- Recent transactions

#### User Management
- List all users with pagination
- Search and filters
- User details view
- Suspend/activate users
- Booking history per user

#### Artist Management
- List all artists with status
- KYC approval workflow
- Profile review and editing
- Suspend/activate artists
- Earnings overview per artist

#### Booking Management
- View all bookings with filters
- Filter by status, date, type
- Booking details and timeline
- Dispute resolution
- Manual cancellations
- Booking analytics

#### Payment Management
- All transactions list
- Settlement reports
- Refund request management
- Payout tracking
- Revenue analytics

#### Content Moderation
- Portfolio image review
- Chat content flags
- Review moderation and approval

---

## 2. System Architecture

### 2.1 Cloud Infrastructure (Google Cloud Platform)

#### Compute Services
- **Cloud Run:** Serverless containerized API deployment
- **Auto-scaling:** Based on request load
- **Region:** Asia South 1 (Mumbai)

#### Database Services
- **Cloud SQL (PostgreSQL 15+):** Primary relational database
- **Memorystore (Redis 7+):** Caching and session management
- **MongoDB Atlas:** Chat message storage (optional, can use PostgreSQL)

#### Storage Services
- **Cloud Storage:** Artist portfolios, KYC documents, chat images

#### Networking
- **Cloud Load Balancer:** HTTPS load balancing with SSL
- **Cloud CDN:** Static asset delivery

#### Security & Monitoring
- **Secret Manager:** API keys and credentials
- **Cloud Monitoring:** Application metrics
- **Cloud Logging:** Centralized logging
- **Cloud IAM:** Access control

---

### 2.2 Application Architecture

```
┌────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                        │
│  Web App (React) • Mobile Web • Admin Panel (React)   │
└────────────────────────────────────────────────────────┘
                          │
                      HTTPS/WSS
                          │
┌────────────────────────────────────────────────────────┐
│               CLOUD LOAD BALANCER (GCP)                │
└────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
┌───────▼──────────┐               ┌────────▼─────────┐
│   FastAPI API    │               │  WebSocket       │
│   (Cloud Run)    │◄─────────────►│  Server          │
│   REST Endpoints │               │  (Real-time)     │
└───────┬──────────┘               └────────┬─────────┘
        │                                    │
        │         ┌──────────────────────────┘
        │         │
        ▼         ▼
┌────────────────────────────────────────────────────────┐
│                    DATA LAYER                          │
│  ┌──────────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ Cloud SQL    │  │  Redis   │  │  Cloud Storage  │ │
│  │ (PostgreSQL) │  │  Cache   │  │  (Assets)       │ │
│  └──────────────┘  └──────────┘  └─────────────────┘ │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                         │
│  Razorpay • Firebase • Twilio • SendGrid • MEON       │
└────────────────────────────────────────────────────────┘
```

---

### 2.3 Technology Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Python 3.11+ |
| **Framework** | FastAPI 0.100+ |
| **Language** | Python 3.11+ |
| **Database** | PostgreSQL 15+ (Cloud SQL) |
| **ORM** | SQLAlchemy 2.0+ |
| **Migrations** | Alembic |
| **Cache** | Redis 7+ (Memorystore) |
| **Object Storage** | Google Cloud Storage |
| **Email** | SendGrid API |
| **SMS** | Twilio API |
| **Payment** | Razorpay |
| **Push** | Firebase Cloud Messaging (FCM) |
| **Maps** | Google Maps Platform API |
| **KYC** | MEON DigiLocker |
| **Real-time** | WebSockets (FastAPI native) |
| **Queue** | Celery + Redis |
| **Monitoring** | Google Cloud Monitoring |
| **Logging** | Google Cloud Logging |
| **Secrets** | Google Secret Manager |
| **Container** | Docker |
| **Hosting** | Cloud Run (serverless) |
| **Load Balancer** | Cloud Load Balancing |
| **CI/CD** | Cloud Build + GitHub Actions |

---

## 3. Database Schema Design (Prisma)

### 3.1 Core Entities

#### User
```python
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    device_tokens = relationship("DeviceToken", back_populates="user")
    bookings = relationship("Booking", back_populates="customer")
    reviews = relationship("Review", back_populates="reviewer")
    emergency_contacts = relationship("EmergencyContact", back_populates="user")
```

#### Artist
```python
from sqlalchemy import Column, String, Boolean, Float, Integer, ForeignKey, ARRAY, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

class Artist(Base):
    __tablename__ = "artists"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    bio = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    profession = Column(ARRAY(String), nullable=False)
    kyc_verified = Column(Boolean, default=False)
    kyc_details = Column(JSON, nullable=True)
    bank_details = Column(JSON, nullable=True)
    bank_verified = Column(Boolean, default=False)
    portfolio = Column(ARRAY(String), default=[])
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    location = Column(JSON, nullable=True)  # {lat, lng, city, state}
    travel_willingness = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="artist_profile")
    packages = relationship("Package", back_populates="artist")
    bookings = relationship("Booking", back_populates="artist")
```

#### Package
```python
from sqlalchemy import Column, String, Float, Enum as SQLEnum, Index
import enum

class PackageType(str, enum.Enum):
    INSTANT = "INSTANT"
    FLEXI = "FLEXI"

class PackageStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    DELETED = "DELETED"

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artist_id = Column(UUID(as_uuid=True), ForeignKey("artists.id"), nullable=False)
    type = Column(SQLEnum(PackageType), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    duration = Column(String, nullable=False)
    category = Column(String, nullable=False)
    image = Column(String, nullable=True)
    status = Column(SQLEnum(PackageStatus), default=PackageStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    artist = relationship("Artist", back_populates="packages")
    
    __table_args__ = (
        Index('ix_package_artist_type_status', 'artist_id', 'type', 'status'),
    )
```

#### Enquiry
```prisma
model Enquiry {
  id            String        @id @default(uuid())
  customerId    String
  customer      User          @relation(fields: [customerId], references: [id])
  artistId      String
  artist        Artist        @relation(fields: [artistId], references: [id])
  packages      String[]      // Array of package IDs
  
  status        EnquiryStatus @default(PENDING)
  date          DateTime
  time          String
  location      Json?         // {address, lat, lng}
  travelOption  String        // client_location, artist_studio
  additionalNotes String?
  referenceImages String[]
  
  expiresAt     DateTime
  acceptedAt    DateTime?
  declinedAt    DateTime?
  
  bookingId     String?       @unique
  booking       Booking?
  
  createdAt     DateTime      @default(now())
  
  @@index([artistId, status, expiresAt])
  @@index([customerId, status])
}

enum EnquiryStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
  CONVERTED
}
```

#### Booking
```prisma
model Booking {
  id              String        @id @default(uuid())
  bookingNumber   String        @unique // BKG-2026-001234
  
  customerId      String
  customer        User          @relation(fields: [customerId], references: [id])
  artistId        String
  artist          Artist        @relation(fields: [artistId], references: [id])
  
  enquiryId       String        @unique
  enquiry         Enquiry       @relation(fields: [enquiryId], references: [id])
  
  packages        BookingPackage[]
  type            BookingType   // INSTANT, FLEXI
  status          BookingStatus @default(CREATED)
  
  serviceDate     DateTime
  serviceTime     String
  location        Json?
  travelOption    String
  
  pricing         Json          // {subtotal, travelCharge, total}
  
  payment         Payment?
  journey         Journey?
  ratings         Review[]
  
  cancelledBy     String?
  cancelledAt     DateTime?
  cancellationReason String?
  
  completedAt     DateTime?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([customerId, status])
  @@index([artistId, status])
  @@index([serviceDate, status])
}

model BookingPackage {
  id          String   @id @default(uuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  packageId   String
  package     Package  @relation(fields: [packageId], references: [id])
  
  price       Float
  duration    String
  
  @@index([bookingId])
}

enum BookingType {
  INSTANT
  FLEXI
}

enum BookingStatus {
  CREATED
  PAYMENT_PENDING
  PAYMENT_CAPTURED
  CONFIRMED
  ARTIST_PREPARING
  ARTIST_TRAVELING
  ARTIST_ARRIVED
  SERVICE_IN_PROGRESS
  SERVICE_COMPLETED
  PAYMENT_RELEASED
  RATING_PENDING
  CLOSED
  CANCELLED
  FAILED
}
```

#### Payment
```prisma
model Payment {
  id              String        @id @default(uuid())
  bookingId       String        @unique
  booking         Booking       @relation(fields: [bookingId], references: [id])
  
  razorpayOrderId   String      @unique
  razorpayPaymentId String?     @unique
  
  amount          Float
  currency        String        @default("INR")
  status          PaymentStatus @default(PENDING)
  
  capturedAt      DateTime?
  releasedAt      DateTime?
  refundedAt      DateTime?
  refundAmount    Float?
  refundId        String?
  
  escrowHeld      Boolean       @default(false)
  
  transactions    Transaction[]
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@index([status])
}

enum PaymentStatus {
  PENDING
  CAPTURED
  RELEASED
  REFUNDED
  PARTIALLY_REFUNDED
  FAILED
}
```

#### Transaction
```prisma
model Transaction {
  id              String          @id @default(uuid())
  paymentId       String
  payment         Payment         @relation(fields: [paymentId], references: [id])
  
  type            TransactionType
  amount          Float
  status          String
  
  razorpayId      String?
  metadata        Json?
  
  createdAt       DateTime        @default(now())
  
  @@index([paymentId])
}

enum TransactionType {
  CAPTURE
  RELEASE
  REFUND
}
```

#### Journey
```prisma
model Journey {
  id              String        @id @default(uuid())
  bookingId       String        @unique
  booking         Booking       @relation(fields: [bookingId], references: [id])
  
  status          JourneyStatus @default(PENDING)
  
  checkInAt       DateTime?
  startedAt       DateTime?
  arrivedAt       DateTime?
  
  liveTrackingLink String?
  linkExpiresAt    DateTime?
  
  gpsUpdates      GpsUpdate[]
  
  completionOtp   String?
  otpVerifiedAt   DateTime?
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum JourneyStatus {
  PENDING
  CHECKED_IN
  TRAVELING
  ARRIVED
  COMPLETED
}

model GpsUpdate {
  id          String   @id @default(uuid())
  journeyId   String
  journey     Journey  @relation(fields: [journeyId], references: [id])
  
  latitude    Float
  longitude   Float
  accuracy    Float?
  timestamp   DateTime @default(now())
  
  @@index([journeyId, timestamp])
}
```

#### Review
```prisma
model Review {
  id          String   @id @default(uuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  
  reviewerId  String
  reviewer    User     @relation(fields: [reviewerId], references: [id])
  revieweeId  String   // Artist being reviewed
  
  rating      Int      // 1-5
  comment     String?
  
  approved    Boolean  @default(false)
  moderatedAt DateTime?
  
  createdAt   DateTime @default(now())
  
  @@index([revieweeId, approved])
}
```

---

### 3.2 Supporting Entities

#### DeviceToken
```prisma
model DeviceToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  token     String   @unique
  platform  String   // ios, android, web
  active    Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, active])
}
```

#### EmergencyContact
```prisma
model EmergencyContact {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  name      String
  phone     String
  relation  String
  
  createdAt DateTime @default(now())
  
  @@index([userId])
}
```

#### Admin
```prisma
model Admin {
  id        String     @id @default(uuid())
  email     String     @unique
  name      String
  role      AdminRole
  password  String
  active    Boolean    @default(true)
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum AdminRole {
  SUPER_ADMIN
  MODERATOR
  SUPPORT
}
```

#### Chat Models (MongoDB or PostgreSQL)
```python
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
import uuid

# Can be implemented in MongoDB or PostgreSQL
class LastMessage(BaseModel):
    text: str
    sender: uuid.UUID
    timestamp: datetime

class Chat(BaseModel):
    id: uuid.UUID
    participants: List[uuid.UUID]  # User IDs
    type: Literal['enquiry', 'booking', 'support']
    entity_id: uuid.UUID  # Enquiry ID or Booking ID
    last_message: LastMessage
    created_at: datetime
    updated_at: datetime

class Message(BaseModel):
    id: uuid.UUID
    chat_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    type: Literal['text', 'image', 'file', 'location']
    metadata: Optional[dict] = None
    read_by: List[uuid.UUID] = []
    created_at: datetime
```

---

## 4. State Machines & Workflows

### 4.1 Instant Booking Flow

```mermaid
stateDiagram-v2
    [*] --> EnquirySent
    EnquirySent --> EnquiryPending : Timer starts (2 min)
    EnquiryPending --> EnquiryAccepted : Artist accepts
    EnquiryPending --> EnquiryDeclined : Artist declines
    EnquiryPending --> EnquiryExpired : Timer expires
    
    EnquiryDeclined --> FallbackNextArtist
    EnquiryExpired --> FallbackNextArtist
    FallbackNextArtist --> EnquiryPending : New artist notified
    
    EnquiryAccepted --> BookingCreated
    BookingCreated --> PaymentPending : Razorpay order created
    PaymentPending --> PaymentCaptured : Customer pays
    PaymentPending --> Cancelled : Payment timeout
    
    PaymentCaptured --> Confirmed : Auto-confirm
    Confirmed --> ArtistPreparing : 1 hour before
    ArtistPreparing --> ArtistTraveling : Start journey
    ArtistTraveling --> ArtistArrived : Mark arrived
    ArtistArrived --> ServiceInProgress : Service starts
    ServiceInProgress --> ServiceCompleted : OTP verified
    ServiceCompleted --> PaymentReleased : Escrow released
    PaymentReleased --> RatingPending : Wait for ratings
    RatingPending --> Closed : Rating submitted or 7 days passed
    
    Confirmed --> Cancelled : Cancel before journey
    Cancelled --> RefundInitiated : Trigger refund
```

---

### 4.2 Flexi Booking Flow

```mermaid
stateDiagram-v2
    [*] --> RequestSent
    RequestSent --> RequestPending : Normal notification
    RequestPending --> RequestAccepted : Artist accepts
    RequestPending --> RequestDeclined : Artist declines
    
    RequestAccepted --> TrialBooked : If trial selected
    RequestAccepted --> PaymentPending : Direct booking
    
    TrialBooked --> TrialCompleted : Trial done
    TrialCompleted --> FinalBooked : Customer confirms
    TrialCompleted --> Cancelled : Customer declines
    
    FinalBooked --> PaymentPending
    PaymentPending --> PaymentCaptured : Customer pays
    PaymentCaptured --> Confirmed
    
    Confirmed --> ServicePending : Wait for service date
    ServicePending --> ServiceCompleted : Service done + OTP
    ServiceCompleted --> PaymentReleased
    PaymentReleased --> RatingPending
    RatingPending --> Closed
```

---

### 4.3 Payment State Machine

```mermaid
stateDiagram-v2
    [*] --> OrderCreated
    OrderCreated --> PaymentPending : Razorpay order
    PaymentPending --> PaymentCaptured : Customer payment success
    PaymentPending --> PaymentFailed : Payment failed
    
    PaymentCaptured --> EscrowHeld : Hold funds
    EscrowHeld --> EscrowReleased : Service completed
    EscrowReleased --> PaymentReleased : Transfer to artist
    
    EscrowHeld --> RefundInitiated : Cancellation
    RefundInitiated --> RefundCompleted : Razorpay refund success
    RefundCompleted --> [*]
    
    PaymentReleased --> [*]
    PaymentFailed --> [*]
```

---

## 5. API Design (v2)

### 5.1 Authentication APIs

```
POST   /api/v2/auth/otp/request
POST   /api/v2/auth/otp/verify
POST   /api/v2/auth/google
POST   /api/v2/auth/refresh
POST   /api/v2/auth/logout
GET    /api/v2/auth/me
```

### 5.2 User APIs

```
GET    /api/v2/users/profile
PATCH  /api/v2/users/profile
POST   /api/v2/users/emergency-contacts
GET    /api/v2/users/emergency-contacts
POST   /api/v2/users/device-token
DELETE /api/v2/users/device-token/:token
```

### 5.3 Artist APIs

```
POST   /api/v2/artists/onboard
GET    /api/v2/artists/:id
PATCH  /api/v2/artists/profile
POST   /api/v2/artists/kyc/aadhaar
POST   /api/v2/artists/kyc/pan
POST   /api/v2/artists/kyc/face-verify
POST   /api/v2/artists/bank-details
POST   /api/v2/artists/portfolio
GET    /api/v2/artists/nearby
GET    /api/v2/artists/search
```

### 5.4 Package APIs

```
POST   /api/v2/packages
GET    /api/v2/packages/:id
PATCH  /api/v2/packages/:id
DELETE /api/v2/packages/:id
GET    /api/v2/packages/artist/:artistId
GET    /api/v2/packages/search
```

### 5.5 Enquiry APIs

```
POST   /api/v2/enquiries                # Create enquiry
GET    /api/v2/enquiries/:id
POST   /api/v2/enquiries/:id/accept     # Artist accepts
POST   /api/v2/enquiries/:id/decline    # Artist declines
GET    /api/v2/enquiries/artist/pending # Artist's incoming
GET    /api/v2/enquiries/customer       # Customer's sent enquiries
```

### 5.6 Booking APIs

```
GET    /api/v2/bookings/:id
GET    /api/v2/bookings
POST   /api/v2/bookings/:id/cancel
GET    /api/v2/bookings/:id/status
GET    /api/v2/bookings/upcoming
GET    /api/v2/bookings/history
```

### 5.7 Payment APIs

```
POST   /api/v2/payments/create-order
POST   /api/v2/payments/verify
GET    /api/v2/payments/:id
POST   /api/v2/payments/:id/refund
POST   /api/v2/payments/webhook         # Razorpay webhook
```

### 5.8 Journey APIs

```
POST   /api/v2/journeys/:bookingId/check-in
POST   /api/v2/journeys/:bookingId/start
POST   /api/v2/journeys/:bookingId/arrived
POST   /api/v2/journeys/:bookingId/gps-update
GET    /api/v2/journeys/:bookingId/tracking
POST   /api/v2/journeys/:bookingId/generate-otp
POST   /api/v2/journeys/:bookingId/verify-otp
GET    /api/v2/journeys/share/:token    # Public share link
```

### 5.9 Review APIs

```
POST   /api/v2/reviews
GET    /api/v2/reviews/artist/:artistId
GET    /api/v2/reviews/booking/:bookingId
```

### 5.10 Chat APIs

```
GET    /api/v2/chats
GET    /api/v2/chats/:id/messages
POST   /api/v2/chats/:id/messages
POST   /api/v2/chats/:id/messages/:msgId/read
```

### 5.11 Admin APIs

```
POST   /api/v2/admin/login
GET    /api/v2/admin/dashboard/stats
GET    /api/v2/admin/users
GET    /api/v2/admin/artists
PATCH  /api/v2/admin/artists/:id/approve
PATCH  /api/v2/admin/artists/:id/suspend
GET    /api/v2/admin/bookings
GET    /api/v2/admin/payments
POST   /api/v2/admin/refunds/:id/approve
```

---

## 6. Security Model

### 6.1 Authentication Strategy

```python
from pydantic import BaseModel
from typing import Literal
import uuid

# JWT Structure
class AccessTokenPayload(BaseModel):
    user_id: uuid.UUID
    role: Literal['user', 'artist', 'admin']
    exp: int  # 15 minutes

class RefreshTokenPayload(BaseModel):
    user_id: uuid.UUID
    token_id: str  # Unique token ID
    exp: int  # 7 days
```

**Flow:**
1. User logs in → Receive access token (15 min) + refresh token (7 days)
2. Access token expires → Call `/auth/refresh` with refresh token
3. Receive new access token
4. Logout → Invalidate refresh token in Redis

### 6.2 Authorization Middleware

```python
from fastapi import Depends, HTTPException, status
from app.core.auth import get_current_user, require_role

# Role-based dependency
@app.post("/api/v2/enquiries/{enquiry_id}/accept")
async def accept_enquiry(
    enquiry_id: str,
    current_user: User = Depends(require_role("artist"))
):
    # Artist-only endpoint
    pass

# Resource ownership check
@app.patch("/api/v2/bookings/{booking_id}")
async def update_booking(
    booking_id: str,
    booking_data: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Update booking
```

### 6.3 Rate Limiting

```
OTP Request:      5 requests / hour / IP
Login:            10 requests / hour / IP
Payment:          3 requests / minute / user
Search:           100 requests / minute / IP
```

### 6.4 Input Validation

```python
from pydantic import BaseModel, Field, validator
from typing import List
from datetime import datetime
import uuid

# All schemas validated with Pydantic
class CreateEnquirySchema(BaseModel):
    artist_id: uuid.UUID = Field(..., description="Artist UUID")
    packages: List[uuid.UUID] = Field(..., min_items=1, max_items=5)
    date: datetime = Field(..., description="Service date")
    time: str = Field(..., pattern=r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    location: dict = Field(...)
    travel_option: str = Field(...)
    
    @validator('packages')
    def validate_packages(cls, v):
        if len(v) < 1:
            raise ValueError('At least one package required')
        return v
```

### 6.5 Data Encryption

- **At Rest:** PostgreSQL native encryption (GCP Cloud SQL)
- **In Transit:** TLS 1.3
- **Sensitive Fields:** 
  - Bank account details → AES-256 encryption
  - Emergency contacts → Encrypted in DB
  - OTPs → Hashed in Redis

### 6.6 PCI DSS Compliance

- ✅ Razorpay handles card data (PCI Level 1 certified)
- ✅ No card numbers stored in our database
- ✅ Only Razorpay IDs stored

---

## 7. Implementation Roadmap (8 Weeks)

### Phase 1: Foundation & Setup (Weeks 1-2)

**Objective:** Set up infrastructure and core authentication

**Tasks:**
1. Initialize FastAPI project with Python 3.11+
2. Setup GCP Cloud SQL (PostgreSQL)
3. Configure SQLAlchemy ORM
4. Setup Alembic for migrations
5. Design and implement database schema
6. Setup Redis (GCP Memorystore)
7. Configure environment variables (GCP Secret Manager)
8. Implement JWT authentication with python-jose
9. Build OTP service (SendGrid + Twilio)
10. Implement Google OAuth with authlib
11. User/Artist registration APIs
12. Setup CI/CD pipeline (Cloud Build)
13. Dockerize application

**Deliverables:**
- ✅ FastAPI project structure
- ✅ Database schema with SQLAlchemy
- ✅ Authentication working (OTP + Google)
- ✅ Dev/staging environments configured

**Team:** 1 backend developer

---

### Phase 2: Artist Onboarding & Discovery (Weeks 3-4)

**Objective:** Complete artist profile management and search

**Tasks:**
1. Artist profile creation APIs
2. Portfolio upload to Cloud Storage
3. Integrate MEON KYC APIs
   - Aadhaar verification
   - PAN verification
   - Face verification
4. KYC document upload and tracking
5. Bank account details (encrypted storage)
6. Package CRUD APIs
7. Geo-spatial search implementation
8. Artist discovery with filters
9. Recently viewed tracking
10. Artist profile public view

**Deliverables:**
- ✅ Artist onboarding complete
- ✅ KYC verification working
- ✅ Artist search and discovery functional
- ✅ Package management APIs ready

**Team:** 1 backend developer

---

### Phase 3: Payment Integration (Weeks 5-6)

**Objective:** Implement complete payment and escrow system

**Tasks:**
1. Integrate Razorpay SDK
2. Create Payment model and service
3. Order creation API
4. Payment capture verification
5. Webhook handler for payment events
6. Escrow hold logic
7. Escrow release after service completion
8. Refund API implementation
9. Transaction audit trail
10. Travel charge calculator
11. Bank account verification (Razorpay Fund Account API)
12. Settlement/payout processing

**Deliverables:**
- ✅ Payment capture working
- ✅ Escrow hold/release functional
- ✅ Refund system operational
- ✅ Webhook integration complete
- ✅ Transaction ledger tracking

**Team:** 1 backend developer

---

### Phase 4: Booking Lifecycle (Week 7)

**Objective:** Complete enquiry-to-booking flow with state machine

**Tasks:**
1. Enquiry creation API
2. Redis-based 2-minute timer
3. Real-time notifications via WebSocket
4. Artist accept/decline endpoints
5. Sequential fallback logic
6. Booking creation after enquiry acceptance
7. State machine implementation
8. Status transition logic
9. Cancellation flows
10. Automated refund triggers
11. No-show handling

**Deliverables:**
- ✅ Enquiry system working
- ✅ Booking state machine complete
- ✅ Cancellation with refunds functional
- ✅ Fallback mechanism operational

**Team:** 1 backend developer

---

### Phase 5: Journey & Safety (Week 8)

**Objective:** Build journey tracking and safety features

**Tasks:**
1. Journey model implementation
2. Check-in endpoint
3. Start journey API
4. Mark arrived endpoint
5. GPS coordinate ingestion
6. WebSocket updates for live tracking
7. Temporary tracking link generator
8. OTP generation for service completion
9. OTP verification endpoint
10. SOS emergency button API
11. Emergency contact management
12. Alert emergency contacts

**Deliverables:**
- ✅ Journey tracking operational
- ✅ Live location sharing working
- ✅ OTP-based completion ready
- ✅ SOS features functional

**Team:** 1 backend developer

---

### Phase 6: Admin Dashboard (Week 9)

**Objective:** Build admin panel APIs

**Tasks:**
1. Admin authentication
2. Dashboard statistics aggregation
3. User management APIs
4. Artist management endpoints
5. KYC approval workflow
6. Booking oversight APIs
7. Payment reporting
8. Transaction export
9. Dispute management
10. Content moderation endpoints

**Deliverables:**
- ✅ Admin authentication working
- ✅ Dashboard APIs complete
- ✅ Management tools functional
- ✅ Reporting endpoints ready

**Team:** 1 backend developer

---

### Phase 7: Chat & Reviews (Week 10)

**Objective:** Real-time communication and rating system

**Tasks:**
1. Socket.IO server setup
2. Chat room creation
3. Message send/receive
4. Image upload in chat
5. File sharing
6. Typing indicators
7. Read receipts
8. Review submission API
9. Rating aggregation
10. Review moderation
11. Fake review detection

**Deliverables:**
- ✅ Real-time chat operational
- ✅ Rating system complete
- ✅ Review moderation working

**Team:** 1 backend developer

---

### Phase 8: Testing & Launch (Week 11-12)

**Objective:** Production readiness

**Tasks:**
1. Unit testing (critical paths)
2. Integration testing
3. Load testing with artillery/k6
4. Security audit
   - OWASP Top 10 check
   - Penetration testing
5. API documentation (Swagger)
6. Error handling review
7. Performance optimization
8. Database query optimization
9. Production deployment
10. Monitoring setup
11. Alert configuration
12. Bug fixes

**Deliverables:**
- ✅ Test coverage >70%
- ✅ Performance benchmarks met
- ✅ Security issues resolved
- ✅ API documentation complete
- ✅ Production deployment successful

**Team:** 1 backend developer + 1 QA (optional)

---

## 8. Success Metrics

### 8.1 Technical Metrics

- **Test Coverage:** >70%
- **API Response Time:** <500ms (p95)
- **Database Query Time:** <100ms (p95)
- **Payment Success Rate:** >99%
- **Uptime:** >99.9%

### 8.2 Functional Completeness

- ✅ All in-scope features implemented
- ✅ All state transitions tested
- ✅ Payment flow end-to-end verified
- ✅ Admin panel operational
- ✅ Real-time features working
- ⛔ Workshop features (out of scope)
- ⛔ Mobile app (out of scope)

### 8.3 Security Checklist

- ✅ OWASP Top 10 addressed
- ✅ PCI DSS compliant (via Razorpay)
- ✅ Rate limiting on all endpoints
- ✅ Input validation on all DTOs
- ✅ Secrets in GCP Secret Manager
- ✅ Audit logging for critical operations
- ✅ HTTPS enforced
- ✅ CORS properly configured

---

## 9. Project Structure

```
mimora-backend/
├── app/
│   ├── api/
│   │   ├── v2/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── artists.py
│   │   │   │   ├── packages.py
│   │   │   │   ├── enquiries.py
│   │   │   │   ├── bookings.py
│   │   │   │   ├── payments.py
│   │   │   │   ├── journeys.py
│   │   │   │   ├── reviews.py
│   │   │   │   ├── chat.py
│   │   │   │   └── admin.py
│   │   │   └── router.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── auth.py
│   │   └── database.py
│   ├── models/
│   │   ├── user.py
│   │   ├── artist.py
│   │   ├── package.py
│   │   ├── enquiry.py
│   │   ├── booking.py
│   │   ├── payment.py
│   │   ├── journey.py
│   │   └── review.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── artist.py
│   │   ├── package.py
│   │   ├── enquiry.py
│   │   ├── booking.py
│   │   └── payment.py
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── payment_service.py
│   │   ├── kyc_service.py
│   │   ├── notification_service.py
│   │   └── storage_service.py
│   ├── utils/
│   │   ├── dependencies.py
│   │   ├── validators.py
│   │   └── helpers.py
│   ├── websockets/
│   │   ├── chat.py
│   │   └── tracking.py
│   └── main.py
├── alembic/
│   ├── versions/
│   └── env.py
├── tests/
├── docker/
├── docs/
├── .env.example
├── .gitignore
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

## 10. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Payment integration delays | Medium | High | Start Razorpay integration early (Week 5) |
| State machine complexity | High | High | Design state machine with clear documentation |
| Razorpay webhook failures | Low | High | Retry mechanism + manual reconciliation |
| GPS tracking issues | Medium | Medium | Optimize update frequency, handle poor network |
| Admin panel security breach | Low | High | Separate admin auth + IP whitelisting |
| Performance bottlenecks | Medium | Medium | Load testing early, query optimization |

---

## Appendix A: Environment Variables

```env
# Application
NODE_ENV=production
PORT=8080
API_VERSION=v2

# Database
DATABASE_URL=postgresql://user:pass@host:5432/mimora
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=xxx
JWT_REFRESH_SECRET=xxx
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=https://api.mimora.com/auth/google/callback

# SendGrid
SENDGRID_API_KEY=xxx
SENDGRID_FROM_EMAIL=noreply@mimora.com

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+91xxxxxxxxxx

# Razorpay
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Firebase
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx

# Google Cloud Storage
GCS_BUCKET_NAME=mimora-assets
GCS_PROJECT_ID=xxx

# MEON KYC
MEON_API_KEY=xxx
MEON_API_SECRET=xxx

# Google Maps
GOOGLE_MAPS_API_KEY=xxx
```

---

**Blueprint Status:** READY FOR IMPLEMENTATION  
**Next Steps:** Begin Phase 1 (Foundation & Setup)  
**Timeline:** 8 weeks to production-ready backend  
**Budget:** ₹1,70,000

---

*End of Blueprint*

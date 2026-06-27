# HireSense AI - Platform Guidelines

## Overview
HireSense AI is a complete recruitment platform with AI-powered insights for both candidates and recruiters.

## Design System

### Colors
- **Background**: `#0f1723` (Deep navy)
- **Primary Accent**: `#1f7af9` (Electric blue)
- **Secondary Accent**: `#bc13fe` (Neon purple)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter
- **Headings**: Bold (600-900 weight)
- **Body**: Regular (400-500 weight)

### Components
- **Cards**: Glassmorphism with `bg-white/5`, `backdrop-blur`, rounded corners
- **Borders**: `border-white/10` for subtle separation
- **Shadows**: Glow effects on hover with accent colors
- **Buttons**: Gradient backgrounds for primary actions
- **Inputs**: Dark with focus states using accent colors

## User Flows

### 🌐 Public / Onboarding (5 screens)
1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Animated statistics
   - Feature highlights
   - CTA for both candidate and recruiter

2. **Login** (`/login`)
   - Email/password authentication
   - Google OAuth option
   - Forgot password link

3. **Register** (`/register`)
   - Full name, email, password
   - Terms acceptance
   - Google OAuth option

4. **Role Selection** (`/role-selection`)
   - Choose between Candidate or Recruiter
   - Visual cards with descriptions

5. **Onboarding Flow** (`/onboarding`)
   - Multi-step process
   - Resume upload (drag & drop)
   - Job preferences
   - Skills selection
   - Profile confirmation

### 🧑 Candidate Flow (15 screens)

#### Dashboard & Profile
1. **Candidate Dashboard** (`/candidate/dashboard`)
   - ATS Score, Interview Confidence, Skill Alignment metrics
   - Applied jobs list with status
   - Application status tracker (timeline UI)
   - Quick action buttons
   - Career progress chart
   - Recent interviews

2. **Candidate Profile** (`/candidate/profile`)
   - Personal information
   - Skills showcase
   - Resume preview
   - Interview history
   - Activity timeline

#### Job Search
3. **Job Search** (`/candidate/jobs`)
   - Search with filters (role, location, experience, salary, type, remote)
   - AI match score for each job
   - Save/bookmark jobs
   - Sort by relevance

4. **Job Detail** (`/candidate/jobs/:id`)
   - Full job description
   - AI match breakdown
   - Required vs candidate skills comparison
   - **Apply Now** button (prominent CTA)

#### Resume & Skills
5. **ATS Analyzer** (`/candidate/ats-analyzer`)
   - Resume upload interface (drag & drop)
   - ATS compatibility score
   - Keyword match analysis
   - Strengths & weaknesses
   - Improvement suggestions

6. **Skill Gap Analysis** (`/candidate/skill-gap`)
   - Radar chart of skills
   - Required vs candidate comparison
   - Skill gap suggestions
   - Recommended learning resources

#### Interview Preparation
7. **Interview Preparation** (`/candidate/interview-prep`)
   - Interview tips (before, during, after)
   - Common interview questions (behavioral, technical, situational)
   - STAR method framework
   - Quick links to practice tests

8. **Interview Setup** (`/candidate/interview-setup`)
   - Job role configuration
   - Interview type selection (Behavioral/Technical/HR)
   - Difficulty level
   - Camera/mic check

9. **Interview Live** (`/candidate/interview-live`)
   - Video interface (AI interviewer + candidate)
   - Real-time question display
   - Confidence meter
   - Emotion detection
   - Filler word counter

10. **Interview Results** (`/candidate/interview-results/:id`)
    - Overall performance score
    - Per-question breakdown
    - Communication analysis
    - Improvement tips
    - Download report option

#### Assessment Tests
11. **Aptitude Test** (`/candidate/aptitude-test`)
    - Timed multiple-choice questions
    - Progress tracking
    - Question navigation
    - Instant scoring

12. **Technical Test** (`/candidate/technical-test`)
    - Coding challenges
    - Code editor with syntax highlighting
    - Run code functionality
    - Test case validation

13. **HR Interview** (`/candidate/hr-interview`)
    - Text-based interview questions
    - Open-ended responses
    - Progress tracking
    - STAR method tips

14. **Empty State** (`/empty`)
    - No interviews completed state
    - Motivational design
    - CTA to start first interview
    - Quick tips for success

### 🏢 Recruiter Flow (7 screens)

1. **Recruiter Dashboard** (`/recruiter/dashboard`)
   - Key metrics (applications, time-to-hire, AI match score)
   - Hiring pipeline visualization
   - Application sources chart
   - Top ranked candidates
   - Quick action to post jobs

2. **Candidate Profile (Recruiter View)** (`/recruiter/candidate/:id`)
   - AI match score badge
   - Skills comparison radar chart
   - AI interview analysis playback
   - Resume & documents download
   - Recruiter notes section
   - Schedule interview CTA

3. **Job Posting Creator** (`/recruiter/post-job`)
   - Basic information form
   - Required skills selection
   - AI-generated job description
   - Save draft / Publish options

4. **Interview Scheduler** (`/recruiter/scheduler`)
   - Calendar view
   - Time slot selection
   - Candidate assignment
   - Interview type configuration
   - Upcoming interviews list

5. **Talent Pipeline** (`/recruiter/pipeline`)
   - Kanban board (Applied → Screening → Interview → Offer → Hired)
   - Drag-and-drop functionality
   - Candidate cards with scores
   - Filter and search

### 📊 Shared / Analytics (5 screens)

1. **Analytics & Reports** (`/analytics`)
   - Applications over time chart
   - Source effectiveness
   - Pipeline conversion funnel
   - Time-to-hire trends
   - Export functionality

2. **Admin Panel** (`/admin`)
   - System health metrics
   - User management table
   - Subscription tiers overview
   - Feature toggles

3. **Settings** (`/settings`)
   - Profile settings
   - Notification preferences
   - Subscription & billing
   - Payment method management
   - Invoice history
   - Security settings

4. **Notifications** (`/notifications`)
   - Categorized alerts
   - Unread count
   - Mark all as read
   - Notification preferences link

## UX Principles

### Navigation
- **Top Bar**: Logo, main navigation links, user actions (notifications, settings, profile)
- **Minimal Clicks**: Direct access to key features from dashboard
- **Breadcrumbs**: Clear back navigation on all screens

### Visual Hierarchy
- **Cards**: Group related information
- **Charts**: Data visualization for metrics and analytics
- **Progress Indicators**: Show completion status for multi-step processes
- **Status Badges**: Color-coded for quick scanning

### Interactions
- **Hover Effects**: Subtle scale, glow, or color changes
- **Transitions**: Smooth animations (300-500ms)
- **Loading States**: Skeleton screens or spinners
- **Error Handling**: Inline validation and clear error messages

### Accessibility
- **Contrast**: High contrast for text on dark backgrounds
- **Focus States**: Visible keyboard navigation
- **Alt Text**: Descriptive labels for icons and images
- **Responsive**: Mobile-first design with breakpoints

## Technical Stack

### Frontend
- **Framework**: React 18.3
- **Routing**: React Router 7.13
- **Styling**: Tailwind CSS 4.1
- **Charts**: Recharts 2.15
- **Animations**: Motion 12.23
- **Icons**: Lucide React
- **Drag & Drop**: React DnD 16.0
- **Confetti**: Canvas Confetti

### Design Patterns
- **Component-Based**: Reusable components in `/src/app/components/`
- **Route Configuration**: Centralized in `/src/app/routes.tsx`
- **Type Safety**: TypeScript for type checking
- **Separation of Concerns**: Presentation vs logic

## AI Features

### Candidate Side
- **ATS Score Analysis**: Resume keyword matching and formatting
- **Skill Gap Detection**: Compare candidate skills vs job requirements
- **Interview Feedback**: Real-time emotion, confidence, filler word detection
- **Job Matching**: AI-powered job recommendations with match scores

### Recruiter Side
- **Candidate Scoring**: AI match percentage for job-candidate fit
- **Auto-Generated JDs**: AI assistance in job description writing
- **Interview Analysis**: Automated scoring and transcription
- **Pipeline Insights**: Conversion rate optimization suggestions

## Development Guidelines

### File Structure
```
src/
├── app/
│   ├── components/        # All React components
│   ├── routes.tsx         # Route configuration
│   └── App.tsx            # Root component
├── styles/
│   ├── theme.css          # Color tokens and design system
│   └── fonts.css          # Font imports
```

### Component Naming
- PascalCase for component files (e.g., `CandidateDashboard.tsx`)
- Descriptive names that match their purpose
- Group related components (e.g., all interview components)

### Styling Conventions
- Use Tailwind utility classes
- Consistent spacing scale (4px increments)
- Reuse color tokens from theme
- Avoid inline styles unless dynamic

### Best Practices
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Write accessible markup (ARIA labels, semantic HTML)
- Optimize images and assets
- Lazy load heavy components when possible

## Future Enhancements

### Phase 2
- Real-time video interview integration
- Advanced analytics dashboard
- Mobile applications (iOS/Android)
- Integration with ATS systems
- Slack/Teams notifications
- Calendar integrations (Google/Outlook)

### Phase 3
- AI-powered resume builder
- Salary benchmarking tools
- Team collaboration features
- White-label solutions for enterprises
- API for third-party integrations
- Advanced reporting and exports

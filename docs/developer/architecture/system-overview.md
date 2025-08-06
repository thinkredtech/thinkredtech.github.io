# ThinkRED Website Architecture

## System Overview

The ThinkRED Technologies website is a modern web application consisting of a React frontend and a Google Apps Script backend. The architecture prioritizes simplicity, maintainability, and cost-effectiveness.

## Core Components

### Frontend Architecture

**Technology Stack:**

- React 19 with TypeScript
- Vite build system
- Tailwind CSS for styling
- React Router for navigation
- React Markdown for documentation rendering

**Key Features:**

- Single Page Application (SPA) design
- Responsive design for all devices
- Client-side routing
- Markdown-based documentation system
- Form submission handling

### Backend Architecture

**Technology Stack:**

- Google Apps Script (JavaScript runtime)
- Google Sheets for data storage
- Google Drive for file storage
- Gmail for email notifications

**Key Features:**

- Serverless execution model
- Form processing (contact and job applications)
- File upload handling
- Email notifications
- CORS handling for web requests

## Data Flow

### Contact Form Submission

1. User fills out contact form on frontend
2. Frontend sends HTTP request to Google Apps Script endpoint
3. Apps Script validates and processes the data
4. Data is stored in Google Sheets
5. Email notification is sent via Gmail
6. Response is returned to frontend

### Job Application Process

1. User completes job application form with optional resume upload
2. Frontend sends application data to Apps Script
3. Apps Script processes the application
4. Resume files are stored in Google Drive
5. Application data is recorded in Google Sheets
6. Email notifications are sent to relevant parties
7. Confirmation response is returned to user

## Deployment Architecture

### Frontend Deployment

- **Primary**: GitHub Pages (automated via GitHub Actions)
- **Secondary**: Hostinger (manual deployment option)
- **Build Process**: Vite optimizes and bundles the application
- **Static Assets**: Served directly from the hosting platform

### Backend Deployment

- **Platform**: Google Apps Script
- **Deployment**: CLASP (Command Line Apps Script Projects)
- **Access**: Public web app endpoint
- **Scaling**: Automatic scaling handled by Google

## Security Considerations

### Frontend Security

- Input validation on all form fields
- XSS prevention through proper sanitization
- HTTPS enforcement
- CSP headers configured

### Backend Security

- CORS configuration for authorized domains
- Input validation and sanitization
- Rate limiting through Google's infrastructure
- Secure file storage in Google Drive

## Performance Characteristics

### Frontend Performance

- Code splitting for optimal loading
- Lazy loading of route components
- Optimized asset bundling
- Responsive image loading

### Backend Performance

- Serverless architecture eliminates server management
- Automatic scaling based on demand
- Google's global infrastructure for low latency
- Efficient data processing with Google Sheets API

## Monitoring and Maintenance

### Frontend Monitoring

- GitHub Actions for build status
- Browser console for client-side errors
- User feedback through contact forms

### Backend Monitoring

- Google Apps Script execution logs
- Email delivery status
- Google Sheets data integrity checks

## Development Workflow

### Local Development

1. Clone repository
2. Install dependencies (`npm install`)
3. Start development server (`npm run dev`)
4. Access application at `http://localhost:5173`

### Deployment Process

1. **Frontend**: Push to main branch triggers GitHub Actions deployment
2. **Backend**: Use CLASP to push changes to Google Apps Script
3. **Testing**: Verify functionality in staging environment
4. **Production**: Deploy to production hosting platform

## Technology Trade-offs

### Benefits

- **Cost-effective**: Minimal hosting costs with Google Apps Script
- **Scalable**: Automatic scaling without infrastructure management
- **Reliable**: Built on Google's infrastructure
- **Simple**: Straightforward architecture with minimal complexity

### Limitations

- **Vendor lock-in**: Dependent on Google's services
- **Execution limits**: Google Apps Script has execution time limits
- **Customization**: Limited backend customization compared to traditional servers
- **Debugging**: Limited debugging capabilities in Apps Script environment
  │ └── ui/ # UI primitives
  │ ├── Button.tsx # Button variants
  │ ├── Modal.tsx # Modal dialogs
  │ ├── Card.tsx # Card containers
  │ └── Badge.tsx # Status badges
  ├── 📄 pages/ # Route components
  │ ├── HomePage.tsx # Landing page
  │ ├── AboutPage.tsx # About us
  │ ├── BlogPage.tsx # Blog listing
  │ ├── BlogPostPage.tsx # Individual posts
  │ ├── ContactPage.tsx # Contact form
  │ ├── JobsPage.tsx # Career opportunities
  │ └── AdminPage.tsx # Admin dashboard
  ├── 🛠️ utils/ # Utility functions
  │ ├── api.ts # API client
  │ ├── helpers.ts # Helper functions
  │ ├── constants.ts # App constants
  │ ├── validation.ts # Form validation
  │ └── storage.ts # Local storage
  ├── 🔧 config/ # Configuration
  │ ├── environment.ts # Environment variables
  │ ├── routes.ts # Route definitions
  │ └── theme.ts # Theme configuration
  ├── 🎨 styles/ # Global styles
  │ ├── globals.css # Global CSS
  │ ├── components.css # Component styles
  │ └── utilities.css # Utility classes
  └── 📊 types/ # TypeScript types
  ├── api.ts # API response types
  ├── forms.ts # Form data types
  └── components.ts # Component prop types

````

### **🔄 State Management Strategy**

ThinkRED uses a **hybrid state management approach**:

```typescript
// 1. React Built-in State for Local Component State
const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState<FormData>({});

// 2. Context API for Global State
const ThemeContext = createContext<ThemeContextType>();
const UserContext = createContext<UserContextType>();

// 3. Custom Hooks for Business Logic
const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint: string) => {
    // API logic here
  }, []);

  return { data, error, fetchData };
};

// 4. Local Storage for Persistence
const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // Local storage hook implementation
};
````

### **🎯 Component Design Patterns**

#### **Composition Pattern**

```typescript
// ✅ Good: Composable components
<Card>
  <Card.Header>
    <Card.Title>Job Application</Card.Title>
  </Card.Header>
  <Card.Content>
    <JobApplicationForm />
  </Card.Content>
  <Card.Footer>
    <Button type="submit">Apply Now</Button>
  </Card.Footer>
</Card>

// ❌ Avoid: Monolithic components
<JobApplicationCard
  title="Job Application"
  showHeader={true}
  showFooter={true}
  // ... 20 more props
/>
```

#### **Render Props Pattern**

```typescript
// Flexible data fetching component
<DataFetcher url="/api/jobs">
  {({ data, loading, error }) => (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <JobsList jobs={data} />}
    </>
  )}
</DataFetcher>
```

#### **Higher-Order Components (HOCs)**

```typescript
// Authentication wrapper
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <LoginPrompt />;
    }

    return <Component {...props} />;
  };
};

// Usage
const ProtectedAdminPage = withAuth(AdminPage);
```

---

## ⚙️ **Backend Architecture**

### **🤖 Google Apps Script Foundation**

Our backend leverages **Google Apps Script** as a serverless platform:

```javascript
// Main entry point
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const action = data.action || e.parameter.action;

    // Route to appropriate handler
    switch (action) {
      case "contact":
        return handleContactForm(data);
      case "job-application":
        return handleJobApplication(data);
      case "admin":
        return handleAdminAction(data);
      default:
        return createResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    console.error("Error in doPost:", error);
    return createResponse({ error: "Internal server error" }, 500);
  }
}

// GET request handler
function doGet(e) {
  const action = e.parameter.action;

  switch (action) {
    case "health":
      return createResponse({ status: "healthy", timestamp: new Date() });
    case "test":
      return createResponse({ message: "API is working!" });
    default:
      return handleFormSubmission(e); // Fallback for large files
  }
}
```

### **📊 Data Layer Architecture**

```text
📊 Google Sheets Database
├── 📋 Contact Forms Sheet
│   ├── Timestamp, Name, Email, Subject, Message
│   ├── Status, Response Date, Notes
│   └── Auto-generated ID
├── 💼 Job Applications Sheet
│   ├── Timestamp, Position, Name, Email, Phone
│   ├── Resume URL, Cover Letter URL, Status
│   └── Interview Notes, Decision
├── 📈 Analytics Sheet
│   ├── Page Views, Form Submissions, Errors
│   ├── Performance Metrics, User Agent
│   └── Geographic Data
└── ⚙️ Configuration Sheet
    ├── API Keys, Email Templates
    ├── Feature Flags, Settings
    └── Environment Variables
```

### **📂 File Storage Strategy**

```javascript
// Google Drive integration
class FileManager {
  constructor() {
    this.resumeFolder = DriveApp.getFolderById(RESUME_PARENT_FOLDER_ID);
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  saveFile(fileData, fileName, mimeType) {
    try {
      // Create blob from base64 data
      const blob = Utilities.newBlob(
        Utilities.base64Decode(fileData),
        mimeType,
        this.sanitizeFileName(fileName),
      );

      // Save to Google Drive
      const file = this.resumeFolder.createFile(blob);

      // Set sharing permissions
      file.setSharing(
        DriveApp.Access.ANYONE_WITH_LINK,
        DriveApp.Permission.VIEW,
      );

      return {
        id: file.getId(),
        url: file.getUrl(),
        downloadUrl: file.getDownloadUrl(),
        size: blob.getBytes().length,
      };
    } catch (error) {
      throw new Error(`File save failed: ${error.message}`);
    }
  }

  sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 100);
  }
}
```

### **🔐 Security Layer**

```javascript
// Input validation and sanitization
class SecurityManager {
  static validateInput(data, schema) {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors.push(`${field} is required`);
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} exceeds maximum length`);
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    return errors;
  }

  static sanitizeHtml(input) {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  static checkRateLimit(userIdentifier) {
    const cache = CacheService.getScriptCache();
    const key = `rate_limit_${userIdentifier}`;

    const count = cache.get(key) || 0;

    if (count > 10) {
      // 10 requests per hour
      throw new Error("Rate limit exceeded");
    }

    cache.put(key, parseInt(count) + 1, 3600); // 1 hour TTL
  }
}
```

---

## 🔄 **API Design**

### **🌐 RESTful Endpoints**

```typescript
// API endpoint structure
interface ApiEndpoints {
  // Contact form submission
  POST: '/contact' => {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  // Job application submission
  POST: '/job-application' => {
    position: string;
    name: string;
    email: string;
    phone: string;
    resume: File;
    coverLetter?: File;
  }

  // Health check
  GET: '/health' => {

    status: 'healthy' | 'degraded' | 'down';

    timestamp: string;
    version: string;
  }

  // Admin operations
  POST: '/admin' => {

    action: 'get-submissions' | 'update-status' | 'export-data';

    password: string;
    data?: any;
  }
}
```

### **📡 Request/Response Flow**

```text
Frontend Request ─────────────────────────────────────────────┐
│                                                             │
│  1. User submits form                                       │
│  2. Frontend validates data                                 │
│  3. Frontend attempts POST request                          │
│                                                             │
└─────────────────── HTTP POST ─────────────────────────────┐│
                                                             ││
Backend Processing ──────────────────────────────────────────┘│
│                                                             │
│  4. Google Apps Script receives request                     │
│  5. Validates and sanitizes input                          │
│  6. Processes business logic                               │
│  7. Saves to Google Sheets/Drive                          │
│  8. Sends email notifications                              │
│                                                             │
└─────────────────── JSON Response ──────────────────────────┐│
                                                             ││
Frontend Response ───────────────────────────────────────────┘│
│                                                             │
│  9. Frontend receives response                              │
│  10. Updates UI with success/error state                   │
│  11. Shows user feedback                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **🔄 Fallback Mechanism**

```typescript
// Smart fallback for large file uploads
async function submitWithFallback(data: FormData) {
  try {
    // Attempt POST request first
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) return response.json();

    // If POST fails, try GET with URL parameters
    console.log("POST failed, attempting GET fallback...");
    return await submitViaGet(data);
  } catch (error) {
    console.log("POST request failed, using GET fallback:", error);
    return await submitViaGet(data);
  }
}

async function submitViaGet(data: FormData) {
  const params = new URLSearchParams(data as any);
  const url = `${API_ENDPOINT}?${params.toString()}`;

  const response = await fetch(url, { method: "GET" });
  return response.json();
}
```

---

## 🛠️ **Development Workflow**

### **🔄 Git Branching Strategy**

```text
main                    # 🚀 Production-ready code
├── develop            # 🧪 Integration branch
├── feature/           # ✨ Feature development
│   ├── feature/new-ui
│   ├── feature/file-upload
│   └── feature/admin-panel
├── bugfix/            # 🐛 Bug fixes
│   ├── bugfix/cors-issue
│   └── bugfix/form-validation
├── hotfix/            # 🚨 Emergency fixes
│   └── hotfix/security-patch
└── release/           # 📦 Release preparation
    └── release/v1.1.0
```

### **📋 Code Review Process**

```text
1. 👤 Developer creates feature branch
2. 💻 Implements feature with tests
3. 🔍 Self-review and testing
4. 📥 Creates pull request
5. 🤖 Automated checks run (CI/CD)
6. 👥 Team code review
7. ✅ Approval and merge
8. 🚀 Automated deployment
```

### **🧪 Testing Strategy**

```typescript
// Test pyramid structure
describe("ThinkRED Application", () => {
  // Unit Tests (70%)
  describe("Utils", () => {
    test("validates email format", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
    });
  });

  // Integration Tests (20%)
  describe("API Integration", () => {
    test("submits contact form successfully", async () => {
      const response = await submitContactForm(mockFormData);
      expect(response.success).toBe(true);
    });
  });

  // E2E Tests (10%)
  describe("User Workflows", () => {
    test("user can complete job application", async () => {
      await page.goto("/careers");
      await page.click('[data-testid="apply-button"]');
      // ... test steps
    });
  });
});
```

---

## 🚀 **Deployment Architecture**

### **🏗️ CI/CD Pipeline**

```yaml
# Deployment flow
Commit Push ──────────────────────────────────────────────┐
│                                                         │
├── GitHub Actions Triggered                              │
│   ├── 🧪 Run Tests                                     │
│   ├── 🔍 Code Quality Checks                           │
│   ├── 🏗️ Build Application                             │
│   └── 🚀 Deploy to Environment                         │
│                                                         │
├── Backend Deployment (Google Apps Script)               │
│   ├── 📦 Bundle JavaScript                             │
│   ├── 🚀 Deploy via CLASP                              │
│   ├── 🔄 Extract Deployment ID                         │
│   └── ✅ Verify Deployment                             │
│                                                         │
└── Frontend Deployment (GitHub Pages/Hostinger)          │
├── 📦 Build React App                                │
├── 🔄 Update API Configuration                       │
├── 🚀 Deploy Static Files                            │
└── ✅ Health Check                                   │
```

### **🌍 Multi-Environment Strategy**

```json
{
  "environments": {
    "development": {
      "frontend_url": "http://localhost:5173",
      "backend_deployment_id": "dev-deployment-id",
      "database": "dev-sheets",
      "monitoring": "basic"
    },
    "staging": {
      "frontend_url": "https://staging.thinkred.tech",
      "backend_deployment_id": "staging-deployment-id",
      "database": "staging-sheets",
      "monitoring": "enhanced"
    },
    "production": {
      "frontend_url": "https://thinkred.tech",
      "backend_deployment_id": "prod-deployment-id",
      "database": "prod-sheets",
      "monitoring": "full"
    }
  }
}
```

---

## 📊 **Performance Architecture**

### **⚡ Frontend Optimization**

```typescript
// Code splitting with React.lazy
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Route-based splitting
const AppRouter = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  </Router>
);

// Image optimization
const OptimizedImage = ({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    {...props}
  />
);

// Memoization for expensive operations
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() =>
    expensiveProcessing(data), [data]
  );

  return <div>{processedData}</div>;
});
```

### **🔄 Backend Optimization**

```javascript
// Caching strategy
class CacheManager {
  static cache = CacheService.getScriptCache();

  static get(key, fallbackFn) {
    let data = this.cache.get(key);

    if (!data) {
      data = fallbackFn();
      this.cache.put(key, JSON.stringify(data), 3600); // 1 hour
    } else {
      data = JSON.parse(data);
    }

    return data;
  }

  static invalidate(pattern) {
    // Invalidate cache entries matching pattern
  }
}

// Batch operations
function batchProcessSubmissions(submissions) {
  const batchSize = 100;
  const results = [];

  for (let i = 0; i < submissions.length; i += batchSize) {
    const batch = submissions.slice(i, i + batchSize);
    results.push(...processBatch(batch));

    // Yield control to prevent timeout
    if (i % 300 === 0) {
      Utilities.sleep(100);
    }
  }

  return results;
}
```

---

## 🔮 **Future Architecture Considerations**

### **🚀 Scalability Roadmap**

```text
Phase 1: Current State
├── React SPA + Google Apps Script
├── Google Sheets Database
└── GitHub Pages Hosting

Phase 2: Enhanced Backend (6 months)
├── Node.js API Server
├── PostgreSQL Database
├── Redis Caching
└── Docker Containerization

Phase 3: Microservices (12 months)
├── API Gateway
├── Service Mesh
├── Event-Driven Architecture
└── Kubernetes Orchestration

Phase 4: Advanced Features (18 months)
├── GraphQL API
├── Real-time Notifications
├── Advanced Analytics
└── AI/ML Integration
```

### **🎯 Technology Evolution**

```typescript
// Potential future tech stack
interface FutureTechStack {
  frontend: {

    framework: "React 20+" | "Next.js" | "Remix";
    state: "Zustand" | "Jotai" | "Valtio";
    styling: "Tailwind CSS" | "CSS-in-JS" | "Vanilla Extract";
    bundler: "Vite" | "Turbopack" | "esbuild";

  };

  backend: {

    runtime: "Node.js" | "Deno" | "Bun";
    framework: "Express" | "Fastify" | "Hono";
    database: "PostgreSQL" | "MongoDB" | "Supabase";
    hosting: "Vercel" | "Railway" | "Fly.io";

  };

  infrastructure: {

    containerization: "Docker" | "Podman";
    orchestration: "Kubernetes" | "Docker Swarm";
    monitoring: "Grafana" | "Datadog" | "New Relic";
    cicd: "GitHub Actions" | "GitLab CI" | "Jenkins";

  };
}
```

---

## 📚 **Architecture Patterns & Best Practices**

### **🎯 SOLID Principles in Practice**

```typescript
// Single Responsibility Principle
class EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    // Only responsible for sending emails
  }
}

class FormValidator {
  validate(data: FormData): ValidationResult {
    // Only responsible for validation
  }
}

// Open/Closed Principle
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class CreditCardProcessor implements PaymentProcessor {
  async process(amount: number) {
    // Credit card specific logic
  }
}

class PayPalProcessor implements PaymentProcessor {
  async process(amount: number) {
    // PayPal specific logic
  }
}

// Dependency Inversion Principle
class OrderService {
  constructor(
    private paymentProcessor: PaymentProcessor,
    private emailService: EmailService,
  ) {}

  async processOrder(order: Order) {
    await this.paymentProcessor.process(order.amount);
    await this.emailService.sendEmail(
      order.email,
      "Order Confirmed",
      "Thank you!",
    );
  }
}
```

### **📐 Clean Architecture Layers**

```text
┌─────────────────────────────────────────────────────────┐
│                 🎨 Presentation Layer                   │
│  React Components, Pages, UI Logic                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│                 🧠 Application Layer                    │
│  Business Logic, Use Cases, Services                   │
└─────────────────────┼───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│                 🗄️ Domain Layer                        │
│  Entities, Value Objects, Domain Logic                 │
└─────────────────────┼───────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────────┐
│              📡 Infrastructure Layer                   │
│  External APIs, Database, File System                  │
└─────────────────────────────────────────────────────────┘
```

---

<div align="center">

### 🎉 **Master the Architecture, Master the Code! ⚡**

_"Good architecture is not about perfect code, it's about making the right trade-offs!"_

[![Back to Main](https://img.shields.io/badge/←%20Back%20to%20Main-README-blue?style=for-the-badge)](../README.md)
[![Setup Guide](https://img.shields.io/badge/Setup%20Guide-→-green?style=for-the-badge)](./SETUP.md)

</div>

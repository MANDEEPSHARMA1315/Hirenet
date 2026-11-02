const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedDataHelper = async () => {
  try {
    console.log('[AutoSeed] Clearing existing collections and populating 50+ real tech jobs...');
    await User.deleteMany({});
    await CandidateProfile.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // 1. Admin User
    const adminUser = await User.create({
      name: 'Mandeep Sharma (System Admin)',
      email: 'mandeep.admin@hirenet.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });

    // 2. Verified Recruiters & Companies across 9 Tech Domains
    const recruiterData = [
      {
        name: 'Mandeep Sharma',
        email: 'mandeep@techcorp.com',
        companyName: 'TechCorp Innovations',
        website: 'https://techcorp.example.com',
        description: 'Next-generation enterprise cloud platforms and scalable full-stack applications architected by Mandeep Sharma.'
      },
      {
        name: 'Michael Scott',
        email: 'michael@innovateai.io',
        companyName: 'Innovate AI Labs',
        website: 'https://innovateai.io',
        description: 'Pioneering generative AI agents, neural search platforms, and scalable machine learning microservices.'
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah@cloudscale.io',
        companyName: 'CloudScale Systems',
        website: 'https://cloudscale.io',
        description: 'Global cloud infrastructure management, Kubernetes orchestration, and 99.999% uptime platform reliability engineering.'
      },
      {
        name: 'David Chen',
        email: 'david@fintechcore.io',
        companyName: 'FinTech Core Global',
        website: 'https://fintechcore.io',
        description: 'Ultra-low latency transaction processing, cryptographic settlement rails, and modern distributed banking architecture.'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@designcraft.io',
        companyName: 'DesignCraft Studio',
        website: 'https://designcraft.io',
        description: 'Boutique digital product studio crafting enterprise design systems, accessible UI architectures, and interactive digital experiences.'
      },
      {
        name: 'Priya Nair',
        email: 'priya@datasphere.io',
        companyName: 'DataSphere Analytics',
        website: 'https://datasphere.io',
        description: 'Petabyte-scale big data architectures, real-time distributed stream processing, and modern cloud data warehouses.'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@nexgenmobile.io',
        companyName: 'NexGen Mobile Labs',
        website: 'https://nexgenmobile.io',
        description: 'Creating award-winning native and cross-platform mobile experiences for iOS, Android, and wearable ecosystems.'
      },
      {
        name: 'Alex Mercer',
        email: 'alex@cybershield.io',
        companyName: 'CyberShield Security',
        website: 'https://cybershield.io',
        description: 'Zero-Trust cloud security posture, automated compliance monitoring, penetration testing, and next-gen AppSec defenses.'
      },
      {
        name: 'Sophia Martinez',
        email: 'sophia@veloce.io',
        companyName: 'Veloce Global Platforms',
        website: 'https://veloce.io',
        description: 'Hyper-scale e-commerce infrastructures, global multi-region edge delivery networks, and distributed commerce engines.'
      }
    ];

    const companies = {};
    const recruiters = {};

    for (const r of recruiterData) {
      const recUser = await User.create({
        name: r.name,
        email: r.email,
        password: 'password123',
        role: 'recruiter',
        isVerified: true
      });
      recruiters[r.companyName] = recUser._id;

      const comp = await Company.create({
        recruiter: recUser._id,
        name: r.companyName,
        logoUrl: '',
        website: r.website,
        description: r.description,
        isVerified: true
      });
      companies[r.companyName] = comp._id;
    }

    // 3. Primary Candidates
    const candidate1 = await User.create({
      name: 'Mandeep Sharma',
      email: 'mandeep@gmail.com',
      password: 'password123',
      role: 'candidate',
      isVerified: true
    });

    const customUser = await User.create({
      name: 'Mandeep Sharma',
      email: 'manusharma98777@gmail.com',
      password: 'password123',
      role: 'candidate',
      isVerified: true
    });

    const candidate1Profile = await CandidateProfile.create({
      user: candidate1._id,
      headline: 'Senior Full Stack MERN Architect | Mandeep Sharma',
      skills: ['react', 'node.js', 'express', 'mongodb', 'javascript', 'tailwind', 'typescript', 'python'],
      experienceYears: 4,
      location: 'Chandigarh / Remote',
      resumeUrl: '/uploads/resumes/Mandeep_Sharma_Resume.pdf'
    });

    await CandidateProfile.create({
      user: customUser._id,
      headline: 'Senior Full Stack MERN Architect | Mandeep Sharma',
      skills: ['react', 'node.js', 'express', 'mongodb', 'javascript', 'tailwind', 'typescript', 'python'],
      experienceYears: 4,
      location: 'Chandigarh / Remote',
      resumeUrl: '/uploads/resumes/Mandeep_Sharma_Resume.pdf'
    });

    // 4. Detailed 50 Real Tech Job Openings
    const rawJobs = [
      // ==========================================
      // SECTION 1: FRONTEND DEVELOPMENT (7 Jobs)
      // ==========================================
      {
        companyName: 'TechCorp Innovations',
        title: 'Senior Frontend Engineer (React & Next.js)',
        description: `Role Overview:
TechCorp Innovations is seeking a Senior Frontend Engineer to lead the architecture and development of our next-generation customer analytics dashboards. You will build highly responsive, accessible, and performant web interfaces using React 18, Next.js, and TypeScript.

Key Responsibilities:
• Architect scalable, modular React component hierarchies with strict TypeScript typing.
• Optimize Core Web Vitals (LCP, FID/INP, CLS) to achieve sub-second load times on heavy analytical dashboards.
• Collaborate with backend engineers to integrate GraphQL and RESTful microservices.
• Mentor junior engineers and conduct rigorous pull request reviews for code quality.

Required Tech Stack & Qualifications:
• 4+ years of professional experience with React, Next.js, and modern TypeScript.
• Expertise in Tailwind CSS, CSS Grid, and state management (Zustand / Redux Toolkit).
• Deep understanding of server-side rendering (SSR), incremental static regeneration (ISR), and client-side caching.
• Bachelor's degree in Computer Science or equivalent hands-on experience.

Perks & Benefits:
• $135,000 - $170,000 competitive base salary + equity options.
• 100% remote work flexibility with a $2,000 home office stipend.
• Comprehensive medical, dental, vision coverage and 401(k) retirement match.`,
        skillsRequired: ['react', 'next.js', 'typescript', 'tailwind', 'javascript', 'redux'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 135000,
        salaryMax: 170000,
        daysAgo: 1,
        viewCount: 142
      },
      {
        companyName: 'DesignCraft Studio',
        title: 'Design Systems & UI Engineer',
        description: `Role Overview:
Join DesignCraft Studio as our dedicated Design Systems Engineer. You will bridge the gap between product designers in Figma and front-end developers building production React applications.

Key Responsibilities:
• Maintain and expand our multi-brand component library published to private npm registries.
• Translate complex Figma design tokens into automated CSS variables and Tailwind utility plugins.
• Implement strict WCAG 2.1 AA accessibility guidelines, keyboard navigation, and ARIA attributes.
• Document components in Storybook with interactive visual regression tests using Chromatic.

Required Tech Stack & Qualifications:
• 3+ years of building reusable UI components in React and TypeScript.
• Mastery of Figma Tokens, Tailwind CSS, Storybook, and Radix UI primitives.
• Proven track record with accessibility audits and headless UI design patterns.

Perks & Benefits:
• $115,000 - $145,000 annual salary + annual performance bonuses.
• Hybrid setup in San Francisco, CA or fully remote for senior candidates.
• Generous learning & conference budget ($2,500/year).`,
        skillsRequired: ['react', 'figma', 'typescript', 'tailwind', 'css', 'javascript'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 115000,
        salaryMax: 145000,
        daysAgo: 2,
        viewCount: 98
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Lead Frontend Performance Architect',
        description: `Role Overview:
CloudScale Systems is looking for a Lead Frontend Architect to head our UI performance guild. You will oversee web asset delivery, bundle optimization, and edge-rendered dashboards used by cloud infrastructure operators worldwide.

Key Responsibilities:
• Audit large-scale Single Page Applications (SPAs) and eliminate performance bottlenecks.
• Architect micro-frontend patterns and shared module federations across four distinct engineering squads.
• Implement synthetic performance monitoring and real-user monitoring (RUM) pipelines.
• Set coding standards for React code splitting, lazy loading, and Web Worker offloading.

Required Tech Stack & Qualifications:
• 6+ years of senior frontend engineering experience with modern JavaScript frameworks.
• Deep expertise in Webpack / Vite bundle analyzers, tree shaking, and code splitting.
• Mastery of React concurrency features, memoization hooks, and browser rendering lifecycle.

Perks & Benefits:
• $160,000 - $205,000 base compensation + significant stock options.
• Flexible working hours with global async culture.
• Unlimited PTO policy and wellness stipend.`,
        skillsRequired: ['react', 'typescript', 'javascript', 'docker', 'tailwind'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 160000,
        salaryMax: 205000,
        daysAgo: 3,
        viewCount: 164
      },
      {
        companyName: 'FinTech Core Global',
        title: 'Frontend Financial Dashboard Developer',
        description: `Role Overview:
FinTech Core Global is hiring a Mid-Level Frontend Developer to build real-time trading monitors, liquidity dashboards, and institutional account management consoles.

Key Responsibilities:
• Implement real-time WebSocket feeds pushing tens of price ticks per second into interactive React tables.
• Build clean, interactive financial charts using Chart.js, Recharts, or TradingView widgets.
• Ensure bulletproof input validation and error boundaries across all transactional forms.
• Write unit and integration tests using Vitest and React Testing Library.

Required Tech Stack & Qualifications:
• 2-4 years of experience with React, TypeScript, and state management.
• Familiarity with WebSockets, SSE (Server-Sent Events), and REST API consumption.
• Strong aesthetic sense for clean financial typography and dark-mode data density.

Perks & Benefits:
• $110,000 - $140,000 base salary + competitive annual bonus.
• Hybrid working environment in New York, NY (2 days in office).
• Comprehensive health benefits and 401(k) matching.`,
        skillsRequired: ['react', 'typescript', 'javascript', 'tailwind', 'redux'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 110000,
        salaryMax: 140000,
        daysAgo: 4,
        viewCount: 88
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Junior Frontend Developer (React & Tailwind)',
        description: `Role Overview:
Innovate AI Labs is hiring an ambitious Junior Frontend Developer to craft user interfaces for our AI prompt engineering tools and chat playgrounds.

Key Responsibilities:
• Build responsive UI pages following Figma mockups using React and Tailwind CSS.
• Connect frontend state to backend AI streaming endpoints (Markdown rendering, SSE chat bubbles).
• Fix styling inconsistencies across Chrome, Safari, and mobile viewports.
• Participate in daily agile standups and sprint planning.

Required Tech Stack & Qualifications:
• 1+ year of hands-on experience or exceptional portfolio projects using React and modern CSS.
• Proficiency in JavaScript (ES6+), HTML5 semantics, and Git version control.
• Passion for generative AI, conversational UI, and rapid prototyping.

Perks & Benefits:
• $75,000 - $95,000 starting compensation.
• Direct mentorship from Staff AI & UI engineers.
• Modern M3 MacBook Pro and work-from-home allowance.`,
        skillsRequired: ['react', 'javascript', 'tailwind', 'html', 'css'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 75000,
        salaryMax: 95000,
        daysAgo: 5,
        viewCount: 115
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Frontend Web Developer (React & Tailwind)',
        description: `Role Overview:
Veloce Global Platforms is seeking a talented Frontend Web Developer to work on high-converting e-commerce web applications, checkout flows, and localized catalog interfaces.

Key Responsibilities:
• Develop dynamic product detail pages with interactive image zooms, variant pickers, and live inventory.
• Integrate payment SDKs (Stripe, Apple Pay, PayPal) into seamless one-click checkout flows.
• Optimize mobile checkout experiences and reduce cart abandonment through UI refinements.
• Collaborate with marketing teams to deploy A/B tests via Optimizely / LaunchDarkly.

Required Tech Stack & Qualifications:
• 2-4 years of professional experience building consumer-facing web apps with React.
• Deep understanding of Tailwind CSS, responsive layouts, and cross-browser testing.
• Experience profiling bundle sizes and deferring non-critical scripts.

Perks & Benefits:
• $98,000 - $125,000 competitive salary.
• 100% remote position with flexible working hours.
• Employee discounts and annual wellness package.`,
        skillsRequired: ['react', 'tailwind', 'javascript', 'html', 'css', 'typescript'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 98000,
        salaryMax: 125000,
        daysAgo: 6,
        viewCount: 76
      },
      {
        companyName: 'DesignCraft Studio',
        title: 'Creative WebGL & Frontend Developer',
        description: `Role Overview:
DesignCraft Studio creates award-winning, interactive digital experiences for premier consumer brands. We are seeking a Creative Frontend Developer skilled in interactive 3D, physics animations, and smooth scrolling experiences.

Key Responsibilities:
• Develop interactive 3D scenes using Three.js, React Three Fiber, and WebGL shaders.
• Build fluid page transitions and micro-animations with GSAP and Framer Motion.
• Ensure 60 FPS rendering performance across high-DPI desktop and mobile devices.

Required Tech Stack & Qualifications:
• 3+ years of front-end development with deep Three.js / WebGL / GSAP proficiency.
• Portfolio exhibiting award-winning interactive design (Awwwards, FWA or similar caliber).
• Solid grounding in React, TypeScript, and modern canvas rendering.

Perks & Benefits:
• $110,000 - $145,000 compensation package.
• Opportunity to work on high-profile global creative campaigns.
• Hybrid studio in Los Angeles, CA or remote flexibility.`,
        skillsRequired: ['react', 'javascript', 'css', 'html', 'tailwind'],
        location: 'Los Angeles, CA',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 110000,
        salaryMax: 145000,
        daysAgo: 7,
        viewCount: 65
      },

      // ==========================================
      // SECTION 2: BACKEND & MICROSERVICES (7 Jobs)
      // ==========================================
      {
        companyName: 'TechCorp Innovations',
        title: 'Senior Backend Microservices Engineer (Node.js & Redis)',
        description: `Role Overview:
TechCorp Innovations is looking for a Senior Backend Engineer to architect, build, and maintain high-throughput microservices powering our enterprise data synchronization platform.

Key Responsibilities:
• Design and implement REST and gRPC microservices in Node.js and TypeScript.
• Architect distributed caching strategies using Redis clusters to reduce primary DB read load by 80%.
• Implement message queue workers using BullMQ / RabbitMQ for asynchronous document processing.
• Ensure strict security standards including JWT authentication, HMAC request signing, and role-based access control.

Required Tech Stack & Qualifications:
• 5+ years of server-side engineering experience with Node.js and Express.
• Mastery of MongoDB / PostgreSQL query optimization, indexing, and connection pooling.
• Strong familiarity with Docker containerization and CI/CD deployment pipelines.

Perks & Benefits:
• $140,000 - $175,000 base salary + equity compensation.
• Work from anywhere in the world on a fully remote team.
• Premium health, vision, and dental insurance.`,
        skillsRequired: ['node.js', 'express', 'mongodb', 'redis', 'typescript', 'docker'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 175000,
        daysAgo: 1,
        viewCount: 155
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Distributed Systems Engineer (Go & gRPC)',
        description: `Role Overview:
CloudScale Systems is seeking a Distributed Systems Engineer to build network control planes, service mesh controllers, and high-frequency telemetry collectors using Golang.

Key Responsibilities:
• Implement concurrent, low-latency microservices in Go capable of handling 150k+ requests/sec.
• Design protocol buffer definitions (Protobuf) and streaming gRPC endpoints.
• Build automated failover mechanisms and raft-based distributed consensus protocols.
• Profile memory allocations, goroutine leakage, and CPU hotspots using pprof.

Required Tech Stack & Qualifications:
• 4+ years of professional software engineering in Go (Golang) or C++.
• Deep knowledge of TCP/IP, HTTP/2, gRPC, and distributed system trade-offs (CAP theorem).
• Experience deploying services on Kubernetes with Docker and Helm.

Perks & Benefits:
• $155,000 - $195,000 annual base salary + equity grants.
• Work in our Seattle, WA engineering hub or 100% remote.
• Annual technical conference sponsorships and certification funding.`,
        skillsRequired: ['go', 'docker', 'kubernetes', 'postgresql', 'microservices'],
        location: 'Seattle, WA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 155000,
        salaryMax: 195000,
        daysAgo: 2,
        viewCount: 132
      },
      {
        companyName: 'FinTech Core Global',
        title: 'High-Throughput Payment API Engineer',
        description: `Role Overview:
FinTech Core Global is looking for a senior backend engineer to join our core payments infrastructure team. You will build and scale idempotent transaction rails moving millions of dollars in real time.

Key Responsibilities:
• Design transaction processing engines ensuring strict ACID consistency and zero double-charge anomalies.
• Implement webhook dispatchers with exponential backoff retry algorithms and dead-letter queues.
• Maintain PCI-DSS Level 1 compliance through end-to-end payload tokenization and TLS 1.3 encryption.
• Collaborate with financial compliance and fraud detection teams to enforce AML screening.

Required Tech Stack & Qualifications:
• 4+ years of experience with Node.js, TypeScript, PostgreSQL, and Redis.
• Deep understanding of distributed transactions, two-phase commits, and optimistic concurrency locking.
• Proven track record operating fintech, payments, or banking software at scale.

Perks & Benefits:
• $145,000 - $185,000 base compensation + performance bonus.
• Hybrid work in New York, NY (Financial District).
• 401(k) with 6% company match and executive healthcare plan.`,
        skillsRequired: ['node.js', 'typescript', 'postgresql', 'redis', 'express'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 145000,
        salaryMax: 185000,
        daysAgo: 3,
        viewCount: 120
      },
      {
        companyName: 'TechCorp Innovations',
        title: 'TypeScript & Node API Developer',
        description: `Role Overview:
We are looking for a Mid-Level Node.js Developer to join TechCorp Innovations. You will build and optimize RESTful endpoints and microservices consumed by our mobile and web applications.

Key Responsibilities:
• Write clean, testable TypeScript code utilizing Express and Mongoose ORM.
• Implement pagination, multi-field filtering, and full-text search indexing on MongoDB collections.
• Write integration test suites using Jest and Supertest to maintain 85%+ code coverage.
• Create interactive Swagger / OpenAPI specification documentation for external partners.

Required Tech Stack & Qualifications:
• 2-4 years of production experience with Node.js, Express, and MongoDB.
• Solid understanding of relational and NoSQL schema modeling.
• Experience with Git, postman, Docker, and Linux environments.

Perks & Benefits:
• $95,000 - $125,000 compensation package.
• 100% remote flexibility.
• Flexible working hours and yearly equipment upgrades.`,
        skillsRequired: ['typescript', 'node.js', 'express', 'mongodb', 'docker'],
        location: 'Remote',
        jobType: 'contract',
        experienceLevel: 'mid',
        salaryMin: 95000,
        salaryMax: 125000,
        daysAgo: 4,
        viewCount: 94
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Backend Database Optimization Specialist',
        description: `Role Overview:
Veloce Global is searching for a Database Specialist to optimize our distributed MongoDB and PostgreSQL architectures across our worldwide e-commerce operations.

Key Responsibilities:
• Audit slow-running database queries, create composite indexes, and restructure aggregate pipelines.
• Implement read-replica failovers and automated horizontal sharding for high-write collections.
• Establish disaster recovery automated backups, point-in-time recovery, and data encryption at rest.
• Guide development teams on best practices for data normalization versus denormalization.

Required Tech Stack & Qualifications:
• 4+ years of specialized database engineering with MongoDB and PostgreSQL.
• Expertise in query profiling (explain plans), connection pooling, and replication sets.
• Experience with Node.js or Python scripting for database maintenance tasks.

Perks & Benefits:
• $140,000 - $180,000 base salary.
• Austin, TX office or fully remote.
• Comprehensive medical, dental, and retirement benefits.`,
        skillsRequired: ['mongodb', 'postgresql', 'node.js', 'redis', 'docker'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 180000,
        daysAgo: 5,
        viewCount: 78
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Junior Backend API Developer (Express & MongoDB)',
        description: `Role Overview:
Innovate AI Labs is seeking an entry-level Backend Developer to assist in building API gateways and database schemas powering our developer tools.

Key Responsibilities:
• Build CRUD endpoints in Express.js connected to MongoDB database collections.
• Validate user inputs using Joi or Zod schemas to safeguard against injection attacks.
• Assist senior engineers in profiling API latency and writing automated tests.
• Maintain API documentation and Postman collections.

Required Tech Stack & Qualifications:
• 1+ year of experience (or university / bootcamp projects) with Node.js and MongoDB.
• Familiarity with Git, RESTful architectural principles, and basic JSON web tokens.
• Strong problem-solving mindset and eagerness to learn cloud technologies.

Perks & Benefits:
• $78,000 - $96,000 starting salary.
• Work with cutting-edge AI technologies alongside senior mentors.
• Generous training budget and remote hardware setup.`,
        skillsRequired: ['node.js', 'express', 'mongodb', 'javascript'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 78000,
        salaryMax: 96000,
        daysAgo: 6,
        viewCount: 104
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Cloud Backend Microservices Engineer',
        description: `Role Overview:
Join Veloce Global to build order fulfillment and real-time inventory management microservices running in Docker containers across multi-region Kubernetes clusters.

Key Responsibilities:
• Develop resilient Node.js / Express services that communicate via asynchronous event buses.
• Manage distributed caching layers to handle holiday traffic surges of up to 50,000 orders/minute.
• Implement OpenTelemetry tracing and Prometheus metrics across all backend endpoints.

Required Tech Stack & Qualifications:
• 3-5 years of backend development in Node.js or Java.
• Strong experience with Docker, Redis, and message queues.
• Familiarity with cloud deployments on AWS (ECS, EKS, or Lambda).

Perks & Benefits:
• $120,000 - $155,000 salary package.
• Chicago, IL (Hybrid) or remote.
• 401(k) matching and annual performance bonuses.`,
        skillsRequired: ['node.js', 'express', 'docker', 'redis', 'mongodb'],
        location: 'Chicago, IL',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 120000,
        salaryMax: 155000,
        daysAgo: 7,
        viewCount: 82
      },

      // ==========================================
      // SECTION 3: FULL STACK ENGINEERING (6 Jobs)
      // ==========================================
      {
        companyName: 'TechCorp Innovations',
        title: 'Lead Full Stack MERN Architect',
        description: `Role Overview:
TechCorp Innovations is hiring a Lead Full Stack MERN Architect to oversee the architectural direction of our SaaS platform suite. You will direct both React frontend architecture and Node.js microservices.

Key Responsibilities:
• Define technical blueprints, microservices communication standards, and data modeling strategies.
• Oversee full development lifecycle from database migrations in MongoDB to interactive UI components in React.
• Champion CI/CD automation, unit testing, and automated security vulnerability scanning.
• Collaborate with product management on roadmaps and technical feasibility estimations.

Required Tech Stack & Qualifications:
• 6+ years of full-stack engineering with deep MERN stack (MongoDB, Express, React, Node.js) mastery.
• Extensive experience with TypeScript, Tailwind CSS, Docker, and AWS cloud architectures.
• Proven leadership skills and experience mentoring engineering teams.

Perks & Benefits:
• $150,000 - $190,000 top-tier base salary + equity.
• Full remote flexibility with asynchronous working style.
• Premium health benefits and generous home workspace allowance.`,
        skillsRequired: ['react', 'node.js', 'express', 'mongodb', 'typescript', 'tailwind'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 150000,
        salaryMax: 190000,
        daysAgo: 1,
        viewCount: 182
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Full Stack Product Engineer (Next.js & Python)',
        description: `Role Overview:
Innovate AI Labs is seeking a versatile Full Stack Product Engineer to rapidly prototype and ship AI-powered productivity applications.

Key Responsibilities:
• Build slick web applications utilizing Next.js 14 App Router, Server Actions, and Tailwind CSS.
• Integrate backend Python services and LangChain orchestration pipelines via REST/GraphQL.
• Conduct user feedback sessions, analyze product telemetry, and iterate rapidly on features.

Required Tech Stack & Qualifications:
• 3-5 years of full-stack development experience.
• Proficiency with React / Next.js and backend Python (FastAPI) or Node.js.
• Experience with vector databases, authentication providers, and cloud deployments.

Perks & Benefits:
• $125,000 - $160,000 competitive compensation + equity.
• 100% remote flexibility.
• $3,000 annual conference and learning budget.`,
        skillsRequired: ['react', 'next.js', 'python', 'fastapi', 'tailwind', 'typescript'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 125000,
        salaryMax: 160000,
        daysAgo: 2,
        viewCount: 140
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Staff Full Stack SaaS Engineer',
        description: `Role Overview:
CloudScale Systems is looking for a Staff Full Stack Engineer to lead technical design across our cloud cost analytics and cluster governance web applications.

Key Responsibilities:
• Build high-volume telemetry exploration interfaces in React and backend ingestion pipelines in Node.js.
• Design multi-tenant database partitioning strategies in PostgreSQL and MongoDB.
• Guide engineering squads on code quality, automated end-to-end testing, and architectural integrity.

Required Tech Stack & Qualifications:
• 6+ years of full-stack experience delivering commercial SaaS platforms.
• Deep expertise in React, TypeScript, Node.js, and containerized deployments.
• Experience in cloud infrastructure (AWS/GCP) and system scalability.

Perks & Benefits:
• $165,000 - $215,000 base salary + significant RSUs.
• Austin, TX or 100% remote.
• Full health coverage and executive 401(k) matching.`,
        skillsRequired: ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'aws'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 165000,
        salaryMax: 215000,
        daysAgo: 3,
        viewCount: 128
      },
      {
        companyName: 'DesignCraft Studio',
        title: 'Full Stack Web Developer (React & Node.js)',
        description: `Role Overview:
DesignCraft Studio is hiring a Full Stack Developer to build bespoke digital commerce platforms and dynamic brand websites for high-growth tech startups.

Key Responsibilities:
• Develop responsive front-end experiences with React, Tailwind CSS, and Framer Motion.
• Build scalable headless CMS backends and custom APIs in Node.js and Express.
• Ensure bulletproof SEO, semantic markup, and lightning-fast page speed scores.

Required Tech Stack & Qualifications:
• 3+ years of full-stack web development.
• Strong portfolio demonstrating clean design execution and robust backend structure.
• Proficient with Git, REST APIs, and modern database management.

Perks & Benefits:
• $105,000 - $135,000 salary package.
• Los Angeles, CA or remote.
• Generous creative time and paid team retreats.`,
        skillsRequired: ['react', 'node.js', 'express', 'tailwind', 'javascript'],
        location: 'Los Angeles, CA',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 105000,
        salaryMax: 135000,
        daysAgo: 4,
        viewCount: 91
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Senior Full Stack E-Commerce Engineer',
        description: `Role Overview:
Veloce Global is searching for an experienced Full Stack Engineer to build global multi-currency checkout solutions and merchant management dashboards.

Key Responsibilities:
• Implement server-rendered catalog and checkout interfaces using Next.js and Tailwind CSS.
• Design order fulfillment microservices in Node.js connected to MongoDB and Redis caches.
• Build automated fraud screening hooks and payment gateway failover logic.

Required Tech Stack & Qualifications:
• 4+ years of full-stack e-commerce or SaaS engineering experience.
• Solid background in React, Node.js, database indexing, and API security.

Perks & Benefits:
• $135,000 - $175,000 base salary.
• 100% remote anywhere in the US or Canada.
• Comprehensive medical, dental, and retirement plan.`,
        skillsRequired: ['react', 'node.js', 'mongodb', 'typescript', 'tailwind'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 135000,
        salaryMax: 175000,
        daysAgo: 5,
        viewCount: 102
      },
      {
        companyName: 'TechCorp Innovations',
        title: 'Full Stack Engineering Intern',
        description: `Role Overview:
TechCorp Innovations is offering a 6-month hands-on Full Stack Internship for aspiring engineers eager to master the MERN stack in a high-velocity production environment.

Key Responsibilities:
• Work alongside senior developers to build internal tooling and customer onboarding flows.
• Write unit tests in Jest and integrate frontend React components with backend Express endpoints.
• Learn modern CI/CD deployment pipelines, code review etiquettes, and agile methodologies.

Required Tech Stack & Qualifications:
• Strong foundation in JavaScript, React basics, HTML5, and CSS3.
• Familiarity with Node.js and MongoDB through personal or academic projects.
• Strong eagerness to learn and excellent communication skills.

Perks & Benefits:
• $45,000 - $65,000 annualized stipend ($25-35/hr).
• Full remote flexibility.
• High potential for full-time conversion upon successful internship completion.`,
        skillsRequired: ['react', 'javascript', 'node.js', 'html', 'css'],
        location: 'Remote',
        jobType: 'internship',
        experienceLevel: 'entry',
        salaryMin: 45000,
        salaryMax: 65000,
        daysAgo: 6,
        viewCount: 175
      },

      // ==========================================
      // SECTION 4: AI & DATA SCIENCE (7 Jobs)
      // ==========================================
      {
        companyName: 'Innovate AI Labs',
        title: 'Lead Generative AI & LLM Systems Engineer',
        description: `Role Overview:
Innovate AI Labs is seeking a Lead AI Engineer to architect our enterprise generative AI platform. You will build agentic workflows, multi-modal LLM reasoning pipelines, and retrieval-augmented generation (RAG) systems.

Key Responsibilities:
• Architect scalable LLM inference pipelines with continuous batching and speculative decoding.
• Build hybrid RAG architectures using vector embeddings (Pinecone / Milvus) and BM25 lexical rerankers.
• Fine-tune open-weight models (Llama-3, Mistral) on domain-specific datasets using LoRA/QLoRA.
• Design evaluation guardrails measuring hallucination rates, latency, and token efficiency.

Required Tech Stack & Qualifications:
• 5+ years of software engineering with 2+ years dedicated to deep learning and generative models.
• Mastery of Python, PyTorch, Hugging Face Transformers, and vLLM / Ollama frameworks.
• Deep understanding of vector databases, attention mechanisms, and prompt optimization.

Perks & Benefits:
• $175,000 - $230,000 top-of-market compensation + equity.
• Work with unlimited GPU compute clusters (H100 / A100).
• 100% remote flexibility with annual company summits in California.`,
        skillsRequired: ['python', 'pytorch', 'fastapi', 'docker', 'llm'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 175000,
        salaryMax: 230000,
        daysAgo: 1,
        viewCount: 215
      },
      {
        companyName: 'DataSphere Analytics',
        title: 'Machine Learning Research Engineer (PyTorch)',
        description: `Role Overview:
DataSphere Analytics is hiring a Machine Learning Research Engineer to develop predictive algorithms and neural representation models for enterprise business forecasting.

Key Responsibilities:
• Formulate novel neural network architectures for multivariate time-series forecasting.
• Implement scalable model training distributed across multi-node GPU clusters in PyTorch.
• Translate research discoveries into production microservices via FastAPI and Triton Inference Server.

Required Tech Stack & Qualifications:
• MS or PhD in Computer Science, Machine Learning, or related quantitative field.
• Extensive hands-on experience with PyTorch, CUDA profiling, and distributed training (DDP / FSDP).
• Publication record or demonstrated open-source contributions in machine learning.

Perks & Benefits:
• $160,000 - $210,000 base salary + stock grants.
• San Francisco, CA (Hybrid) or remote for senior researchers.
• Generous compute budget and conference travel stipends.`,
        skillsRequired: ['python', 'pytorch', 'docker', 'sql', 'fastapi'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 160000,
        salaryMax: 210000,
        daysAgo: 2,
        viewCount: 148
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'AI Solutions & FastAPI Microservices Developer',
        description: `Role Overview:
We are looking for a Mid-Level AI Backend Developer to build scalable asynchronous APIs that serve machine learning predictions to thousands of active client applications.

Key Responsibilities:
• Develop asynchronous REST and WebSocket microservices in Python utilizing FastAPI.
• Containerize AI service dependencies with Docker and optimize container startup latency.
• Implement Celery and Redis task queues for long-running batch inference jobs.
• Monitor API throughput and model latency metrics using Prometheus and Grafana.

Required Tech Stack & Qualifications:
• 3+ years of Python server development with strong FastAPI or Flask experience.
• Familiarity with Docker, Redis, and cloud microservices patterns.
• Working knowledge of machine learning inference workflows.

Perks & Benefits:
• $120,000 - $155,000 salary package.
• Austin, TX or 100% remote.
• Flexible time off and health wellness allowances.`,
        skillsRequired: ['python', 'fastapi', 'docker', 'redis', 'mongodb'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 120000,
        salaryMax: 155000,
        daysAgo: 3,
        viewCount: 112
      },
      {
        companyName: 'FinTech Core Global',
        title: 'Data Scientist - Predictive Risk & Fraud Detection',
        description: `Role Overview:
FinTech Core Global is seeking an experienced Data Scientist to design real-time anomaly detection and credit risk models protecting billions in transaction volume.

Key Responsibilities:
• Train supervised and unsupervised machine learning models (XGBoost, Isolation Forests, Neural Nets).
• Build automated feature engineering pipelines using SQL and Pandas over historical financial ledgers.
• Deploy models to production scoring engines with sub-50ms inference deadlines.
• Collaborate with compliance officers to produce explainable AI (SHAP / LIME) model risk documentation.

Required Tech Stack & Qualifications:
• 3-5 years of data science experience in banking, fintech, or cybersecurity.
• Mastery of Python (Pandas, Scikit-Learn, LightGBM) and advanced SQL.
• Strong understanding of model validation, backtesting, and drift detection.

Perks & Benefits:
• $130,000 - $165,000 base compensation + annual performance bonus.
• Hybrid work in New York, NY.
• 401(k) matching and comprehensive benefits.`,
        skillsRequired: ['python', 'sql', 'docker', 'pandas', 'scikit-learn'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 130000,
        salaryMax: 165000,
        daysAgo: 4,
        viewCount: 96
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Computer Vision & Deep Learning Specialist',
        description: `Role Overview:
CloudScale Systems is developing intelligent edge surveillance and automated server rack inspection systems using state-of-the-art computer vision models.

Key Responsibilities:
• Train object detection and segmentation models (YOLOv8, Mask R-CNN, ViTs) on specialized hardware imagery.
• Quantize neural weights (INT8 / FP16) for real-time edge execution on NVIDIA Jetson and edge accelerators.
• Build synthetic data generation pipelines to train models on rare failure modes.

Required Tech Stack & Qualifications:
• 4+ years of deep learning experience with a strong focus on computer vision.
• Expertise in PyTorch, OpenCV, TensorRT, and Docker.
• Experience deploying CV models to edge devices or low-latency cloud endpoints.

Perks & Benefits:
• $140,000 - $180,000 compensation package.
• Boston, MA or remote flexibility.
• Excellent medical, dental, and life insurance benefits.`,
        skillsRequired: ['python', 'pytorch', 'docker', 'linux', 'c++'],
        location: 'Boston, MA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 180000,
        daysAgo: 5,
        viewCount: 88
      },
      {
        companyName: 'DataSphere Analytics',
        title: 'Machine Learning Operations (MLOps) Engineer',
        description: `Role Overview:
DataSphere Analytics is hiring an MLOps Engineer to build automated training, testing, packaging, and deployment pipelines for dozens of production ML models.

Key Responsibilities:
• Build automated CI/CD pipelines for ML models using GitHub Actions and Kubeflow Pipelines.
• Track model artifacts, experiments, and hyperparameters using MLflow or Weights & Biases.
• Implement automated model monitoring dashboards detecting data drift, concept drift, and performance degradation.

Required Tech Stack & Qualifications:
• 3+ years in DevOps / SRE with specific experience supporting machine learning infrastructure.
• Proficiency in Python, Docker, Kubernetes, and AWS / GCP infrastructure.

Perks & Benefits:
• $145,000 - $185,000 base salary.
• 100% remote.
• Annual wellness stipend and home setup budget.`,
        skillsRequired: ['python', 'docker', 'kubernetes', 'aws', 'ci/cd'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 145000,
        salaryMax: 185000,
        daysAgo: 6,
        viewCount: 105
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Junior AI & Data Science Associate',
        description: `Role Overview:
Innovate AI Labs is seeking an entry-level Data Science Associate to curate training datasets, evaluate LLM benchmarks, and build visualization dashboards.

Key Responsibilities:
• Clean, filter, and deduplicate large text corpora for machine learning training.
• Run automated evaluation suites measuring model accuracy across standard industry benchmarks.
• Write exploratory data analysis scripts in Python (Jupyter, Pandas, Seaborn).

Required Tech Stack & Qualifications:
• Degree in Computer Science, Data Science, Mathematics, or equivalent portfolio.
• Solid Python programming skills and working familiarity with Git and SQL.
• Passion for understanding foundational AI mechanics.

Perks & Benefits:
• $75,000 - $95,000 starting compensation.
• Mentorship from PhD researchers and senior ML architects.
• Full hardware setup provided.`,
        skillsRequired: ['python', 'sql', 'pandas', 'numpy', 'git'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 75000,
        salaryMax: 95000,
        daysAgo: 7,
        viewCount: 130
      },

      // ==========================================
      // SECTION 5: CLOUD & DEVOPS / SRE (5 Jobs)
      // ==========================================
      {
        companyName: 'CloudScale Systems',
        title: 'Staff Site Reliability Engineer (Kubernetes & AWS)',
        description: `Role Overview:
CloudScale Systems is looking for a Staff SRE to maintain 99.999% uptime for multi-region cloud infrastructures orchestrating over 10,000 customer nodes.

Key Responsibilities:
• Architect, maintain, and scale high-availability Kubernetes clusters on AWS (EKS).
• Manage automated infrastructure provisioning using Terraform and GitOps (ArgoCD).
• Lead blameless post-mortem reviews and build automated chaos engineering drills with LitmusChaos.
• Build real-time alerting rules and SLO/SLI error budget monitoring in Prometheus and Datadog.

Required Tech Stack & Qualifications:
• 6+ years in DevOps / SRE roles managing large-scale distributed cloud infrastructure.
• Deep expertise in Kubernetes networking, CNI plugins, ingress controllers, and service meshes (Istio).
• Mastery of Linux internals, shell scripting, and infrastructure-as-code principles.

Perks & Benefits:
• $170,000 - $220,000 base salary + equity compensation.
• 100% remote work globally.
• Comprehensive health benefits and 401(k) matching.`,
        skillsRequired: ['kubernetes', 'docker', 'aws', 'terraform', 'linux'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 170000,
        salaryMax: 220000,
        daysAgo: 1,
        viewCount: 160
      },
      {
        companyName: 'TechCorp Innovations',
        title: 'DevOps & CI/CD Infrastructure Specialist',
        description: `Role Overview:
TechCorp Innovations is seeking a Mid-Level DevOps Engineer to supercharge our software release velocity and cloud efficiency.

Key Responsibilities:
• Maintain automated CI/CD pipelines in GitHub Actions reducing deployment durations by 50%.
• Create and optimize Docker images, reducing layer sizes and eliminating container security vulnerabilities.
• Automate multi-environment provisioning (Dev, Staging, Prod) using Terraform modules.
• Monitor cloud expenditure and implement automated auto-scaling policies to optimize AWS billing.

Required Tech Stack & Qualifications:
• 3-5 years of DevOps experience working with AWS and Docker.
• Proficiency in Terraform, Bash scripting, and GitHub Actions CI/CD workflows.
• Solid understanding of DNS, SSL/TLS certificates, and VPC networking.

Perks & Benefits:
• $125,000 - $160,000 salary package.
• Austin, TX or remote.
• Annual learning budget and flexible PTO.`,
        skillsRequired: ['docker', 'terraform', 'aws', 'ci/cd', 'linux'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 125000,
        salaryMax: 160000,
        daysAgo: 2,
        viewCount: 110
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Cloud Infrastructure Architect (AWS & GCP)',
        description: `Role Overview:
CloudScale Systems is looking for a Cloud Solutions Architect to design high-security, multi-cloud foundations for our enterprise Fortune 500 partners.

Key Responsibilities:
• Design multi-cloud network topologies connecting AWS VPCs and GCP projects via encrypted tunnels.
• Ensure enterprise regulatory compliance across SOC 2 Type II, HIPAA, and ISO 27001 standards.
• Advise executive stakeholders and engineering directors on cloud migration strategies.

Required Tech Stack & Qualifications:
• 7+ years of cloud architecture experience with AWS Certified Solutions Architect Professional or equivalent.
• Proven expertise with Terraform Enterprise, Kubernetes, and enterprise IAM directory integration.

Perks & Benefits:
• $180,000 - $235,000 base salary + executive bonus.
• San Francisco, CA (Hybrid) or remote.
• Full family health coverage and wellness allowances.`,
        skillsRequired: ['aws', 'kubernetes', 'terraform', 'docker', 'security'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 180000,
        salaryMax: 235000,
        daysAgo: 3,
        viewCount: 140
      },
      {
        companyName: 'CyberShield Security',
        title: 'DevSecOps Platform Engineer',
        description: `Role Overview:
CyberShield Security is hiring a DevSecOps Engineer to integrate continuous security testing, vulnerability scanning, and compliance verification into cloud software release cycles.

Key Responsibilities:
• Embed automated SAST/DAST tools (Snyk, Trivy, SonarQube) into developer pull request workflows.
• Enforce infrastructure-as-code security policies using Checkov and OPA (Open Policy Agent).
• Automate secrets management and rotation using HashiCorp Vault and AWS Secrets Manager.

Required Tech Stack & Qualifications:
• 4+ years of combined experience across DevOps and cybersecurity.
• Hands-on mastery of Docker container security, Kubernetes RBAC, and Terraform.

Perks & Benefits:
• $140,000 - $175,000 salary package.
• 100% remote position.
• Generous training stipends for SANS / OSCP certifications.`,
        skillsRequired: ['docker', 'security', 'kubernetes', 'terraform', 'ci/cd'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 175000,
        daysAgo: 4,
        viewCount: 92
      },
      {
        companyName: 'CloudScale Systems',
        title: 'Associate Cloud & Linux Operations Engineer',
        description: `Role Overview:
CloudScale Systems is seeking an entry-level Cloud Operations Engineer to support our 24/7 cloud reliability desk.

Key Responsibilities:
• Monitor alerts in Datadog and PagerDuty, performing initial triage and standard incident escalation.
• Execute routine server maintenance tasks, kernel upgrades, and log rotation on Ubuntu Linux instances.
• Document standard operating procedures (SOPs) and automate routine scripts in Bash / Python.

Required Tech Stack & Qualifications:
• 1+ year experience or degree in IT / Computer Science / Systems Administration.
• Strong command of Linux terminal commands, file permissions, and basic networking (DNS, SSH, HTTP).
• Passion for cloud technologies and eagerness to achieve AWS / Linux certifications.

Perks & Benefits:
• $82,000 - $105,000 starting compensation.
• Company-sponsored cloud certification programs (AWS / CKA).
• Denver, CO office or remote.`,
        skillsRequired: ['linux', 'docker', 'aws', 'bash', 'git'],
        location: 'Denver, CO',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 82000,
        salaryMax: 105000,
        daysAgo: 5,
        viewCount: 98
      },

      // ==========================================
      // SECTION 6: UI/UX & PRODUCT DESIGN (5 Jobs)
      // ==========================================
      {
        companyName: 'DesignCraft Studio',
        title: 'Lead Product Designer (Design Systems & UX)',
        description: `Role Overview:
DesignCraft Studio is looking for a Lead Product Designer to guide our digital product engagements, establish scalable multi-brand design systems, and champion human-centered design.

Key Responsibilities:
• Architect robust design systems in Figma utilizing variables, component properties, and auto-layout.
• Lead end-to-end UX design for complex enterprise web applications from discovery to final handoff.
• Conduct qualitative user testing, card sorting, and workflow journey mapping sessions.
• Mentor junior product designers and establish design critique rituals across the studio.

Required Tech Stack & Qualifications:
• 5+ years of digital product design experience in Figma.
• Proven track record of architecting enterprise design systems used by cross-functional teams.
• Strong portfolio demonstrating structured design thinking and measurable product outcomes.

Perks & Benefits:
• $140,000 - $180,000 base salary.
• San Francisco, CA or remote.
• Flexible vacation policy and top-tier design equipment provided.`,
        skillsRequired: ['figma', 'design systems', 'ui/ux', 'prototyping', 'user research'],
        location: 'San Francisco, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 180000,
        daysAgo: 1,
        viewCount: 125
      },
      {
        companyName: 'TechCorp Innovations',
        title: 'UI/UX Designer & Prototyper',
        description: `Role Overview:
TechCorp Innovations is seeking a Mid-Level UI/UX Designer to design intuitive user experiences for our cloud administration portal and analytics products.

Key Responsibilities:
• Design wireframes, user flows, and high-fidelity interactive prototypes in Figma.
• Collaborate closely with frontend engineers to ensure pixel-perfect implementation of UI components.
• Build reusable UI patterns conforming to accessibility standards (contrast ratios, legible scales).

Required Tech Stack & Qualifications:
• 3+ years of experience designing web and mobile applications in Figma.
• Solid grasp of frontend constraints (HTML/CSS/Tailwind) to design technically feasible solutions.
• Excellent verbal communication and presentation skills.

Perks & Benefits:
• $95,000 - $125,000 salary package.
• 100% remote position.
• Health benefits and annual technology stipend.`,
        skillsRequired: ['figma', 'ui/ux', 'prototyping', 'css', 'html'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 95000,
        salaryMax: 125000,
        daysAgo: 2,
        viewCount: 89
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Senior Interaction & Visual Designer',
        description: `Role Overview:
Innovate AI Labs is hiring a Senior Interaction Designer to invent novel conversational and generative AI user interfaces that delight millions of global users.

Key Responsibilities:
• Design novel interaction paradigms for generative content editing, prompt refinement, and AI workflows.
• Craft beautiful visual aesthetics, custom iconography, and micro-interactions that communicate system status.
• Partner with product managers and AI researchers to conceptualize experimental features.

Required Tech Stack & Qualifications:
• 4+ years in digital product design with emphasis on interaction design and visual craftsmanship.
• Expertise in Figma, Principle / Protopie, and modern web interaction design.

Perks & Benefits:
• $120,000 - $155,000 compensation package + equity.
• New York, NY (Hybrid) or remote.
• Opportunity to shape the future of human-AI collaboration.`,
        skillsRequired: ['figma', 'ui/ux', 'prototyping', 'design systems'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 120000,
        salaryMax: 155000,
        daysAgo: 3,
        viewCount: 110
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Product Design & User Researcher',
        description: `Role Overview:
Join Veloce Global to investigate consumer buying behaviors and design streamlined checkout flows across global e-commerce portals.

Key Responsibilities:
• Conduct moderated and unmoderated usability tests across desktop and mobile devices.
• Analyze conversion drop-off funnels in Mixpanel / Hotjar to identify friction points.
• Translate quantitative and qualitative findings into concrete UX wireframes and recommendations.

Required Tech Stack & Qualifications:
• 3+ years of combined experience in UX design and formal user research.
• Proficient in Figma, Maze, UserTesting.com, and analytics tools.

Perks & Benefits:
• $105,000 - $135,000 salary.
• 100% remote flexibility.
• Comprehensive health and retirement plans.`,
        skillsRequired: ['figma', 'user research', 'ui/ux', 'prototyping'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 105000,
        salaryMax: 135000,
        daysAgo: 4,
        viewCount: 74
      },
      {
        companyName: 'DesignCraft Studio',
        title: 'Junior UI/UX Designer',
        description: `Role Overview:
DesignCraft Studio is looking for a passionate Junior UI/UX Designer to join our collaborative design team.

Key Responsibilities:
• Support senior designers by preparing Figma design components and updating icon sets.
• Create high-fidelity mockups for marketing landing pages and client case studies.
• Participate in design critiques, learning design system principles and client presentation skills.

Required Tech Stack & Qualifications:
• 1+ year of design experience or exceptional design portfolio showcasing Figma proficiency.
• Keen eye for typography, whitespace, and harmonious color palettes.
• Strong willingness to receive feedback and grow technical design skills.

Perks & Benefits:
• $70,000 - $90,000 starting compensation.
• Daily mentorship and hands-on client projects.
• Austin, TX studio or remote.`,
        skillsRequired: ['figma', 'ui/ux', 'html', 'css'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 70000,
        salaryMax: 90000,
        daysAgo: 5,
        viewCount: 102
      },

      // ==========================================
      // SECTION 7: MOBILE DEVELOPMENT (5 Jobs)
      // ==========================================
      {
        companyName: 'NexGen Mobile Labs',
        title: 'Lead React Native Mobile Architect',
        description: `Role Overview:
NexGen Mobile Labs is seeking a Lead React Native Engineer to architect cross-platform iOS and Android applications used by over 3 million monthly active users.

Key Responsibilities:
• Lead cross-platform mobile architecture with React Native and TypeScript.
• Build custom native bridge modules in Swift and Kotlin for hardware sensors and background sync.
• Optimize rendering performance, memory footprint, and app launch time across low-end Android devices.
• Manage automated mobile CI/CD pipelines deploying to Apple TestFlight and Google Play Console.

Required Tech Stack & Qualifications:
• 5+ years of mobile software engineering with 3+ years in React Native.
• Deep understanding of React Native architecture (Fabric, TurboModules, Hermes JS engine).
• Experience publishing and maintaining high-volume consumer apps in both app stores.

Perks & Benefits:
• $145,000 - $185,000 base salary + equity.
• 100% remote flexibility.
• All testing mobile hardware provided (latest iPhones and Pixel devices).`,
        skillsRequired: ['react native', 'react', 'typescript', 'javascript', 'mobile'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 145000,
        salaryMax: 185000,
        daysAgo: 1,
        viewCount: 135
      },
      {
        companyName: 'NexGen Mobile Labs',
        title: 'Senior iOS Engineer (Swift & SwiftUI)',
        description: `Role Overview:
NexGen Mobile Labs is hiring a Senior iOS Engineer to craft delightful, native Apple experiences across iPhone, iPad, and Apple Watch devices.

Key Responsibilities:
• Build elegant native user interfaces using SwiftUI and Combine reactive data bindings.
• Implement local persistence with CoreData and SwiftData with background CloudKit synchronization.
• Ensure adherence to Apple Human Interface Guidelines and strict memory management.

Required Tech Stack & Qualifications:
• 4+ years of dedicated native iOS development with Swift and Xcode.
• Deep expertise in SwiftUI, async/await concurrency, and modular framework design.

Perks & Benefits:
• $140,000 - $175,000 base salary.
• San Jose, CA (Hybrid) or remote.
• Full health coverage and 401(k) matching.`,
        skillsRequired: ['swift', 'swiftui', 'ios', 'mobile', 'git'],
        location: 'San Jose, CA',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 175000,
        daysAgo: 2,
        viewCount: 94
      },
      {
        companyName: 'NexGen Mobile Labs',
        title: 'Senior Android Engineer (Kotlin & Compose)',
        description: `Role Overview:
We are looking for a Senior Android Developer to lead the development of our flagship Android application built on modern Jetpack architecture.

Key Responsibilities:
• Develop dynamic UI components using Jetpack Compose and Material 3 design specifications.
• Architect clean MVVM/MVI applications using Kotlin Coroutines, Flow, and Hilt dependency injection.
• Integrate offline-first Room database storage and background sync via Android WorkManager.

Required Tech Stack & Qualifications:
• 4+ years of native Android software development using Kotlin.
• In-depth mastery of Jetpack Compose, state handling, and Android performance profiling.

Perks & Benefits:
• $135,000 - $170,000 salary package.
• 100% remote.
• Annual learning and conference stipend.`,
        skillsRequired: ['kotlin', 'android', 'mobile', 'git', 'rest'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 135000,
        salaryMax: 170000,
        daysAgo: 3,
        viewCount: 88
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'Cross-Platform Mobile Developer (Flutter & Dart)',
        description: `Role Overview:
Veloce Global is searching for a Flutter Developer to create responsive, high-performance shopping applications for emerging global markets.

Key Responsibilities:
• Write clean Dart code implementing pixel-perfect UI widgets across iOS and Android.
• Manage app state using Bloc / Riverpod and integrate REST and GraphQL backend services.
• Integrate payment gateways and native push notifications via Firebase Cloud Messaging.

Required Tech Stack & Qualifications:
• 3+ years of mobile software development with strong Flutter & Dart proficiency.
• Experience releasing applications to the Apple App Store and Google Play Store.

Perks & Benefits:
• $110,000 - $140,000 compensation package.
• Seattle, WA (Hybrid) or remote.
• Comprehensive benefits and stock options.`,
        skillsRequired: ['flutter', 'dart', 'mobile', 'rest', 'git'],
        location: 'Seattle, WA',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 110000,
        salaryMax: 140000,
        daysAgo: 4,
        viewCount: 78
      },
      {
        companyName: 'NexGen Mobile Labs',
        title: 'Junior Mobile Application Developer (React Native)',
        description: `Role Overview:
NexGen Mobile Labs is seeking an entry-level Mobile Developer to assist in building consumer mobile screens, fixing bugs, and verifying releases.

Key Responsibilities:
• Develop reusable UI screen components in React Native and TypeScript.
• Test mobile builds on real physical iOS and Android devices, cataloging edge-case bugs.
• Assist with release notes and automated screenshot generation for app store listings.

Required Tech Stack & Qualifications:
• 1+ year experience or strong portfolio projects in React Native or React.
• Solid JavaScript/TypeScript basics and familiarity with mobile testing.

Perks & Benefits:
• $72,000 - $92,000 starting salary.
• Hands-on mentoring from senior mobile architects.
• Remote work flexibility and equipment provided.`,
        skillsRequired: ['react native', 'javascript', 'react', 'mobile', 'git'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 72000,
        salaryMax: 92000,
        daysAgo: 5,
        viewCount: 112
      },

      // ==========================================
      // SECTION 8: CYBERSECURITY & CLOUD SECURITY (5 Jobs)
      // ==========================================
      {
        companyName: 'CyberShield Security',
        title: 'Senior Application Security Engineer (AppSec)',
        description: `Role Overview:
CyberShield Security is hiring a Senior AppSec Engineer to protect our cloud software ecosystem against emerging cyber threats and zero-day vulnerabilities.

Key Responsibilities:
• Conduct architectural threat modeling on new product designs following STRIDE methodologies.
• Perform manual code audits and automated SAST/DAST/SCA security testing in CI/CD pipelines.
• Triage vulnerability reports from our Bug Bounty program and guide development teams on remediation.
• Lead security awareness training and secure coding workshops for engineering squads.

Required Tech Stack & Qualifications:
• 4+ years in dedicated Application Security or Penetration Testing roles.
• Deep understanding of the OWASP Top 10, cryptographic standards, and authentication protocols (OAuth, SAML).
• Hands-on scripting capability in Python, Go, or Node.js.

Perks & Benefits:
• $155,000 - $195,000 base salary.
• 100% remote globally.
• Full SANS / GIAC training funding ($5,000/year).`,
        skillsRequired: ['security', 'owasp', 'python', 'docker', 'ci/cd'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 155000,
        salaryMax: 195000,
        daysAgo: 1,
        viewCount: 122
      },
      {
        companyName: 'CyberShield Security',
        title: 'Cloud Security & IAM Specialist (AWS & Zero Trust)',
        description: `Role Overview:
Join CyberShield Security as our Cloud Security Architect to enforce least-privilege access, automated compliance posture, and Zero-Trust cloud network segmentation.

Key Responsibilities:
• Enforce least-privilege IAM policies, AWS Service Control Policies (SCPs), and permission boundaries.
• Configure real-time threat detection rules in AWS GuardDuty, Security Hub, and CloudTrail.
• Automate remediation of misconfigured cloud assets using Terraform and serverless Lambda functions.

Required Tech Stack & Qualifications:
• 4+ years of cloud security engineering with AWS.
• Strong familiarity with Terraform, IAM policy evaluation, and container security.
• Relevant certifications (AWS Certified Security Specialty, CISSP, or CCSP).

Perks & Benefits:
• $160,000 - $205,000 base compensation + performance bonus.
• Washington, DC (Hybrid) or remote.
• Comprehensive healthcare and retirement matching.`,
        skillsRequired: ['aws', 'security', 'terraform', 'docker', 'linux'],
        location: 'Washington, DC',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 160000,
        salaryMax: 205000,
        daysAgo: 2,
        viewCount: 104
      },
      {
        companyName: 'FinTech Core Global',
        title: 'Penetration Tester & Vulnerability Researcher',
        description: `Role Overview:
FinTech Core Global is seeking an experienced Penetration Tester to conduct red-team assessments and uncover vulnerabilities before malicious actors do.

Key Responsibilities:
• Execute black-box and white-box penetration tests against web APIs, cloud microservices, and mobile apps.
• Develop custom exploit payloads and proof-of-concept scripts in Python or Go.
• Author detailed remediation reports for executive leadership and engineering teams.

Required Tech Stack & Qualifications:
• 3+ years in offensive security testing (OSCP, OSCE, or GPEN certifications preferred).
• Mastery of Burp Suite Pro, Metasploit, Nmap, and network traffic interception.

Perks & Benefits:
• $140,000 - $180,000 base salary.
• Remote work flexibility.
• Hardware testing lab budget and conference allowances.`,
        skillsRequired: ['security', 'penetration testing', 'python', 'linux', 'owasp'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 180000,
        daysAgo: 3,
        viewCount: 86
      },
      {
        companyName: 'CyberShield Security',
        title: 'SOC Incident Response Analyst',
        description: `Role Overview:
CyberShield Security is looking for a Security Operations Center (SOC) Analyst to monitor and respond to real-time cybersecurity telemetry.

Key Responsibilities:
• Investigate alerts generated by SIEM (Splunk, Elastic, Sentinel) and EDR platforms (CrowdStrike).
• Perform containment and eradication of malware infections and unauthorized access attempts.
• Maintain playbook documentation and automate alert correlation scripts in Python.

Required Tech Stack & Qualifications:
• 2-4 years in a SOC or Incident Response team.
• Solid understanding of the MITRE ATT&CK framework and network protocols.

Perks & Benefits:
• $95,000 - $125,000 base salary.
• Dallas, TX or remote.
• Shift differentials and certification coverage.`,
        skillsRequired: ['security', 'linux', 'python', 'siem', 'network'],
        location: 'Dallas, TX',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 95000,
        salaryMax: 125000,
        daysAgo: 4,
        viewCount: 75
      },
      {
        companyName: 'CyberShield Security',
        title: 'Junior Cyber Defense Analyst',
        description: `Role Overview:
CyberShield Security is seeking an entry-level Cyber Defense Analyst to join our threat intelligence team.

Key Responsibilities:
• Review phishing submissions, analyze suspicious email headers, and block malicious domains.
• Maintain vulnerability scanning schedules across internal subnet ranges.
• Assist with compliance documentation audits (SOC 2, ISO 27001).

Required Tech Stack & Qualifications:
• Degree in Cybersecurity, Computer Science, or Security+ certification.
• Basic understanding of Linux, IP networking, and common web attack vectors.

Perks & Benefits:
• $70,000 - $90,000 compensation package.
• Direct mentorship and full training to prepare for advanced security roles.
• Remote flexibility.`,
        skillsRequired: ['security', 'linux', 'python', 'network', 'git'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 70000,
        salaryMax: 90000,
        daysAgo: 5,
        viewCount: 95
      },

      // ==========================================
      // SECTION 9: DATA ENGINEERING & BIG DATA (5 Jobs)
      // ==========================================
      {
        companyName: 'DataSphere Analytics',
        title: 'Staff Data Platform Engineer (Spark & Kafka)',
        description: `Role Overview:
DataSphere Analytics is seeking a Staff Data Engineer to lead the architecture of our distributed data lakehouse ingesting over 5 billion events daily.

Key Responsibilities:
• Architect real-time streaming pipelines utilizing Apache Kafka and Spark Structured Streaming.
• Design Delta Lake storage partitioning on AWS S3, optimizing parquet compression and query speeds.
• Orchestrate complex DAG workflows in Apache Airflow with automated failure recovery.

Required Tech Stack & Qualifications:
• 6+ years in big data engineering with Apache Spark, Kafka, and Python / Scala.
• Mastery of distributed data processing, schema evolution, and cloud data warehouses.

Perks & Benefits:
• $165,000 - $215,000 top-of-market salary + equity.
• 100% remote.
• Full health coverage and generous wellness stipend.`,
        skillsRequired: ['python', 'spark', 'kafka', 'airflow', 'sql'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 165000,
        salaryMax: 215000,
        daysAgo: 1,
        viewCount: 140
      },
      {
        companyName: 'DataSphere Analytics',
        title: 'Analytics Engineer (Snowflake & dbt)',
        description: `Role Overview:
DataSphere Analytics is hiring an Analytics Engineer to bridge the gap between raw data pipelines and executive business intelligence dashboards.

Key Responsibilities:
• Build modular, tested, and documented dimensional SQL models in dbt Core.
• Manage data warehouse schemas and access controls in Snowflake.
• Partner with product analysts to design clean semantic metrics definitions.

Required Tech Stack & Qualifications:
• 3+ years in data analytics engineering using SQL and dbt.
• Deep understanding of Kimball dimensional modeling (star schema, facts, dimensions).

Perks & Benefits:
• $120,000 - $155,000 salary package.
• New York, NY (Hybrid) or remote.
• Annual conference budget and flexible PTO.`,
        skillsRequired: ['sql', 'snowflake', 'dbt', 'python', 'bi'],
        location: 'New York, NY',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 120000,
        salaryMax: 155000,
        daysAgo: 2,
        viewCount: 98
      },
      {
        companyName: 'FinTech Core Global',
        title: 'Real-time Streaming Data Engineer',
        description: `Role Overview:
FinTech Core Global is looking for a Streaming Data Engineer to process real-time market data ticks and banking transaction logs with millisecond latency.

Key Responsibilities:
• Design Kafka topic architectures, partition keys, and schema registries (Avro / Protobuf).
• Build stateful stream processing applications using Apache Flink or Kafka Streams.
• Ensure zero message loss with exactly-once processing semantics.

Required Tech Stack & Qualifications:
• 4+ years of hands-on experience building stream processing pipelines in Kafka or Flink.
• Strong programming in Java, Python, or Go.

Perks & Benefits:
• $140,000 - $180,000 compensation package.
• Chicago, IL or remote.
• 401(k) matching and bonus incentives.`,
        skillsRequired: ['kafka', 'python', 'sql', 'docker', 'spark'],
        location: 'Chicago, IL',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 140000,
        salaryMax: 180000,
        daysAgo: 3,
        viewCount: 88
      },
      {
        companyName: 'DataSphere Analytics',
        title: 'ETL Pipeline Developer (Python & PostgreSQL)',
        description: `Role Overview:
Join DataSphere Analytics to build reliable data extraction and loading pipelines from dozens of third-party SaaS APIs into our centralized data platform.

Key Responsibilities:
• Develop robust Python ingestion scripts handling rate limits, token refreshes, and pagination.
• Write automated data quality check scripts validating row counts and schema integrity.
• Maintain Airflow task orchestrations and database indexing in PostgreSQL.

Required Tech Stack & Qualifications:
• 2-4 years of data engineering or Python development experience.
• Strong proficiency in SQL and relational database concepts.

Perks & Benefits:
• $105,000 - $135,000 salary.
• 100% remote position.
• Health, dental, and vision insurance.`,
        skillsRequired: ['python', 'postgresql', 'mongodb', 'docker', 'sql'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 105000,
        salaryMax: 135000,
        daysAgo: 4,
        viewCount: 76
      },
      {
        companyName: 'DataSphere Analytics',
        title: 'Junior Data Analyst (SQL & Python)',
        description: `Role Overview:
DataSphere Analytics is seeking an enthusiastic Junior Data Analyst to support executive reporting, KPI tracking, and ad-hoc data analysis.

Key Responsibilities:
• Write SQL queries to extract insights on user growth, retention, and feature engagement.
• Build executive dashboards in Tableau and Metabase.
• Clean and transform raw exploratory datasets in Python with Pandas.

Required Tech Stack & Qualifications:
• Degree in Data Analytics, Statistics, Economics, or Computer Science.
• Proficient in writing multi-table SQL queries (joins, window functions, aggregations).

Perks & Benefits:
• $50,000 - $70,000 starting salary.
• Remote work flexibility.
• Training program and mentorship from senior data engineers.`,
        skillsRequired: ['sql', 'python', 'pandas', 'excel', 'tableau'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 50000,
        salaryMax: 70000,
        daysAgo: 5,
        viewCount: 118
      },

      // ==========================================
      // SECTION 10: QA AUTOMATION & SDET (4 Jobs)
      // ==========================================
      {
        companyName: 'TechCorp Innovations',
        title: 'Lead SDET & Automation Architect',
        description: `Role Overview:
TechCorp Innovations is looking for a Lead Software Development Engineer in Test (SDET) to establish our global automated testing framework across web and mobile platforms.

Key Responsibilities:
• Architect scalable end-to-end automated test suites in TypeScript using Playwright.
• Integrate parallel test execution into GitHub Actions, reducing regression cycles from 4 hours to 15 minutes.
• Establish contract testing between frontend React components and backend microservices using Pact.
• Mentor QA engineers on writing maintainable page object models and mocking network requests.

Required Tech Stack & Qualifications:
• 5+ years of software engineering in test or test automation architecture.
• Deep expertise in Playwright, Cypress, TypeScript, and Jest.
• Proven track record embedding QA automation into CI/CD delivery pipelines.

Perks & Benefits:
• $135,000 - $170,000 base compensation + equity.
• 100% remote work globally.
• Full health coverage and home workspace equipment.`,
        skillsRequired: ['playwright', 'cypress', 'jest', 'typescript', 'ci/cd'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'senior',
        salaryMin: 135000,
        salaryMax: 170000,
        daysAgo: 1,
        viewCount: 115
      },
      {
        companyName: 'Veloce Global Platforms',
        title: 'QA Automation Engineer (Cypress & API Testing)',
        description: `Role Overview:
Veloce Global is seeking a Mid-Level QA Automation Engineer to ensure zero defects across our customer checkout and order processing workflows.

Key Responsibilities:
• Write and maintain end-to-end regression suites in Cypress for web applications.
• Automate backend API testing using Supertest, Postman, or Newman scripts.
• Identify edge-case defects, file reproducible JIRA tickets, and verify fixes.

Required Tech Stack & Qualifications:
• 3+ years in automated software testing.
• Strong experience with Cypress, JavaScript/TypeScript, and REST API testing.

Perks & Benefits:
• $100,000 - $130,000 salary package.
• Austin, TX (Hybrid) or remote.
• Medical, dental, and 401(k) retirement benefits.`,
        skillsRequired: ['cypress', 'jest', 'javascript', 'node.js', 'ci/cd'],
        location: 'Austin, TX',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 100000,
        salaryMax: 130000,
        daysAgo: 2,
        viewCount: 84
      },
      {
        companyName: 'FinTech Core Global',
        title: 'Performance & Load Testing Engineer (k6 & JMeter)',
        description: `Role Overview:
FinTech Core Global is looking for a Performance Testing Specialist to benchmark and stress-test our transaction engines prior to major market volume surges.

Key Responsibilities:
• Develop load testing scripts in k6 and Apache JMeter simulating hundreds of thousands of concurrent transactions.
• Identify latency bottlenecks in database connection pools, memory garbage collection, and network sockets.
• Produce executive performance benchmark reports highlighting degradation thresholds.

Required Tech Stack & Qualifications:
• 3-5 years of specialized experience in performance, load, and stress testing.
• Mastery of k6, JMeter, distributed testing, and Prometheus telemetry.

Perks & Benefits:
• $115,000 - $145,000 salary package.
• Remote work flexibility.
• Excellent financial industry benefits and bonus incentives.`,
        skillsRequired: ['javascript', 'docker', 'python', 'linux', 'ci/cd'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'mid',
        salaryMin: 115000,
        salaryMax: 145000,
        daysAgo: 3,
        viewCount: 72
      },
      {
        companyName: 'Innovate AI Labs',
        title: 'Junior QA Software Tester',
        description: `Role Overview:
Innovate AI Labs is hiring an entry-level QA Tester to perform exploratory testing, automated regression verification, and bug triage.

Key Responsibilities:
• Execute structured test cases covering new features, responsive layouts, and cross-browser compatibility.
• Document clear, reproducible bug steps with screenshots and network logs.
• Assist in writing automated test scripts in Playwright / Cypress.

Required Tech Stack & Qualifications:
• 1+ year experience or degree in Computer Science / Software Engineering.
• Understanding of software testing fundamentals, bug lifecycle, and web technologies.

Perks & Benefits:
• $65,000 - $85,000 starting compensation.
• Remote work with mentorship from senior SDET architects.
• Full equipment and learning benefits.`,
        skillsRequired: ['javascript', 'cypress', 'html', 'css', 'git'],
        location: 'Remote',
        jobType: 'full-time',
        experienceLevel: 'entry',
        salaryMin: 65000,
        salaryMax: 85000,
        daysAgo: 4,
        viewCount: 98
      }
    ];

    // Build the Job documents
    const jobListingsToInsert = rawJobs.map((j) => {
      const companyId = companies[j.companyName];
      const recruiterId = recruiters[j.companyName];
      const createdAtDate = new Date(Date.now() - (j.daysAgo || 1) * 86400000);

      return {
        company: companyId,
        postedBy: recruiterId,
        title: j.title,
        description: j.description,
        skillsRequired: j.skillsRequired.map(s => s.trim().toLowerCase()),
        location: j.location,
        jobType: j.jobType,
        experienceLevel: j.experienceLevel,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        status: 'open',
        viewCount: j.viewCount || Math.floor(Math.random() * 80 + 20),
        createdAt: createdAtDate,
        updatedAt: createdAtDate
      };
    });

    const createdJobs = await Job.insertMany(jobListingsToInsert);
    console.log(`[AutoSeed] Successfully created ${createdJobs.length} real tech job postings across 9 companies!`);

    // Create an initial sample application for Candidate 1
    if (createdJobs.length > 0) {
      await Application.create({
        job: createdJobs[0]._id,
        candidate: candidate1._id,
        resumeUrl: candidate1Profile.resumeUrl,
        coverLetter: 'I am excited to apply for this Senior Full Stack role! My MERN stack skills align 100% with the requirements.',
        status: 'shortlisted',
        statusHistory: [
          { status: 'applied', changedAt: new Date(Date.now() - 86400000 * 3), changedBy: candidate1._id },
          { status: 'shortlisted', changedAt: new Date(Date.now() - 86400000 * 1), changedBy: recruiters['TechCorp Innovations'] }
        ]
      });
    }

    console.log('[AutoSeed] Mandeep Sharma admin & candidate accounts successfully populated!');
    return { success: true, count: createdJobs.length };
  } catch (error) {
    console.error('[AutoSeed Helper Error]:', error);
    throw error;
  }
};

module.exports = seedDataHelper;

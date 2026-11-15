import { BackendProduct, CartItemInput, OrderItem } from '../models/types.ts';

export const BACKEND_PRODUCTS: BackendProduct[] = [
  {
    id: 'web-designing-course',
    slug: 'web-designing-course',
    title: 'Web Designing Course',
    category: 'Courses',
    price: 9999,
    formattedPrice: '₹9,999.00',
    shortDescription:
      'Learn the essentials of modern web design, including layout, visual hierarchy, responsive pages, and user-friendly interfaces for polished websites.',
    fullDescription:
      'Learn the essentials of modern web design, including layout, visual hierarchy, responsive pages, and user-friendly interfaces for polished websites. Designed for creators who want systematic control over grids, typography, color contrast, and production-ready UI components.',
    duration: '6 Weeks · Self-Paced',
    level: 'Beginner to Intermediate',
    modules: [
      '01. Grid Architecture & Visual Hierarchy',
      '02. Responsive Breakpoints & Fluid Layout Systems',
      '03. Typographic Scales, Contrast & Color Discipline',
      '04. Interactive Prototyping & Component Handoff',
    ],
    deliverables: [
      '18 HD studio video lessons & layout walkthroughs',
      'Downloadable responsive design tokens & UI starter kit',
      'Real-world portfolio landing page capstone',
      'Lifetime curriculum updates & digital certificate',
    ],
  },
  {
    id: 'system-design-course',
    slug: 'system-design-course',
    title: 'System Design Course',
    category: 'Courses',
    price: 24999,
    formattedPrice: '₹24,999.00',
    shortDescription:
      'Understand the principles of scalable systems, architecture, APIs, databases, and reliability through practical examples designed to build job-ready system design skills.',
    fullDescription:
      'Understand the principles of scalable systems, architecture, APIs, databases, and reliability through practical examples designed to build job-ready system design skills. Master load balancing, distributed caching, partitioning, and fault-tolerant service design.',
    duration: '8 Weeks · Self-Paced',
    level: 'Intermediate to Senior',
    modules: [
      '01. Scalability Fundamentals, Latency & Throughput',
      '02. API Gateways, Load Balancing & Rate Limiting',
      '03. Relational vs. Distributed Storage & Sharding',
      '04. Event-Driven Queues, Caching & Observability',
    ],
    deliverables: [
      '24 architecture deep-dives with production blueprints',
      'Interactive system trade-off checklists & diagrams',
      '6 end-to-end case studies (payments, feeds, messaging)',
      'Lifetime curriculum updates & digital certificate',
    ],
  },
  {
    id: 'c-course',
    slug: 'c-course',
    title: 'C++ Course',
    category: 'Courses',
    price: 49999,
    formattedPrice: '₹49,999.00',
    shortDescription:
      'Build a strong foundation in C++ through clear lessons, practical coding exercises, and real-world problem solving. Strengthen your programming and object-oriented development skills.',
    fullDescription:
      'Build a strong foundation in C++ through clear lessons, practical coding exercises, and real-world problem solving. Strengthen your programming and object-oriented development skills while mastering memory management, STL containers, and modern C++20 patterns.',
    duration: '10 Weeks · Self-Paced',
    level: 'Foundation to Advanced',
    modules: [
      '01. Memory Models, Pointers, References & RAII',
      '02. Object-Oriented Architecture & Polymorphism',
      '03. Templates, Generic Programming & Modern STL',
      '04. Concurrency, Profiling & High-Performance Systems',
    ],
    deliverables: [
      '32 structured lessons with annotated source repositories',
      '60+ algorithmic and systems-level coding exercises',
      'Low-latency engine & parser capstone project',
      'Lifetime curriculum updates & digital certificate',
    ],
  },
  {
    id: 'python-course',
    slug: 'python-course',
    title: 'Python Course',
    category: 'Courses',
    price: 99999,
    formattedPrice: '₹99,999.00',
    shortDescription:
      'Learn Python from the ground up with practical lessons, clear examples, and hands-on projects. Build strong programming skills and gain confidence creating real-world applications.',
    fullDescription:
      'Learn Python from the ground up with practical lessons, clear examples, and hands-on projects. Build strong programming skills and gain confidence creating real-world applications spanning automation, backend APIs, data pipelines, and production tooling.',
    duration: '12 Weeks · Mentored Track',
    level: 'Comprehensive Mastery',
    modules: [
      '01. Core Pythonic Patterns, Data Structures & Typing',
      '02. Asynchronous I/O, Testing & Clean Package Design',
      '03. Production Web APIs, Databases & Automation',
      '04. Data Workflows, Tooling & Deployment Architecture',
    ],
    deliverables: [
      '40+ in-depth lessons and production code templates',
      '4 real-world capstone applications with test suites',
      'Architecture review guides & reference e-books',
      'Lifetime curriculum updates & digital certificate',
    ],
  },
  {
    id: 'fullstack-javascript-bootcamp',
    slug: 'fullstack-javascript-bootcamp',
    title: 'JavaScript & Modern Frontend Bootcamp',
    category: 'Courses',
    price: 999,
    formattedPrice: '₹999.00',
    shortDescription:
      'Master modern ES6+, asynchronous JavaScript, DOM manipulation, and React component architecture with hands-on projects.',
    fullDescription:
      'Master modern ES6+, asynchronous JavaScript (Promises, async/await), DOM manipulation, and React frontend architecture. Build interactive web applications with clean code patterns, state management, and API integrations.',
    duration: '4 Weeks · Self-Paced',
    level: 'Beginner to Intermediate',
    modules: [
      '01. Modern ES6+ Syntax, Scopes & Closures',
      '02. Asynchronous JavaScript, Fetch API & Async/Await',
      '03. DOM Architecture, Events & Interactive UIs',
      '04. React Fundamentals, Hooks & State Management',
    ],
    deliverables: [
      '16 HD studio lessons with annotated code sandboxes',
      '5 hands-on portfolio projects (Weather App, Task Manager, API Dashboard)',
      'Downloadable cheat sheets & interview prep guide',
      'Lifetime curriculum updates & certificate of completion',
    ],
  },
  {
    id: 'html-css-masterclass',
    slug: 'html-css-masterclass',
    title: 'HTML5 & Modern CSS Masterclass',
    category: 'Courses',
    price: 499,
    formattedPrice: '₹499.00',
    shortDescription:
      'Learn modern semantic HTML5 and responsive CSS from scratch, including Flexbox, CSS Grid, animations, and mobile-first design.',
    fullDescription:
      'Learn modern semantic HTML5 and responsive CSS styling from scratch. Gain practical expertise in Flexbox, CSS Grid, typography, responsive layouts, and modern CSS variables to build beautiful websites from day one.',
    duration: '2 Weeks · Self-Paced',
    level: 'Beginner',
    modules: [
      '01. Semantic HTML5 Elements & Web Accessibility',
      '02. CSS Box Model, Specificity & Custom Properties',
      '03. Modern Layouts with Flexbox & CSS Grid',
      '04. Responsive Breakpoints, Transitions & Keyframe Animations',
    ],
    deliverables: [
      '10 concise video lessons & step-by-step code walkthroughs',
      '3 responsive website templates (Landing Page, Portfolio, Newsletter)',
      'Downloadable CSS Flexbox & Grid visual reference guides',
      'Lifetime curriculum updates & certificate of completion',
    ],
  },
  {
    id: 'founder-creator-masterclass',
    slug: 'founder-creator-masterclass',
    title: 'Founder & Creator Masterclass (Bid Your Price)',
    category: 'Courses',
    price: 499,
    formattedPrice: 'Bid from ₹99',
    shortDescription:
      'Name your price! An exclusive open-bidding masterclass on building digital products, indie business strategy, and creative software craftsmanship.',
    fullDescription:
      'Name your price! An exclusive community-driven masterclass on building digital products, indie business strategy, and creative software craftsmanship. Bid any amount you wish (starting from just ₹99) to support the community and unlock full access to live cohort sessions, interactive Q&A, and the complete resource vault.',
    duration: 'Live Cohort Sessions + Lifetime Access',
    level: 'All Levels Welcome',
    isBiddable: true,
    minBid: 99,
    modules: [
      '01. Digital Product Discovery & Market Validation',
      '02. Zero-to-One Architecture & Indie Tech Stack Selection',
      '03. Audience Building, Monetization & Payment Workflows',
      '04. Live Mastermind Q&A & Project Teardowns',
    ],
    deliverables: [
      'Live interactive mastermind session access + full HD recordings',
      'Complete Indie Creator Notion OS & financial projection templates',
      'Private BlueBlends community access & peer feedback circle',
      'Lifetime access pass & personalized founder certificate',
    ],
  },
  {
    id: 'fullstack-react-nextjs',
    slug: 'fullstack-react-nextjs',
    title: 'Full-Stack React & Next.js Masterclass',
    category: 'Courses',
    price: 4999,
    formattedPrice: '₹4,999.00',
    shortDescription:
      'Build production-ready, full-stack web applications with Next.js 15, React Server Components, TypeScript, Tailwind CSS, and PostgreSQL.',
    fullDescription:
      'Build production-ready, full-stack web applications with Next.js 15, React Server Components, TypeScript, Tailwind CSS, and PostgreSQL. Master server actions, authentication, database migrations, caching strategies, and seamless deployment to cloud environments.',
    duration: '6 Weeks · Self-Paced',
    level: 'Intermediate',
    modules: [
      '01. Next.js 15 App Router & Server Components',
      '02. Server Actions, Form Mutations & Zod Validation',
      '03. Database Modeling with Prisma & PostgreSQL',
      '04. Auth, Caching Layers & Production Deployment',
    ],
    deliverables: [
      '22 HD video modules with structured repository milestones',
      'Complete SaaS starter kit with auth, Stripe/Cashfree & database setup',
      'Architectural review rubrics & production deployment blueprints',
      'Lifetime curriculum updates & certificate of completion',
    ],
  },
];

export function getProductById(productId: string): BackendProduct | undefined {
  return BACKEND_PRODUCTS.find((p) => p.id === productId);
}

export function validateAndCalculateItems(
  items: CartItemInput[]
): {
  valid: boolean;
  orderItems: OrderItem[];
  totalAmount: number;
  error?: string;
} {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, orderItems: [], totalAmount: 0, error: 'Cart is empty' };
  }

  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      return {
        valid: false,
        orderItems: [],
        totalAmount: 0,
        error: `Invalid product ID: ${item.productId}`,
      };
    }

    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    let effectivePrice = product.price;

    if (product.isBiddable) {
      const minBid = product.minBid || 1;
      const proposedBid = Number(item.customPrice);
      if (isNaN(proposedBid) || proposedBid < minBid) {
        return {
          valid: false,
          orderItems: [],
          totalAmount: 0,
          error: `Minimum bid for "${product.title}" is ₹${minBid}`,
        };
      }
      effectivePrice = Math.round(proposedBid);
    }

    const subtotal = effectivePrice * qty;
    totalAmount += subtotal;

    orderItems.push({
      productId: product.id,
      title: product.title,
      price: effectivePrice,
      quantity: qty,
      subtotal,
      isBiddable: product.isBiddable,
      bidAmount: product.isBiddable ? effectivePrice : undefined,
    });
  }

  return {
    valid: true,
    orderItems,
    totalAmount,
  };
}

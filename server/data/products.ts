import { BackendProduct, OrderItem } from '../models/types.ts';

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
];

export function getProductById(productId: string): BackendProduct | undefined {
  return BACKEND_PRODUCTS.find((p) => p.id === productId);
}

export function validateAndCalculateItems(
  items: { productId: string; quantity: number }[]
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
    const subtotal = product.price * qty;
    totalAmount += subtotal;

    orderItems.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: qty,
      subtotal,
    });
  }

  return {
    valid: true,
    orderItems,
    totalAmount,
  };
}

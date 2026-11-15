import heroStudioImg from '../assets/images/hero_blueblends_studio_1794648521545.jpg';
import webDesignImg from '../assets/images/course_web_design_1794648521787.jpg';
import systemDesignImg from '../assets/images/course_system_design_1794648521907.jpg';
import cppCourseImg from '../assets/images/course_cpp_1794648522588.jpg';
import pythonCourseImg from '../assets/images/course_python_1794648523116.jpg';
import blogGraphicDesignImg from '../assets/images/blog_graphic_design_ebooks_1794648523838.jpg';
import blogCodingBeginnersImg from '../assets/images/blog_coding_beginners_1794648524810.jpg';
import blogDigitalProductsImg from '../assets/images/blog_digital_products_1794648525450.jpg';

export type ProductCategory = 'All Products' | 'Courses' | 'E-Books' | 'Graphics';

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: Exclude<ProductCategory, 'All Products'>;
  price: number;
  formattedPrice: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  duration: string;
  level: string;
  modules: string[];
  deliverables: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
}

export interface BlogPostSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedLabel: string;
  readTime: string;
  image: string;
  imageAlt: string;
  sections: BlogPostSection[];
}

export const HERO_MEDIA = {
  image: heroStudioImg,
  alt: 'Blueblends modern creative design and software engineering studio',
};

export const PRODUCTS: Product[] = [
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
    image: webDesignImg,
    imageAlt: 'Web Designing Course course cover',
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
    image: systemDesignImg,
    imageAlt: 'System Design Course course cover',
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
    image: cppCourseImg,
    imageAlt: 'C++ Course course cover',
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
    image: pythonCourseImg,
    imageAlt: 'Python Course course cover',
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

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Software Engineer & Product Builder',
    rating: 5,
    quote:
      'The coding courses are a game-changer. I finally understand complex algorithms in a way that makes sense for my projects.',
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    role: 'Senior UI/UX Designer',
    rating: 5,
    quote:
      'BlueBlends e-books are incredibly well-structured. They provide the depth of knowledge I needed to master my design workflow.',
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    role: 'Creative Technologist',
    rating: 5,
    quote:
      'Professional, sleek, and highly effective. The software courses are exactly what I was looking for to level up my skills.',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'top-ebooks-graphic-designers',
    slug: 'top-e-books-for-aspiring-graphic-designers',
    title: 'Top E-Books for Aspiring Graphic Designers',
    excerpt:
      'Graphic design is a field that combines creativity with technical skills, making it both exciting and challenging. For aspiring graphic designers, having the right resources can make a significant difference in their learning journey.',
    author: 'blueblendsfinancia',
    publishedLabel: '19 hours ago',
    readTime: '4 min read',
    image: blogGraphicDesignImg,
    imageAlt: 'Eye-level view of a colorful graphic design book collection',
    sections: [
      {
        paragraphs: [
          'Graphic design is a field that combines creativity with technical skills, making it both exciting and challenging. For aspiring graphic designers, having the right resources can make a significant difference in their learning journey. E-books are an excellent way to access knowledge, tips, and inspiration from industry experts. In this post, we will explore some of the top e-books that can help you enhance your skills and develop your unique style as a graphic designer.',
        ],
      },
      {
        heading: 'Understanding the Basics of Graphic Design',
        paragraphs: [
          'Before diving into specific e-books, it is essential to understand the foundational principles of graphic design. These principles serve as the building blocks for effective design and appear across every well-crafted digital or print system:',
        ],
        bullets: [
          'Balance: Achieving visual stability in your designs.',
          'Contrast: Using opposing elements to create interest.',
          'Alignment: Ensuring elements are visually connected.',
          'Repetition: Reinforcing a design through consistent elements.',
          'Proximity: Grouping related items together for clarity.',
        ],
      },
      {
        heading: 'Recommended E-Books for Aspiring Graphic Designers',
        paragraphs: [
          '1. "The Non-Designer’s Design Book" by Robin Williams — Perfect for beginners who want to understand typography, color theory, and layout without technical jargon.',
          '2. "Graphic Design: The New Basics" by Ellen Lupton and Jennifer Cole Phillips — A comprehensive guide to visual literacy and critical design thinking.',
          '3. "Thinking with Type" by Ellen Lupton — Explores the history, anatomy, and practical rules of typography in print and screen layouts.',
          '4. "Making and Breaking the Grid" by Timothy Samara — Shows how structured grid systems anchor modern editorial and web interfaces.',
        ],
      },
    ],
  },
  {
    id: 'essential-coding-courses-beginners',
    slug: 'essential-coding-courses-for-beginners',
    title: 'Essential Coding Courses for Beginners',
    excerpt:
      'In today’s digital age, coding is an invaluable skill that opens doors to numerous career opportunities. This guide will help you navigate through essential coding courses tailored for beginners.',
    author: 'blueblendsfinancia',
    publishedLabel: '19 hours ago',
    readTime: '3 min read',
    image: blogCodingBeginnersImg,
    imageAlt: 'Eye-level view of a clean developer workspace with code editor and notebook',
    sections: [
      {
        paragraphs: [
          'In today’s digital age, coding is an invaluable skill that opens doors to numerous career opportunities. Whether you are looking to switch careers, enhance your current role, or build independent software products, learning to code can transform what you can ship.',
          'With countless resources available, it can be overwhelming to choose the right path. Starting with structured fundamentals rather than fragmented tutorials ensures you build mental models that transfer across languages.',
        ],
      },
      {
        heading: 'Choosing Your First Technical Track',
        paragraphs: [
          'A strong beginner curriculum pairs clear conceptual explanations with hands-on exercises where you debug real programs from scratch:',
        ],
        bullets: [
          'Web Designing & Frontend Logic: Ideal for visual thinkers who want immediate feedback in the browser.',
          'Python Foundations: Clean syntax for automation, scripting, backend APIs, and data analysis.',
          'C++ & Memory Fundamentals: Builds deep rigor around types, memory, and performance.',
          'System Design Thinking: Teaches how individual services fit together reliably at scale.',
        ],
      },
    ],
  },
  {
    id: 'maximize-sales-digital-products',
    slug: 'maximize-your-sales-with-digital-products',
    title: 'Maximize Your Sales with Digital Products',
    excerpt:
      'Businesses are constantly seeking innovative ways to build scalable revenue streams. This post explores how structured digital products unlock sustainable growth and reach.',
    author: 'blueblendsfinancia',
    publishedLabel: '19 hours ago',
    readTime: '5 min read',
    image: blogDigitalProductsImg,
    imageAlt: 'Eye-level view of a digital tablet displaying clean analytics and digital product layouts',
    sections: [
      {
        paragraphs: [
          'In today’s fast-paced digital landscape, businesses and independent creators are constantly seeking durable ways to grow their reach. One of the most effective strategies is integrating high-value digital products—such as technical courses, structured e-books, and reusable design systems—into your offerings.',
          'Digital products provide a scalable revenue stream with zero physical inventory overhead while allowing learners around the world to access your expertise immediately.',
        ],
      },
      {
        heading: 'Practical Strategies for Digital Product Growth',
        paragraphs: [
          'Consistent product quality and clear positioning matter far more than aggressive discounting:',
        ],
        bullets: [
          'Lead with Concrete Outcomes: Clearly state the skills, deliverables, and projects learners complete.',
          'Pair Products with Educational Writing: Publish practical guides and tutorials that demonstrate your depth before a buyer commits.',
          'Offer Tiered Learning Paths: Guide learners smoothly from introductory design courses into advanced engineering tracks.',
          'Keep Checkout Frictionless: Provide transparent pricing, instant digital fulfillment, and responsive customer support.',
        ],
      },
    ],
  },
];

import { PrismaClient, ProductType, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =====================
  // USERS
  // =====================
  const adminPassword = await hash("Admin@OmniCartix2024", 12);
  const customerPassword = await hash("Customer@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@omnicartix.co.uk" },
    update: {},
    create: {
      name: "Omni Admin",
      email: "admin@omnicartix.co.uk",
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  const customerList = [
    { name: "Sarah Thompson", email: "sarah.thompson@example.co.uk" },
    { name: "James Whitfield", email: "james.whitfield@example.co.uk" },
    { name: "Priya Sharma", email: "priya.sharma@example.co.uk" },
    { name: "Oliver Bennett", email: "oliver.bennett@example.co.uk" },
    { name: "Emma Clarke", email: "emma.clarke@example.co.uk" },
  ];
  const customers = [];
  for (const u of customerList) {
    const customer = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: customerPassword, role: UserRole.CUSTOMER, emailVerified: new Date() },
    });
    customers.push(customer);
  }

  console.log(`✅ Created ${customers.length + 1} users`);

  // =====================
  // CATEGORIES
  // =====================
  const categoryData = [
    // Physical (SIC 47910)
    { name: "Fashion & Apparel", slug: "fashion-apparel", icon: "👗", sicCode: "47910", parentSlug: "physical" },
    { name: "Home & Living", slug: "home-living", icon: "🏠", sicCode: "47910", parentSlug: "physical" },
    { name: "Health & Beauty", slug: "health-beauty", icon: "💄", sicCode: "47910", parentSlug: "physical" },
    { name: "Electronics & Gadgets", slug: "electronics-gadgets", icon: "📱", sicCode: "47910", parentSlug: "physical" },
    { name: "Food & Drink", slug: "food-drink", icon: "🍵", sicCode: "47910", parentSlug: "physical" },
    { name: "Sports & Fitness", slug: "sports-fitness", icon: "🏋️", sicCode: "47910", parentSlug: "physical" },
    { name: "Toys & Games", slug: "toys-games", icon: "🎮", sicCode: "47910", parentSlug: "physical" },
    { name: "Books & Stationery", slug: "books-stationery", icon: "📚", sicCode: "47910", parentSlug: "physical" },
    { name: "Pet Products", slug: "pet-products", icon: "🐾", sicCode: "47910", parentSlug: "physical" },
    { name: "Handmade & Craft", slug: "handmade-craft", icon: "🎨", sicCode: "47910", parentSlug: "physical" },
    // Digital (SIC 58290)
    { name: "E-books & Guides", slug: "ebooks-guides", icon: "📖", sicCode: "58290", parentSlug: "digital" },
    { name: "Online Courses", slug: "online-courses", icon: "🎓", sicCode: "58290", parentSlug: "digital" },
    { name: "Templates", slug: "templates", icon: "📋", sicCode: "58290", parentSlug: "digital" },
    { name: "Music & Audio", slug: "music-audio", icon: "🎵", sicCode: "58290", parentSlug: "digital" },
    { name: "Photography & Presets", slug: "photography-presets", icon: "📸", sicCode: "58290", parentSlug: "digital" },
    { name: "Fonts & Graphics", slug: "fonts-graphics", icon: "✒️", sicCode: "58290", parentSlug: "digital" },
    { name: "Printables", slug: "printables", icon: "🖨️", sicCode: "58290", parentSlug: "digital" },
    { name: "Plugins & Tools", slug: "plugins-tools", icon: "🔧", sicCode: "58290", parentSlug: "digital" },
    { name: "Memberships", slug: "memberships", icon: "⭐", sicCode: "58290", parentSlug: "digital" },
    { name: "AI Prompts & Packs", slug: "ai-prompts", icon: "🤖", sicCode: "58290", parentSlug: "digital" },
    // SaaS (SIC 62012)
    { name: "Custom Software", slug: "custom-software", icon: "⚙️", sicCode: "62012", parentSlug: "saas" },
    { name: "SaaS Products", slug: "saas-products", icon: "☁️", sicCode: "62012", parentSlug: "saas" },
    { name: "Mobile Apps", slug: "mobile-apps", icon: "📲", sicCode: "62012", parentSlug: "saas" },
    { name: "Website Themes", slug: "website-themes", icon: "🎨", sicCode: "62012", parentSlug: "saas" },
    { name: "Scripts & Code", slug: "scripts-code", icon: "💾", sicCode: "62012", parentSlug: "saas" },
    { name: "CRM & ERP Tools", slug: "crm-erp", icon: "📊", sicCode: "62012", parentSlug: "saas" },
    { name: "Analytics Dashboards", slug: "analytics-dashboards", icon: "📈", sicCode: "62012", parentSlug: "saas" },
    { name: "AI Chatbots", slug: "ai-chatbots", icon: "🤖", sicCode: "62012", parentSlug: "saas" },
    { name: "Browser Extensions", slug: "browser-extensions", icon: "🌐", sicCode: "62012", parentSlug: "saas" },
    { name: "API & Developer Tools", slug: "api-developer-tools", icon: "🔌", sicCode: "62012", parentSlug: "saas" },
  ];

  // Create parent categories first
  const physicalParent = await prisma.category.upsert({
    where: { slug: "physical" },
    update: {},
    create: { name: "Physical Products", slug: "physical", sicCode: "47910", icon: "📦", description: "Quality physical goods delivered to your door" },
  });
  const digitalParent = await prisma.category.upsert({
    where: { slug: "digital" },
    update: {},
    create: { name: "Digital Products", slug: "digital", sicCode: "58290", icon: "⚡", description: "Instant digital downloads" },
  });
  const saasParent = await prisma.category.upsert({
    where: { slug: "saas" },
    update: {},
    create: { name: "SaaS & Software", slug: "saas", sicCode: "62012", icon: "💻", description: "Powerful software tools" },
  });

  const parentMap: Record<string, string> = {
    physical: physicalParent.id,
    digital: digitalParent.id,
    saas: saasParent.id,
  };

  const categories = [];
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sicCode: cat.sicCode,
        parentId: parentMap[cat.parentSlug],
      },
    });
    categories.push(category);
  }

  console.log(`✅ Created ${categories.length} subcategories`);

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // =====================
  // PRODUCTS
  // =====================
  const products = [
    // Physical products
    {
      name: "Premium Organic Skincare Set",
      slug: "premium-organic-skincare-set",
      description: "A luxurious collection of 5 organic skincare products including cleanser, toner, serum, moisturiser, and eye cream. Made in the UK with certified organic ingredients. Perfect for all skin types.",
      shortDesc: "5-piece organic skincare collection, UK-made with certified ingredients.",
      type: ProductType.PHYSICAL,
      price: 49.99,
      comparePrice: 74.99,
      stock: 150,
      categorySlug: "health-beauty",
      featured: true,
      images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=450&fit=crop"],
      tags: ["skincare", "organic", "beauty", "uk-made"],
    },
    {
      name: "Artisan Coffee Subscription Box",
      slug: "artisan-coffee-subscription-box",
      description: "Discover the world's finest single-origin coffees. Each monthly box contains 3 freshly roasted 250g bags from our curated selection of independent UK roasters. Includes tasting notes and brewing guide.",
      shortDesc: "Monthly box of 3 premium single-origin coffees from UK roasters.",
      type: ProductType.PHYSICAL,
      price: 29.99,
      comparePrice: null,
      stock: 80,
      categorySlug: "food-drink",
      featured: true,
      images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=450&fit=crop"],
      tags: ["coffee", "subscription", "food"],
    },
    {
      name: "Smart Fitness Resistance Band Set",
      slug: "smart-fitness-resistance-band-set",
      description: "Professional-grade resistance band set with 5 levels of resistance (10-50lbs). Includes door anchor, ankle straps, handles, and carry bag. Suitable for strength training, yoga, and physiotherapy.",
      shortDesc: "5-piece professional resistance band set for all fitness levels.",
      type: ProductType.PHYSICAL,
      price: 24.99,
      comparePrice: 39.99,
      stock: 200,
      categorySlug: "sports-fitness",
      featured: false,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=450&fit=crop"],
      tags: ["fitness", "gym", "resistance", "workout"],
    },
    {
      name: "Handmade Soy Wax Candle Collection",
      slug: "handmade-soy-wax-candle-collection",
      description: "Set of 3 hand-poured soy wax candles in unique British-inspired fragrances: English Garden, Scottish Pine, and Welsh Lavender. Each candle burns for 40+ hours. Gift-wrapped in recyclable packaging.",
      shortDesc: "3 hand-poured soy candles in British-inspired scents. Perfect gift.",
      type: ProductType.PHYSICAL,
      price: 34.99,
      comparePrice: null,
      stock: 60,
      categorySlug: "handmade-craft",
      featured: true,
      images: ["https://images.unsplash.com/photo-1602178506150-0c3d44b0e62a?w=600&h=450&fit=crop"],
      tags: ["candles", "handmade", "gift", "soy"],
    },
    {
      name: "Bamboo Desk Organiser Set",
      slug: "bamboo-desk-organiser-set",
      description: "Sustainable bamboo desk organiser with 6 compartments, wireless charging pad, and pen holder. Keeps your workspace tidy and eco-friendly. Suitable for home office or corporate desk.",
      shortDesc: "Eco-friendly bamboo desk organiser with wireless charging.",
      type: ProductType.PHYSICAL,
      price: 44.99,
      comparePrice: 59.99,
      stock: 100,
      categorySlug: "home-living",
      featured: false,
      images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=450&fit=crop"],
      tags: ["desk", "organiser", "bamboo", "eco"],
    },

    // Digital products
    {
      name: "Complete Notion Business OS",
      slug: "complete-notion-business-os",
      description: "A comprehensive Notion workspace system for entrepreneurs and small businesses. Includes CRM tracker, project management, financial dashboard, content calendar, HR hub, and 50+ custom templates. UK-focused with VAT tracking built in.",
      shortDesc: "Complete Notion business system with CRM, finance, HR and 50+ templates.",
      type: ProductType.DIGITAL,
      price: 39.00,
      comparePrice: 79.00,
      stock: 0,
      categorySlug: "templates",
      featured: true,
      images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=450&fit=crop"],
      tags: ["notion", "templates", "business", "productivity"],
    },
    {
      name: "UK Small Business Finance Guide 2024",
      slug: "uk-small-business-finance-guide-2024",
      description: "The definitive 180-page guide to UK small business finance. Covers VAT registration, Corporation Tax, Making Tax Digital, payroll, bookkeeping, and financial planning. Written by a UK chartered accountant. Updated for 2024 tax year.",
      shortDesc: "180-page UK business finance guide by a chartered accountant.",
      type: ProductType.DIGITAL,
      price: 19.99,
      comparePrice: null,
      stock: 0,
      categorySlug: "ebooks-guides",
      featured: true,
      images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=450&fit=crop"],
      tags: ["finance", "uk-business", "tax", "accounting", "ebook"],
    },
    {
      name: "Lightroom Preset Pack — Cinematic UK",
      slug: "lightroom-preset-pack-cinematic-uk",
      description: "50 professional Lightroom presets inspired by British cinema and landscapes. Includes presets for portraits, landscapes, urban photography, and golden hour. Compatible with Lightroom Classic, CC, and mobile. One-click installation guide included.",
      shortDesc: "50 cinematic Lightroom presets for portraits, landscapes, and urban shots.",
      type: ProductType.DIGITAL,
      price: 29.00,
      comparePrice: 49.00,
      stock: 0,
      categorySlug: "photography-presets",
      featured: false,
      images: ["https://images.unsplash.com/photo-1452780212456-957a0ef1cdc5?w=600&h=450&fit=crop"],
      tags: ["lightroom", "presets", "photography", "editing"],
    },
    {
      name: "Social Media Content Kit 2024",
      slug: "social-media-content-kit-2024",
      description: "300+ Canva templates for Instagram, LinkedIn, Facebook, and Twitter. Includes post templates, stories, reels covers, highlights, and carousels. Fully editable with your brand colours and fonts.",
      shortDesc: "300+ Canva templates for all major social platforms.",
      type: ProductType.DIGITAL,
      price: 24.99,
      comparePrice: null,
      stock: 0,
      categorySlug: "templates",
      featured: true,
      images: ["https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=450&fit=crop"],
      tags: ["canva", "social-media", "templates", "instagram"],
    },
    {
      name: "Python for Beginners: UK Developer Path",
      slug: "python-for-beginners-uk-developer-path",
      description: "A complete Python course designed for UK learners. 20 modules, 120+ exercises, and real-world projects. Covers Python basics, data structures, web scraping, automation, and API integration. Certificate of completion included.",
      shortDesc: "20-module Python course with 120+ exercises and real-world UK projects.",
      type: ProductType.DIGITAL,
      price: 59.00,
      comparePrice: 99.00,
      stock: 0,
      categorySlug: "online-courses",
      featured: false,
      images: ["https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=450&fit=crop"],
      tags: ["python", "programming", "course", "beginners"],
    },

    // SaaS products
    {
      name: "Analytics Pro Dashboard",
      slug: "analytics-pro-dashboard",
      description: "A powerful analytics dashboard for SMEs. Connect up to 10 data sources, build custom reports, and share live dashboards with your team. Includes Google Analytics, Stripe, Shopify, and HubSpot integrations.",
      shortDesc: "Multi-source analytics dashboard with 10 integrations for SMEs.",
      type: ProductType.SAAS,
      price: 19.99,
      comparePrice: null,
      stock: 0,
      categorySlug: "analytics-dashboards",
      featured: true,
      images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop"],
      tags: ["analytics", "dashboard", "saas", "reporting"],
    },
    {
      name: "UK CRM for Freelancers",
      slug: "uk-crm-for-freelancers",
      description: "The only CRM built specifically for UK freelancers and contractors. Manage clients, track projects, send invoices with UK VAT, chase payments, and generate Making Tax Digital reports. IR35-aware billing.",
      shortDesc: "CRM and invoicing tool built for UK freelancers with VAT and IR35 support.",
      type: ProductType.SAAS,
      price: 12.00,
      comparePrice: null,
      stock: 0,
      categorySlug: "crm-erp",
      featured: true,
      images: ["https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=450&fit=crop"],
      tags: ["crm", "freelancer", "invoicing", "uk", "vat"],
    },
    {
      name: "AI Chatbot Builder — No Code",
      slug: "ai-chatbot-builder-no-code",
      description: "Build and deploy AI-powered chatbots for your website in minutes. No coding required. Powered by GPT-4, trained on your own documents. Includes live chat handover, analytics, and Slack integration. GDPR-compliant data handling.",
      shortDesc: "No-code AI chatbot builder powered by GPT-4 with GDPR compliance.",
      type: ProductType.SAAS,
      price: 29.00,
      comparePrice: 49.00,
      stock: 0,
      categorySlug: "ai-chatbots",
      featured: true,
      images: ["https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=450&fit=crop"],
      tags: ["ai", "chatbot", "automation", "gpt", "no-code"],
    },
    {
      name: "Next.js E-commerce Starter Theme",
      slug: "nextjs-ecommerce-starter-theme",
      description: "A production-ready Next.js 14 e-commerce theme with Stripe integration, Prisma ORM, Tailwind CSS, and shadcn/ui components. Includes product pages, cart, checkout, admin panel, and dark mode. TypeScript throughout.",
      shortDesc: "Production-ready Next.js 14 e-commerce theme with Stripe and Prisma.",
      type: ProductType.SAAS,
      price: 149.00,
      comparePrice: 249.00,
      stock: 0,
      categorySlug: "website-themes",
      featured: false,
      images: ["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=450&fit=crop"],
      tags: ["nextjs", "ecommerce", "theme", "typescript"],
    },
    {
      name: "SEO Keyword Research API",
      slug: "seo-keyword-research-api",
      description: "Access real-time UK search volume data, keyword difficulty scores, and SERP analysis via REST API. 10,000 requests/month on Pro plan. Includes Python and JavaScript SDKs, webhook support, and CSV export.",
      shortDesc: "UK search volume and keyword API with 10,000 monthly requests.",
      type: ProductType.SAAS,
      price: 39.00,
      comparePrice: null,
      stock: 0,
      categorySlug: "api-developer-tools",
      featured: false,
      images: ["https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=450&fit=crop"],
      tags: ["seo", "api", "keywords", "developer"],
    },
  ];

  for (const p of products) {
    const { categorySlug, ...productData } = p;
    const categoryId = catMap[categorySlug];
    if (!categoryId) {
      console.warn(`Category not found: ${categorySlug}`);
      continue;
    }
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        price: productData.price,
        comparePrice: productData.comparePrice ?? undefined,
        categoryId,
        published: true,
        thumbnailUrl: productData.images[0],
        vatRate: 0.2,
        licenseType: p.type === ProductType.SAAS ? "single" : undefined,
      },
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // =====================
  // COUPONS
  // =====================
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", description: "10% off your first order", discountType: "PERCENTAGE", discountValue: 10, validFrom: new Date(), active: true },
  });
  await prisma.coupon.upsert({
    where: { code: "DIGITAL20" },
    update: {},
    create: { code: "DIGITAL20", description: "20% off digital products", discountType: "PERCENTAGE", discountValue: 20, validFrom: new Date(), active: true },
  });
  await prisma.coupon.upsert({
    where: { code: "SAVE15" },
    update: {},
    create: { code: "SAVE15", description: "£15 off orders over £100", discountType: "FIXED", discountValue: 15, minOrderValue: 100, validFrom: new Date(), active: true },
  });

  console.log("✅ Created 3 coupons");

  // =====================
  // BLOG POSTS
  // =====================
  const blogPosts = [
    { title: "5 Must-Have Digital Tools for UK Freelancers in 2024", slug: "digital-tools-uk-freelancers-2024", excerpt: "From tax management to client communication, here are the essential digital tools every UK freelancer needs.", content: "As a UK freelancer, staying on top of your business is critical. Here are the 5 tools we recommend...", published: true, publishedAt: new Date("2024-01-15"), tags: ["freelancing", "tools", "productivity"] },
    { title: "UK VAT for Digital Products: Everything You Need to Know", slug: "uk-vat-digital-products-guide", excerpt: "Understanding VAT on digital products can be confusing. This comprehensive guide breaks it all down.", content: "UK VAT on digital products is 20% standard rate. Here's everything you need to know about compliance...", published: true, publishedAt: new Date("2024-02-01"), tags: ["vat", "uk", "tax", "digital"] },
    { title: "How to Choose the Right SaaS Tool for Your Business", slug: "choosing-saas-tools-business", excerpt: "With thousands of SaaS options available, how do you pick the right one? Our practical guide helps.", content: "Choosing SaaS software for your UK business requires careful consideration of pricing, integrations, and compliance...", published: true, publishedAt: new Date("2024-03-10"), tags: ["saas", "business", "software"] },
    { title: "Top 10 Lightroom Presets for UK Wedding Photography", slug: "top-lightroom-presets-uk-wedding", excerpt: "Capture the magic of British weddings with these stunning professional presets.", content: "UK weddings have a unique aesthetic. Whether shooting in a country manor or a city hotel, these presets...", published: true, publishedAt: new Date("2024-03-25"), tags: ["photography", "lightroom", "wedding"] },
    { title: "Making Tax Digital: A Simple Guide for Small Businesses", slug: "making-tax-digital-guide-small-business", excerpt: "HMRC's Making Tax Digital is here. Here's what it means for your small business and how to comply.", content: "Making Tax Digital (MTD) is HMRC's initiative to move tax administration online. From April 2026, all VAT-registered businesses...", published: true, publishedAt: new Date("2024-04-05"), tags: ["tax", "hmrc", "mtd", "uk"] },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("✅ Created 5 blog posts");

  console.log("\n🎉 Seeding complete!");
  console.log("Admin credentials: admin@omnicartix.co.uk / Admin@OmniCartix2024");
  console.log("Customer credentials: sarah.thompson@example.co.uk / Customer@123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

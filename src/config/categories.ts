export type ProductType = "PHYSICAL" | "DIGITAL" | "SAAS";

export interface CategoryConfig {
  name: string;
  slug: string;
  icon: string;
  description: string;
  productType: ProductType;
  sicCode: string;
  subcategories: {
    name: string;
    slug: string;
    icon: string;
  }[];
}

export const categories: CategoryConfig[] = [
  {
    name: "Physical Products",
    slug: "physical",
    icon: "📦",
    description: "Quality physical goods delivered to your door",
    productType: "PHYSICAL",
    sicCode: "47910",
    subcategories: [
      { name: "Fashion & Apparel", slug: "fashion-apparel", icon: "👗" },
      { name: "Home & Living", slug: "home-living", icon: "🏠" },
      { name: "Health & Beauty", slug: "health-beauty", icon: "💄" },
      { name: "Electronics & Gadgets", slug: "electronics-gadgets", icon: "📱" },
      { name: "Food & Drink", slug: "food-drink", icon: "🍵" },
      { name: "Sports & Fitness", slug: "sports-fitness", icon: "🏋️" },
      { name: "Toys & Games", slug: "toys-games", icon: "🎮" },
      { name: "Books & Stationery", slug: "books-stationery", icon: "📚" },
      { name: "Pet Products", slug: "pet-products", icon: "🐾" },
      { name: "Handmade & Craft", slug: "handmade-craft", icon: "🎨" },
    ],
  },
  {
    name: "Digital Products",
    slug: "digital",
    icon: "⚡",
    description: "Instant digital downloads — delivered in seconds",
    productType: "DIGITAL",
    sicCode: "58290",
    subcategories: [
      { name: "E-books & Guides", slug: "ebooks-guides", icon: "📖" },
      { name: "Online Courses", slug: "online-courses", icon: "🎓" },
      { name: "Templates", slug: "templates", icon: "📋" },
      { name: "Music & Audio", slug: "music-audio", icon: "🎵" },
      { name: "Photography & Presets", slug: "photography-presets", icon: "📸" },
      { name: "Fonts & Graphics", slug: "fonts-graphics", icon: "✒️" },
      { name: "Printables", slug: "printables", icon: "🖨️" },
      { name: "Plugins & Tools", slug: "plugins-tools", icon: "🔧" },
      { name: "Memberships", slug: "memberships", icon: "⭐" },
      { name: "AI Prompts & Packs", slug: "ai-prompts", icon: "🤖" },
    ],
  },
  {
    name: "SaaS & Software",
    slug: "saas",
    icon: "💻",
    description: "Powerful software tools and SaaS solutions",
    productType: "SAAS",
    sicCode: "62012",
    subcategories: [
      { name: "Custom Software", slug: "custom-software", icon: "⚙️" },
      { name: "SaaS Products", slug: "saas-products", icon: "☁️" },
      { name: "Mobile Apps", slug: "mobile-apps", icon: "📲" },
      { name: "Website Themes", slug: "website-themes", icon: "🎨" },
      { name: "Scripts & Code", slug: "scripts-code", icon: "💾" },
      { name: "CRM & ERP Tools", slug: "crm-erp", icon: "📊" },
      { name: "Analytics Dashboards", slug: "analytics-dashboards", icon: "📈" },
      { name: "AI Chatbots", slug: "ai-chatbots", icon: "🤖" },
      { name: "Browser Extensions", slug: "browser-extensions", icon: "🌐" },
      { name: "API & Developer Tools", slug: "api-developer-tools", icon: "🔌" },
    ],
  },
];

export const allSubcategories = categories.flatMap((cat) =>
  cat.subcategories.map((sub) => ({ ...sub, parentSlug: cat.slug, productType: cat.productType }))
);

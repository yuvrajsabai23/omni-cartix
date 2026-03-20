export const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  products: [
    { label: "Physical Products", href: "/categories/physical" },
    { label: "Digital Downloads", href: "/categories/digital" },
    { label: "SaaS & Software", href: "/categories/saas" },
    { label: "Pricing Plans", href: "/pricing" },
  ],
  support: [
    { label: "Help Centre", href: "/help" },
    { label: "Contact Support", href: "/contact" },
    { label: "Order Tracking", href: "/dashboard/orders" },
    { label: "Returns", href: "/returns" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Returns Policy", href: "/returns" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export const dashboardLinks = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Orders", href: "/dashboard/orders", icon: "ShoppingBag" },
  { label: "Downloads", href: "/dashboard/downloads", icon: "Download" },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: "RefreshCw" },
  { label: "Licenses", href: "/dashboard/licenses", icon: "Key" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
];

export const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Categories", href: "/admin/categories", icon: "Grid3X3" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "S5 Logistics Inc.",
  description: "S5 Logistics, Inc offers seamless and reliable logistics services worldwide, specializing in fast and secure delivery.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Services",
      href: "/user/trucking-services",
    },
    {
      label: "Contact Us",
      href: "/user/contact-us",
    },
    {
      label: "Order Tracking",
      href: "/user/order-tracking",
    },
  ],
  navMenuItems: [
    {
      label: "Login",
      href: "/login",
    },
  ],
};

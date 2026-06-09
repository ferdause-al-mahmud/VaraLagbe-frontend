export const tabs = [
  { key: "dashboard", label: "Dashboard", icon: "view-dashboard-outline" },
  { key: "users", label: "Users", icon: "account-group-outline" },
  { key: "content", label: "Content", icon: "file-document-outline" },
];

export const avatars = {
  admin:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80",
  tanvir:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80",
  maliha:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80",
  nabila:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80",
  asif:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80",
};

export const listings = [
  {
    id: 1,
    title: "Gulshan Premium Duplex",
    owner: "Ahmed Zahid",
    note: "Reported: Misleading photos",
    status: "FLAGGED",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    title: "Studio Near Banani Lake",
    owner: "Nusrat Jahan",
    note: "Submitted: 2 hours ago",
    status: "PENDING REVIEW",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    title: "Modern Condo in Uttara",
    owner: "Karim Uddin",
    note: "42 Views today",
    status: "LIVE",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    title: "Badda Family Apartment",
    owner: "Selina Akter",
    note: "Reported: Duplicate Listing",
    status: "FLAGGED",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
  },
];

export const users = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    role: "PROPERTY OWNER",
    status: "VERIFIED",
    avatar: avatars.tanvir,
    metaTitle: "NID Status",
    metaText: "View NID",
  },
  {
    id: 2,
    name: "Nabila Karim",
    role: "RENTER",
    status: "PENDING",
    avatar: avatars.nabila,
    metaTitle: "NID Verification",
    metaSubtitle: "Submitted 2h ago",
    metaText: "View NID",
  },
  {
    id: 3,
    name: "Asif Rahman",
    role: "PREMIUM HOST",
    status: "VERIFIED",
    avatar: avatars.asif,
    metaTitle: "Account Healthy",
    metaText: "",
  },
];

export const adminSidebarItems = [
  {
    key: "dashboard",
    label: "Overview",
    detail: "Revenue and verification snapshot",
    icon: "view-dashboard-outline",
  },
  {
    key: "users",
    label: "User Management",
    detail: "Review users and NID status",
    icon: "account-group-outline",
  },
  {
    key: "content",
    label: "Content Moderation",
    detail: "Approve, edit, or flag listings",
    icon: "file-document-outline",
  },
];

export const adminUtilityItems = [
  { icon: "shield-check-outline", label: "Verification Queue" },
  { icon: "home-city-outline", label: "All Listings" },
  { icon: "chart-box-outline", label: "Reports" },
  { icon: "cog-outline", label: "Settings" },
];

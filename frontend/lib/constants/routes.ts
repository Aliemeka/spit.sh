export const marketingRoutes = {
  home: "/",
  about: "/about",
  pricing: "/pricing",
  terms: "/legal/terms",
  privacy: "/legal/privacy",
};

export const authRoutes = {
  signIn: "/signin",
  verify: "/verify",
};

export const onboardingRoutes = {
  index: "/onboarding",
  welcome: "/onboarding/welcome",
  createProject: "/onboarding/create-workspace",
};

export const dashboardRoutes = {
  home: "/dashboard",
  links: "/dashboard/links",
  domains: "/dashboard/domains",
  analytics: (linkId?: string) =>
    `/dashboard/analytics${linkId ? `?linkId=${linkId}` : ""}`,
  pages: "/dashboard/pages",
  settings: "/dashboard/settings",
  billing: "/dashboard/settings/billing",
};

export const linkRoutes = {
  newLink: "/dashboard/links?action=new_link",
  linkDetails: (linkId: string) => `/dashboard/links/${linkId}`,
};

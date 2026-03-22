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
  project: (slug: string) => `/dashboard/${slug}`,
  links: (slug: string) => `/dashboard/${slug}/links`,
  domains: (slug: string) => `/dashboard/${slug}/domains`,
  analytics: (slug: string) => `/dashboard/${slug}/analytics`,
  pages: (slug: string) => `/dashboard/${slug}/pages`,
  settings: (slug: string) => `/dashboard/${slug}/settings`,
};

export const linkRoutes = {
  newLink: (slug: string) => `/dashboard/${slug}/links?action=new_link`,
  linkDetails: (projectSlug: string, linkId: string) =>
    `/dashboard/${projectSlug}/links/${linkId}`,
};

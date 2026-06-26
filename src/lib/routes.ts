export const routes = {
  marketing: {
    home: "/",
  },
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },
  onboarding: "/onboarding",
  user: {
    home: "/app",
    challenges: "/app/challenges",
    myChallenges: "/app/my-challenges",
    favorites: "/app/favorites",
    rewards: "/app/rewards",
    challengeDetail: (id: string) => `/app/challenges/${id}`,
    map: "/app/map",
    profile: "/app/profile",
    coins: "/app/coins",
    coinsHistory: "/app/coins/history",
  },
  brand: {
    dashboard: "/brand",
    challenges: "/brand/challenges",
    newChallenge: "/brand/challenges/new",
    analytics: "/brand/analytics",
    rewards: "/brand/rewards",
    scanner: "/brand/scanner",
    scanResult: "/brand/scan-result",
    preview: "/brand/preview",
  },
} as const;

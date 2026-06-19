export const routes = {
  marketing: {
    home: "/",
  },
  user: {
    home: "/app",
    challenges: "/app/challenges",
    challengeDetail: (id: string) => `/app/challenges/${id}`,
    activeChallenge: "/app/active-challenge",
    map: "/app/map",
    profile: "/app/profile",
    coins: "/app/coins",
    reward: "/app/reward",
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

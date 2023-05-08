module.exports = {
  ci: {
    collect: {
      startServerCommand: 'NODE_ENV=production npm run start',
      url: [process.env.VERCEL_URL ?? 'http://localhost:3000'],
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

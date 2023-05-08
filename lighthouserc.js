module.exports = {
  ci: {
    collect: {
      startServerCommand: 'NODE_ENV=production npm run start',
      url: [
        'https://podopieczni-21142.vercel.app/',
        'https://podopieczni-dev.vercel.app/',
        'http://localhost:3000',
      ],
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

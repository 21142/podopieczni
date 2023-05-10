module.exports = {
  ci: {
    collect: {
      url: [
        'https://podopieczni-21142.vercel.app/',
        'https://podopieczni-dev.vercel.app/',
      ],
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

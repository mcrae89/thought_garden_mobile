import 'dotenv/config';

export default {
  expo: {
    name: "ThoughtGarden",
    slug: "thoughtgarden",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_BASE_URL,
    },
  },
};

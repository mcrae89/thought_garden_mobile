import 'dotenv/config';

export default {
  expo: {
    name: "Thought Garden",
    slug: "thought-garden",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};

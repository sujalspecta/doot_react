const config = {
  API_URL: "http://localhost:3000/",
  AUTH_BACKEND: "Dummy",
  FIRE_BASE: {
    API_KEY: import.meta.env.VITE_APP_APIKEY,
    AUTH_DOMAIN: import.meta.env.VITE_APP_AUTHDOMAIN,
    DATABASEURL: import.meta.env.VITE_APP_DATABASEURL,
    PROJECTID: import.meta.env.VITE_APP_PROJECTID,
    STORAGEBUCKET: import.meta.env.VITE_APP_STORAGEBUCKET,
    MESSAGINGSENDERID: import.meta.env.VITE_APP_MESSAGINGSENDERID,
    APPID: import.meta.env.VITE_APP_APPID,
    MEASUREMENTID: import.meta.env.VITE_APP_MEASUREMENTID,
  },
  GOOGLE: {
    API_KEY: import.meta.env.VITE_APP_GOOGLE_API_KEY,
    CLIENT_ID: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
    SECRET: import.meta.env.VITE_APP_GOOGLE_SECRET_KEY,
  },
  FACEBOOK: {
    APP_ID: import.meta.env.VITE_APP_FACEBOOK_APP_ID,
  },
};

export default config;

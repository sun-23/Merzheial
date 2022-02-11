import 'dotenv/config';

export default {
  expo: {
    name: 'Merzheial',
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "Allow Merzheial to access your photos",
          cameraPermission: "Allow Merzheial to access your camera"
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffffff",
        }
      ]
    ],
    slug: 'merzheial',
    privacy: 'public',
    platforms: ['ios', 'android'],
    version: '0.15.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/icon.png',
      resizeMode: 'cover',
      backgroundColor: '#F57C00'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
};

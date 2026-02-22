const config = require('./app.json');

module.exports = ({ config: appConfig }) => ({
  ...config.expo,
  extra: {
    ...((appConfig && appConfig.extra) || {}),
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
  }
});

const config = require('./app.json');

module.exports = ({ config: appConfig }) => ({
  ...config.expo,
  extra: {
    ...((appConfig && appConfig.extra) || {}),
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  }
});

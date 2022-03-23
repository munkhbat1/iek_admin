const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  let domains = ['img.youtube.com']
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    domains = [...domains, 'localhost']
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  }

  return {
    reactStrictMode: true,
    images: {
      domains,
    }
  }
}

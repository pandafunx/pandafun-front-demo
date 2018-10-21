const APIV1 = '/api'
const APIV2 = '/apiv2'

module.exports = {
  name: 'name',
  prefix: 'prifix',
  footerText: 'footer ',
  logo: '/logo.png',
  CORS: [],
  openPages: ['/login','/register'],
  apiPrefix: '/api',
  APIV1,
  APIV2,
  amount:0.025,
  api: {
    userLogin: `${APIV1}/web/doAuthLoginOrRegister`,
    eosBalance: `${APIV1}/homeland/currency`,// eos余额
  },
}

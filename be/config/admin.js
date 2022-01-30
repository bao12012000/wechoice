module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '83e6869e38912bf130018d071a02aeea'),
  },
});

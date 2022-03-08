module.exports = {
  server: {
    port: 3001,
  },
  crypto: {
    keysSuffix: '_test',
  },
  secrets: {
    jwtKey: 'ab035b0e0b8853584c3e9fac6735eb00',
    keyid: '123',
    db: {
      connString: 'postgresql://postgresdev:postgresdev@localhost:5432/auth_service_test',
    },
  },
}

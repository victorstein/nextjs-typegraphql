const http = require('http')

const options = {
  host: process.env.URL || 'localhost',
  port: process.env.PORT || '3000',
  path: '/api/graphql',
  timeout: 2000
}

const request = http.request(options, (res) => {
  if (res.statusCode === 400) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on('error', function () {
  process.exit(1)
})

request.end()

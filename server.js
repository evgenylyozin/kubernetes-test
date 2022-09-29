const http = require('http')
const os = require('os')

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.write(`Hello from ${os.hostname()}!`)
    return res.end()
  }
})

server.listen(8081)

server.on('listening', () => {
  console.log('Server is listening on port 8081')
})

server.on('error', (error) => {
  console.log(
    'Error: \n',
    '____________________\n',
    error.message,
    '____________________\n'
  )
})

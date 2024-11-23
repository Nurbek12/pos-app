import path from 'path'
import cors from 'cors'
import routes from './routes'
import express from 'express'
import { createServer } from 'http'
import { PORT, HOST } from './config/keys'

const app = express()
const server = createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../upload')))
app.use(express.static(path.join(__dirname, '../../client/dist')))

app.use('/api', routes)
app.get('*', async (_, res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')))

server.listen(PORT, HOST as any, () => console.log('server started...'))

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});
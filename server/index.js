import express from 'express'
import { processFile } from './file.js';
import multer from 'multer';
import http from 'http'
import { Server } from 'socket.io';
import { socketServer } from './socket.js'

const app = express()
const upload = multer()

const server = http.createServer(app)

const socketIo = new Server(server, {
    cors: {
        origin: '*'
    },
    maxHttpBufferSize: 1e8 * 100
})

socketServer(socketIo)

//app.post('/test', upload.single('file'), processFile)

server.listen(3000, () => {
    console.log('Server Listening on 3000');
})
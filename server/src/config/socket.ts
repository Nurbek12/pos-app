import { Server } from "socket.io"

export default (io: Server) => io.on('connection', socket => {
    socket.on('create-order', (data) => {
        io.emit('order-created', data)
    })
    socket.on('complete-order', (data, index) => {
        io.emit('order-completed', data, index)
    })
})
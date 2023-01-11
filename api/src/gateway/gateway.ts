import { OnModuleInit } from '@nestjs/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: ['https://chat-web-delta.vercel.app', 'http://localhost:3000'],
    credentials: true,
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id)
      console.log('Connected')
    })
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body)
    this.server.emit('onMessage', body)
  }
}

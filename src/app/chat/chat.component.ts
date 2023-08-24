import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  public message: string = '';
  public messages: Array<{ text: string; fromMe: boolean }> = [];
  public socketId: string = '';

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.getSocketId().subscribe((data) => {
      this.socketId = data.id;
    });

    this.socketService.listen('chat message').subscribe((data) => {
      const message = {
        text: data.text,
        fromMe: this.socketId === data.id,
      };
      this.messages.push(message);
    });
  }

  send(): void {
    if (this.message.trim()) {
      const message = { text: this.message.trim(), id: this.socketId };
      this.socketService.emit('chat message', message);
      // this.messages.push({ text: this.message.trim(), fromMe: true });
      this.message = '';
    }
  }
}

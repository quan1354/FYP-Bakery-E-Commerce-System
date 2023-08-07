import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';


interface MessageModel {
  user: number;
  type: 'in' | 'out';
  text: any;
  time: string;
  template?: boolean;
}


interface UserInfoModel {
  initials?: {
    label: string;
    state: 'warning' | 'danger' | 'primary' | 'success' | 'info';
  };
  name: string;
  avatar?: string;
  email: string;
  online: boolean;
}

const defaultUserInfos: Array<UserInfoModel> = [
  {
    name: 'You',
    avatar: '../../../../../assets/media/icons/duotune/communication/com006.svg',
    email: 'max@kt.com',
    online: false,
  },
  {
    name: 'Mr.bot',
    avatar: '../../../../../assets/bakery/baymax.png',
    email: 'brian@exchange.com',
    online: false,
  },
];

@Component({
  selector: 'app-chat-inner',
  templateUrl: './chat-inner.component.html',
})
export class ChatInnerComponent implements OnInit, AfterViewChecked {
  @Input() isDrawer: boolean = false;
  @HostBinding('class') class = 'card-body';
  @HostBinding('id') id = this.isDrawer
    ? 'kt_drawer_chat_messenger_body'
    : 'kt_chat_messenger_body';
  @ViewChild('messageInput', { static: true })
  messageInput: ElementRef<HTMLTextAreaElement>;
  @ViewChild('scrollMe')
  private myScrollContainer: ElementRef;

  private messages$: BehaviorSubject<Array<MessageModel>> = new BehaviorSubject<
    Array<MessageModel>>([]);
  messagesObs: Observable<Array<MessageModel>>;

  constructor(private chatServie: ChatService) {
    this.messagesObs = this.messages$.asObservable();
  }

  submitMessage(): void {
    const text = this.messageInput.nativeElement.value;
    const newMessage: MessageModel = {
      user: 0,
      type: 'out',
      text,
      time: 'Just now',
    };
    this.addMessage(newMessage);
    this.generateResponse(text)
    this.messageInput.nativeElement.value = '';
  }

  addMessage(newMessage: MessageModel): void {
    const messages = [...this.messages$.value];
    messages.push(newMessage);
    this.messages$.next(messages);
  }

  getUser(user: number): UserInfoModel {
    return defaultUserInfos[user];
  }

  getMessageCssClass(message: MessageModel): string {
    return `p-5 rounded text-dark fw-bold mw-lg-400px bg-light-${
      message.type === 'in' ? 'info' : 'primary'
    } text-${message.type === 'in' ? 'start' : 'end'}`;
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.generateResponse('Hi')
  }
  generateResponse(text:string){
    let responder: MessageModel = {
      user: 1,
      type: 'in',
      text: '',
      time: 'Just now',
    };
    this.chatServie.generateAnswer(text).subscribe((response) => {
      responder.text = response.answer;
    });
    setTimeout(() => {
      this.addMessage(responder);
    }, 2000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface UIChat{
  "question":string
  "answer":string
}

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  constructor(private httpClient: HttpClient) { }

  generateAnswer(text:string):Observable<UIChat>{
    let formData = new FormData
    formData.append("question", text)
    return this.httpClient.post<UIChat>('http://127.0.0.1:5002/answer', formData)
  }
}

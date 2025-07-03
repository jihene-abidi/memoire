import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root",
})
export class InteractionCvApi { 
  public interactionCvUrl = "/interactionCv";
  constructor(private http: HttpClient) {}

  updateModel(id: string, question:string) {
    return this.http.post(`http://127.0.0.1:5000/cv-chat/${id}`, {'question': question}).toPromise();
  }

  start(id: string) {
    return this.http.post(`http://127.0.0.1:5000/start`,{'application_id': id}).toPromise();
  }
  handle(id: string, answer:string) {
    return this.http.post(`http://127.0.0.1:5000/answer`, {'application_id': id,'answer': answer}).toPromise();
  }
}
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

}
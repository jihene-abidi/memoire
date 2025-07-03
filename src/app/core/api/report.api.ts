
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportAPI {
    private rapportUrl = "http://127.0.0.1:5000";

  constructor(private http: HttpClient) {}

  generate(candidateId: string): Observable<any> {
    return this.http.post<any>(`${this.rapportUrl}/generate-report`, {
      application_id: candidateId
    });
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportAPI {
    private rapportUrl = '';

  constructor(private http: HttpClient) {}

  generate(candidateId: string): Observable<{ report_s3: string }> {
    return this.http.post<{ report_s3: string }>(`${this.rapportUrl}/generate-report`, {
      candidate_id: candidateId
    });
  }


}
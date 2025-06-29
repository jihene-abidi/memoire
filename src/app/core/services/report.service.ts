import { Injectable } from '@angular/core';
import { ReportAPI } from '../api/report.api';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private reportApi: ReportAPI
  ) {}

  downloadReport(candidateId: string): Observable<any> {
    return this.reportApi.generate(candidateId) 
  }
}
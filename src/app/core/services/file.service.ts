import {Injectable} from '@angular/core';
import {FileAPI} from '../api/file.api';
import {
  async,
  catchError,
  concatMap,
  defer,
  EMPTY,
  forkJoin,
  from,
  Observable,
  of,
  reduce,
  switchMap,
  throwError
} from 'rxjs';
import {UserService} from './user';
import {FileModel} from '../models/file';
import {map} from "rxjs/operators";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import axios from "axios"; //facilite les appels HTTP utilisée pour communiquer avec des API REST
import {CvConstants} from "../../components/client/cv/cv.constants";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


@Injectable({
  providedIn: 'root',
})
export class FileService {
  cvConstants = CvConstants;
  constructor(
    private fileApi: FileAPI,
    private userService: UserService
  ) {
  }

  add(file: FileModel) {
    return this.fileApi.add(file);
  }

  findOne(id: string): Observable<FileModel> {
    return this.fileApi.findOne(id);
  }

  checkUrlAws(url: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      axios({
        url: url,
        method: "GET",
        responseType: "blob",
      })
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(() => {
          observer.next(false);
          observer.complete();
        });
    });
  }



extractTextFromPDF(file: any): Observable<string> {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "assets/pdf.worker.min.mjs";
  return defer(() => {
    const reader = new FileReader();

    return new Observable<string>((observer) => {
      if (file.type !== 'application/pdf') {
        observer.error(this.cvConstants.ERROR_INVALID_PDF);
        return;
      }

      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        if (!arrayBuffer) {
          observer.error(this.cvConstants.ERROR_CANNOT_READ_FILE);
          return;
        }

        try {
          const pdfPromise = pdfjsLib.getDocument({ data: arrayBuffer }).promise;

          from(pdfPromise).pipe(
            switchMap((pdf) => {
              const pageTexts$: Observable<string>[] = [];
              for (let i = 0; i < pdf.numPages; i++) {
                pageTexts$.push(
                  from(pdf.getPage(i + 1)).pipe(
                    switchMap((page) =>
                      from(page.getTextContent()).pipe(
                        map((textContent) => {
                          const pageText = textContent.items
                            .map((item: any) => item.str)
                            .join(' ')
                            .trim();
                          return pageText || '[page vide]';
                        })
                      )
                    ),
                    catchError(() => of('[erreur page]'))
                  )
                );
              }
              return forkJoin(pageTexts$).pipe(
                map((pages) => pages.join('\n'))
              );
            }),
            catchError((error) => {
              observer.error(this.cvConstants.ERROR_TEXT_EXTRACTION);
              return EMPTY;
            })
          ).subscribe({
            next: (text) => {
              observer.next(text);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
        } catch (error) {
          observer.error(this.cvConstants.ERROR_PDF_INITIALIZATION);
        }
      };

      reader.onerror = () => observer.error(this.cvConstants.ERROR_FILE_READING);
      reader.readAsArrayBuffer(file);
    });
  });
}


}
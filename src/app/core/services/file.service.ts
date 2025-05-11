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
// import * as pdfjsLib from "pdfjs-dist"; // biblio pour lire, analyser et afficher des fichiers PDF
import axios from "axios"; //facilite les appels HTTP utilisée pour communiquer avec des API REST
import {CvConstants} from "../../components/client/cv/cv.constants";
//pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


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

  // showFile(fileId: string): Observable<{ source: string; name: string }> {
  //   return new Observable<{ source: string; name: string }>((observer) => {

  //     this.awsFile(fileId)
  //       .pipe(
  //         switchMap((result) => {

  //           return this.checkUrlAws(result.source).pipe(
  //             map((isValidUrl) => {

  //               if (isValidUrl) {
  //                 return result;
  //               } else {
  //                 throw new Error(this.cvConstants.FILE_NOT_FOUND);
  //               }
  //             })
  //           );
  //         })
  //       )
  //       .subscribe({
  //         next: (result) => {
  //           observer.next(result);
  //           observer.complete();
  //         },
  //         error: (error) => {
  //           console.error(this.cvConstants.SHOW_FILE_ERROR, error);
  //           observer.error(error);
  //         },
  //       });
  //   });
  // }


  // awsFile(fileId: string): Observable<{ source: string; name: string }> {
  //   let result: { source: string; name: string } = { source: '', name: '' };

  //   return from(this.fileApi.findOne(fileId)).pipe(
  //     switchMap((file) => {
  //       if (!file) {
  //         throw new Error(this.cvConstants.FILE_NOT_FOUND);
  //       }

  //       if (!file.path) {
  //         throw new Error(this.cvConstants.ERROR_FILE_PATH);
  //       }


  //       const pathParts = file.path.split('/');
  //       const level = pathParts[0];
  //       const filePath = file.path.slice(level.length + 1);



  //       if (!file.hash) {
  //         throw new Error(this.cvConstants.ERROR_FILE_HASH);
  //       }

        // return this.amplifyService.getFile(file.hash, filePath).pipe(
        //   map((awsFile) => {
        //     const fileName = file.name ?? 'Unknown File';
        //     return { awsFile, fileName };
        //   })
        // );
  //     }),
  //     switchMap(({ awsFile, fileName }) => {
  //       result = {
  //         source: awsFile,
  //         name: fileName,
  //       };
  //       return of(result);
  //     }),
  //     catchError((err) => {
  //       console.error(err);
  //       return of({ source: '', name: '' });
  //     })
  //   );
  // }

  // ngOnUpload(event: File, type?: string): Observable<string | null> {
  //   const user = this.userService.getCurrentUser()._id;
  //   if (!user) {
  //     return throwError(() => new Error('User not authenticated'));
  //   }

  //   const allowedTypes = ['.pdf', '.doc', '.docx'];
  //   const fileExtension = event.name?.substring(event.name?.lastIndexOf('.')).toLowerCase();

  //   if (!allowedTypes.includes(fileExtension)) {

  //     return throwError(() => new Error(this.cvConstants.ERROR_FILE_TYPE));
  //   }

  //   const selectedFile = new FileModel();
  //   selectedFile.name = event.name;
  //   selectedFile.owner._id = user;
  //   selectedFile.type = type || "";

    // return this.amplifyService.upload(event).pipe(
    //   switchMap((fileAws: any) => {
    //     const blobType = selectedFile.name?.substring(selectedFile.name?.lastIndexOf('.'), selectedFile.name?.length);
    //     selectedFile.path = fileAws.path;

    //     let fileType = blobType;
    //     if (blobType === '.DOCX') {
    //       fileType = '.docx';
    //     } else if (blobType === '.PDF') {
    //       fileType = '.pdf';
    //     } else if (blobType === '.DOC') {
    //       fileType = '.doc';
    //     }

    //     selectedFile.hash = fileAws.fileHash + fileType;
    //     selectedFile.type = fileType;

    //     if (fileType === '.pdf') {
    //       return this.extractTextFromPDF(event).pipe(
    //         switchMap((extractedText: string) => {
    //           selectedFile.context = extractedText;
    //           return this.fileApi.add(selectedFile).pipe(
    //             switchMap((file) => {
    //               return file._id ? from([file._id]) : throwError(() => new Error(this.cvConstants.ERROR_FILE_UPLOAD));
    //             })
    //           );
    //         }),
    //         catchError((error) => {
    //           return throwError(() => new Error(this.cvConstants.ERROR_PDF_TEXT));
    //         })
    //       );
    //     }

    //     return this.fileApi.add(selectedFile).pipe(
    //       switchMap((file) => {
    //         return file._id ? from([file._id]) : throwError(() => new Error(this.cvConstants.ERROR_FILE_UPLOAD));
    //       })
    //     );
    //   }),
    //   catchError((error) => {
    //     return throwError(() => error);
    //   })
    // );
  }


  // extractTextFromPDF(file: any): Observable<string> {
  //   return defer(() => {
  //     const reader = new FileReader();

  //     return new Observable<string>((observer) => {
  //       if (file.type !== 'application/pdf') {
  //         observer.error(this.cvConstants.ERROR_INVALID_PDF);
  //         return;
  //       }

  //       reader.onload = () => {
  //         const arrayBuffer = reader.result as ArrayBuffer;
  //         if (!arrayBuffer) {
  //           observer.error(this.cvConstants.ERROR_CANNOT_READ_FILE);
  //           return;
  //         }

  //         try {
  //           const pdfPromise = pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  //           from(pdfPromise).pipe(
  //             switchMap((pdf) => {
  //               const pageTexts$: Observable<string>[] = [];
  //               for (let i = 0; i < pdf.numPages; i++) {
  //                 pageTexts$.push(
  //                   from(pdf.getPage(i + 1)).pipe(
  //                     switchMap((page) =>
  //                       from(page.getTextContent()).pipe(
  //                         map((textContent) => {
  //                           const pageText = textContent.items
  //                             .map((item: any) => item.str)
  //                             .join(' ')
  //                             .trim();
  //                           return pageText || '[page vide]';
  //                         })
  //                       )
  //                     ),
  //                     catchError(() => of('[erreur page]'))
  //                   )
  //                 );
  //               }
  //               return forkJoin(pageTexts$).pipe(
  //                 map((pages) => pages.join('\n'))
  //               );
  //             }),
  //             catchError((error) => {
  //               observer.error(this.cvConstants.ERROR_TEXT_EXTRACTION);
  //               return EMPTY;
  //             })
  //           ).subscribe({
  //             next: (text) => {
  //               observer.next(text);
  //               observer.complete();
  //             },
  //             error: (error) => observer.error(error),
  //           });
  //         } catch (error) {
  //           observer.error(this.cvConstants.ERROR_PDF_INITIALIZATION);
  //         }
  //       };

  //       reader.onerror = () => observer.error(this.cvConstants.ERROR_FILE_READING);
  //       reader.readAsArrayBuffer(file);
  //     });
  //   });
  // }


//}

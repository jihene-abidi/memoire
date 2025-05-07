import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {SharedDialogComponent} from "../../shared/confirmation-dialog/shared-dialog.component";
import {Shared_dialogConstant} from "../../shared/confirmation-dialog/shared-dialog.constants";
import { TranslateService } from '@ngx-translate/core';

export interface DialogResult {
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog,private translate: TranslateService) {}

  openDialog(actionType: 'delete' | 'update' | 'custom'): Observable<DialogResult> {
    const dialogData = this.getDialogData(actionType);

    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    return dialogRef.afterClosed();
  }

  private getDialogData(actionType: 'delete' | 'update' | 'custom') {
    switch (actionType) {
      case 'delete':
        return {
          actionType,
          title: this.translate.instant(Shared_dialogConstant.DELETE_TITLE),
          message: this.translate.instant(Shared_dialogConstant.DELETE_MESSAGE),
          actionButtonText: this.translate.instant(Shared_dialogConstant.DELETE),

          actionButtonColor: Shared_dialogConstant.BUTTON_COLOR_DELETE,
        };
      case 'update':
        return {
          actionType,
          title: this.translate.instant(Shared_dialogConstant.UPDATE_TITLE),
          message: this.translate.instant(Shared_dialogConstant.UPDATE_MESSAGE),
          actionButtonText: this.translate.instant(Shared_dialogConstant.UPDATE),
          actionButtonColor: Shared_dialogConstant.BUTTON_COLOR_UPDATE,
        };
      case 'custom':
        return {
          actionType,
          title: this.translate.instant(Shared_dialogConstant.CUSTOM_TITLE),
          message: this.translate.instant(Shared_dialogConstant.CUSTOM_MESSAGE),
          actionButtonText: Shared_dialogConstant.CUSTOM,
          actionButtonColor: Shared_dialogConstant.BUTTON_COLOR_CUSTOM,
        };
      default:
        return {
          
          title: this.translate.instant(Shared_dialogConstant.TITLE_DEFAULT),
          message: this.translate.instant(Shared_dialogConstant.MESSAGE_DEFAULT),
        };
    }
  }
}

import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { deleteChatConstant, errorMessages } from './delete-chat.constants';
import {TranslatePipe} from "@ngx-translate/core";


interface DialogData {
  chatIndex?: number;
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-delete-chat',
  standalone: true,
  imports: [MatDialogModule,TranslatePipe],
  templateUrl: './delete-chat.component.html',
  styleUrl: './delete-chat.component.css'
})
export class DeleteChatComponent {
  deleteChatConstant = deleteChatConstant;
  errorMessages = errorMessages;
  dialogTitle: string;
  dialogMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteChatComponent>, 
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogTitle = data.title || deleteChatConstant.DIALOG_TITLE;
    this.dialogMessage = data.message || deleteChatConstant.DIALOG_TEXT;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm'); 
  }
  
  deleteChat(): boolean {
    return true;
  }
}
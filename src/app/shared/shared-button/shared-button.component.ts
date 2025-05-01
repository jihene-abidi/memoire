import {booleanAttribute, Component, EventEmitter, Input, Output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {NgClass} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'app-shared-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgClass,TranslatePipe],
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.css'],
})
export class SharedButtonComponent {
  @Input() label: string = '';
  @Input() icon: string | null = null;
  @Input() color: 'primary' |'warn' | 'updated'| 'delete' |'edit' | 'CVS'| 'ContactSubmit'|'add'|'cancel' = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input({transform: booleanAttribute}) isDeleteButton: boolean = false;
  @Input({transform: booleanAttribute}) isEditButton: boolean = false;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}

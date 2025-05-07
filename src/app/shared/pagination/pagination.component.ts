import { Component, Input } from '@angular/core';
import {MatOption, MatSelect} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {NgForOf} from "@angular/common";
import {PaginationConstant} from "./pagination.constants";


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  imports: [
    MatSelect,
    MatOption,
    MatIcon,
    NgForOf
  ],
  standalone: true
})
export class PaginationComponent {
  @Input() totalItems: number =0;
  @Input() pageSizeOptions: number[] = [6, 10, 20];
  pageSize: number = 6;
  currentPage: number = 1;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      console.log(`Navigated to page ${page}`);
    }
  }

  changePageSize(event: any): void {
    this.pageSize = event.value;
    this.currentPage = 1;
    console.log(`Page size changed to ${this.pageSize}`);
  }

  protected readonly PaginationConstant = PaginationConstant;
}

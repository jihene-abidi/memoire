import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-phone-dial',
  standalone: true,
  templateUrl: './phone-dial.component.html',

})
export class PhoneDialComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {

  }
  showPopup = false;
  messageHandler = (event: MessageEvent) => {
    if (event.data?.type === 'twilioCallDisconnected') {

      this.showPopup = true;
      setTimeout(() => {
        this.router.navigate(['/client/joboffer']);
      }, 2000);

    }
  };

  ngOnInit() {
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.messageHandler);
  }

  closePopup() {
    this.showPopup = false;
  }
}
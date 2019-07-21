import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { WebNotificationService } from './shared/web-notification.service';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isEnabled = false;
  permission = Notification.permission;

  constructor(
    private swUpdate: SwUpdate,
    private webNotificationService: WebNotificationService
  ) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((evt) => {
        const updateApp = window.confirm(`
          Ein Update ist verfügbar (${evt.current.appData['version']} => ${evt.available.appData['version']}).
          Änderungen: ${evt.current.appData['changelog']}
          Wollen Sie das Update jetzt installieren?
        `);
        if (updateApp) { window.location.reload(); }
      });
    }
    this.isEnabled = this.webNotificationService.isEnabled;
  }

  submitNotification() {
    this.webNotificationService.subscribeToNotifications()
      .then(() => this.permission = Notification.permission);
  }
}

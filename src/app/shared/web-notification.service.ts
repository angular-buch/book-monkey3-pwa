import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BGk2Rx3DEjXdRv9qP8aKrypFoNjISAZ54l-3V05xpPOV-5ZQJvVH9OB9Rz5Ug7H_qH6CEr40f4Pi3DpjzYLbfCA';
  private baseUrl = 'https://api3.angular-buch.com/notifications';

  constructor(
    private http: HttpClient,
    private swPush: SwPush
  ) {
    this.swPush.notificationClicks.subscribe(event => {
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
  }

  get isEnabled() {
    return this.swPush.isEnabled;
  }

  subscribeToNotifications(): Promise<any> {
    return this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => this.sendToServer(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));
  }

  private sendToServer(params: PushSubscriptionJSON) {
    this.http.post(this.baseUrl, params).subscribe();
  }
}

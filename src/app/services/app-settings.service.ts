import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppSettingsService {
  apiEndpoint: string;

  constructor(private httpClient: HttpClient) {}

  public loadSettings(): Promise<any> {
    return this.httpClient.get('./assets/appSettingsDev.json')
      .toPromise()
      .then(res => this.apiEndpoint = res['apiEndpoint']);
  }
}

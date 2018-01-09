import { Injectable } from '@angular/core';

@Injectable()
export class SplitsService {

  constructor() { }

  splits: Array<string> = [
    "Bägge",
    "Bara Marie",
    "Bara Samuel",
    "Marie Autogiro",
    "Samuel Autogiro",
    "Betalt av Marie, ska delas",
    "Betalt av Samuel, ska delas",
    "Överföring Marie till Samuel",
    "Överföring Samuel till Marie"
  ]
}

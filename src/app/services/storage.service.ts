import { Injectable } from '@angular/core';
import { IGameRecord } from '../models/igame-record';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storageKey = 'gameRecords';
  gameRecords!: IGameRecord[];

  constructor() {
    try {
      let records = localStorage.getItem(this._storageKey);
      if (!records) this.gameRecords = [];
      else {
        this.gameRecords = JSON.parse(records);
      }
    } catch (error) {
      console.error('Error reading game records:', error);
      this.gameRecords = [];
    }
  }

  addRecord(record: IGameRecord) {
    this.gameRecords.push(record);
    this.saveRecords();
  }

  saveRecords() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this.gameRecords));
    } catch (error) {
      console.error('Error writing game records:', error);
    }
  }
}

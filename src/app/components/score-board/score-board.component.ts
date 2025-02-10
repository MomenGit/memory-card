import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IGameRecord } from '../../models/igame-record';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-score-board',
  imports: [DatePipe],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.css',
})
export class ScoreBoardComponent implements OnInit {
  private _storageService = inject(StorageService);
  gameRecords!: IGameRecord[];

  ngOnInit(): void {
    if (this._storageService.gameRecords.length > 5)
      this.gameRecords = this._storageService.gameRecords.slice(-5);
    else this.gameRecords = this._storageService.gameRecords;
    this.gameRecords.reverse();
  }
}

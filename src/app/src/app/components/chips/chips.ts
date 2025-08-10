import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chip } from '../../../../interfaces';
import { CommonModule } from '@angular/common';
import { sliceText } from '../../../../utils';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chips.html',
})
export class Chips {
  @Input({ required: true }) items: Chip[] = [];
  @Output() remove = new EventEmitter<number>();

  readonly sliceText = sliceText;
}

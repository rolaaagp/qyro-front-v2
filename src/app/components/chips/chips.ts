import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sliceText } from '@utils/text-utils';
import { Chip } from '@interfaces/chip.interface';

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

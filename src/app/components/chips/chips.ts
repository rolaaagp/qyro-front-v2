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
  @Input() selectedId: number | null = null;
  @Output() remove = new EventEmitter<number>();
  @Output() select = new EventEmitter<number | null>();

  readonly sliceText = sliceText;

  get textSelected(): string {
    return this.items.find((c) => c.id === this.selectedId)?.title || '';
  }

  toggleSelect(id: number) {
    this.select.emit(this.selectedId === id ? null : id);
  }
}

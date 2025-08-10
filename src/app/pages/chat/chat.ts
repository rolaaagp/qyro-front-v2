import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Chip } from '../../interfaces';
import { Chips } from '../../src/app/components/chips/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [Chips, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat {
  chipsControl = new FormControl<Chip[]>(
    [
      { id: 1, title: 'Hello' },
      { id: 2, title: 'Test' },
    ],
    { nonNullable: true },
  );

  onRemoveChip(id: number) {
    this.chipsControl.setValue(
      this.chipsControl.value.filter((c) => c.id !== id),
    );
  }
}

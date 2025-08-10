import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chips } from '@components/chips/chips';
import { Chip } from '@interfaces/chip.interface';

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
    { nonNullable: true }
  );

  onRemoveChip(id: number) {
    this.chipsControl.setValue(
      this.chipsControl.value.filter((c) => c.id !== id)
    );
  }
}

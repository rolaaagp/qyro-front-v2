import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@components/sidebar/sidebar';

@Component({
  selector: 'app-main-comp',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  onSidebarWidth(_: string) {}
}

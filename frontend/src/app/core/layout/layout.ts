import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit {

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.startTokenExpirationWatcher();
  }
}

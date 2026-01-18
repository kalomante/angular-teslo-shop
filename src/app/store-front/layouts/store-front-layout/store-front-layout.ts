import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { FrontNavbar } from "@store-front/components/front-navbar/front-navbar";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.html',
})
export class StoreFrontLayout {

 }

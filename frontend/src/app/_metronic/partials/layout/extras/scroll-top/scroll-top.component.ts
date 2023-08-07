import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  Inject,
  HostListener,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  StickyComponent,
  ScrollTopComponent,
  MenuComponent,
  ToggleComponent,
  DrawerComponent,
} from '../../../../kt/components';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class LayoutScrollTopComponent implements OnInit, OnDestroy {
  windowScrolled: boolean;
  @HostBinding('class') class = 'kt_scrolltop';
  @HostBinding('id') id = 'scrolltop';
  @HostBinding('attr.data-kt-scrolltop') dataKtScrolltop = 'true';
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  private unsubscribe: Subscription[] = [];
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.pluginsReinitialization();
        this.updateHeaderSticky();
        setTimeout(() => {
          this.scrollTop();
        }, 0);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  updateHeaderSticky() {
    const stickyHeader = document.body.querySelectorAll(
      `[data-kt-sticky-name="header"]`
    );
    if (stickyHeader && stickyHeader.length > 0) {
      const sticky = StickyComponent.getInstance(
        stickyHeader[0] as HTMLElement
      );
      if (sticky) {
        sticky.update();
      }
    }
  }

  scrollTop() {
    ScrollTopComponent.goTop();
  }

  pluginsReinitialization() {
    setTimeout(() => {
      // ScrollTopComponent.reinitialization()
      MenuComponent.reinitialization();
      StickyComponent.reInitialization();
      setTimeout(() => {
        ToggleComponent.reinitialization();
        DrawerComponent.reinitialization();
        // ScrollComponent.reinitialization()
      }, 70);
    }, 140);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

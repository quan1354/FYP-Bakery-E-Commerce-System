import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';
import { Admin } from 'mongodb';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  isAdmin = true;
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  //toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  element1: any;
  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    private userService:UserService,
    private router: Router
  ) {
    this.initService.init();
  }

  ngOnInit(): void {
    if (this.userService.currentUser.isAdmin == true) {
      this.setAsideLayout(true);
    } else {
      this.setAsideLayout(false);
    }
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    //this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.contentContainerClasses =
      this.layout.getStringCSSClasses('contentContainer');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');
  }

  setAsideLayout(value: boolean) {
    let model = this.layout.getConfig();
    model.aside.display = value;
    this.layout.setConfig(model);
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl('/shop', {skipLocationChange: true}).then(() => {
    //     this.router.navigate([currentUrl]);
    // });
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }
  }
}

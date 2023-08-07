import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  closeResult = '';
  isReadMore = true;
  bioContent: string;

  constructor(private modalService: NgbModal) {}

  // async openModal(type:string) {
  //   if (type === 'L') this.bioContent = 'L'
  //   else if (type === 'E') this.bioContent = 'E'
  //   else if (type === 'Senshi') this.bioContent = 'Senshi'
  //   else this.bioContent = ''
  //   return await this.modalComponent.open();
  // }

  ngOnInit(): void {}

  showMoreText() {
    this.isReadMore = !this.isReadMore;
  }

  open(content: any, point: string) {
    if (point === 'L') this.bioContent = 'L';
    else if (point === 'E') this.bioContent = 'E';
    else if (point === 'Senshi') this.bioContent = 'Senshi';
    else this.bioContent = '';
    console.log(this.bioContent)
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { icon, LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, map, Map, marker, Marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild('map',{static:true})
  mapRef!: ElementRef
  contactFrom!:FormGroup
  isSubmit:boolean = false
  map!:Map
  currentMarker!:Marker

  private readonly DEFAULT_LATLNG:LatLngTuple = [5.458230,100.313439]
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/dym8k4ftq/image/upload/v1662612451/bread/marker_bm5qgp.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });


  constructor(private formBuilder:FormBuilder) {}
  ngOnInit(): void {
    this.contactFrom = this.formBuilder.group({
      name:['',Validators.required],
      email:['', [Validators.required, Validators.email]],
      subject:['',Validators.required],
      message:['',Validators.required],
    })
  this.initializeMap()
  }

  initializeMap(){
    if(this.map) return
    this.map = map(this.mapRef.nativeElement,{
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG,16)

    this.currentMarker = marker(this.DEFAULT_LATLNG, {icon:this.MARKER_ICON}).addTo(this.map).bindTooltip("<b>LEPAN BAKERY</b>",
    {
        permanent: true,
        direction: 'right'
    }
);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map)
  }

  get fc(){
    return this.contactFrom.controls;
  }

  submit(){
    this.isSubmit = true
    if (this.contactFrom.invalid) return
    // Then ... how to make email
  }
}



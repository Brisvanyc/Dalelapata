import { Component, OnInit } from '@angular/core';
import { MapaService } from '../../../servicios/mapa/mapa.service';
import * as mapboxgl from 'mapbox-gl';
import { UbicacionMapa } from 'src/app/modelos/modulo-ubicacionMapa/ubicacionMapa-modulo';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { Item } from 'pdfmake-wrapper';

@Component({
  selector: 'app-unidad-movil',
  templateUrl: './unidad-movil.component.html',
  styleUrls: ['./unidad-movil.component.css']
})
export class UnidadMovilComponent implements OnInit {
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  public isCollapsed = true;
  public ubicaciones: UbicacionMapa[];
  public listaLatitudes: UbicacionMapa[];
  public ubicacionSelec: UbicacionMapa[];
  url: string =environment.url+ 'unidadMovil/img/';
  municipio: string;
  idVisita : string;
  activar:boolean;
  

  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 1.2;
  lng = -77.267;
  zoom = 7;
  constructor(private mapService: MapaService,private router: Router) {
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
    this.mapbox.accessToken = environment.mapBoxToken;
    this.municipio="PASTO";
   }

  ngOnInit(): void {
    this.buildMapa();
    this.cargarUbicaciones(); 
    this.getAllUbicaciones(); 
  }
  getAllUbicaciones() {
    this.mapService.getAllUbicaciones().subscribe(
      data=>{
        this.listaLatitudes = data;
        this.listaLatitudes.map((item)=>{
           if(item.estado=='Visitado'){
            this.crearMarcador(item.longitud,item.latitud, '#2db3bf',item.idMunicipio, item.cantidad,item.estado, item.urlFoto);
           }
           else{
            this.crearMarcador(item.longitud,item.latitud, '#008F39',item.idMunicipio, item.cantidad,item.estado,item.urlFoto);
           }
         
         });
       });
  }

  inicio(){
    this.router.navigateByUrl("/home");
  }
  activarMunicipio(evento){
    this.activar=true;
    this.municipio = evento.target.value;
    this.mapService.getUbicacionesByIMunicipio(this.municipio).subscribe(
      data=>{
        this.ubicacionSelec = data;
       });
}

  cargarUbicaciones(){
     this.mapService.getUbicaciones().subscribe(
      data=>{
        this.ubicaciones = data;  
       }); 
  }

  crearMarcador(lng: string, lat:string, color: string,municipio: string, cantidad: string, estado:string, urlFoto : string){
     let popup = new mapboxgl.Popup({
       closeButton: false,
       offset:[0,-15]
     })
     .setLngLat({lng: lng, lat: lat})
     .setHTML('<h3>' + municipio + '</h3><p> Mascotas esterilizadas: ' + cantidad+  '<br> Estado: '+estado+'</p><img width="90%" src="'+ this.url +'/'+ urlFoto+'">')
     .setLngLat({lng: lng, lat: lat})

     const marker = new mapboxgl.Marker({
       draggable:true,
       "color": color
     })
     .setLngLat({lng: lng, lat: lat})
     .setPopup(popup)
     .addTo(this.map);

     marker.on('drag', ()=>{
       console.log('a');
     })
  }

  buildMapa(){
    mapboxgl.accessToken = environment.makboxKey;
    this.map = new mapboxgl.Map({
    container: 'mapa', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [this.lng,this.lat], // starting position
    zoom: 7 // starting zoom
    });
    this.map.addControl(new mapboxgl.NavigationControl()); 
    }

}
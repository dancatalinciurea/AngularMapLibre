import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GeoJSONSourceComponent } from '@maplibre/ngx-maplibre-gl';
import { GeoJSON } from 'geojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'test';
  earthquakes: GeoJSON.FeatureCollection | undefined;
  selectedCluster: { geometry: GeoJSON.Point; properties: any; } | undefined;

  async ngOnInit() {

    fetch('https://maplibre.org/maplibre-gl-js-docs/assets/earthquakes.geojson')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then((earthquakes) => {

        setInterval(() => {
          if (earthquakes.features.length) {
            earthquakes.features.pop();
          }
          this.earthquakes = { ...earthquakes };
        }, 500);
      })
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  }

  selectCluster(event: MouseEvent, feature: any) {
    event.stopPropagation(); // This is needed, otherwise the popup will close immediately
    // Change the ref, to trigger mgl-popup onChanges (when the user click on the same cluster)
    this.selectedCluster = {
      geometry: feature.geometry,
      properties: feature.properties,
    };
  }
}


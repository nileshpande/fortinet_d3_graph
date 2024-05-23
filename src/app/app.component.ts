import { Component } from '@angular/core';
import { CorrelationGraphDataService } from './correlation-graph-data/correlation-graph-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'file-upload-app';
  constructor(private graphDataService: CorrelationGraphDataService) {}

  public nodes:any;
  public edges:any;
  
  ngOnInit(): void {
    // Load data and pass it to the correlation graph component
    this.graphDataService.getGraphData().subscribe(data => {
      // Assuming data is in the format { nodes: [], edges: [] }
      this.nodes = data.nodes;
      this.edges = data.edges;
    });
  }
}

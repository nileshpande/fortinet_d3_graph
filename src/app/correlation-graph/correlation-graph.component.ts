import { Component, Input, SimpleChanges } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

@Component({
  selector: 'app-correlation-graph',
  templateUrl: './correlation-graph.component.html',
  styleUrls: ['./correlation-graph.component.scss']
})
export class CorrelationGraphComponent implements AfterViewInit {

  @ViewChild('correlationGraph', { static: true }) private chartContainer: ElementRef | undefined;

  @Input() nodes: GraphNode[] = [];
  @Input() edges: GraphLink[] = []; 

  private selectedNode: GraphNode | any = null;
  private contextMenu: HTMLElement | any = null;

  constructor() {}
  ngAfterViewInit(): void {
    console.log('Chart Container:', this.chartContainer);
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    console.log("ngoninit of correlation");
    if (!this.chartContainer) {
      console.error('Chart container is not available.');
      return;
    }

    this.contextMenu = document.getElementById('contextMenu');

    if (!this.nodes || !this.edges || this.nodes.length === 0 || this.edges.length === 0) {
      console.error('Nodes or edges data is empty or undefined.');
      return;
    }
  

    this.createGraph();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes'].currentValue || changes['edges'].currentValue) {
      this.updateGraph();
    }
  }
  
  // ngAfterViewInit(): void {
  //   console.log("ngAfterViewInit of correlation");
  //   if (!this.chartContainer) {
  //     console.error('Chart container is not available.');
  //     return;
  //   }
  //   if(this.edges)
  //     {
  //       this.createGraph();
  //        this.contextMenu = document.getElementById('contextMenu');
  //     }
  // }

  createGraph(): void { 
    console.log('Nodes:', this.nodes);
    console.log('Edges:', this.edges);
    if ((!this.nodes || this.nodes.length === 0) || (!this.edges || this.edges.length === 0) || (!this.chartContainer) ) {
      console.error('Nodes data is empty or undefined.');
      return;
    }

    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);

    const simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(this.edges).id((d: GraphNode) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.edges)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter().append('circle')
      .attr('r', 15)
      .attr('fill', d => d.color)
      .call(d3.drag<SVGCircleElement, GraphNode, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('contextmenu', (event, d) => this.showContextMenu(event, d));

    node.append('title')
      .text(d => d.label);

    simulation
      .nodes(this.nodes)
      .on('tick', ticked);

    const linkForce = simulation.force<d3.ForceLink<any, any>>('link');
    if (linkForce) {
      linkForce.links(this.edges);
    }

    function ticked() {
      link
        .attr('x1', d => ((d.source as GraphNode).x ?? 0))
        .attr('y1', d => ((d.source as GraphNode).y ?? 0))
        .attr('x2', d => ((d.target as GraphNode).x ?? 0))
        .attr('y2', d => ((d.target as GraphNode).y ?? 0));

      node
        .attr('cx', d => d.x ?? 0)
        .attr('cy', d => d.y ?? 0);
    }

    function dragstarted(event:any, d:any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event:any, d:any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event:any, d:any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  showContextMenu(event:any, node:any): void {
    event.preventDefault();
    this.selectedNode = node;

    if(this.contextMenu)
      {
        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = `${event.pageX}px`;
        this.contextMenu.style.top = `${event.pageY}px`;
      }

    // Remove context menu on click outside
    document.addEventListener('click', () => {
      if(this.contextMenu){ this.contextMenu.style.display = 'none'; }
    }, { once: true });
  }

  deleteNode(): void {
    if (this.selectedNode) {
      this.nodes = this.nodes.filter((node:any) => node.id !== this.selectedNode?.id);
      this.edges = this.edges.filter((edge:any) => edge.from !== this.selectedNode.id && edge.to !== this.selectedNode.id);
      this.updateGraph();
    }
  }

  detachNode(): void {
    if (this.selectedNode) {
      this.edges = this.edges.filter((edge:any) => edge.from !== this.selectedNode.id && edge.to !== this.selectedNode.id);
      this.updateGraph();
    }
  }

  updateGraph(): void {
    // d3.select('#correlationGraph svg').remove();
    // this.createGraph();
    if (!this.nodes || !this.edges || this.nodes.length === 0 || this.edges.length === 0) {
      console.error('Nodes or edges data is empty or undefined.');
      return;
    }

    // Remove existing SVG elements
    d3.select('#correlationGraph svg').remove();

    // Create the graph with updated data
    this.createGraph();
  }
}

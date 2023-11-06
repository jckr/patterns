const SQRT32 = Math.sqrt(3) / 2;

import {findIntersection, findLineCircleIntersections, makeShape} from './utils';

export class Pattern {
  private points:Array<[number, number]> = [];
  private constructionSegments: Array<[number, number]> = [];
  private constructionCircles: Array<[number, number]> = [];
  private patternLines: Array<{points: Array<number>, color: string}> = [];
  private patternShapes: Array<{points: Array<number>, color: string}> = [];
  constructor(private ctx:CanvasRenderingContext2D, private instructions:Array<string> = [], private size:number = 500, private strokeWidth:number = 5, private innerStroke:number = 3) {
    for (const instruction of instructions) {
      this.readInstruction(instruction);
    }
  }

  addPoint(x:number, y:number) {
    this.points.push([x, y]);
  }
  addConstructionSegment(a: number, b: number) {
    this.constructionSegments.push([a, b]);
  }
  addConstructionCircle(a: number, b: number) {
    this.constructionCircles.push([a, b]);
  }
  addPatternLine(points: Array<number>, color: string = '#fff') {
    this.patternLines.push({points, color});
  }
  addPatternShape(points: Array<number>, color: string = 'red') {
    this.patternShapes.push({points, color});
  }
  addHex1() {
    const n = this.points.length;
    const s = this.size;
    const s2 = this.size / 2;
    const s4 = this.size / 4;
    this.addPoint(s2, s2);
    this.addPoint(0, s2);
    this.addPoint(s4, (s2) -  SQRT32 * s2);
    this.addPoint(s - s4, (s2) -  SQRT32 * s2);
    this.addPoint(s, s2);
    this.addPoint(s - s4, (s2) +  SQRT32 * s2);
    this.addPoint(s4, (s2) +  SQRT32 * s2);
    this.addConstructionCircle(n, n + 1);
    this.addConstructionSegment(n + 1, n + 2);
    this.addConstructionSegment(n + 2, n + 3);
    this.addConstructionSegment(n + 3, n + 4);
    this.addConstructionSegment(n + 4, n + 5);
    this.addConstructionSegment(n + 5, n + 6);
    this.addConstructionSegment(n + 6, n + 1);
  }
  addHex2() {
    const n = this.points.length;
    const s = this.size;
    const s2 = this.size / 2;
    const s4 = this.size / 4;
    this.addPoint(s2, s2);
    this.addPoint(s2, 0);
    this.addPoint((s2) -  SQRT32 * s2, s4);
    this.addPoint(s2 -  SQRT32 * s2, (s - s4));
    this.addPoint(s2, s);
    this.addPoint((s2) +  SQRT32 * s2, s - s4);
    this.addPoint((s2) +  SQRT32 * s2, s4);
    this.addConstructionCircle(n, n + 1);
    this.addConstructionSegment(n + 1, n + 2);
    this.addConstructionSegment(n + 2, n + 3);
    this.addConstructionSegment(n + 3, n + 4);
    this.addConstructionSegment(n + 4, n + 5);
    this.addConstructionSegment(n + 5, n + 6);
    this.addConstructionSegment(n + 6, n + 1);
  }

  readInstruction(instruction: string) {
    const [command, ...args] = instruction.split(',');
    switch (command) {
      case 'hex1':
        this.addHex1();
        break;
      case 'hex2':
        this.addHex2();
        break;
      case 'point':
        this.addPoint(parseInt(args[0]), parseInt(args[1]));
        break;
      case 'segment':
        this.addConstructionSegment(parseInt(args[0]), parseInt(args[1]));
        break;
      case 'circle':
        this.addConstructionCircle(parseInt(args[0]), parseInt(args[1]));
        break;
      case 'line':
        this.addPatternLine(args.map((arg) => parseInt(arg)));
        break;
      case 'lineColor':
        this.addPatternLine(args.slice(0, args.length - 1).map((arg) => parseInt(arg)), args[args.length - 1]);
        break;
      case 'shape':
        this.addPatternShape(args.map((arg) => parseInt(arg)));
        break;
      case 'shapeColor':
        this.addPatternShape(args.slice(0, args.length - 1).map((arg) => parseInt(arg)), args[args.length - 1]);
        break;
      default:
        console.log('unknown command', command);
    }
  }

  drawConstruction() {
    this.ctx.save();
    this.ctx.strokeStyle = '#222';
    this.ctx.setLineDash([3, 3]);
    this.ctx.lineWidth = 1;
    for (const segment of this.constructionSegments) {
      const [a, b] = segment;
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[a][0], this.points[a][1]);
      this.ctx.lineTo(this.points[b][0], this.points[b][1]);
      this.ctx.stroke();
    }
    for (const circle of this.constructionCircles) {
      const [a, b] = circle;
      const [x1, y1] = this.points[a];
      const [x2, y2] = this.points[b];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const r = Math.hypot(dx, dy);
      this.ctx.beginPath();
      this.ctx.arc(x1, y1, r, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
  draw() {
    this.ctx.save();
    for (const shape of this.patternShapes) {
      this.ctx.fillStyle = shape.color;
      makeShape(this.ctx, shape.points.map((point) => {
        return [this.points[point][0], this.points[point][1]];
      }));
      this.ctx.fill();
    }
    for (const shape of this.patternLines) {
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = this.strokeWidth;
      makeShape(this.ctx, shape.points.map((point) => {
        return [this.points[point][0], this.points[point][1]];
      }));
      this.ctx.stroke();
    }
    for (const shape of this.patternLines) {
      this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = this.innerStroke;
      makeShape(this.ctx, shape.points.map((point) => {
        return [this.points[point][0], this.points[point][1]];
      }));
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}


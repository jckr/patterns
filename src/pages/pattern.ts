const SQRT32 = Math.sqrt(3) / 2;

import {findIntersection, findLineCircleIntersections, findSymmetricPoint, getHexLong, getHexTall, getMiddle, makeShape} from './utils';

export class Pattern {
  private cx: number;
  private cy: number;
  private points:Array<[number, number]> = [];
  private constructionSegments: Array<[number, number]> = [];
  private constructionCircles: Array<[number, number]> = [];
  private patternLines: Array<{points: Array<number>, color: string}> = [];
  private patternShapes: Array<{points: Array<number>, color: string}> = [];
  constructor(private ctx:CanvasRenderingContext2D, private instructions:Array<string> = [], private size:number = 500, private strokeWidth:number = 5, private innerStroke:number = 3) {
    this.cx = ctx.canvas.width / 2;
    this.cy = ctx.canvas.height / 2;
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
  addLineIntersect(a: number, b: number, c: number, d: number) {
    const intersections = findIntersection(this.points[a], this.points[b], this.points[c], this.points[d]);
    for (const intersection of intersections) {
      this.addPoint(intersection[0], intersection[1]);
    }
  }
  addCircleIntersect(a: number, b: number, c: number, d: number) {
    const intersections = findLineCircleIntersections(this.points[a], this.points[b], this.points[c], this.points[d]);
    for (const intersection of intersections) {
      this.addPoint(intersection[0], intersection[1]);
    }
  }
  addSymmetricPoint(a: number, b: number, c: number) {
    this.addPoint(...findSymmetricPoint(this.points[a], this.points[b], this.points[c]));
  }
  addHex1() {
    const cx = this.cx, cy = this.cy;
    const n = this.points.length;
    const s2 = this.size / 2;
    this.addPoint(cx, cy);
    
    const points = getHexLong(cx, cy, s2);

    for (const point of points) {
      this.addPoint(point[0], point[1]);
    }
    this.addConstructionCircle(n, n + 1);
    this.addConstructionSegment(n + 1, n + 2);
    this.addConstructionSegment(n + 2, n + 3);
    this.addConstructionSegment(n + 3, n + 4);
    this.addConstructionSegment(n + 4, n + 5);
    this.addConstructionSegment(n + 5, n + 6);
    this.addConstructionSegment(n + 6, n + 1);
  }
  addHex2() {
    const cx = this.cx, cy = this.cy;
    const n = this.points.length;
    const s2 = this.size / 2;

    this.addPoint(cx, cy);
    const points = getHexTall(cx, cy, s2);

    for (const point of points) {
      this.addPoint(point[0], point[1]);
    }

    this.addConstructionCircle(n, n + 1);
    this.addConstructionSegment(n + 1, n + 2);
    this.addConstructionSegment(n + 2, n + 3);
    this.addConstructionSegment(n + 3, n + 4);
    this.addConstructionSegment(n + 4, n + 5);
    this.addConstructionSegment(n + 5, n + 6);
    this.addConstructionSegment(n + 6, n + 1);
  }
  addHex3() {
    const cx = this.cx, cy = this.cy;
    const n = this.points.length;
    const s2 = this.size / 2;

    const points = getHexLong(cx, cy, s2);
    this.addPoint(cx, cy);
    this.addPoint(...getMiddle(points[1], points[2]));
    this.addPoint(...getMiddle(points[0], points[1]));
    this.addPoint(...getMiddle(points[0], points[5]));
    this.addPoint(...getMiddle(points[4], points[5]));
    this.addPoint(...getMiddle(points[3], points[4]));
    this.addPoint(...getMiddle(points[2], points[3]));

    this.addConstructionCircle(n, n + 1);
    this.addConstructionSegment(n + 1, n + 2);
    this.addConstructionSegment(n + 2, n + 3);
    this.addConstructionSegment(n + 3, n + 4);
    this.addConstructionSegment(n + 4, n + 5);
    this.addConstructionSegment(n + 5, n + 6);
    this.addConstructionSegment(n + 6, n + 1);
  }
  addHex4() {
    const cx = this.cx, cy = this.cy;
    const n = this.points.length;
    const s2 = this.size / 2;

    const points = getHexTall(cx, cy, s2);
    this.addPoint(cx, cy);
    this.addPoint(...getMiddle(points[1], points[2]));
    this.addPoint(...getMiddle(points[0], points[1]));
    this.addPoint(...getMiddle(points[0], points[5]));
    this.addPoint(...getMiddle(points[4], points[5]));
    this.addPoint(...getMiddle(points[3], points[4]));
    this.addPoint(...getMiddle(points[2], points[3]));
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
      case 'addCircleIntersect':
        this.addCircleIntersect(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
        break;
      case 'addLineIntersect':
        this.addLineIntersect(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
        break;
      case 'addSymmetricPoint':
        this.addSymmetricPoint(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
        break;
      case 'circle':
        this.addConstructionCircle(parseInt(args[0]), parseInt(args[1]));
        break;
      case 'hex1':
        this.addHex1();
        break;
      case 'hex2':
        this.addHex2();
        break;
      case 'hex3':
        this.addHex3();
        break;
      case 'hex4':
        this.addHex4();
        break;
      case 'line':
        this.addPatternLine(args.map((arg) => parseInt(arg)));
        break;
      case 'lineColor':
        this.addPatternLine(args.slice(0, args.length - 1).map((arg) => parseInt(arg)), args[args.length - 1]);
        break;
      case 'point':
        this.addPoint(parseInt(args[0]), parseInt(args[1]));
        break;
      case 'segment':
        this.addConstructionSegment(parseInt(args[0]), parseInt(args[1]));
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
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
    this.ctx.fillStyle = '#222';
    let idx = 0;
    for (const point of this.points) {
      const [x, y] = point;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.font = '12px sans-serif';
      this.ctx.fillText(idx.toString(), x + 5, y + 5);
      idx++;
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


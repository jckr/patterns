const SQRT32 = Math.sqrt(3) / 2;

type Options = {
  size?: number;
  groutStrokeWidth?: number;
  strokeWidth?: number;
  lineStroke?: string;
  groutStroke?: string;
  palette?: Array<string>;
};

import {
  findIntersection,
  findLineCircleIntersections,
  findSymmetricPoint,
  getHexLong,
  getHexTall,
  getMiddle,
  isCloseTo,
  makeShape,
  rotate,
} from './utils';

export class Engine {
  private constructionSegments: Array<[number, number]> = [];
  private constructionCircles: Array<[number, number]> = [];
  private cx: number;
  private cy: number;
  private groutStroke = '#222';
  private groutStrokeWidth = 5;
  private innerStroke = '#fff';
  private innerStrokeWidth = 3;
  private instruction: string | null = null;
  private currentColor = { order: -1, color: '' };
  private order: number = 0;
  private palette: Array<string> = [
    '#0066CC', // Deep Azure
    '#E6BF83', // Golden Sandstone
    '#8B0000', // Majestic Maroon
    '#556B2F', // Olive Elegance
    '#C04000', // Rich Terracotta
    '#800080', // Royal Plum
    '#FFFFF0', // Ivory Whisper
    '#CD853F', // Antique Brass
  ];
  private patternLines: Array<Array<number>> = [];
  private patternShapes: Array<{ points: Array<number>; color: string }> = [];
  private points: Array<{
    x: number;
    y: number;
    order: number;
    instruction: string | null;
  }> = [];
  private size: number = 500;
  private strokeWidth: number = 3;
  constructor(
    private ctx: CanvasRenderingContext2D,
    instructions: Array<string | Array<string>> = [],
    options: Options
  ) {
    Object.assign(this, options);
    this.cx = ctx.canvas.width / 2;
    this.cy = ctx.canvas.height / 2;
    this.order = 0;

    for (const instructionGroup of instructions) {
      if (typeof instructionGroup === 'string') {
        this.instruction = instructionGroup;
        this.readInstruction(instructionGroup);
      } else {
        for (const instruction of instructionGroup) {
          this.instruction = instruction;
          this.readInstruction(instruction);
        }
      }
      this.order++;
    }
  }

  addPoint(x: number, y: number) {
    this.points.push({
      x,
      y,
      order: this.order,
      instruction: this.instruction,
    });
  }
  addConstructionSegment(a: number, b: number) {
    if (
      this.constructionSegments.some(
        ([c, d]) => (c === a && d === b) || (c === b && d === a)
      )
    ) {
      return;
    }
    this.constructionSegments.push([a, b]);
  }
  addConstructionCircle(a: number, b: number) {
    if (
      this.constructionCircles.some(([c, d]) => {
        if (c !== a) return false;
        const [cx, cy] = this.getCoords(c);
        const [bx, by] = this.getCoords(b);
        const [dx, dy] = this.getCoords(d);
        if (Math.hypot(cx - bx, cy - by) !== Math.hypot(cx - dx, cy - dy))
          return false;
      })
    ) {
      return;
    }
    this.constructionCircles.push([a, b]);
  }
  addPatternLine(points: Array<number>) {
    this.patternLines.push(points);
  }
  addPatternShape(points: Array<number>) {
    let color;
    if (this.currentColor.order === this.order) {
      color = this.currentColor.color;
    } else {
      const colorIndex =
        this.palette.findIndex((d) => d === this.currentColor.color) + 1;
      color = this.palette[this.order % this.palette.length];
      this.currentColor = { order: this.order, color };
    }
    this.patternShapes.push({ points, color });
  }
  addLineIntersect(a: number, b: number, c: number, d: number) {
    const intersections = findIntersection(
      this.getCoords(a),
      this.getCoords(b),
      this.getCoords(c),
      this.getCoords(d)
    );
    for (const intersection of intersections) {
      if (
        !isCloseTo(intersection, [
          this.getCoords(a),
          this.getCoords(b),
          this.getCoords(c),
          this.getCoords(d),
        ])
      ) {
        this.addConstructionSegment(a, b);
        this.addConstructionSegment(c, d);
        this.addPoint(intersection[0], intersection[1]);
      }
    }
  }
  addCircleIntersect(a: number, b: number, c: number, d: number) {
    const intersections = findLineCircleIntersections(
      this.getCoords(a),
      this.getCoords(b),
      this.getCoords(c),
      this.getCoords(d)
    );
    for (const intersection of intersections) {
      if (
        !isCloseTo(intersection, [
          this.getCoords(a),
          this.getCoords(b),
          this.getCoords(c),
          this.getCoords(d),
        ])
      ) {
        this.addConstructionSegment(a, b);
        this.addConstructionCircle(c, d);
        this.addPoint(intersection[0], intersection[1]);
      }
    }
    console.log(this.points);
  }
  addSymmetricPoint(a: number, b: number, c: number) {
    this.addPoint(
      ...findSymmetricPoint(
        this.getCoords(a),
        this.getCoords(b),
        this.getCoords(c)
      )
    );
  }
  addHex1() {
    const cx = this.cx,
      cy = this.cy;
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
    const cx = this.cx,
      cy = this.cy;
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
    const cx = this.cx,
      cy = this.cy;
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
    const cx = this.cx,
      cy = this.cy;
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
        this.addCircleIntersect(
          parseInt(args[0]),
          parseInt(args[1]),
          parseInt(args[2]),
          parseInt(args[3])
        );
        break;
      case 'addLineIntersect':
        this.addLineIntersect(
          parseInt(args[0]),
          parseInt(args[1]),
          parseInt(args[2]),
          parseInt(args[3])
        );
        break;
      case 'addRelativePoint':
        this.addPoint(
          this.cx + (parseInt(args[0]) * this.size) / 2,
          this.cy + (parseInt(args[1]) * this.size) / 2
        );
        break;
      case 'addSymmetricPoint':
        this.addSymmetricPoint(
          parseInt(args[0]),
          parseInt(args[1]),
          parseInt(args[2])
        );
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
        const points = args.map((arg) => parseInt(arg));
        this.addPatternShape(points);
        this.addPatternLine(points);
        break;
      default:
        console.log('unknown command', command);
    }
  }

  drawConstruction(symmetry: number = 1) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.ctx.strokeStyle = '#222';
    this.ctx.setLineDash([3, 3]);
    this.ctx.lineWidth = 1;

    // How symmetry works:
    // we are going to divide the pattern area in n = [symmetry] slices around
    // the center. then, everything that we draw, we're going to replicate that
    // n times, rotating each time by 1nth of a circle.
    // many of our patterns are based on an hexagon, a square, an equilateral
    // triangle or other figures that naturally tile.

    for (let section = 0; section < symmetry; section++) {
      // this helper function will give the coordinate of a point after moving
      // it forward by [section] slices, if we have the [x, y] coordinates of
      // that point to begin with
      const rotateSection = (point: [number, number]) => {
        return rotate(
          point,
          [this.cx, this.cy],
          (section * 2 * Math.PI) / symmetry
        );
      };
      // this function is similar but just takes an index as input, it will
      // fetch the [x,y] coordinates of the corresponding point, then rotate
      // it using the helper
      const getCoordinatesAndRotate = (index: number) => {
        return rotateSection(this.getCoords(index));
      };
      for (const segment of this.constructionSegments) {
        const [a, b] = segment;
        this.ctx.beginPath();
        this.ctx.moveTo(...getCoordinatesAndRotate(a));
        this.ctx.lineTo(...getCoordinatesAndRotate(b));
        this.ctx.stroke();
      }
      for (const circle of this.constructionCircles) {
        const [a, b] = circle;
        const [x1, y1] = getCoordinatesAndRotate(a);
        const [x2, y2] = getCoordinatesAndRotate(b);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const r = Math.hypot(dx, dy);
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, r, 0, 2 * Math.PI);
        this.ctx.stroke();
      }
    }
    // for points, we really only want to draw them once
    this.ctx.fillStyle = '#222';
    let idx = 0;
    for (const point of this.points) {
      const [x, y] = [point.x, point.y];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.font = '12px sans-serif';
      this.ctx.fillText(idx.toString(), x + 5, y + 5);
      idx++;
    }
    this.ctx.restore();
  }
  draw(symmetry: number = 1) {
    this.ctx.save();
    for (let section = 0; section < symmetry; section++) {
      const getCoordinatesAndRotate = (index: number) => {
        const point = this.getCoords(index);
        return rotate(
          point,
          [this.cx, this.cy],
          (section * 2 * Math.PI) / symmetry
        );
      };
      for (const shape of this.patternShapes) {
        this.ctx.fillStyle = shape.color;
        const coords = shape.points.map(getCoordinatesAndRotate);
        makeShape(this.ctx, coords);
        this.ctx.fill();
      }
    }
    for (let section = 0; section < symmetry; section++) {
      const getCoordinatesAndRotate = (index: number) => {
        const point = this.getCoords(index);
        return rotate(
          point,
          [this.cx, this.cy],
          (section * 2 * Math.PI) / symmetry
        );
      };
      for (const shape of this.patternLines) {
        this.ctx.strokeStyle = this.groutStroke;
        this.ctx.lineWidth = this.groutStrokeWidth;
        const coords = shape.map(getCoordinatesAndRotate);
        makeShape(this.ctx, coords, true);
        this.ctx.stroke();
      }
    }
    for (let section = 0; section < symmetry; section++) {
      const getCoordinatesAndRotate = (index: number) => {
        const point = this.getCoords(index);
        return rotate(
          point,
          [this.cx, this.cy],
          (section * 2 * Math.PI) / symmetry
        );
      };
      for (const shape of this.patternLines) {
        this.ctx.strokeStyle = this.innerStroke;
        this.ctx.lineWidth = this.innerStrokeWidth;
        const coords = shape.map(getCoordinatesAndRotate);
        makeShape(this.ctx, coords, true);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }
  getCoords(index: number) {
    return [this.points[index].x, this.points[index].y] as [number, number];
  }
}

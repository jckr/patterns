const SQRT32 = Math.sqrt(3) / 2;

export function findIntersection(
  A: [number, number],
  B: [number, number],
  C: [number, number],
  D: [number, number]
): Array<[number, number]> {
  const denominator =
    (A[0] - B[0]) * (C[1] - D[1]) - (A[1] - B[1]) * (C[0] - D[0]);

  // Check if the lines are parallel (denominator is zero)
  if (denominator === 0) {
    return [];
  }

  const t =
    ((A[0] - C[0]) * (C[1] - D[1]) - (A[1] - C[1]) * (C[0] - D[0])) /
    denominator;

  const intersectionX = A[0] + t * (B[0] - A[0]);
  const intersectionY = A[1] + t * (B[1] - A[1]);

  return [[intersectionX, intersectionY]];
}

export function findLineCircleIntersections(
  linePoint1: [number, number],
  linePoint2: [number, number],
  circleCenter: [number, number],
  pointOnCircle: [number, number]
): Array<[number, number]> {
  const [x1, y1] = linePoint1;
  const [x2, y2] = linePoint2;
  const [cx, cy] = circleCenter;

  const r = Math.sqrt(
    (pointOnCircle[0] - cx) ** 2 + (pointOnCircle[1] - cy) ** 2
  );

  // if the line is vertical, equations will be a bit different
  if (x2 === x1) {
    // (x - cx)^2 + (y - cy)^2 = r^2
    // (y -cy)^2 = r^2 - (c2 - cx)^2
    // y^2 + cy^2 - 2cy*y = r^2 - cx^2 + 2cx*x - x^2
    // y^2 - 2cy*y = r^2 - cx^2 + 2cx*x - x^2 - cy^2
    const a = 1;
    const b = -2 * cy;
    const c = -(r * r) + cx * cx - 2 * cx * x1 + x1 * x1 + cy * cy;

    const d = b * b - 4 * a * c;
    if (d >= 0) {
      // insert into quadratic formula
      const intersections = [
        (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
        (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a),
      ];
      if (d === 0) {
        // only 1 intersection
        return [[x1, intersections[0]]];
      }
      return intersections.map((y) => [x1, y]);
    }
    return [];
  }

  // Calculate the slope (m)
  const m = (y2 - y1) / (x2 - x1);

  // Calculate the y-intercept (n)
  const n = y1 - m * x1;

  const a = 1 + m * m;
  const b = -cx * 2 + m * (n - cy) * 2;
  const c = cx * cx + (n - cy) * (n - cy) - r * r;

  // get discriminant
  const d = b * b - 4 * a * c;
  if (d >= 0) {
    // insert into quadratic formula
    const intersections = [
      (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a),
    ];
    if (d === 0) {
      // only 1 intersection
      return [[intersections[0], m * intersections[0] + n]];
    }
    return intersections.map((x) => [x, m * x + n]);
  }
  // no intersection
  return [];
}

export function findSymmetricPoint(
  A: [number, number],
  B: [number, number],
  C: [number, number]
): [number, number] {
  const [ax, ay] = A;
  const [bx, by] = B;
  const [cx, cy] = C;

  // Calculate the vector from A to B
  const ABVector = [bx - ax, by - ay];

  // Calculate the vector from C to A
  const CAVector = [ax - cx, ay - cy];

  // Calculate the dot product of AB and CA vectors
  const dotProduct = ABVector[0] * CAVector[0] + ABVector[1] * CAVector[1];

  // Calculate the length of AB vector squared
  const lengthABSquared = ABVector[0] ** 2 + ABVector[1] ** 2;

  // Calculate the coordinates of point D
  const Dx = ax - (dotProduct * ABVector[0]) / lengthABSquared;
  const Dy = ay - (dotProduct * ABVector[1]) / lengthABSquared;

  const CDVector = [Dx - cx, Dy - cy];

  const Ex = Dx + CDVector[0];
  const Ey = Dy + CDVector[1];

  return [Ex, Ey];
}

export function makeShape(
  ctx: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  open: boolean = false
) {
  ctx.beginPath();
  const firstPoint = points[0];
  ctx.moveTo(firstPoint[0], firstPoint[1]);
  for (const point of points) {
    ctx.lineTo(point[0], point[1]);
  }
  if (open) {
    ctx.moveTo(firstPoint[0], firstPoint[1]);
  }
  ctx.closePath();
}

export function getHexLong(
  cx: number,
  cy: number,
  s: number
): Array<[number, number]> {
  const s2 = s / 2;
  return [
    [cx - s, cy],
    [cx - s2, cy - SQRT32 * s],
    [cx + s2, cy - SQRT32 * s],
    [cx + s, cy],
    [cx + s2, cy + SQRT32 * s],
    [cx - s2, cy + SQRT32 * s],
  ];
}

export function getHexTall(
  cx: number,
  cy: number,
  s: number
): Array<[number, number]> {
  const s2 = s / 2;
  return [
    [cx, cy - s],
    [cx - SQRT32 * s, cy - s2],
    [cx - SQRT32 * s, cy + s2],
    [cx, cy + s],
    [cx + SQRT32 * s, cy + s2],
    [cx + SQRT32 * s, cy - s2],
  ];
}

export function getMiddle(
  A: [number, number],
  B: [number, number]
): [number, number] {
  return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
}

export function rotate(
  point: [number, number],
  center: [number, number],
  angle: number
): [number, number] {
  const [ax, ay] = point;
  const [bx, by] = center;

  const dx = ax - bx;
  const dy = ay - by;

  const newX = bx + dx * Math.cos(angle) - dy * Math.sin(angle);
  const newY = by + dx * Math.sin(angle) + dy * Math.cos(angle);

  return [newX, newY];
}

export function findOrthogonalIntersection(
  circleCenter: [number, number],
  linePoint1: [number, number],
  linePoint2: [number, number]
) {
  const [ax, ay] = circleCenter;
  const [bx, by] = linePoint1;
  const [cx, cy] = linePoint2;

  if (bx === cx) {
    // the line is vertical, so the intersection point is [bx, ay]
    return [bx, ay];
  }

  // Calculate the slope of line BC
  const slopeBC = (by - cy) / (bx - cx);

  // Calculate the negative reciprocal to find the slope of the line passing through A
  const slopeOrthogonal = -1 / slopeBC;

  // Use point-slope form to find the equation of the line passing through A
  const yIntercept = ay - slopeOrthogonal * ax;

  // Calculate the x-coordinate of the intersection point
  const intersectionX = (yIntercept - cy) / (slopeBC - slopeOrthogonal);

  // Calculate the y-coordinate of the intersection point
  const intersectionY = slopeBC * intersectionX + cy;
  console.log({
    slopeBC,
    slopeOrthogonal,
    yIntercept,
    intersectionX,
    intersectionY,
  });
  return [intersectionX, intersectionY];
}

export function isCloseTo(
  pointA: [number, number],
  points: number[][],
  precision: number = 1e-6
) {
  for (const pointB of points) {
    if (
      Math.abs(pointA[0] - pointB[0]) < precision &&
      Math.abs(pointA[1] - pointB[1]) < precision
    )
      return true;
  }
}

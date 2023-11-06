export function findIntersection(A: [number, number], B: [number, number], C: [number, number], D: [number, number]): Array<[number, number]> {
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

export function findLineCircleIntersections(A: [number, number], B: [number, number], C: [number, number], D: [number, number]): Array<[number, number]> {
  const dx1 = B[0] - A[0];
  const dy1 = B[1] - A[1];

  const A_coeff = dx1 * dx1 + dy1 * dy1;
  const B_coeff = 2 * (dx1 * (A[0] - C[0]) + dy1 * (A[1] - C[1]));
  const C_coeff = (A[0] - C[0]) * (A[0] - C[0]) + (A[1] - C[1]) * (A[1] - C[1]) - (D[0] * D[0] + D[1] * D[1]);

  const discriminant = B_coeff * B_coeff - 4 * A_coeff * C_coeff;

  if (discriminant < 0) {
    // No intersection, the line and circle do not intersect.
    return [];
  } else if (discriminant === 0) {
    // Tangent, the line touches the circle at one point.
    const t = -B_coeff / (2 * A_coeff);
    const intersectionX = A[0] + t * dx1;
    const intersectionY = A[1] + t * dy1;
    return [[intersectionX, intersectionY]];
  } else {
    // Two intersection points.
    const t1 = (-B_coeff + Math.sqrt(discriminant)) / (2 * A_coeff);
    const t2 = (-B_coeff - Math.sqrt(discriminant)) / (2 * A_coeff);
    
    const intersection1X = A[0] + t1 * dx1;
    const intersection1Y = A[1] + t1 * dy1;
    
    const intersection2X = A[0] + t2 * dx1;
    const intersection2Y = A[1] + t2 * dy1;

    return [[intersection1X, intersection1Y], [intersection2X, intersection2Y]];
  }
}

export function findSymmetricPoint(A: [number, number], B: [number, number], C: [number, number]): [number, number] {
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


export function makeShape(ctx: CanvasRenderingContext2D, points: Array<[number, number]>) {
  ctx.beginPath();
  const firstPoint = points[0];
  ctx.moveTo(firstPoint[0], firstPoint[1]);
  for (const point of points) {
    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
}

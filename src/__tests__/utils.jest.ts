type Point = [number, number];
import { findIntersection, findLineCircleIntersections, findSymmetricPoint } from '../pages/utils';
describe('find intersections', () => {
  it('should find intersections', () => {
    const A: Point = [0, 0];
    const B: Point = [1, 1];
    const C: Point = [0, 1];
    const D: Point = [1, 0];
    const intersections = findIntersection(A, B, C, D);
    expect(intersections).toEqual([[0.5, 0.5]]);

  });
  it('intersection can be outside of segments', () => {
    const A:Point = [0, 0]; 
    const B:Point = [0, 1];
    const C:Point = [-2, 2];
    const D:Point = [-1, 2];
    const intersections = findIntersection(A, B, C, D);
    expect(intersections).toEqual([[0, 2]]);

  });
  it('should not find intersections if segments are parallel', () => {
    const A:Point = [0, 0];
    const B:Point = [1, 0];
    const C:Point = [0, 1];
    const D:Point = [1, 1];
    const intersections = findIntersection(A, B, C, D);
    expect(intersections).toHaveLength(0)
  });
});

describe('find line circle intersections', () => {
  it('finds 2 intersections if the circle is intersected by the line', () => {
   
    const A:Point = [2, -2];
    const B:Point = [2, 2];
    const C:Point = [0, 0];
    const D:Point = [5, 0];
    const intersections = findLineCircleIntersections(A, B, C, D);
    expect(intersections).toHaveLength(2);
  });
  it('finds one intersection if the circle is tangent to the line', () => {
    const A:Point = [5, -2];
    const B:Point = [5, 2];
    const C:Point = [0, 0];
    const D:Point = [5, 0];
    const intersections = findLineCircleIntersections(A, B, C, D);
    expect(intersections).toHaveLength(1);
  });
  it('finds no intersection if the circle does not intersect the line at all', () => {
    const A:Point = [5, -2];
    const B:Point = [5, 2];
    const C:Point = [0, 0];
    const D:Point = [3, 0];
    const intersections = findLineCircleIntersections(A, B, C, D);
    expect(intersections).toHaveLength(0);
  });
});

describe('find symmetric point', () => {
  it('finds symmetric point', () => {
    
    expect(findSymmetricPoint([5, 2], [5, -2], [0,0])).toEqual([10,0]);
    expect(findSymmetricPoint([5, 2], [5, -2], [3,1])).toEqual([7,1]);
    expect(findSymmetricPoint([0, 0], [2, 2], [0,2])).toEqual([2,0]);


  });
});
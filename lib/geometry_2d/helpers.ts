import { drop } from 'lodash';
import { Dot2d } from './scene_element/dot_2d';

export function horizontal_ray_with_segment_intersection (
    ray_origin: Dot2d,
    segment_start: Dot2d,
    segment_end: Dot2d,
) {
    const t = ( ray_origin.y - segment_start.y ) / ( segment_end.y - segment_start.y );
    if ( t > 1 || t < 0 ) {
        return false;
    }
    const x = ( 1 - t ) * segment_start.x + t * segment_end.x;
    const y = ray_origin.y;
    const min_segment_y = segment_start.y < segment_end.y ? segment_start.y : segment_end.y;
    if ( x < ray_origin.x ) {
        return false;
    }
    if ( y === min_segment_y ) {
        return false;
    }

    return true;
}

export function line_intersection ( l1_d1: Dot2d, l1_d2: Dot2d, l2_d1: Dot2d, l2_d2: Dot2d ): Dot2d | null {
    const dx1 = l1_d2.x - l1_d1.x;
    const dx2 = l2_d2.x - l2_d1.x;
    const dy1 = l1_d2.y - l1_d1.y;
    const dy2 = l2_d2.y - l2_d1.y;

    const d2 = dy2 / dx2;

    const t = ( d2 * l1_d1.x - d2 * l2_d1.x + l2_d1.y - l1_d1.y ) / ( dy1 - d2 * dx1 );

    if ( l1_d1.x + l2_d2.x == l1_d2.x + l2_d1.x || l1_d1.y + l2_d2.y == l1_d2.y + l2_d1.y ) {
        return null;
    }

    const apply_t = ( t: number, x1: number, x2: number ) => {
        return x1 + t * ( x2 - x1 );
    };

    return new Dot2d( apply_t( t, l1_d1.x, l1_d2.x ), apply_t( t, l1_d1.y, l1_d2.y ) );
}

import { Dot2d } from './dot_2d';

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

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

export function vect_2d_mult ( a: Dot2d, b: Dot2d, origin: Dot2d = new Dot2d( 0, 0 ) ): number {
    a = a.sub( origin );
    b = b.sub( origin );
    return a.x * b.y - a.y * b.x;
}

function vect_2d_length ( v: Dot2d ) {
    return Math.sqrt( v.x * v.x + v.y * v.y );
}

function vect_2d_dot_product ( v1: Dot2d, v2: Dot2d ) {
    return v1.x * v2.x + v1.y * v2.y;
}

export function vect_2d_angle ( a: Dot2d, b: Dot2d, origin: Dot2d = new Dot2d( 0, 0 ) ) {
    a = a.sub( origin );
    b = b.sub( origin );

    return Math.acos( vect_2d_dot_product( a, b ) / vect_2d_length( a ) / vect_2d_length( b ) );
}

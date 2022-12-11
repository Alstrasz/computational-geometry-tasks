import { Dot2dPolar } from '../dot_2d_polar';
import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';

export class Dot2d extends SceneElement {
    constructor (
        public x: number,
        public y: number,
        public color?: Color,
    ) {
        super();
    }

    to_polar ( center?: Dot2d ): Dot2dPolar {
        if ( !center ) {
            center = new Dot2d( 0, 0 );
        }
        const from = this.sub( center );
        const r = Math.sqrt( from.x * from.x + from.y * from.y );
        let phi: number;
        if ( r != 0 ) {
            phi = Math.acos( ( from.x ) / r ) * Math.sign( Math.asin( ( from.y ) / r ) );
        } else {
            phi = 1;
        }

        return new Dot2dPolar( r, phi );
    }

    add ( dot: Dot2d ) {
        return new Dot2d( this.x + dot.x, this.y + dot.y, this.color );
    }

    sub ( dot: Dot2d ) {
        return new Dot2d( this.x - dot.x, this.y - dot.y, this.color );
    }

    floor () {
        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
    }

    draw ( brush: Brush ): void {
        brush.draw_point( this, this.color );
    }

    set ( to: Dot2d ) {
        this.x = to.x;
        this.y = to.y;
    }

    distance_to ( target: Dot2d ) {
        const x = this.x - target.x;
        const y = this.y - target.y;
        return Math.sqrt( x * x + y * y );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        return { id: 0, distance: pos.distance_to( this ) };
    }

    set_vertex ( vertex_id: number, target: Dot2d ): void {
        if ( vertex_id != 0 ) {
            throw new Error( 'Vertex id out of range' );
        }
        this.set( target );
    }

    is_in_rectangle ( a: Dot2d, b: Dot2d ) {
        const x_min = a.x < b.x ? a.x : b.x;
        const x_max = a.x > b.x ? a.x : b.x;
        const y_min = a.y < b.y ? a.y : b.y;
        const y_max = a.y > b.y ? a.y : b.y;

        if (
            this.x > x_max ||
            this.x < x_min ||
            this.y > y_max ||
            this.y < y_min
        ) {
            return false;
        }
        return true;
    }

    to_simple_object (): {x: number, y: number} {
        return { x: this.x, y: this.y };
    }
}

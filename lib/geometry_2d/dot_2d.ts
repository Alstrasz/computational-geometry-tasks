import { Dot2dPolar } from './dot_2d_polar';
import { Brush } from './interfaces/brush';
import { SceneElement } from './interfaces/scene_element';
import { Color } from './types/color';

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
        const r = Math.sqrt( this.x * this.x + this.y * this.y );
        const phi = Math.acos( ( from.x ) / r ) * Math.sign( Math.asin( ( from.y ) / r ) );
        return new Dot2dPolar( r, phi );
    }

    add ( dot: Dot2d ) {
        return new Dot2d( this.x + dot.x, this.y + dot.y, this.color );
    }

    sub ( dot: Dot2d ) {
        return new Dot2d( this.x - dot.x, this.y - dot.y, this.color );
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
}

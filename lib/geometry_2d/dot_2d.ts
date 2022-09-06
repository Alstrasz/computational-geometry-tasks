import { Dot2dPolar } from './dot_2d_polar';

export class Dot2d {
    constructor (
        public x: number,
        public y: number,
    ) {}

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
        return new Dot2d( this.x + dot.x, this.y + dot.y );
    }

    sub ( dot: Dot2d ) {
        return new Dot2d( this.x - dot.x, this.y - dot.y );
    }
}

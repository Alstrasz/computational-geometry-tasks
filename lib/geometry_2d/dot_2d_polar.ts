import { Dot2d } from './scene_element/dot_2d';

export class Dot2dPolar {
    constructor (
        public r: number,
        public phi: number,
    ) {}

    to_cartesian ( center?: Dot2d, not_floored?: boolean ): Dot2d {
        if ( !center ) {
            center = new Dot2d( 0, 0 );
        }
        const d = new Dot2d(
            this.r * Math.cos( this.phi ),
            this.r * Math.sin( this.phi ),
        )
            .add( center );
        if ( !not_floored ) {
            d.floor();
        }
        return d;
    }
}

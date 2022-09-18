import { Dot2d } from './scene_element/dot_2d';

export class Dot2dPolar {
    constructor (
        public r: number,
        public phi: number,
    ) {}

    to_cartesian ( center?: Dot2d ): Dot2d {
        if ( !center ) {
            center = new Dot2d( 0, 0 );
        }
        return new Dot2d(
            Math.floor( this.r * Math.cos( this.phi ) ),
            Math.floor( this.r * Math.sin( this.phi ) ),
        )
            .add( center );
    }
}

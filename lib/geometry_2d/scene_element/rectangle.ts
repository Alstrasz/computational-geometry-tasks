import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';


export class Rectangle implements SceneElement {
    constructor (
        public vetex_1: Dot2d,
        public vetex_2: Dot2d,
        private edit_mode: boolean = true,
        public color?: Color,
    ) {}

    draw ( brush: Brush ): void {
        const lt = new Dot2d( this.vetex_1.x, this.vetex_2.y );
        const rb = new Dot2d( this.vetex_2.x, this.vetex_1.y );
        brush.draw_line( this.vetex_1, lt, this.color );
        brush.draw_line( this.vetex_1, rb, this.color );
        brush.draw_line( this.vetex_2, lt, this.color );
        brush.draw_line( this.vetex_2, rb, this.color );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        const lt = new Dot2d( this.vetex_1.x, this.vetex_2.y );
        const rb = new Dot2d( this.vetex_2.x, this.vetex_1.y );

        const ret = {
            id: 0,
            distance: pos.distance_to( this.vetex_1 ),
        };

        if ( pos.distance_to( this.vetex_2 ) < ret.distance ) {
            ret.id = 1;
            ret.distance = pos.distance_to( this.vetex_2 );
        }

        if ( pos.distance_to( lt ) < ret.distance ) {
            ret.id = 2;
            ret.distance = pos.distance_to( lt );
        }

        if ( pos.distance_to( rb ) < ret.distance ) {
            ret.id = 3;
            ret.distance = pos.distance_to( rb );
        }

        return ret;
    }

    set_vertex ( vertex_id: number, target: Dot2d ): void {
        if ( vertex_id < 0 || vertex_id > 3 ) {
            throw new Error( 'Vertex id out of range' );
        }

        if ( this.edit_mode ) {
            if ( vertex_id === 0 ) {
                this.vetex_1.set( target );
            } else if ( vertex_id === 1 ) {
                this.vetex_2.set( target );
            } else if ( vertex_id === 2 ) {
                this.vetex_1.set( new Dot2d( target.x, this.vetex_1.y ) );
                this.vetex_2.set( new Dot2d( this.vetex_2.x, target.y ) );
            } else {
                this.vetex_1.set( new Dot2d( this.vetex_1.x, target.y ) );
                this.vetex_2.set( new Dot2d( target.x, this.vetex_2.y ) );
            }

            return;
        }

        let dv: Dot2d;

        if ( vertex_id === 0 ) {
            dv = target.sub( this.vetex_1 );
        } else if ( vertex_id === 1 ) {
            dv = target.sub( this.vetex_2 );
        } else if ( vertex_id === 2 ) {
            const lt = new Dot2d( this.vetex_1.x, this.vetex_2.y );
            dv = target.sub( lt );
        } else {
            const rb = new Dot2d( this.vetex_2.x, this.vetex_1.y );
            dv = target.sub( rb );
        }

        this.vetex_1.set( this.vetex_1.add( dv ) );
        this.vetex_2.set( this.vetex_2.add( dv ) );
    }

    set_edit_mode ( val: boolean ) {
        this.edit_mode = val;
    }
}

import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';


export class Rectangle implements SceneElement {
    constructor (
        public left_bot_vetex: Dot2d,
        public right_top_vetex: Dot2d,
        public color?: Color,
    ) {}

    draw ( brush: Brush ): void {
        const lt = new Dot2d( this.left_bot_vetex.x, this.right_top_vetex.y );
        const rb = new Dot2d( this.right_top_vetex.x, this.left_bot_vetex.y );
        brush.draw_line( this.left_bot_vetex, lt, this.color );
        brush.draw_line( this.left_bot_vetex, rb, this.color );
        brush.draw_line( this.right_top_vetex, lt, this.color );
        brush.draw_line( this.right_top_vetex, rb, this.color );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        const lt = new Dot2d( this.left_bot_vetex.x, this.right_top_vetex.y );
        const rb = new Dot2d( this.right_top_vetex.x, this.left_bot_vetex.y );

        const ret = {
            id: 0,
            distance: pos.distance_to( this.left_bot_vetex ),
        };

        if ( pos.distance_to( this.right_top_vetex ) < ret.distance ) {
            ret.id = 1;
            ret.distance = pos.distance_to( this.right_top_vetex );
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

        let dv: Dot2d;

        if ( vertex_id === 0 ) {
            dv = target.sub( this.left_bot_vetex );
        } else if ( vertex_id === 1 ) {
            dv = target.sub( this.right_top_vetex );
        } else if ( vertex_id === 2 ) {
            const lt = new Dot2d( this.left_bot_vetex.x, this.right_top_vetex.y );
            dv = target.sub( lt );
        } else {
            const rb = new Dot2d( this.right_top_vetex.x, this.left_bot_vetex.y );
            dv = target.sub( rb );
        }

        this.left_bot_vetex.set( this.left_bot_vetex.add( dv ) );
        this.right_top_vetex.set( this.right_top_vetex.add( dv ) );
    }
}

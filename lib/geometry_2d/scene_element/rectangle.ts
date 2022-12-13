import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';


export class Rectangle implements SceneElement {
    constructor (
        public vertex_1: Dot2d,
        public vertex_2: Dot2d,
        public color?: Color,
    ) {}

    draw ( brush: Brush ): void {
        const lt = new Dot2d( this.vertex_1.x, this.vertex_2.y );
        const rb = new Dot2d( this.vertex_2.x, this.vertex_1.y );
        brush.draw_line( this.vertex_1, lt, this.color );
        brush.draw_line( this.vertex_1, rb, this.color );
        brush.draw_line( this.vertex_2, lt, this.color );
        brush.draw_line( this.vertex_2, rb, this.color );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        const lt = new Dot2d( this.vertex_1.x, this.vertex_2.y );
        const rb = new Dot2d( this.vertex_2.x, this.vertex_1.y );

        const ret = {
            id: 0,
            distance: pos.distance_to( this.vertex_1 ),
        };

        if ( pos.distance_to( this.vertex_2 ) < ret.distance ) {
            ret.id = 1;
            ret.distance = pos.distance_to( this.vertex_2 );
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

    set_vertex ( vertex_id: number, target: Dot2d, move_shape?: boolean ): void {
        if ( vertex_id < 0 || vertex_id > 3 ) {
            throw new Error( 'Vertex id out of range' );
        }

        if ( move_shape ) {
            if ( vertex_id === 0 ) {
                this.vertex_1.set( target );
            } else if ( vertex_id === 1 ) {
                this.vertex_2.set( target );
            } else if ( vertex_id === 2 ) {
                this.vertex_1.set( new Dot2d( target.x, this.vertex_1.y ) );
                this.vertex_2.set( new Dot2d( this.vertex_2.x, target.y ) );
            } else {
                this.vertex_1.set( new Dot2d( this.vertex_1.x, target.y ) );
                this.vertex_2.set( new Dot2d( target.x, this.vertex_2.y ) );
            }

            return;
        }

        let dv: Dot2d;

        if ( vertex_id === 0 ) {
            dv = target.sub( this.vertex_1 );
        } else if ( vertex_id === 1 ) {
            dv = target.sub( this.vertex_2 );
        } else if ( vertex_id === 2 ) {
            const lt = new Dot2d( this.vertex_1.x, this.vertex_2.y );
            dv = target.sub( lt );
        } else {
            const rb = new Dot2d( this.vertex_2.x, this.vertex_1.y );
            dv = target.sub( rb );
        }

        this.vertex_1.set( this.vertex_1.add( dv ) );
        this.vertex_2.set( this.vertex_2.add( dv ) );
    }

    to_simple_object (): Array<{x: number, y: number}> {
        const ret: Array<{x: number, y: number}> = [];
        ret.push( { x: this.vertex_1.x, y: this.vertex_1.y } );
        ret.push( { x: this.vertex_2.x, y: this.vertex_2.y } );
        ret.push( { x: this.vertex_1.x, y: this.vertex_2.y } );
        ret.push( { x: this.vertex_2.x, y: this.vertex_1.y } );
        return ret;
    }
}

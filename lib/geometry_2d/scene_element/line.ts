import { line_intersection } from '../helpers';
import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';


export class Line implements SceneElement {
    public interactive = true;

    constructor (
        public dot_1: Dot2d,
        public dot_2: Dot2d,
        public color?: Color,
        public line_width: number = 2,
    ) {}

    draw ( brush: Brush ): void {
        brush.draw_line( this.dot_1, this.dot_2, this.color );
        brush.draw_point( this.dot_1 );
        brush.draw_point( this.dot_2 );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        if ( !this.interactive ) {
            return { id: -1, distance: 100000 };
        }
        const dist_1 = pos.distance_to( this.dot_1 );
        const dist_2 = pos.distance_to( this.dot_2 );
        if ( dist_1 < dist_2 ) {
            return {
                id: 0,
                distance: dist_1,
            };
        } else {
            return {
                id: 1,
                distance: dist_2,
            };
        }
    }

    set_vertex ( vertex_id: number, target: Dot2d, move_shape?: boolean ): void {
        if ( vertex_id < 0 || vertex_id > 1 ) {
            throw new Error( 'Vertex id out of range' );
        }
        if ( vertex_id == 0 ) {
            this.dot_1.set( target );
        } else {
            this.dot_2.set( target );
        }
    }

    intersects_with ( line: Line ): boolean {
        const dot = line_intersection( line.dot_1, line.dot_2, this.dot_1, this.dot_2 );
        if ( dot == null ) {
            return false;
        }
        const number_between = ( a: number, b: number, c: number ) => {
            return ( a < b ? a : b ) <= c && c <= ( a > b ? a : b );
        };
        console.log(
            dot,
            number_between( line.dot_1.x, line.dot_2.x, dot.x ),
            number_between( line.dot_1.y, line.dot_2.y, dot.y ),
            number_between( this.dot_1.x, this.dot_2.x, dot.x ),
            number_between( this.dot_1.y, this.dot_2.y, dot.y ),
        );
        if (
            ( number_between( line.dot_1.x, line.dot_2.x, dot.x ) && number_between( line.dot_1.y, line.dot_2.y, dot.y ) ) &&
            ( number_between( this.dot_1.x, this.dot_2.x, dot.x ) && number_between( this.dot_1.y, this.dot_2.y, dot.y ) )
        ) {
            return true;
        }
        return false;
    }

    to_simple_object () {
        return [this.dot_1.to_simple_object(), this.dot_2.to_simple_object()];
    }
}

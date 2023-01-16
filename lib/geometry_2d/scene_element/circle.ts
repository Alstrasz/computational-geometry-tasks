import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';


export class Circle implements SceneElement {
    public interactive = true;

    constructor (
        public center: Dot2d,
        public radius: number,
        public color?: Color,
        public line_width: number = 2,
    ) {}

    draw ( brush: Brush ): void {
        brush.draw_circle( this.center, this.radius, this.color, this.line_width );
        brush.draw_point( this.center, this.color );
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        if ( !this.interactive ) {
            return { id: -1, distance: 100000 };
        }
        return {
            id: 0,
            distance: pos.distance_to( this.center ),
        };
    }

    set_vertex ( vertex_id: number, target: Dot2d, move_shape?: boolean ): void {
        if ( vertex_id != 0 ) {
            throw new Error( 'Vertex id out of range' );
        }
        this.center.set( target );
    }

    to_simple_object () {
        return {
            x: this.center.x,
            y: this.center.y,
            r: this.radius,
        };
    }
}

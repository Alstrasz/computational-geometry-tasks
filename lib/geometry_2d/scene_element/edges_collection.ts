import { Dot2d } from './dot_2d';
import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { cloneDeep, range, sortedIndex } from 'lodash-es';
import { Rectangle } from './rectangle';

export class EdgesCollection implements SceneElement {
    constructor ( private edges: Array<[Dot2d, Dot2d]> = [], public color?: Color ) {

    }

    draw ( brush: Brush ): void {
        for ( const edge of this.edges ) {
            brush.draw_line( edge[0], edge[1], this.color );
        }
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        return { id: -1, distance: 100000 };
    }

    set_vertex (): void {
        // cannnot move vertexes of this collection
    }

    to_simple_object (): Array<[{x: number, y: number}, {x: number, y: number}]> {
        const ret: Array<[{x: number, y: number}, {x: number, y: number}]> = [];
        for ( const edge of this.edges ) {
            ret.push( [edge[0].to_simple_object(), edge[1].to_simple_object()] );
        }
        return ret;
    }
}


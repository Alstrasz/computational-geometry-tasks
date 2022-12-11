import { Dot2d } from './dot_2d';
import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { cloneDeep, range, sortedIndex } from 'lodash-es';
import { Rectangle } from './rectangle';

export class Dot2dQuickFindCollection implements SceneElement {
    private dots: Array<Dot2d> = [];
    private precomputed_dots_count: Array<Array<number>> = [];
    private x_index_sorted: Array<number> = [];
    private y_index_sorted: Array<number> = [];
    color?: Color;

    constructor ( dots: Array<Dot2d>, color?: Color ) {
        this.color = color;
        this.dots = cloneDeep( dots );
        if ( this.color ) {
            for ( const dot of this.dots ) {
                dot.color = this.color;
            }
        }
        this.precompute();
    }

    precompute () {
        this.x_index_sorted = range( 0, this.dots.length );
        this.y_index_sorted = range( 0, this.dots.length );

        this.x_index_sorted.sort( ( a, b ) => this.dots[a].x - this.dots[b].x );
        this.y_index_sorted.sort( ( a, b ) => this.dots[a].y - this.dots[b].y );

        this.precomputed_dots_count.length = this.dots.length + 1;
        for ( let i = 0; i < this.precomputed_dots_count.length; i++ ) {
            this.precomputed_dots_count[i] = [];
            this.precomputed_dots_count[i].length = this.dots.length + 1;
            this.precomputed_dots_count[i].fill( 0 );
        }
        for ( let i = 0; i < this.dots.length; i++ ) {
            let add = false;
            for ( let j = 0; j < this.dots.length; j++ ) {
                if ( this.y_index_sorted[j] == this.x_index_sorted[i] ) {
                    add = true;
                }
                this.precomputed_dots_count[i + 1][j + 1] = this.precomputed_dots_count[i][j + 1] + ( add ? 1 : 0 );
            }
        }
        console.log( this.precomputed_dots_count );
        this.x_index_sorted = this.x_index_sorted.map( ( v ) => this.dots[v].x );
        this.y_index_sorted = this.y_index_sorted.map( ( v ) => this.dots[v].y );
    }

    count_dots_in_rectangle ( rect: Rectangle ): number;
    count_dots_in_rectangle ( left_bot: Dot2d, right_top: Dot2d ): number;
    count_dots_in_rectangle ( left_bot_or_rect: Dot2d | Rectangle, right_top?: Dot2d ) {
        let lb: Dot2d;
        let rt: Dot2d;
        if ( right_top ) {
            lb = left_bot_or_rect as Dot2d;
            rt = right_top;
        } else {
            const rect = left_bot_or_rect as Rectangle;
            lb = new Dot2d(
                rect.vertex_1.x < rect.vertex_2.x ? rect.vertex_1.x : rect.vertex_2.x,
                rect.vertex_1.y < rect.vertex_2.y ? rect.vertex_1.y : rect.vertex_2.y,
            );
            rt = new Dot2d(
                rect.vertex_1.x > rect.vertex_2.x ? rect.vertex_1.x : rect.vertex_2.x,
                rect.vertex_1.y > rect.vertex_2.y ? rect.vertex_1.y : rect.vertex_2.y,
            );
        }
        const lbx = sortedIndex( this.x_index_sorted, lb.x );
        const lby = sortedIndex( this.y_index_sorted, lb.y );
        const rtx = sortedIndex( this.x_index_sorted, rt.x );
        const rty = sortedIndex( this.y_index_sorted, rt.y );

        return this.precomputed_dots_count[rtx][rty] + this.precomputed_dots_count[lbx][lby] - this.precomputed_dots_count[lbx][rty] - this.precomputed_dots_count[rtx][lby];
    }

    draw ( brush: Brush ): void {
        for ( const dot of this.dots ) {
            dot.draw( brush );
        }
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        // cannnot move vertexes of this collection

        return { id: -1, distance: 100000 };

        // if ( this.dots.length == 0 ) {
        //     return { id: -1, distance: 10000 };
        // }
        // let min_dist = 0;
        // let index: number = this.dots[0].distance_to( pos );

        // for ( let i = 0; i < this.dots.length; i ++ ) {
        //     if ( min_dist > this.dots[i].distance_to( pos ) ) {
        //         min_dist = this.dots[i].distance_to( pos );
        //         index = i;
        //     }
        // }
        // return { id: index, distance: min_dist };
    }

    set_vertex (): void {
        // cannnot move vertexes of this collection
    }

    to_simple_object (): Array<{x: number, y: number}> {
        const ret: Array<{x: number, y: number}> = [];
        for ( const dot of this.dots ) {
            ret.push( { x: dot.x, y: dot.y } );
        }
        return ret;
    }
}


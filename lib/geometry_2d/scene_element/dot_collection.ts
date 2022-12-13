import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';
import { Shape } from './shape';
import { cloneDeep, minBy, map, min } from 'lodash-es';
import { vect_2d_angle, vect_2d_mult } from '../helpers';


export class DotCollection implements SceneElement {
    public dots!: Array<Dot2d>;
    public color?: Color;

    constructor( dots: Array<Dot2d>, color?: Color );
    constructor( count: number, x_begin: number, y_begin: number, width: number, height: number, color?: Color );
    constructor (
        dots_or_count: Array<Dot2d> | number,
        x_begin_or_color?: Color | number,
        y_begin?: number,
        width?: number,
        height?: number,
        color?: Color,
    ) {
        if ( typeof dots_or_count == 'number' ) {
            this.color = color;
            this.construct_from_random( dots_or_count, x_begin_or_color as number, y_begin as number, width as number, height as number );
        } else {
            this.color = x_begin_or_color as Color | undefined;
            this.construct_from_array( dots_or_count );
        }
    }

    construct_from_array ( dots: Array<Dot2d> ) {
        this.dots = dots;
    }

    construct_from_random ( count: number, x_begin: number, y_begin: number, width: number, height: number ) {
        this.dots = [];
        for ( let i = 0; i < count; i++ ) {
            this.dots.push( new Dot2d( x_begin + Math.floor( Math.random() * width ), y_begin + Math.floor( Math.random() * height ), this.color ) );
        }
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        if ( this.dots.length == 0 ) {
            throw new Error( 'No dots in colletion' );
        }
        const ret = {
            id: 0,
            distance: pos.distance_to( this.dots[0] ),
        };
        for ( let i = 1; i < this.dots.length; i ++ ) {
            if ( pos.distance_to( this.dots[i] ) < ret.distance ) {
                ret.id = i;
                ret.distance = pos.distance_to( this.dots[i] );
            }
        }
        return ret;
    }

    set_vertex ( vertex_id: number, target: Dot2d, move_shape?: boolean ): void {
        if ( vertex_id < 0 || vertex_id >= this.dots.length ) {
            throw new Error( 'Vertex id out of range' );
        }
        if ( move_shape ) {
            const diff = this.dots[vertex_id].sub( target );

            this.dots = this.dots.map( ( dot ) => {
                return dot.add( diff );
            } );

            return;
        }
        this.dots[vertex_id].set( target );
    }

    draw ( brush: Brush ): void {
        this.dots.forEach( ( dot ) => {
            dot.draw( brush );
        } );
    }

    convex_shape ( type: 'n4' | 'n2' | 'nlogn' ): Array<Dot2d> {
        switch ( type ) {
        case 'n4':
            return this.convex_shape_n4();
        case 'n2':
            return this.convex_shape_n2();
        case 'nlogn':
            return this.convex_shape_nlogn();
        default:
            return this.convex_shape_nlogn();
        }
    }

    convex_shape_n4 (): Array<Dot2d> {
        const ret: Array<Dot2d> = [];
        const cadidates: Array<boolean> = [];

        const N = this.dots.length;

        cadidates.length = N;
        cadidates.fill( true );

        for ( let i = 0; i < N; i++ ) {
            for ( let j = 0; j < N; j++ ) {
                for ( let k = 0; k < N; k++ ) {
                    if ( i != j && i != k && j != k ) {
                        const shape = new Shape( [this.dots[i], this.dots[j], this.dots[k]] );
                        for ( let u = 0; u < N; u++ ) {
                            if ( u != i && u != j && u != k && shape.is_dot_inside_by_ray( this.dots[u] ) ) {
                                cadidates[u] = false;
                            }
                        }
                    }
                }
            }
        }

        let x = 0;
        let y = 0;
        let c = 0;
        for ( let i = 0; i < N; i++ ) {
            if ( cadidates[i] ) {
                c++;
                x += this.dots[i].x;
                y += this.dots[i].y;
                ret.push( this.dots[i] );
            }
        }

        x /= c;
        y /= c;

        ret.sort( ( a: Dot2d, b: Dot2d ) => {
            return b.to_polar( new Dot2d( x, y ) ).phi - a.to_polar( new Dot2d( x, y ) ).phi;
        } );

        return ret;
    }

    convex_shape_n2 (): Array<Dot2d> {
        const ret: Array<Dot2d> = [];

        const sorted_dots = cloneDeep( this.dots );

        let max_y = 0;
        sorted_dots.forEach( ( dot ) => {
            max_y = max_y > dot.y ? max_y : dot.y;
        } );

        sorted_dots.sort( ( a: Dot2d, b: Dot2d ) => {
            return a.x * max_y + a.y - b.x * max_y + b.y;
        } );

        ret.push( sorted_dots[0] );

        // let min_phi_dot = minBy( sorted_dots, ( a: Dot2d ) => {
        //     return a.to_polar( new Dot2d( ret[0].x, ret[0].y ) ).phi;
        // } );
        // if ( min_phi_dot == undefined ) {
        //     console.log( 'bbad1' );
        //     return ret;
        // }

        // ret.push( min_phi_dot );

        // min_phi_dot = minBy( sorted_dots, ( a: Dot2d ) => {
        //     return vect_2d_angle( ret[ret.length - 1], a, ret[ret.length - 2] );
        // } );
        // if ( min_phi_dot == undefined ) {
        //     console.log( 'bbad2' );
        //     return ret;
        // }
        // while ( min_phi_dot.x != ret[0].x && min_phi_dot.y != ret[0].y ) {
        //     ret.push( min_phi_dot );
        //     const angles = map( sorted_dots, ( a: Dot2d ) => {
        //         if ( a.x == ret[ret.length - 2].x && a.y == ret[ret.length - 2].y ) {
        //             return 100000;
        //         }
        //         return vect_2d_angle( ret[ret.length - 1], a, ret[ret.length - 2] );
        //     } );
        //     let min = 10000000; let argmin = -1;
        //     for ( let i = 0; i < angles.length; i++ ) {
        //         if ( angles[i] < min ) {
        //             min = angles[i];
        //             argmin = i;
        //         }
        //     }
        //     min_phi_dot = sorted_dots[argmin];
        //     console.log( angles, sorted_dots );
        //     if ( min_phi_dot == undefined ) {
        //         console.log( 'bbad3' );
        //         return ret;
        //     }
        // }

        return ret;
    }

    convex_shape_nlogn (): Array<Dot2d> {
        const ret: Array<Dot2d> = [];

        const sorted_dots = cloneDeep( this.dots );

        let max_y = 0;
        sorted_dots.forEach( ( dot ) => {
            max_y = max_y > dot.y ? max_y : dot.y;
        } );

        sorted_dots.sort( ( a: Dot2d, b: Dot2d ) => {
            return a.x * max_y + a.y - b.x * max_y + b.y;
        } );

        ret.push( sorted_dots[0] );
        sorted_dots.shift();

        sorted_dots.sort( ( a: Dot2d, b: Dot2d ) => {
            return b.to_polar( new Dot2d( ret[0].x, ret[0].y ) ).phi - a.to_polar( new Dot2d( ret[0].x, ret[0].y ) ).phi;
        } );

        ret.push( sorted_dots[0] );
        sorted_dots.shift();

        while ( sorted_dots.length ) {
            while ( ret.length > 2 && vect_2d_mult( ret[ret.length - 1], sorted_dots[0], ret[ret.length - 2] ) > 0 ) {
                ret.pop();
            }
            ret.push( sorted_dots[0] );
            sorted_dots.shift();
        }

        return ret;
    }

    to_simple_object (): Array<{x: number, y: number}> {
        const ret: Array<{x: number, y: number}> = [];
        for ( const dot of this.dots ) {
            ret.push( { x: dot.x, y: dot.y } );
        }
        return ret;
    }
}

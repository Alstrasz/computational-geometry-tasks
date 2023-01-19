import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Color } from '../types/color';
import { Dot2d } from './dot_2d';
import { Shape } from './shape';
import { cloneDeep, minBy, map, min, result } from 'lodash-es';
import { bin_search, get_circle_centers, vect_2d_angle, vect_2d_mult } from '../helpers';


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
            return this.convex_shape_nlogn();
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

        let first_min_dot_id = 0;

        for ( let i = 0; i < this.dots.length; i++ ) {
            if ( this.dots[i].y < this.dots[first_min_dot_id].y ) {
                first_min_dot_id = i;
            }
            if ( this.dots[i].y == this.dots[first_min_dot_id].y && this.dots[i].x < this.dots[first_min_dot_id].x ) {
                first_min_dot_id = i;
            }
        }

        console.log( this.dots, first_min_dot_id );

        ret.push( this.dots[first_min_dot_id] );

        const reserved_dots: Array<boolean> = [];
        reserved_dots.length = this.dots.length;
        reserved_dots.fill( false );

        const get_min_dot_id = ( a: Dot2d, b: Dot2d ) => {
            let min_dot_id = -1;
            let min_angle = 40;
            for ( let i = 0; i < this.dots.length; i++ ) {
                if ( reserved_dots[i] ) {
                    continue;
                }
                const angle = vect_2d_angle( b, this.dots[i], a );
                // console.log( angle );
                if ( angle < min_angle ) {
                    min_dot_id = i;
                    min_angle = angle;
                }
            }
            return min_dot_id;
        };

        let min_dot_id = get_min_dot_id( ret[0], new Dot2d( ret[0].x + 100, ret[0].y ) );

        ret.push( this.dots[min_dot_id] );
        reserved_dots[min_dot_id] = true;

        while ( true ) {
            min_dot_id = get_min_dot_id( ret[ret.length - 2], ret[ret.length - 1] );
            console.log( min_dot_id, first_min_dot_id );
            if ( min_dot_id == first_min_dot_id ) {
                break;
            }
            reserved_dots[min_dot_id] = true;
            ret.push( this.dots[min_dot_id] );
        }

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

    convex_circle () {
        let min_x = this.dots[0].x;
        let max_x = min_x;
        let min_y = this.dots[0].y;
        let max_y = min_y;
        for ( const dot of this.dots ) {
            min_x = min_x < dot.x ? min_x : dot.x;
            max_x = max_x > dot.x ? max_x : dot.x;
            min_y = min_y < dot.y ? min_y : dot.y;
            max_y = max_y > dot.y ? max_y : dot.y;
        }
        const max_rad = max_x - min_x + max_y - min_y;
        const res = {
            dot_1: this.dots[0],
            dot_2: this.dots[1],
            radius: max_rad,
        };

        for ( let i = 0; i < this.dots.length; i++ ) {
            for ( let j = 0; j < this.dots.length; j++ ) {
                if ( i == j ) {
                    // continue;
                }
                const dot_1 = this.dots[i];
                const dot_2 = this.dots[j];
                const rad = bin_search( 1, res.radius, ( m: number ) => {
                    const centers = get_circle_centers( dot_1, dot_2, max_rad );
                    let check_1 = true;
                    let check_2 = true;
                    for ( let k = 0; k < this.dots.length; k++ ) {
                        if ( k == i || k == j ) {
                            continue;
                        }
                        const inner_dot = this.dots[k];
                        if ( inner_dot.distance_to( centers[0] ) > m ) {
                            check_1 = false;
                        }
                        if ( inner_dot.distance_to( centers[1] ) > m ) {
                            check_2 = false;
                        }
                    }
                    return check_1 || check_2;
                } );
                if ( rad < res.radius ) {
                    res.radius = rad;
                    res.dot_1 = dot_1;
                    res.dot_2 = dot_2;
                }
            }
        }

        const centers = get_circle_centers( res.dot_1, res.dot_2, res.radius );

        // console.log( res.dot_1, res.dot_2, centers, res.radius, max_rad );

        let check = true;

        for ( const inner_dot of this.dots ) {
            if ( inner_dot.distance_to( centers[0] ) > res.radius * 1.1 ) {
                check = false;
            }
        }

        return {
            center: check ? centers[0] : centers[1],
            radius: res.radius,
        };
    }

    to_simple_object (): Array<{x: number, y: number}> {
        const ret: Array<{x: number, y: number}> = [];
        for ( const dot of this.dots ) {
            ret.push( { x: dot.x, y: dot.y } );
        }
        return ret;
    }
}

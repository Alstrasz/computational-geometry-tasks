import { Brush } from '../interfaces/brush';
import { SceneElement } from '../interfaces/scene_element';
import { Dot2d } from './dot_2d';
import { Color } from '../types/color';
import { Dot2dPolar } from '../dot_2d_polar';
import { horizontal_ray_with_segment_intersection } from '../helpers';

export class Shape implements SceneElement {
    private vertices!: Array<Dot2d>;
    public color?: Color;


    constructor( vertices: Array<Dot2d>, color?: Color );
    constructor( center: Dot2d, num_vertices: number, radius: number, irregularity: number, spikeness: number, color?: Color );
    constructor ( center_or_vertices: Dot2d | Array<Dot2d>, num_vertices_or_color?: number | Color, radius?: number, irregularity?: number, spikeness?: number, color?: Color ) {
        if ( Array.isArray( center_or_vertices ) ) {
            this.from_vertices( center_or_vertices );
            this.color = num_vertices_or_color as Color | undefined;
        } else {
            this.from_gen_random( center_or_vertices, num_vertices_or_color as number, radius as number, irregularity as number, spikeness as number );
            this.color = color;
        }
    }

    draw ( brush: Brush ) {
        for ( let i = 0; i < this.vertices.length; i ++ ) {
            brush.draw_line( this.vertices[i], this.vertices[( i + 1 ) % this.vertices.length], this.color );
        }
    }

    private from_gen_random ( center: Dot2d, num_vertices: number, radius: number, irregularity: number, spikeness: number ) {
        this.vertices = [];
        for ( let i = 0; i < num_vertices; i++ ) {
            this.vertices.push(
                new Dot2dPolar(
                    radius * ( ( Math.random() * 2 - 1 ) * spikeness + 1 ),
                    ( 2 * Math.PI ) / num_vertices * ( i + Math.random() * irregularity ),
                ).to_cartesian( center ),
            );
        }
    }

    private from_vertices ( vertices: Array<Dot2d> ) {
        this.vertices = vertices;
    }

    is_dot_inside ( dot: Dot2d ) {
        let count = 0;
        for ( let i = 0; i < this.vertices.length; i ++ ) {
            if ( horizontal_ray_with_segment_intersection( dot, this.vertices[i], this.vertices[( i + 1 ) % this.vertices.length] ) ) {
                count++;
            }
        }
        return count % 2 === 1;
    }

    closest_vertex ( pos: Dot2d ): { id: number; distance: number; } {
        const ret = {
            id: 0,
            distance: pos.distance_to( this.vertices[0] ),
        };
        for ( let i = 1; i < this.vertices.length; i ++ ) {
            if ( pos.distance_to( this.vertices[i] ) < ret.distance ) {
                ret.id = i;
                ret.distance = pos.distance_to( this.vertices[i] );
            }
        }
        return ret;
    }

    set_vertex ( vertex_id: number, target: Dot2d ): void {
        if ( vertex_id < 0 || vertex_id >= this.vertices.length ) {
            throw new Error( 'Vertex id out of range' );
        }
        this.vertices[vertex_id].set( target );
    }

    array_short (): Array<[number, number]> {
        return this.vertices.map( ( val ) => [val.x, val.y] );
    }
}

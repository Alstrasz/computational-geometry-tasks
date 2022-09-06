import { Brush } from './interfaces/brush';
import { SceneElement } from './interfaces/scene_element';
import { Dot2d } from './dot_2d';
import { Color } from './types/color';
import { Dot2dPolar } from './dot_2d_polar';

export class Shape implements SceneElement {
    public vertices: Array<Dot2d>;
    public color?: Color;


    constructor( vertices: Array<Dot2d>, color?: Color );
    constructor( center: Dot2d, num_vertices: number, radius: number, irregularity: number, spikeness: number, color?: Color );
    constructor ( center_or_vertices: Dot2d | Array<Dot2d>, num_vertices_or_color?: number | Color, radius?: number, irregularity?: number, spikeness?: number, color?: Color ) {
        if ( Array.isArray( center_or_vertices ) ) {
            this.from_vertices( this.vertices );
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
                    radius * Math.random() * spikeness,
                    ( 2 * Math.PI ) / num_vertices * ( i + Math.random() * irregularity ),
                ).to_cartesian( center ),
            );
        }
    }

    private from_vertices ( vertices: Array<Dot2d> ) {
        this.vertices = vertices;
    }
}

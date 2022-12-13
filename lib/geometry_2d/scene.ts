import { EventEmitter } from 'events';
import { Dot2d } from './scene_element/dot_2d';
import { Brush } from './interfaces/brush';
import { SceneElement } from './interfaces/scene_element';
import { SceneSelectedVertex } from './types/scene_selected_vertex';

export class Scene {
    private elements: { [name: string]: SceneElement } = {};
    private generated_name_counter = 0;
    /**
     * Supported events: 'draw', 'vertex_moved'
     *
     * @private
     * @memberof CanvasScene
     */
    protected event_emmiter = new EventEmitter();
    move_shape: boolean = false;

    constructor (
        public brush: Brush,
    ) { }

    add_element ( element: SceneElement, name?: string ) {
        if ( name ) {
            if ( name in element ) {
                throw new Error( 'Element name already taken' );
            }
        } else {
            name = this.get_unique_elemt_name();
        }
        this.elements[name] = element;
        return name;
    }

    remove_element ( name: string ) {
        delete this.elements[name];
    }

    get_element ( name: string ) {
        return this.elements[name];
    }

    private get_unique_elemt_name () {
        while ( true ) {
            const name = `__name:${this.generated_name_counter}`;
            this.generated_name_counter++;
            if ( !( name in this.elements ) ) {
                return name;
            }
        }
    }

    draw () {
        this.brush.fill_all( { r: 255, b: 0, g: 0 } );
        // eslint-disable-next-line guard-for-in
        for ( const prop in this.elements ) {
            this.elements[prop].draw( this.brush );
        }
        this.event_emmiter.emit( 'draw' );
    }

    select_vertex ( threshold: number, pos: Dot2d ): SceneSelectedVertex | undefined {
        const keys = Object.keys( this.elements );
        if ( keys.length === 0 ) {
            return undefined;
        }
        let vertex = this.elements[keys[0]].closest_vertex( pos );
        let elem_id = 0;
        for ( let i = 1; i < keys.length; i++ ) {
            const v = this.elements[keys[i]].closest_vertex( pos );
            if ( v.distance < vertex.distance ) {
                elem_id = i;
                vertex = v;
            }
        }
        if ( vertex.distance > threshold ) {
            return undefined;
        }
        return { elem_name: keys[elem_id], vertex_id: vertex.id };
    }

    move_vertex ( selector: SceneSelectedVertex, to: Dot2d ) {
        if ( this.elements[selector.elem_name] ) {
            this.elements[selector.elem_name].set_vertex( selector.vertex_id, to, this.move_shape );
            this.event_emmiter.emit( 'vertex_moved', selector, to );
        }
    }
}

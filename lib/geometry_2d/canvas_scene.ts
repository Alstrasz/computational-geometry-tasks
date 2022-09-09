import { CanvasBrush } from './canvas_brush';
import { Dot2d } from './dot_2d';
import { Scene } from './scene';
import { SceneSelectedVertex } from './types/scene_selected_vertex';

export class CanvasScene extends Scene {
    context: CanvasRenderingContext2D;
    brush: CanvasBrush;
    private selected_vertex: SceneSelectedVertex | undefined = undefined;
    private render_interval;

    constructor ( public canvas: HTMLCanvasElement ) {
        const ctx = canvas.getContext( '2d' );
        if ( ctx == null ) {
            throw new Error( 'Context is null' );
        }
        const rect = canvas.getBoundingClientRect();
        const brush = new CanvasBrush( ctx, rect.width, rect.height );
        super( brush );
        this.context = ctx;
        this.brush = brush;

        canvas.onmousedown = ( ev ) => {
            this.selected_vertex = this.select_vertex( 5, this.get_dot_from_mouse_event( ev ) );
        };

        canvas.onmousemove = ( ev ) => {
            if ( this.selected_vertex ) {
                this.move_vertex( this.selected_vertex, this.get_dot_from_mouse_event( ev ) );
            }
        };

        canvas.onmouseup = ( ev ) => {
            this.selected_vertex = undefined;
        };

        this.render_interval = setInterval( () => {
            this.draw();
        }, 16 );
    }

    private get_dot_from_mouse_event ( ev: MouseEvent ) {
        const rect = this.canvas.getBoundingClientRect();
        return new Dot2d( ev.clientX - rect.x, ev.clientY - rect.y );
    }

    destroy () {
        this.canvas.onmousedown = null;
        this.canvas.onmousemove = null;
        this.canvas.onmouseup = null;
        clearInterval( this.render_interval );
        this.event_emmiter.removeAllListeners();
    }

    get_size () {
        const rect = this.canvas.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }

    on ( type: 'draw', func: () => void ) {
        this.event_emmiter.addListener( type, func );
    }
}

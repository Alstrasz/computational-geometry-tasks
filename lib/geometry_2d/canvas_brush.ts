import { Dot2d } from './dot_2d';
import { Brush } from './interfaces/brush';
import { Color } from './types/color';

export class CanvasBrush implements Brush {
    constructor (
        private context: CanvasRenderingContext2D,
        private width: number,
        private height: number,
    ) {}

    draw_line ( from: Dot2d, to: Dot2d, color?: Color | undefined ): void {
        this.context.strokeStyle = this.color_type_to_string( color || { r: 0, g: 0, b: 255 } );
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.moveTo( Math.round( from.x ), Math.round( from.y ) );
        this.context.lineTo( Math.round( to.x ), Math.round( to.y ) );
        this.context.closePath();
        this.context.stroke();
    }

    draw_point ( pos: Dot2d, color?: Color | undefined ): void {
        this.context.fillStyle = this.color_type_to_string( color || { r: 0, g: 255, b: 0 } );
        this.context.fillRect( Math.round( pos.x ) - 1, Math.round( pos.y ) - 1, 3, 3 );
    }

    fill_all ( color: Color ): void {
        this.context.fillStyle = 'this.color_type_to_string( color )';
        this.context.clearRect( 0, 0, this.width, this.height );
    }

    private color_type_to_string ( color: Color ) {
        const trim_range = ( val: number ) => {
            return val > 255 ? 255 : ( val < 0 ? 0 : val );
        };
        return `rgb(${trim_range( color.r )},${trim_range( color.g )},${trim_range( color.b )})`;
    }
}

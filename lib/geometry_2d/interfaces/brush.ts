import { Dot2d } from '../scene_element/dot_2d';
import { Color } from '../types/color';

export abstract class Brush {
    abstract draw_line ( from: Dot2d, to: Dot2d, color?: Color, lineWidth?: number ): void;

    abstract draw_point ( pos: Dot2d, color?: Color ): void;

    abstract fill_all ( color: Color ): void;
}

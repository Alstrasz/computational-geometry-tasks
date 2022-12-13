import { Dot2d } from '../scene_element/dot_2d';
import { Brush } from './brush';

export abstract class SceneElement {
    abstract draw ( brush: Brush ): void;

    abstract closest_vertex ( pos: Dot2d ): { id: number, distance: number }

    abstract set_vertex ( vertex_id: number, target: Dot2d, move_shape?: boolean ): void;

    abstract to_simple_object (): unknown;
}

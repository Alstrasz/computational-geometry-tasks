import { Brush } from './brush';

export abstract class SceneElement {
    abstract draw ( brush: Brush ): void;
}

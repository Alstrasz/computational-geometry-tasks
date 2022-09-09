<template>
    <div>
        <canvas ref="canvas" class="canvas bg-blue-grey-14" width="512" height="512"></canvas>
    </div>
    <p>
        Dot inside: {{dot_inside}}
    </p>
</template>

<style>
.canvas {
    border: 1px white solid;
}
</style>

<script setup lang="ts">
import { CanvasScene } from '../../lib/geometry_2d/canvas_scene';
import { onDeactivated, onMounted, ref } from 'vue';
import { Shape } from '../../lib/geometry_2d/shape';
import { Dot2d } from '../../lib/geometry_2d/dot_2d';

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;
const dot_inside = ref( false );

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    const shape = new Shape( new Dot2d( 256, 256 ), 16, 128, 0.2, 0.6, { r: 0, g: 0, b: 255 } );
    const dot = new Dot2d( 256, 256, { r: 0, g: 255, b: 0 } );

    scene.add_element( shape );
    scene.add_element( dot );

    scene.on( 'draw', () => {
        dot_inside.value = shape.is_dot_inside( dot );
    } );
} );

onDeactivated( () => {
    scene?.destroy();
} );
</script>

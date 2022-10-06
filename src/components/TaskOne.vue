<template>
    <q-card-section>
        <div>
            <canvas ref="canvas" class="canvas bg-blue-grey-14" width="512" height="512"></canvas>
        </div>
    </q-card-section>

    <q-card-section>
        <p v-bind:class="{ 'text-positive': dot_inside, 'text-negative': !dot_inside, }">
            Dot inside: {{dot_inside}}
        </p>
        <q-checkbox v-model="check_by_ray" label="Check by ray" @update:model-value="recheck()"/>
        <p>
            Shape vertices: {{shape_dots_pos_string}}
        </p>
        <p>
            Dot position: {{dot_pos_string}}
        </p>
    </q-card-section>

    <q-card-actions>
        <q-btn color="accent" label="Create custom shape" class="text-capitalize" @click="input_shape_dialog_active = true" />
        <ShapeInput v-model="input_shape_dialog_active" @created:shape="set_shape($event)" :dotst_only="false"></ShapeInput>
    </q-card-actions>
</template>

<style>
.canvas {
    border: 1px white solid;
}
</style>

<script setup lang="ts">
import { CanvasScene } from '../../lib/geometry_2d/canvas_scene';
import { onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue';
import { Shape } from '../../lib/geometry_2d/scene_element/shape';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import ShapeInput from './ShapeInput.vue';

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;

const dot_inside = ref( false );
const input_shape_dialog_active = ref( false );
const check_by_ray = ref( true );

let shape = new Shape( new Dot2d( 256, 256 ), 16, 128, 0.2, 0.6, false, { r: 0, g: 0, b: 255 } );
const dot = new Dot2d( 256, 256, { r: 0, g: 255, b: 0 } );
const shape_dots_pos_string = ref( JSON.stringify( shape.array_short() ) );
const dot_pos_string = ref( `[${dot.x}, ${dot.y}]` );

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.add_element( shape, 'shape_base' );
    scene.add_element( dot );

    scene.on( 'vertex_moved', () => {
        recheck();
        shape_dots_pos_string.value = JSON.stringify( shape.array_short() );
        dot_pos_string.value = `[${dot.x}, ${dot.y}]`;
    } );
    recheck();
} );

onBeforeUnmount( () => {
    scene?.destroy();
} );

function set_shape ( dots: Array<Dot2d> ) {
    scene?.remove_element( 'shape_base' );
    shape = new Shape( dots, { r: 0, g: 0, b: 255 } );
    scene?.add_element( shape, 'shape_base' );
}

function recheck () {
    if ( check_by_ray.value ) {
        dot_inside.value = shape.is_dot_inside( dot, 'ray' );
    } else {
        dot_inside.value = shape.is_dot_inside( dot, 'vectors' );
    }
}
</script>

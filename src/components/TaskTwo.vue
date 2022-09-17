<template>
    <q-card-section>
        <div>
            <canvas ref="canvas" class="canvas bg-blue-grey-14" :width="CANVAS_W" :height="CANVAS_H"></canvas>
        </div>
    </q-card-section>

    <q-card-section>
        <p>
            Dots inside: {{dot_count}}
        </p>
    </q-card-section>

    <q-card-actions>
        <q-btn color="accent" label="Create custom dots" class="text-capitalize" @click="input_shape_dialog_active = true" />
        <ShapeInput v-model="input_shape_dialog_active" @created:shape="set_shape($event)" :dotst_only="true" :canvas_width="CANVAS_W" :canvas_height="CANVAS_H"></ShapeInput>
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
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import ShapeInput from './ShapeInput.vue';
import { Dot2dCollection } from '../../lib/geometry_2d/scene_element/dot_2d_collection';
import { Rectangle } from '../../lib/geometry_2d/scene_element/rectangle';

const CANVAS_W = ref( 512 );
const CANVAS_H = ref( 512 );

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;
const dot_count = ref( 0 );
const input_shape_dialog_active = ref( false );

const dt: Array<Dot2d> = [];
for ( let i = 0; i < 20; i++ ) {
    dt.push( new Dot2d( Math.floor( Math.random() * CANVAS_W.value ), Math.floor( Math.random() * CANVAS_H.value ) ) );
}

let dot_collection = new Dot2dCollection( dt, { r: 255, g: 0, b: 0 } );
const rect = new Rectangle( new Dot2d( 128, 128 ), new Dot2d( 256, 256 ), { r: 0, g: 255, b: 0 } );

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.add_element( dot_collection, 'dot_collection' );
    scene.add_element( rect );

    scene.on( 'draw', () => {
        dot_count.value = dot_collection.count_dots_in_rectangle( rect.left_bot_vetex, rect.right_top_vetex );
    } );
} );

onBeforeUnmount( () => {
    scene?.destroy();
} );

function set_shape ( dots: Array<Dot2d> ) {
    scene?.remove_element( 'dot_collection' );
    dot_collection = new Dot2dCollection( dots, { r: 255, g: 0, b: 0 } );
    scene?.add_element( dot_collection, 'dot_collection' );
}
</script>

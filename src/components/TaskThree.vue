<template>
    <div style="width: min-content;">
        <q-card-section>
            <div>
                <canvas ref="canvas" class="canvas bg-blue-grey-14" :width="CANVAS_W" :height="CANVAS_H"></canvas>
            </div>
        </q-card-section>

        <q-card-section>
            <q-checkbox v-model="is_convex" label="Is convex" @update:model-value="set_shape()"/>
            <br>
            <q-badge color="secondary">
                Radius: {{ rad }}
            </q-badge>
            <q-slider v-model="rad" :min="10" :max="CANVAS_W" @update:model-value="set_shape()"/>

            <q-badge color="secondary">
                Vertices count: {{ vertices_count }}
            </q-badge>
            <q-slider v-model="vertices_count" :min="4" :max="64" @update:model-value="set_shape()"/>

            <q-badge color="secondary">
                Irregularity: {{ irregularity }}
            </q-badge>
            <q-slider v-model="irregularity" :min="0" :max="1" :step="0.01" @update:model-value="set_shape()"/>

            <q-badge color="secondary">
                Spikiness: {{ spikiness }}
            </q-badge>
            <q-slider v-model="spikiness" :min="0" :max="1" :step="0.01" @update:model-value="set_shape()"/>
        </q-card-section>
    </div>
</template>

<style>
.canvas {
    border: 1px white solid;
}
</style>

<script setup lang="ts">
import { CanvasScene } from '../../lib/geometry_2d/canvas_scene';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Shape } from '../../lib/geometry_2d/scene_element/shape';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;

const CANVAS_W = ref( 512 );
const CANVAS_H = ref( 512 );

const rad = ref( CANVAS_W.value / 4 );
const vertices_count = ref( 16 );
const irregularity = ref( 0.2 );
const spikiness = ref( 0.6 );
const is_convex = ref( false );

const cen = new Dot2d( CANVAS_W.value / 2, CANVAS_H.value / 2 );
console.log( cen, cen.to_polar( ), cen.to_polar( ).to_cartesian( ) );
console.log( cen, cen.to_polar( cen ), cen.to_polar( cen ).to_cartesian( cen ) );

let shape = new Shape(
    new Dot2d( CANVAS_W.value / 2, CANVAS_H.value / 2 ),
    vertices_count.value,
    rad.value,
    irregularity.value,
    spikiness.value,
    is_convex.value,
    { r: 0, g: 0, b: 255 },
);


onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.add_element( shape, 'shape_base' );
} );

onBeforeUnmount( () => {
    scene?.destroy();
} );

function set_shape ( ) {
    scene?.remove_element( 'shape_base' );
    shape = new Shape(
        new Dot2d( CANVAS_W.value / 2, CANVAS_H.value / 2 ),
        vertices_count.value,
        rad.value,
        irregularity.value,
        spikiness.value,
        is_convex.value,
        { r: 0, g: 0, b: 255 },
    );
    scene?.add_element( shape, 'shape_base' );
}
</script>

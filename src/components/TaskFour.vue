<template>
    <div style="width: min-content;">
        <q-card-section>
            <div>
                <canvas ref="canvas" class="canvas bg-blue-grey-14" :width="CANVAS_W" :height="CANVAS_H"></canvas>
            </div>
        </q-card-section>

        <q-card-section>
            <div class="q-pb-sm">
                <q-select dark v-model="convex_hull_mode" :options="convex_hull_mode_options" label="Convex hull mode"  @update:model-value="regenerate_shape()"/>
            </div>
            <q-badge color="secondary">
                Dot count: {{ dot_count }}
            </q-badge>
            <q-slider v-model="dot_count" :min="3" :max="512" @update:model-value="regenerate_shape()"/>

            <q-badge color="secondary">
                X delta: {{ x_max_delta }}
            </q-badge>
            <q-slider v-model="x_max_delta" :min="4" :max="CANVAS_W" @update:model-value="regenerate_shape()"/>

            <q-badge color="secondary">
                Y delta: {{ y_max_delta }}
            </q-badge>
            <q-slider v-model="y_max_delta" :min="4" :max="CANVAS_H" @update:model-value="regenerate_shape()"/>
        </q-card-section>

        <q-card-actions>
            <div>
                <q-btn color="accent" label="Create custom dots" class="text-capitalize" @click="input_shape_dialog_active = true" />
                <ShapeInput v-model="input_shape_dialog_active" @created:shape="set_dots($event)" :dotst_only="true" :canvas_width="CANVAS_W" :canvas_height="CANVAS_H"></ShapeInput>
            </div>
        </q-card-actions>
    </div>
</template>

<style>
.canvas {
    border: 1px white solid;
}
</style>

<script setup lang="ts">
import { CanvasScene } from '../../lib/geometry_2d/canvas_scene';
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { Shape } from '../../lib/geometry_2d/scene_element/shape';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import ShapeInput from './ShapeInput.vue';
import { DotCollection } from '../../lib/geometry_2d/scene_element/dot_collection';

const canvas = ref<HTMLCanvasElement>( null as never );
const input_shape_dialog_active = ref( false );
let scene: CanvasScene | undefined = undefined;


const convex_hull_mode_options: Array<{label: string, value: Parameters<DotCollection['convex_shape']>['0'] }> = [
    {
        label: 'n4',
        value: 'n4',
    },
    {
        label: 'n2',
        value: 'n2',
    },
    {
        label: 'nlogn',
        value: 'nlogn',
    },
];
const convex_hull_mode: Ref<typeof convex_hull_mode_options[0]> = ref( convex_hull_mode_options[0] );


const CANVAS_W = ref( 512 );
const CANVAS_H = ref( 512 );

const dot_count = ref( 16 );
const x_max_delta = ref( Math.floor( CANVAS_W.value / 2 ) );
const y_max_delta = ref( Math.floor( CANVAS_H.value / 2 ) );


const cen = new Dot2d( CANVAS_W.value / 2, CANVAS_H.value / 2 );
console.log( cen, cen.to_polar( ), cen.to_polar( ).to_cartesian( ) );
console.log( cen, cen.to_polar( cen ), cen.to_polar( cen ).to_cartesian( cen ) );

let dots_collection = new DotCollection(
    dot_count.value,
    Math.floor( CANVAS_W.value / 2 ) - Math.floor( x_max_delta.value / 2 ),
    Math.floor( CANVAS_H.value / 2 ) - Math.floor( y_max_delta.value / 2 ),
    x_max_delta.value,
    y_max_delta.value,
);

dots_collection.convex_shape_n2();

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.add_element( dots_collection, 'dots_collection' );

    scene.on( 'vertex_moved', () => {
        update_convex_hull();
    } );
    update_convex_hull();
} );

onBeforeUnmount( () => {
    scene?.destroy();
} );

function set_dots ( dots: Array<Dot2d> ) {
    scene?.remove_element( 'dots_collection' );
    dots_collection = new DotCollection(
        dots,
    );
    scene?.add_element( dots_collection, 'dots_collection' );
    update_convex_hull();
}

function regenerate_shape () {
    scene?.remove_element( 'dots_collection' );
    dots_collection = new DotCollection(
        dot_count.value,
        Math.floor( CANVAS_W.value / 2 ) - Math.floor( x_max_delta.value / 2 ),
        Math.floor( CANVAS_H.value / 2 ) - Math.floor( y_max_delta.value / 2 ),
        x_max_delta.value,
        y_max_delta.value,
    );
    scene?.add_element( dots_collection, 'dots_collection' );
    update_convex_hull();
}

function update_convex_hull () {
    scene?.remove_element( 'convex_hull' );
    const shape = new Shape( dots_collection.convex_shape( convex_hull_mode.value.value ) );
    shape.interactive = false;
    scene?.add_element( shape, 'convex_hull' );
}
</script>

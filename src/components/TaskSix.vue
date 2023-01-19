<template>
    <div style="width: min-content;">
        <q-card-section>
            <div>
                <canvas ref="canvas" class="canvas bg-blue-grey-14" :width="CANVAS_W" :height="CANVAS_H"></canvas>
            </div>
        </q-card-section>

        <q-card-section>
            <div>
                Line 1 pos: {{ line_1_pos_string }}
            </div>
            <div>
                Line 2 pos: {{ line_2_pos_string }}
            </div>
            <div v-bind:class="{ 'text-positive': lines_intersect, 'text-negative': !lines_intersect, }">
                Dot inside: {{lines_intersect}}
            </div>
        </q-card-section>

        <q-card-actions>

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
import { Line } from '../../lib/geometry_2d/scene_element/line';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';


const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;
const line_1_pos_string = ref( '' );
const line_2_pos_string = ref( '' );
const lines_intersect = ref( true );

const CANVAS_W = ref( 512 );
const CANVAS_H = ref( 512 );

const line_1 = new Line( new Dot2d( CANVAS_W.value / 4, CANVAS_H.value / 4 ), new Dot2d( CANVAS_W.value * 3 / 4, CANVAS_H.value * 3 / 4 ) );
const line_2 = new Line( new Dot2d( CANVAS_W.value * 3 / 4, CANVAS_H.value / 4 ), new Dot2d( CANVAS_W.value / 4, CANVAS_H.value * 3 / 4 ) );

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.add_element( line_1, 'line_1' );
    scene.add_element( line_2, 'line_2' );

    update();

    scene.on( 'vertex_moved', () => {
        update();
    } );
} );

function update_line_pos_string ( pos_str: Ref<string>, line: Line ) {
    pos_str.value = `(${line.dot_1.x}, ${line.dot_1.y}); (${line.dot_2.x}, ${line.dot_2.y})`;
}

function update () {
    update_line_pos_string( line_1_pos_string, line_1 );
    update_line_pos_string( line_2_pos_string, line_2 );
    lines_intersect.value = line_1.intersects_with( line_2 );
}

onBeforeUnmount( () => {
    scene?.destroy();
} );
</script>

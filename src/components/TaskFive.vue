<template>
    <div style="width: min-content;">
        <q-card-section>
            <div>
                <canvas ref="canvas" class="canvas bg-blue-grey-14" width="512" height="512"></canvas>
            </div>
        </q-card-section>

        <q-card-section>
            <div q-pb-sm :key="rerenderKey">
                <q-table
                    title="Treats"
                    :rows="known_shapes"
                    :columns="columns"
                    row-key="name"
                />
            </div>
        </q-card-section>

        <q-card-actions>
            <q-btn color="accent" label="Add shape" class="text-capitalize" @click="input_shape_dialog_active = true" />
            <ShapeInput v-model="input_shape_dialog_active" @created:shape="add_shape($event)" :dotst_only="false"></ShapeInput>
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
import { computed, ComputedRef, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import ShapeInput from './ShapeInput.vue';
import { Shape } from '../../lib/geometry_2d/scene_element/shape';
import { remove, map } from 'lodash-es';

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;
let shape_counter = 0;
const known_shapes: Ref<Array<string>> = ref( [] );

const rerenderKey = ref( 0 );
const input_shape_dialog_active = ref( false );
const columns: any = ref( [
    {
        name: 'name',
        label: 'Name',
        field: ( row: string ) => row,
        required: true,
        style: 'width: 20%',
        align: 'left' },
    {
        name: 'description',
        label: 'Description',
        field: ( row: string ) => JSON.stringify( scene?.get_element( row )?.to_simple_object() ),
        required: false,
        style: 'white-space: normal;',
        align: 'left',
    },
] );
/* const rows: ComputedRef<Array<{name: string, description: string}>> = computed( () => {
    return map( known_shapes.value, ( elem: string ) => {
        return {
            name: elem,
            description: JSON.stringify( scene?.get_element( elem )?.to_simple_object() ),
        };
    } );
} );*/


onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );

    scene.on( 'vertex_moved', () => {
        rerenderKey.value = ( rerenderKey.value + 1 ) % 2;
    } );
} );

onBeforeUnmount( () => {
    scene?.destroy();
} );

function add_shape ( dots: Array<Dot2d> ) {
    const shape = new Shape( dots );
    const shape_name = 'shape_' + shape_counter;
    scene?.add_element( shape, shape_name );
    known_shapes.value.push( shape_name );
    shape_counter += 1;
}

function remove_known_shape ( name: string ) {
    const removed = remove( known_shapes.value, ( elem: string ) => {
        return elem == name;
    } );
    removed.forEach( ( elem: string ) => {
        scene?.remove_element( elem );
    } );
}

</script>

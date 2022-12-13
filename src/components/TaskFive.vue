<template>
    <div style="width: min-content;">
        <q-card-section>
            <div>
                <canvas ref="canvas" class="canvas bg-blue-grey-14" :width="CANVAS_W" :height="CANVAS_H"></canvas>
            </div>
        </q-card-section>

        <q-card-actions>
            <q-btn color="accent" label="Add shape" class="text-capitalize" @click="input_shape_dialog_active = true" />
            <q-btn color="primary" label="Save to file" class="text-capitalize" @click="save_file()" />
            <ShapeInput v-model="input_shape_dialog_active" @created:shape="add_shape($event)" :dotst_only="false" :canvas_width="CANVAS_W" :canvas_height="CANVAS_H"></ShapeInput>
        </q-card-actions>

        <q-card-section>
            <q-toggle
                v-model="move_shape"
                @update:model-value="update_move_shape()"
                label="Move shapes"
            />
            <div q-pb-sm :key="rerender_key">
                <q-table
                    title="Shapes"
                    :rows="known_shapes"
                    :columns="columns"
                    row-key="name"
                    dark
                >
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="name" :props="props">
                                {{props.colsMap.name.field(props.row)}}
                            </q-td>
                            <q-td key="description" :props="props">
                                {{props.colsMap.description.field(props.row)}}
                            </q-td>
                            <q-td key="actions" :props="props">
                                <q-btn
                                    :disable="reserved_rows.find(( elem ) => elem == props.row) != undefined"
                                    color="warning" name="delete"
                                    label='delete'
                                    @click="remove_known_shape(props.row)"
                                />
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </div>
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
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import ShapeInput from './ShapeInput.vue';
import { Shape } from '../../lib/geometry_2d/scene_element/shape';
import { remove, difference } from 'lodash-es';
import { saveAs } from 'file-saver';

const canvas = ref<HTMLCanvasElement>( null as never );
let scene: CanvasScene | undefined = undefined;
let shape_counter = 0;
const known_shapes: Ref<Array<string>> = ref( [] );
const CANVAS_W = ref( 1024 );
const CANVAS_H = ref( 512 );
const rerender_key = ref( 0 );
const reserved_rows: Ref<Array<string>> = ref( [] );
const input_shape_dialog_active = ref( false );
const move_shape = ref( false );
const columns: any = ref( [
    {
        name: 'name',
        label: 'Name',
        field: ( row: string ) => row,
        required: true,
        align: 'left' },
    {
        name: 'description',
        label: 'Description',
        field: ( row: string ) => JSON.stringify( scene?.get_element( row )?.to_simple_object() ),
        required: false,
        style: 'white-space: normal;',
        align: 'left',
    },
    {
        name: 'actions',
        label: 'Action',
        field: () => 'Delete',
        required: false,
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
const start_dot = new Dot2d( CANVAS_W.value / 4, CANVAS_H.value / 4, { r: 255, g: 0, b: 0 } );
const end_dot = new Dot2d( CANVAS_W.value * 3 / 4, CANVAS_H.value * 3 / 4, { r: 0, g: 255, b: 0 } );

onMounted( () => {
    console.log( canvas.value );
    scene = new CanvasScene( canvas.value );
    scene.add_element( start_dot, 'start_dot' );
    scene.add_element( end_dot, 'end_dot' );
    known_shapes.value.push( 'start_dot' );
    known_shapes.value.push( 'end_dot' );
    reserved_rows.value.push( 'start_dot' );
    reserved_rows.value.push( 'end_dot' );

    scene.on( 'vertex_moved', () => {
        rerender_key.value = ( rerender_key.value + 1 ) % 2;
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

function save_file () {
    const object_to_save = {
        start: start_dot.to_simple_object(),
        end: end_dot.to_simple_object(),
        polygons: [] as Array<Array<{x: number, y: number}>>,
    };
    difference( known_shapes.value, reserved_rows.value ).forEach( ( elem ) => {
        object_to_save.polygons.push( scene?.get_element( elem ).to_simple_object() as Array<{x: number, y: number}> );
    } );

    const string_to_save = JSON.stringify( object_to_save );

    saveAs( new Blob( [string_to_save], { type: 'text/plain;charset=utf-8' } ), 'polygons.json' );
}

function update_move_shape () {
    if ( scene ) {
        scene.move_shape = move_shape.value;
    }
}
</script>

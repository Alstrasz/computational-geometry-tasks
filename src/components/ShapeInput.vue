<template>
    <q-dialog
        :model-value="props.modelValue || false"
        @update:model-value="$emit('update:modelValue', $event)"
        transition-show="scale"
        transition-hide="scale"
        @before-hide="reset_dots()"
    >
        <q-card class="bg-dark text-white">
            <q-card-section>
                <div class="text-h6">Shape selection</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div>
                    <canvas
                        class="canvas bg-blue-grey-14"
                        :width="props.canvas_width || 512"
                        :height="props.canvas_height || 512"
                        ref="canvas"
                        @click="add_dot_from_mouse_event($event)"
                    ></canvas>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Submit" color="positive" class="text-capitalize" v-close-popup :disable="dots.length < 3" @click="emit_dots()" />
                <q-btn flat label="Reset" color="secondary" class="text-capitalize" @click="reset_dots()" />
                <q-btn flat label="Cancel" color="negative" class="text-capitalize" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>

<style>
</style>

<script setup lang="ts">
import { Dot2d } from '../../lib/geometry_2d/scene_element/dot_2d';
import { Ref, ref } from 'vue';
import { cloneDeep } from 'lodash-es';

const dots: Ref<Array<Dot2d>> = ref( [] );
const canvas = ref<HTMLCanvasElement>( null as never );

const props = defineProps( {
    canvas_width: Number,
    canvas_height: Number,
    dotst_only: Boolean,
    modelValue: Boolean,
} );

type Emits = {
    ( event: 'update:modelValue', active: boolean ): void,
    ( event: 'created:shape', dots: Array<Dot2d> ): void
}
const emits = defineEmits<Emits>();

function add_dot_from_mouse_event ( ev: MouseEvent ) {
    const rect = canvas.value.getBoundingClientRect();
    dots.value.push( new Dot2d( ev.clientX - rect.x, ev.clientY - rect.y ) );
    draw_dots();
}

function reset_dots () {
    dots.value.length = 0;
    draw_dots();
}

function draw_dots () {
    const ctx = canvas.value.getContext( '2d' );
    if ( !ctx ) {
        throw new Error( 'Canvas contex undefined' );
    }
    ctx.clearRect( 0, 0, props.canvas_width || 512, props.canvas_height || 512 );
    if ( props.dotst_only ) {
        for ( let i = 0; i < dots.value.length; i ++ ) {
            ctx.fillStyle = 'black';
            ctx.fillRect( dots.value[i].x - 1, dots.value[i].y - 1, 3, 3 );
        }
        return;
    }

    if ( dots.value.length > 1 ) {
        for ( let i = 0; i < dots.value.length - 1; i ++ ) {
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo( dots.value[i].x, dots.value[i].y );
            ctx.lineTo( dots.value[i + 1].x, dots.value[i + 1].y );
            ctx.closePath();
            ctx.stroke();
        }

        ctx.fillStyle = 'white';
        ctx.fillRect( dots.value[dots.value.length-1].x - 1, dots.value[dots.value.length-1].y - 1, 3, 3 );
    }
    if ( dots.value.length > 2 ) {
        ctx.strokeStyle = 'lightblue';
        ctx.setLineDash( [5] );
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo( dots.value[0].x, dots.value[0].y );
        ctx.lineTo( dots.value[dots.value.length-1].x, dots.value[dots.value.length-1].y );
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash( [] );
    }
    if ( dots.value.length > 0 ) {
        ctx.fillStyle = 'black';
        ctx.fillRect( dots.value[0].x - 1, dots.value[0].y - 1, 3, 3 );
    }
}
function emit_dots () {
    emits( 'created:shape', cloneDeep( dots.value ) );
}

</script>

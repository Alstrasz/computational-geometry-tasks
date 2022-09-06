<template>
    <canvas ref="canvas" class="canvas"></canvas>
</template>

<style>
.canvas {
  height: 512px;
  width: 512px;
  background-color: black;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement>( null as never );

onMounted( () => {
    console.log( canvas.value );
} );
</script>

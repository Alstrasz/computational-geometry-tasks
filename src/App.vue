<template>
    <q-layout view="lHh Lpr lFf" class="bg-dark text-white">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    aria-label="Menu"
                    icon="menu"
                />

                <q-toolbar-title >
                    Computational geometry
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            class="bg-dark"
            dark
        >
            <q-list>
                <q-item-label header>Essential Links</q-item-label>
                <q-item clickable tag="a" to="/" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Home</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" to="/task1" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task1" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #1</q-item-label>
                        <q-item-label caption class="text-white">Dot localization</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view></router-view>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref( true );
</script>

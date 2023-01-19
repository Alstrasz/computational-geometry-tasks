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
                <q-item clickable tag="a" :to="known_routes.home" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Home</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task1" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task1" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #1</q-item-label>
                        <q-item-label caption class="text-white">Dot localization</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task2" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task2" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #2</q-item-label>
                        <q-item-label caption class="text-white">Dot count</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task3" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task3" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #3</q-item-label>
                        <q-item-label caption class="text-white">Random shape</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task4" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task4" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #4</q-item-label>
                        <q-item-label caption class="text-white">Convex hull</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task5" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task5" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #5</q-item-label>
                        <q-item-label caption class="text-white">Multiple shapes editor</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item clickable tag="a" :to="known_routes.task6" active-class="text-accent">
                    <q-item-section avatar>
                        <q-icon name="task6" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Task #6</q-item-label>
                        <q-item-label caption class="text-white">Lines</q-item-label>
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
import { known_routes } from './router';

const leftDrawerOpen = ref( true );
</script>

<template>
  <!--
  this component wrap all other child component just contain the header, router view and some global css used in cards
  to display the artists and the albumns
 -->
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> Spotify Artist Search </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainLayout",
});
</script>
<style>
.card-container {
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 30px;
  grid-template-columns: repeat(4, minmax(200px, 240px));
  grid-template-rows: auto;
}
.card-container .my-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.5s;
  cursor: pointer;
}
.card-container .my-card:hover {
  transform: scale3d(1.02, 1.02, 1.02);
}
@media (max-width: 1050px) {
  .card-container {
    grid-row-gap: 20px;
    grid-column-gap: 30px;
    grid-template-columns: repeat(3, minmax(100px, 250px));
    grid-template-rows: auto;
  }
}
@media (max-width: 620px) {
  .card-container {
    grid-row-gap: 25px;
    grid-column-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }
}
@media (max-width: 400px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}
</style>

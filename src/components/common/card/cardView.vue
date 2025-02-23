<script lang="ts" setup>

import Card from "@/components/common/card/card.vue";
</script>

<template>
  <div class="card-container">
    <card
        data-image="https://images.unsplash.com/photo-1479660656269-197ebb83b540?dpr=2&auto=compress,format&fit=crop&w=1199&h=798&q=80&cs=tinysrgb&crop=">
      <template #header>
        <h1>Canyons</h1>
      </template>
      <template #content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </template>
    </card>
    <card
        data-image="https://images.unsplash.com/photo-1479659929431-4342107adfc1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=">
      <template #header>
        <h1>Beaches</h1>
      </template>
      <template #content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </template>
    </card>
    <card
        data-image="https://images.unsplash.com/photo-1479644025832-60dabb8be2a1?dpr=2&auto=compress,format&fit=crop&w=1199&h=799&q=80&cs=tinysrgb&crop=">
      <template #header>
        <h1>Trees</h1>
      </template>
      <template #content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </template>
    </card>
    <card
        data-image="https://images.unsplash.com/photo-1479621051492-5a6f9bd9e51a?dpr=2&auto=compress,format&fit=crop&w=1199&h=811&q=80&cs=tinysrgb&crop=">
      <template #header>
        <h1>Lakes</h1>
      </template>
      <template #content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </template>
    </card>
  </div>
</template>

<style lang="scss" scoped>

.card-container {
  padding: 40px 80px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

h1 {
  font-family: "Playfair Display";
  font-size: 36px;
  font-weight: 700;
  text-shadow: rgba(black, 0.5) 0 10px 10px;
}
</style>
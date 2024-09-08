<script lang="ts" setup></script>

<template>
  <div>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

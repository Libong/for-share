<template>
  <div class="bucket-list-view">
    <BucketDetail :bucketId="$route.params.id[0]"/>
  </div>
</template>

<script lang="ts" setup>
import BucketDetail from '@/views/bucket/component/BucketDetail.vue'
</script>

<style scoped>
.bucket-list-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
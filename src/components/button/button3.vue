<script setup lang="ts">

</script>

<template>
  <button>提 交</button>
</template>

<style lang="scss" scoped>

$aqur-color: #324242;
$aqur-bg: #6AB1C9;
$witch-color: #D3B7F7;


  button {
    width: 40%;
    height: 35px;
    color: $aqur-color;
    background: transparent;
    border: 3px solid $aqur-color;
    border-radius: 10px;
    transition: all .5s ease;
    margin-top: 30px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
/*      background: $aqur-color;*/
     /* color: black;*/
      border: 3px solid rgb(255, 255, 255,0.5);
      transition: all .35s ease;
    }
   /* &:active {
      transform: translate(5px, 5px);
    }*/
  }
</style>
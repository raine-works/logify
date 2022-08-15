<script setup lang="ts">

const counter = ref(0)
const count = () => {
    counter.value++
}
</script>

<template>
<div class="flex flex-col justify-center">
    <ui-btn-primary @click="count">Hello World</ui-btn-primary>
    <span>{{ counter }}</span>
</div>
</template>
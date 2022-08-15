<script setup lang="ts">

const emit = defineEmits(['click'])
const props = defineProps({
    disabled: Boolean
})

</script>

<template>
    <button 
        :disabled="props.disabled"
        @click="emit('click')"
        class="py-2 px-4 max-w-lg rounded-lg bg-slate-600 text-white"
    >
        <slot></slot>
    </button>
</template>
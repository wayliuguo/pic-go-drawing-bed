<template>
    <button class="my-button">
        <slot></slot>
    </button>
</template>

<script>
export default {
  name: 'MyButton'
}
</script>

<style>
    .my-button {
        background: orange;
        color: #fff;
    }
</style>

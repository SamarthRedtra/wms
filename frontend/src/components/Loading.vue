<template>
    <div class="mask">
        <div class="loader">
            <Spinner class="w-8" />
        </div>
    </div>
</template>

<script setup>
    import {Spinner} from "frappe-ui"
</script>

<style scoped>
    .mask{
        position: fixed;
        top:0;
        left: 0;
        right:0;
        bottom:0;
        background-color: rgba(227, 236, 236, 0.41);;
        z-index: 100;
    }
    .loader{
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 200;
        transform: translate(-50%,-50%);
    }
</style>
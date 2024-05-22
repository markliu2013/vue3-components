<template>
  <button class="ea-button" :class="buttonStyle"><slot /></button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ea-button",
});
</script>

<script lang="ts" setup>
import "../style/index.scss";
import { computed } from "vue";
type ButtonProps = {
  type?: string;
};
const buttonProps = defineProps<ButtonProps>();

const buttonStyle = computed(() => {
  return { [`ea-button--${buttonProps.type}`]: buttonProps.type };
});
</script>
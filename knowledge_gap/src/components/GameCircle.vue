<script setup lang="ts">
interface Circle {
  id: string;
  row: number;
  col: number;
  color: string;
  revealed: boolean;
  correctColor: string;
  clickable: boolean;
}

const props = defineProps<{
  circle: Circle
}>()
</script>

<template>
  <div 
    class="game-circle" 
    :class="{ 
      'revealed': circle.revealed,
      'clickable': circle.clickable && !circle.revealed,
      'not-clickable': !circle.clickable && !circle.revealed
    }"
    :style="{ backgroundColor: circle.revealed ? circle.color : '#9e9e9e' }"
  ></div>
</template>

<style scoped>
.game-circle {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  cursor: default;
  transition: all 0.3s ease;
}

.revealed {
  transform: scale(0.9);
}

.clickable {
  cursor: pointer;
  animation: pulse 1.5s infinite;
}

.clickable:hover {
  transform: scale(1.1);
}

.not-clickable {
  opacity: 0.7;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(0.95);
  }
}
</style> 
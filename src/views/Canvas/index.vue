<template>
  <div class="canvas-wrap">
    <canvas ref="solarSystem" class="solar-system"></canvas>
    <canvas ref="oclock" class="oclock"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { CanvasRefType, renderSolarSystem, renderOclock } from './chart'

export default defineComponent({
  name: 'Canvas',
  setup() {
    const solarSystem = ref<CanvasRefType>(null)
    const oclock = ref<CanvasRefType>(null)

    onMounted(() => {
      renderSolarSystem(solarSystem.value)
      renderOclock(oclock.value)
    })

    return {
      solarSystem,
      oclock,
    }
  },
})
</script>

<style lang="less" scoped>
.canvas-wrap {
  display: flex;
  justify-content: space-around;
  width: 100%;
  > canvas {
    width: calc(50vw - 30px);
    min-width: 200px;
    height: calc(50vw - 30px);
    min-height: 200px;
    border: 1px solid purple;
  }
}
</style>

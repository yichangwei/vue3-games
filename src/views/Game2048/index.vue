<template>
  <div class="game-2048-header">
    <div>score：{{ score }}</div>
    <el-button @click="gameStart">start new game</el-button>
    <el-button-group>
      <el-button :class="{ actived: n === 4 }" @click="n = 4">4</el-button>
      <el-button :class="{ actived: n === 5 }" @click="n = 5">5</el-button>
    </el-button-group>
  </div>
  <div class="game-2048-body">
    <!-- game box -->
    <div class="game-2048-container">
      <transition-group name="square">
        <div
          v-for="(square, index) in squareList"
          :key="square.id"
          v-square-style="{ num: square.num, index, n }"
          class="game-2048-square"
        >
          <span>{{ square.num || '' }}</span>
        </div>
      </transition-group>
    </div>
    <!-- game tips -->
    <transition name="tips">
      <div
        v-show="state === 'fail' || state === 'success'"
        class="game-2048-tips"
        :style="{ backgroundColor: gameTips.bgColor }"
      >
        {{ gameTips.text }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { squareStyle } from './directive'
import {
  NType,
  GameStateType,
  ArrowKeyType,
  SquareListData,
  shuffle,
  addRandomNum,
  clockwiseRotateMatrix,
  leftMergeSquareBox,
  gameStateCheck,
  GameTriggerEvent,
} from './utils'

export default defineComponent({
  name: 'Game2048',
  directives: { squareStyle },
  setup() {
    // game阶数
    const n = ref<NType>(4)
    // game状态
    const state = ref<GameStateType>('running')
    // game数据
    const squareList = ref<Array<SquareListData>>([])
    // game score
    const score = computed(() =>
      squareList.value.reduce((p, c) => p + c.num, 0),
    )
    // game tips
    const gameTips = computed(() => {
      const obj = {
        running: { bgColor: '', text: '' },
        success: { bgColor: '#64c42d', text: 'very nice!' },
        fail: { bgColor: '#f76b69', text: 'game over!' },
      }
      return obj[state.value]
    })

    // 游戏开始
    const gameStart = () => {
      // 重置状态
      state.value = 'running'
      // 重置游戏方块数据 id主要作用为vue动画
      const arr = new Array(n.value ** 2)
        .fill('')
        .map((d, i) => ({ num: 0, id: i }))
      // 打乱方块
      squareList.value = shuffle(arr)
      // 随机赋值2个
      addRandomNum(squareList.value, 2)
    }
    // 游戏主流程
    const gameProcess = (arrowKey: ArrowKeyType) => {
      // 状态判断
      if (state.value !== 'running') return
      // 获取 左合并 所需方向键对应旋转次数
      const r = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'].indexOf(arrowKey)
      // 旋转游戏矩阵数组
      const rotateArr = clockwiseRotateMatrix(squareList.value, n.value, r)
      // 左合并游戏矩阵数据
      leftMergeSquareBox(rotateArr, n.value)
      // 还原旋转后的矩阵数组
      squareList.value = clockwiseRotateMatrix(rotateArr, n.value, 4 - r)
      // merge动画结束后，随机新增数据1个，并进行状态检测
      setTimeout(() => {
        addRandomNum(squareList.value)
        state.value = gameStateCheck(squareList.value, n.value)
      }, 200)
    }

    // 阶数n变更时 执行重新开始游戏，初始化执行一次
    watch(n, () => {
      gameStart()
    }, { immediate: true })

    // 事件监听（绑定与销毁），并触发游戏主流程
    const eventInstance = new GameTriggerEvent('.game-2048-container', gameProcess)
    onMounted(() => {
      eventInstance.on()
    })
    onUnmounted(() => {
      eventInstance.off()
    })

    return {
      n,
      state,
      squareList,
      score,
      gameTips,
      gameStart,
    }
  },
})
</script>

<style lang="less" scoped>
// 公共样式
#game-2048-common() {
  // 正方形设置
  .square() {
    margin: 0 auto;
    width: calc(100% - 20px);
    max-width: 400px;
  }
  // flex公共样式
  .flex(@justify: center, @align: center) {
    display: flex;
    justify-content: @justify;
    align-items: @align;
  }
  // 方块盒子样式
  .box() {
    #game-2048-common.flex();
    width: 100%;
    height: 100%;
    font-weight: bold;
    line-height: 200%;
  }
}

.game-2048-header {
  #game-2048-common.square();
  #game-2048-common.flex(space-between);
  // 阶数选中状态样式
  .el-button.actived {
    color: #3a8ee6;
    border-color: #3a8ee6;
    background-color: #ecf5ff;
    z-index: 10;
  }
}

.game-2048-body {
  #game-2048-common.square();
  position: relative;
  margin-top: 20px;
}

.game-2048-container {
  box-sizing: border-box;
  position: relative;
  padding-top: 100%;
  width: 100%;
  height: 0;
  background-color: #b9ad9e;
  border: 0.5px solid #b9ad9e;
  border-radius: 3%;
  overflow: hidden;
  .game-2048-square {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    padding: 10px;
    > span {
      #game-2048-common.box();
      border-radius: 10%;
    }
  }
}

.game-2048-tips {
  #game-2048-common.box();
  position: absolute;
  top: 40%;
  height: 20%;
  color: #ffffff;
  font-size: 40px;
  opacity: 0.8;
}

// 方块移动动画样式
.square-move {
  transition: all 0.2s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
.tips-enter-active {
  animation: bounce-in 0.2s;
}
.tips-leave-active {
  animation: bounce-in 0.2s reverse;
}

</style>

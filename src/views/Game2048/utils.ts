export type NType = 4 | 5

export type GameStateType = 'running' | 'success' | 'fail'

export type ArrowKeyType = 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown'

export interface SquareListData {
  num: number
  id: number
}

// 背景颜色池
export const BG_COLOR = [
  '#ede6d9',
  '#eee1cc',
  '#eab678',
  '#e5925b',
  '#ef805e',
  '#e75b37',
  '#edcf70',
  '#ebcd64',
  '#ecc950',
  '#edc63e',
  '#f0c52f',
  '#fab912',
  '#de00ff',
]

// 随机洗牌(操作原数组)
export function shuffle<T extends Array<number | SquareListData>>(arr: T): T {
  let len = arr.length
  if (len < 2) return arr
  let j: number
  while (len > 1) {
    len -= 1
    j = Math.floor(Math.random() * len)
    ;[arr[len], arr[j]] = [arr[j], arr[len]]
  }
  return arr
}

/**
 * box插入随机值（原proxy数据操作）
 * @param arr 游戏数据
 * @param count 插入个数
 * @returns void
 */
export function addRandomNum(arr: Array<SquareListData>, count = 1): void {
  const emptyIndexArr: Array<number> = []
  // 存入空数据下标数据
  arr.forEach(({ num }, index) => {
    if (num === 0) emptyIndexArr.push(index)
  })
  if (emptyIndexArr.length === 0) return
  const indexArr = shuffle(emptyIndexArr).slice(0, count)
  indexArr.forEach(i => {
    arr[i].num = Math.random() > 0.9 ? 4 : 2
  })
}

/**
 * 顺时针旋转矩阵数组（返回新数组）
 * @param arr 传入数据
 * @param n 阶数
 * @param r 旋转次数
 * @returns arr旋转后新数组
 */
export function clockwiseRotateMatrix<T extends Array<SquareListData>>(arr: T, n: NType, r = 1): T {
  r = r % 4
  if (r <= 0) return arr
  const len = arr.length
  const resArr = new Array(len) as T
  for (let x = 0; x < n; x ++) {
    for (let y = 0; y < n; y ++) {
      resArr[x * n + n - y - 1] = arr[x + y * n]
    }
  }
  return clockwiseRotateMatrix(resArr, n, r - 1)
}

/**
 * 单行数据从右向左合并（原数组操作）
 * @param arr game arr数据
 * @param l 合并操作最左侧位置
 * @param r 合并操作最右侧位置
 * @returns 最后可合并位置
 */
function leftMergeSquare(arr: Array<SquareListData>, l: number, r: number): number {
  // 合并逻辑 2204 => 4400，每次方块左移，相同数值合并
  while(r > l) {
    if (arr[r].num && (arr[r].num === arr[r - 1].num || arr[r - 1].num === 0)) {
      // 当前方块有值，且左右方块相等 或 左方块为空 => 位置交换
      [arr[r], arr[r - 1]] = [arr[r - 1], arr[r]]
      // 等值时相加 并清空右侧值
      if (arr[r].num === arr[r - 1].num) {
        arr[r - 1].num *= 2
        arr[r].num = 0
        // merge后标记左侧最后可合并位置，防止2次合并
        l = r
      }
    }
    r --
  }
  return l
}

/**
 * 向左合并box（原数组操作）
 * @param arr game数据
 * @param n 阶数
 * @returns void
 */
export function leftMergeSquareBox<T extends Array<SquareListData>>(arr: T, n: NType) {
  for (let y = 0; y < n; y++) {
    // 逐行合并
    let lastMergeIndex = y * n
    for(let x = 1; x < n; x++) {
      lastMergeIndex = leftMergeSquare(arr, lastMergeIndex, y * n + x)
    }
  }
}

/**
 * game状态检测
 * @param arr 游戏数据
 * @param n 阶数
 * @returns 游戏状态
 */
export function gameStateCheck(arr: Array<SquareListData>, n: NType): GameStateType {
  let isOver = true
  let isPass = false
  const endGameScore = 2 ** (n * 3 - 1)
  // 顺时针旋转，用于检测x轴向数据
  const rArr = clockwiseRotateMatrix(arr, n, 1)
  for(let i = 0; i < arr.length; i ++) {
    // pass状态检测，是否有数值达到结束值
    if (arr[i].num === endGameScore) {
      isPass = true
      break
    }
    // 空值时game进行中
    if (arr[i].num === 0) {
      isOver = false
    }
    // 纵向对比，第二行开始向上比对，值有相同则game继续（横向比对视为旋转后纵向）
    if (i >= n && (arr[i - n].num === arr[i].num || rArr[i - n].num === rArr[i].num)) {
      isOver = false
    }
  }
  if (isPass) return 'success'
  if (isOver) return 'fail'
  return 'running'
}

// keyboard事件及touch事件
export class GameTriggerEvent {
  private readonly selectors: string
  private el: HTMLElement | null
  private readonly gameProcess: any
  private touchPoint: Record<'x' | 'y', number>

  constructor(selectors: string, gameProcess: any) {
    this.el = null
    this.selectors = selectors
    this.gameProcess = gameProcess
    this.touchPoint = { x: 0, y: 0 }
  }

  private get dom() {
    if (!this.el) {
      this.el = document.querySelector(this.selectors)
    }
    return this.el as HTMLElement
  }

  // 方向键执行游戏主进程
  private keyupHandler(e: KeyboardEvent) {
    const codeArr = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
    if (!codeArr.includes(e.key)) return
    this.gameProcess(e.key)
  }

  // touch事件判断移动方向，移动低于50不处理
  private touchstartHandler(e: TouchEvent) {
    this.touchPoint.x = e.changedTouches[0].pageX
    this.touchPoint.y = e.changedTouches[0].pageY
  }
  private touchendHandler(e: TouchEvent) {
    const { pageX, pageY } = e.changedTouches[0]
    const moveX = pageX - this.touchPoint.x
    const moveY = pageY - this.touchPoint.y
    // 位移不足50不做处理
    if (Math.abs(moveX) < 50 && Math.abs(moveY) < 50) return

    let arrowKey: ArrowKeyType
    if (Math.abs(moveX) > Math.abs(moveY)) {
      arrowKey = moveX > 0 ? 'ArrowRight' : 'ArrowLeft'
    } else {
      arrowKey = moveY > 0 ? 'ArrowUp' : 'ArrowDown'
    }
    this.gameProcess(arrowKey)
  }

  public on() {
    document.addEventListener('keyup', this.keyupHandler.bind(this))
    this.dom.addEventListener('touchstart', this.touchstartHandler.bind(this))
    this.dom.addEventListener('touchend', this.touchendHandler.bind(this))
  }

  public off() {
    document.removeEventListener('keyup', this.keyupHandler.bind(this))
    this.dom.removeEventListener('touchstart', this.touchstartHandler.bind(this))
    this.dom.removeEventListener('touchend', this.touchendHandler.bind(this))
  }
}

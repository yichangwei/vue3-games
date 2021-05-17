import { FunctionDirective } from 'vue'
import { BG_COLOR, NType } from './utils'

type SquareStyleBindingProp = {
  num: number
  index: number
  n: NType
}

// 方块对应位置及颜色背景设置
export const squareStyle: FunctionDirective<HTMLElement, SquareStyleBindingProp> = (el, binding) => {
  const { style: divStyle } = el
  const { num, index, n } = binding.value
  Object.assign(divStyle, {
    width: `${100 / n}%`,
    height: `${100 / n}%`,
    left: `${(index % n) * (100 / n)}%`,
    top: `${Math.floor(index / n) * (100 / n)}%`,
  })

  const { style: spanStyle } = el.children[0] as HTMLSpanElement
  const powIndex = num ? Math.log2(num) : 0
  Object.assign(spanStyle, {
    color: powIndex <= 2 ? '#333333' : '#ffffff',
    fontSize: `${60 - n ** 2}px`,
    backgroundColor: BG_COLOR[powIndex],
  })
}

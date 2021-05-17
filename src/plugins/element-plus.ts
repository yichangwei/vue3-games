import { App } from 'vue'
import {
  ElButton,
  ElButtonGroup,
} from 'element-plus'

const components = [
  ElButton,
  ElButtonGroup,
]

export default {
  install: (app: App) => {
    components.forEach(component => {
      app.component(component.name, component)
    })
  },
}

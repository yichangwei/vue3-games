import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

const MSG = 'this is a message'

describe('HelloWorld.vue', () => {
  test('render text', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: MSG },
    })
    expect(wrapper.find('h1').text()).toBe(MSG)
  })

  test('button click', async() => {
    const wrapper = mount(HelloWorld, {
      props: { msg: MSG },
    })
    expect(wrapper.getComponent('.el-button').text()).toBe('count is: 0')
    await (<HTMLElement>wrapper.element.querySelector('.el-button')).click()
    expect(wrapper.getComponent('.el-button').text()).toBe('count is: 1')
  })
})

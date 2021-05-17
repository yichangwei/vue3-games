import { shallowMount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  test('create', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.find('img').exists()).toBeTruthy()
  })
})

import { flushPromises, mount } from '@vue/test-utils'
import ArticleList from '../ArticleList.vue'
import asyncComponentWrapper from '../../utils/test/async-component-wrapper'
import fixtures from '../../utils/test/fixtures'
import { createTestingPinia } from '@pinia/testing'
import { router } from '../../router'
import { getArticles } from '../../services/article/getArticles'

jest.mock('src/services/article/getArticles')
const mockGetArticles = getArticles as jest.MockedFunction<typeof getArticles>

beforeEach(async () => {
  await router.push('/')
})

describe('ArticleList.vue', () => {
  test('when articles exist', async () => {
    mockGetArticles.mockResolvedValueOnce(<ArticlesResponse>{
      articles: [fixtures.article],
      articlesCount: 1,
    })

    const wrapper = mount(asyncComponentWrapper(ArticleList), {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    await flushPromises()

    expect(wrapper.findAll('.article-preview')).toHaveLength(1)
    expect(wrapper.findAll('.page-item')).toHaveLength(1)
  })

  test('when no articles exist', async () => {
    mockGetArticles.mockResolvedValueOnce(<ArticlesResponse>{
      articles: [],
      articlesCount: 0,
    })

    const wrapper = mount(asyncComponentWrapper(ArticleList), {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    await flushPromises()

    expect(wrapper.findAll('.article-preview')).toHaveLength(1)
    expect(wrapper.html()).toContain('No articles are here... yet.')
    expect(wrapper.findAll('.page-item')).toHaveLength(0)
  })
})

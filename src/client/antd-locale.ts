import type { Locale } from 'antd/es/locale/index.js'

const zhCN: Locale = {
  locale: 'zh-cn',
  global: { placeholder: '请选择', close: '关闭' },
  Modal: { okText: '确定', cancelText: '取消', justOkText: '知道了' },
  Select: { notFoundContent: '无匹配结果' },
  Empty: { description: '暂无数据' },
}

const enUS: Locale = {
  locale: 'en',
  global: { placeholder: 'Please select', close: 'Close' },
  Modal: { okText: 'OK', cancelText: 'Cancel', justOkText: 'OK' },
  Select: { notFoundContent: 'No matches' },
  Empty: { description: 'No data' },
}

export function antdLocale(active: 'zh' | 'en'): Locale {
  return active === 'en' ? enUS : zhCN
}

/** 独立挂载的弹窗没有上层主题时，按页面语言选择文案。 */
export function documentAntdLocale(): Locale {
  const lang = typeof document === 'undefined' ? '' : document.documentElement.lang.toLowerCase()
  return antdLocale(lang.startsWith('en') ? 'en' : 'zh')
}

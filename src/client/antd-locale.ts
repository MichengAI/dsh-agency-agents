import type { Locale } from 'antd/es/locale/index.js'

const zhCN: Locale = {
  locale: 'zh-cn',
  global: { close: '关闭' },
  Modal: { okText: '确定', cancelText: '取消', justOkText: '知道了' },
}

const enUS: Locale = {
  locale: 'en',
  global: { close: 'Close' },
  Modal: { okText: 'OK', cancelText: 'Cancel', justOkText: 'OK' },
}

export function antdLocale(active: 'zh' | 'en'): Locale {
  return active === 'en' ? enUS : zhCN
}

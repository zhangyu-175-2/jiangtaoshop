import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLangStore = defineStore('lang', () => {
  const lang = ref(localStorage.getItem('app-lang') || 'zh')

  // 切换
  const setLang = (val) => {
    lang.value = val
    localStorage.setItem('app-lang', val)
  }

  return { lang, setLang }
})
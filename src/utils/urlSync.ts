import { useCharacterStore } from '@/stores/characterStore'
import { LanguageSetting } from '@/types/settings'

export function applyUrlParams(store: ReturnType<typeof useCharacterStore>, search: string): void {
  const params = new URLSearchParams(search)
  const charParam = params.get('char')
  let character = store.characters.find(c => c.id === store.selectedCharacterId)
  if (charParam && store.characters.some(c => c.id === charParam)) {
    store.selectedCharacterId = charParam
    character = store.characters.find(c => c.id === charParam)
  }
  const anim = params.get('anim')
  if (anim) {
    store.selectedAnimation = anim
  }
  const skin = params.get('skin')
  if (skin) {
    store.selectedSkin = skin
  }
  const type = params.get('type')
  if (type === 'ultimate' && character?.cutscene) {
    store.animationCategory = 'ultimate'
  } else if (type === 'dating' && character?.dating) {
    store.animationCategory = 'dating'
  } else {
    store.animationCategory = 'character'
  }

  const language = params.get('lang');
  if (language) {
    store.language = language as LanguageSetting;
  }
  store.playing = true
}

export function buildUrl(store: ReturnType<typeof useCharacterStore>): string {
  const params = new URLSearchParams()

  console.log('buildURl', params, store);
  if (store.selectedCharacterId) params.set('char', store.selectedCharacterId)
  if (store.selectedAnimation) params.set('anim', store.selectedAnimation)
  if (store.selectedSkin) params.set('skin', store.selectedSkin)
  if (store.animationCategory) params.set('type', store.animationCategory)
  if (store.language) params.set('lang', store.language)
  return params.toString()
}

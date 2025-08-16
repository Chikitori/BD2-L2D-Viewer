import { useCharacterStore } from "@/stores/characterStore";

// const audioPath = `${audioAssetRoot}/${char.id}/${ANIMATION_TYPE_BASE_PATH[store.animationCategory]}`
const assetRoot = import.meta.env.DEV ? 'src/assets/audios' : 'assets/audios'

let lastNumber: number | null = null;

function randomIntNoRepeat(min: number, max: number): number {
  let num: number;
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (num === lastNumber);
  lastNumber = num;
  return num;
}




function isAudioElementPlaying(el: HTMLAudioElement): boolean {
  return !el.paused && el.currentTime > 0 && !el.ended;
}

export async function playCharacterMotionAudio() {
  const store = useCharacterStore()

  if (store.selectedAnimation === 'motion' && store.animationCategory === 'character') {
    const char = store.characters.find(c => c.id === store.selectedCharacterId)

    // get charcter folder
    const path = `${assetRoot}/${char?.id}`


    //query to the audio element controlling sounds
    const audioElement = document.getElementById('audio-input') as HTMLAudioElement;
    //check if audio element exists and is it currently playing
    if (audioElement && !isAudioElementPlaying(audioElement)) {
      try {
        console.log('audioElement', audioElement)
        audioElement.src = `${path}/${store.language ?? "JP"}/char${char?.id}_${randomIntNoRepeat(1, 6)}.wav`;
        console.log('isAudioPlaying', isAudioElementPlaying(audioElement))

        // Play it
        audioElement.oncanplaythrough = function () { audioElement.play() };
      }
      catch {
        console.log('Audio assets not found!!!')
      }
    }

  }
}

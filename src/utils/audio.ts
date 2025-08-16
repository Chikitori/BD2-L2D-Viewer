import { AudioIgnoredDatingAnimations } from "@/consts/datingScenesConfig";
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

export async function playDatingAudio() {
  const store = useCharacterStore()
  if (store.animationCategory === 'dating') {
    const char = store.characters.find(c => c.id === store.selectedCharacterId)

    //if the current dating animation is in the ignore file, return and not play any audio
    if (char && AudioIgnoredDatingAnimations[char.id]?.includes(store.selectedAnimation)) {
      console.log('ignored animation', store.selectedAnimation)
      return;
    }
    // get charcter folder
    const path = `${assetRoot}/${char?.id}`



    //query to the audio element controlling sounds
    const audioElement = document.getElementById('audio-input') as HTMLAudioElement;
    if (!audioElement) return;

    //check if audio element exists and is it currently playing
    if (!isAudioElementPlaying(audioElement)) {
      try {
        audioElement.src = `${path}/dating/char${char?.id}_${store.selectedAnimation}.wav`;
        audioElement.onerror = () => {
          console.warn("❌ Failed to load audio:", `${path}/${store.language ?? "JP"}/char${char?.id}_${store.selectedAnimation}.wav`);
        };
        await new Promise<void>((resolve, reject) => {
          audioElement.oncanplaythrough = () => {
            audioElement.play()
              .then(() => resolve()) // resolve after play starts
              .catch(reject);
          };
          audioElement.onerror = () => reject(new Error("Failed to load audio"));
        });
      }
      catch {
        console.log('Audio assets not found!!!')
      }
    }
  }
}

export async function playAnimationAudio() {
  const store = useCharacterStore()

  switch (store.animationCategory) {
    case 'character': {
      if (store.selectedAnimation === 'motion') {
        await playCharacterMotionAudio();
      }
    }
    case 'dating': {
      await playDatingAudio()
    }
  }

}

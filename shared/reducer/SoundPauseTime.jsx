const SoundPause = (state = [], action) => {
    switch (action.type) {
      case 'STORE_SOUND_PAUSE':
        return [
          action.JSON
        ]
      default:
        return state
    }
  }

export default SoundPause
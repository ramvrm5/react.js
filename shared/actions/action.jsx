export const storeToken = (text) => ({
    type: 'STORE_TOKEN',
    text
})

export const loggedInSessionValues = (JSON) => ({
    type : 'STORE_LOGGEDIN_SESSION_VALUES',
    JSON
})

export const RTMCounts = (JSON) => ({
    type : 'STORE_RTM_COUNT',
    JSON
})

export const SoundPauseTime = (JSON) => ({
    type : 'STORE_SOUND_PAUSE',
    JSON
})

export const FirstTimeLoginSecurityVar = (JSON) => ({
    type : 'STORE_FIRST_TIMELOGIN_VAR',
    JSON
})

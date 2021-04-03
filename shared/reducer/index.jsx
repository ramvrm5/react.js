import { combineReducers } from 'redux'
import sessionToken from './sessionToken.jsx'
import UserSession from './loggedinSessionValues.jsx'
import RTMCounts from './RTMCounts.jsx'
import SoundPause from './SoundPauseTime.jsx';
import FirstTimeLoginSecurity from './FirstTimeLoginSecurity.jsx';

const reducer = combineReducers({
    sessionToken,
    UserSession,
    RTMCounts,
    SoundPause,
    FirstTimeLoginSecurity
})

export default reducer

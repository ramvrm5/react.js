const UserSession = (state = [], action) => {
    switch (action.type) {
      case 'STORE_LOGGEDIN_SESSION_VALUES':
        return [
          action.JSON
        ]
      default:
        return state
    }
  }
  
export default UserSession
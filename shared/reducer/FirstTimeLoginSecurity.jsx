const FirstTimeLoginSecurity = (state = [], action) => {
    switch (action.type) {
      case 'STORE_FIRST_TIMELOGIN_VAR':
        return [
            action.JSON
        ]
      default:
        return state
    }
  }
  
  export default FirstTimeLoginSecurity
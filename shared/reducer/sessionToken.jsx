const sessionToken = (state = [], action) => {
    switch (action.type) {
      case 'STORE_TOKEN':
        return [
          action.text
        ]
      default:
        return state
    }
  }
  
  export default sessionToken


const RTMCount = (state = [], action) => {
    switch (action.type) {
      case 'STORE_RTM_COUNT':
        return [
          action.JSON
        ]
      default:
        return state
    }
  }
  
export default RTMCount
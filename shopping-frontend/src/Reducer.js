
function Reducer(state, action) {
  switch (action.type) {
    case "SETUSER":
      return {
        token: action.token,
        id: action.id, 
        username: action.username,
        isAdmin: action.isAdmin,
        isLoggedIn: action.isLoggedIn,
      };
    default:
      return {state}
  }
}

export default Reducer;

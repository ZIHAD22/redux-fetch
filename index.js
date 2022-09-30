const { default: axios } = require("axios")
const { createStore, applyMiddleware } = require("redux")
const { default: thunk } = require("redux-thunk")

// constant 
const GET_TODO_REQUEST = 'GET_TODO_REQUEST'
const GET_TODO_SUCCESS = 'GET_TODO_SUCCESS'
const GET_TODO_FAILED = 'GET_TODO_FAILED'
const API_URL = 'https://jsonplaceholder.typicode.com/todos'

// initials store
const initialsTodoStore = {
    todos: [],
    isLoading: false,
    errors: null,
}

// action 

const action = (actionType, payload = {}) => {
    if (Object.keys(payload).length !== 0) {
        return {
            type: actionType,
            payload
        }
    } else {
        return {
            type: actionType,
        }
    }
}

// reducer for user todos 

const todosReducer = (state = initialsTodoStore, action) => {
    switch (action.type) {
        case GET_TODO_REQUEST:
            return {
                ...state,
                isLoading: true,
            }

        case GET_TODO_SUCCESS:
            return {
                ...state,
                isLoading: false,
                todos: [...state.todos, action.payload]
            }

        case GET_TODO_FAILED:
            return {
                ...state,
                isLoading: false,
                errors: action.payload
            }

        default:
            break;
    }
}

// async task handler
const fetchData = () => {
    return async (dispatch) => {
        try {
            dispatch(action(GET_TODO_REQUEST))
            const { data } = await axios.get(API_URL)
            const allTodo = await data
            const todoTitle = allTodo.map(todo => todo.title)
            dispatch(action(GET_TODO_SUCCESS, todoTitle))

        } catch (e) {
            const errorMessage = e.message;
            dispatch(action(GET_TODO_FAILED, errorMessage))
        }

    }
}

// store
const store = createStore(todosReducer, applyMiddleware(thunk))

// subscribes 
store.subscribe(() => {
    console.log(store.getState());
})

// dispatch data
store.dispatch(fetchData())
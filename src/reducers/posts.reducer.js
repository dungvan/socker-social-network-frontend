import { commentConstants, postConstants } from "../constants";
import { getCurrentUser } from "../utils";

export function posts(state = {items: [], post: {}, total: 0, page: 1}, action) {
  switch (action.type) {
    case commentConstants.CREATE_REQUEST:
      return {
        ...state,        
        loading: true
      };
    case commentConstants.CREATE_SUCCESS:
      const oldPost = state.items.filter(post => post.id === action.data.post_id)
      if (oldPost.length > 0) {
        oldPost[0].comments = [...oldPost[0].comments, action.data.comment] 
      }
      return {
        ...state,
        newComment: action.data.comment,
        post: (!!state.post && (state.post.id === action.data.comment.post_id)) ? {...state.post, comments: [...state.post.comments, action.data.comment]} : state.post,
        items: [...state.items.filter(post => post.id !== action.data.post_id), ...oldPost],
        loading: false
      };
    case commentConstants.CREATE_FAILURE:
      return {
        ...state,        
        loading: false
      };
    case postConstants.GETONE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case postConstants.GETONE_SUCCESS:
      return {
        ...state,
        post: action.data.post,
        loading: false
      }
    case postConstants.GETONE_FAILURE:
      return {
        ...state,
        loading: false
      }
    case postConstants.CREATE_REQUEST:
    return {
      ...state,
      loading: true
    }
    case postConstants.CREATE_SUCCESS:
      return {
        ...state,
        total: state.total + 1,
        items: [{id: action.data.resp.post_id, created_at: new Date().toString(), star_count: 0, star_flag: false, ...action.data.post, user: getCurrentUser(), comments: []}, ...state.items],
        loading: true
      }
    case postConstants.CREATE_FAILURE:
      return {
        ...state,        
        loading: false
      };
    case postConstants.GETALL_REQUEST:
      return {
        ...state,
        page: action.data.page ? action.data.page : 1,
        loading: true
      }
    case postConstants.GETALL_SUCCESS:
      return {
        ...state,
        total: !!action.data.total ? action.data.total : 0,
        items: action.data.posts,
        loading: true
      }
    case postConstants.GETALL_FAILURE:
      return { 
        ...state,
        loading: false,
        message: action.message
      };
    case postConstants.GETBY_HASHTAGS_REQUEST:
      return {
        ...state,
        page: action.data.page ? action.data.page : 1,
        loading: true
      }
    case postConstants.GETBY_HASHTAGS_SUCCESS:
      return {
        ...state,
        total: !!action.data.total ? action.data.total : 0,
        items: action.data.posts,
        loading: true
      }
    case postConstants.GETBY_HASHTAGS_FAILURE:
      return { 
        ...state,
        loading: false,
        message: action.message
      };
    case postConstants.GETBY_USERNAME_REQUEST:
      return {
        ...state,
        page: action.data.page ? action.data.page : 1,
        loading: true
      }
    case postConstants.GETBY_USERNAME_SUCCESS:
      return {
        ...state,
        total: !!action.data.total ? action.data.total : 0,
        items: action.data.posts,
        loading: true
      }
    case postConstants.GETBY_USERNAME_FAILURE:
      return { 
        ...state,
        loading: false,
        message: action.message
      };
    case postConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(post =>
          post.id === action.id
            ? { ...post, deleting: true }
            : post
        )
      };
    case postConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        ...state,
        total: state.total - 1,
        items: state.items.filter(post => post.id !== action.data.id)
      };
    case postConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(post => {
          if (post.id === action.data.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...postCopy } = post;
            // return copy of user with 'deleteError:[error]' property
            return { ...postCopy, deleteError: action.error };
          }
          return post;
        })
      };
    default:
      return state;
  }
}
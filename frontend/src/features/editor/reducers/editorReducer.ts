import { ExecutionStatus, Language } from '@/shared/gql/graphql'

type EditorAction =
  | { type: 'SET_CODE'; code: string }
  | {
      type: 'SET_INITIAL_VALUES'
      payload: Partial<EditorState>
    }
  | { type: 'SET_LANGUAGE'; language: Language; code: string }
  | { type: 'SET_OUTPUT'; output: string }
  | { type: 'SET_EXECUTION_STATUS'; executionStatus?: ExecutionStatus }

export type EditorState = {
  code: string
  language: Language
  output: string
  executionStatus?: ExecutionStatus
}

export default function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case 'SET_CODE': {
      return { ...state, code: action.code }
    }
    case 'SET_INITIAL_VALUES': {
      return {
        ...state,
        ...action.payload,
      }
    }
    case 'SET_LANGUAGE': {
      return {
        ...state,
        language: action.language,
        code: action.code,
      }
    }
    case 'SET_OUTPUT': {
      return { ...state, output: action.output }
    }
    case 'SET_EXECUTION_STATUS': {
      return { ...state, executionStatus: action.executionStatus }
    }
  }
}

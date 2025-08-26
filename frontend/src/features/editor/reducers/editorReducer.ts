import { STARTER_SNIPPET } from '@/features/editor/components/editor'
import { ExecutionStatus, Language } from '@/shared/gql/graphql'

type EditorAction =
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_LANGUAGE'; language: Language; code: string }
  | { type: 'SET_INITIAL_VALUES'; code: string; output: string }
  | { type: 'SET_OUTPUT'; output: string }
  | { type: 'SET_EXECUTION_STATUS'; executionStatus?: ExecutionStatus }

export type EditorState = {
  code: string
  language: Language
  output: string
  executionStatus?: ExecutionStatus
}

export const initialEditorState: EditorState = {
  code: STARTER_SNIPPET.JAVASCRIPT,
  language: Language.Javascript,
  output: '',
  executionStatus: undefined,
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
      return { ...state, code: action.code, output: action.output }
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

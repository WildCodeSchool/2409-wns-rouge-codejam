import { STARTER_SNIPPETS } from '@/features/editor/config'
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
  | { type: 'RESET' }

export type EditorState = {
  code: string
  language: Language
  output: string
  executionStatus?: ExecutionStatus
}

export const initialEditorState: EditorState = {
  code: STARTER_SNIPPETS.JAVASCRIPT,
  language: Language.Javascript,
  output: '',
  executionStatus: undefined,
}

export default function editorReducer(
  editorState: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case 'SET_CODE': {
      return { ...editorState, code: action.code }
    }
    case 'SET_INITIAL_VALUES': {
      return {
        ...editorState,
        ...action.payload,
      }
    }
    case 'SET_LANGUAGE': {
      return {
        ...editorState,
        language: action.language,
        code: action.code,
      }
    }
    case 'SET_OUTPUT': {
      return { ...editorState, output: action.output }
    }
    case 'SET_EXECUTION_STATUS': {
      return { ...editorState, executionStatus: action.executionStatus }
    }
    case 'RESET': {
      return initialEditorState
    }
  }
}

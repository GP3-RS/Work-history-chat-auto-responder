import { CreateChatCompletionResponseChoicesInner } from "openai"

export interface ErrObj {
    log: String,
    status: Number,
    message: ErrMessage
    }
      
export interface ErrMessage {
    err: String
    }

export interface responseData {
    data?: data
}

interface data {
    error?: string,
    choices: CreateChatCompletionResponseChoicesInner[],
}

export interface resLocals {
    question: string,
    platform: string,
}



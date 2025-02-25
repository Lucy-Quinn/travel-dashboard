export type MessageState =
  | {
      success?: string
      error?: string
    }
  | undefined

export type FormDataFields = {
  city: string
  airport?: string
}

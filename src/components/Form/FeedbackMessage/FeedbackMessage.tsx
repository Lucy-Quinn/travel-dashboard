import clsx from 'clsx'

interface FeedbackMessageProps {
  message?: { success?: string; error?: string }
}

export const FeedbackMessage = ({ message }: FeedbackMessageProps) => {
  return (
    message && (
      <p
        className={clsx(
          'mt-2 text-center md:text-right',
          message.success ? 'text-green-600' : 'text-red-500',
        )}
      >
        {message.success || message.error}
      </p>
    )
  )
}

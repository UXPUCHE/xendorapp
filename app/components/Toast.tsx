type Props = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function Toast({ message, actionLabel, onAction }: Props) {
  return (
    <div className="fixed bottom-6 right-6 bg-[#0f3b4c] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50 animate-fade-in">

      <span className="text-sm">{message}</span>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="underline text-sm font-semibold hover:opacity-80 transition"
        >
          {actionLabel}
        </button>
      )}

    </div>
  )
}
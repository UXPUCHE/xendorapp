type Item = {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: Item[] }) {
  return (
    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <a href={item.href} className="hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-[#0f3b4c] font-medium">
              {item.label}
            </span>
          )}

          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </div>
  )
}
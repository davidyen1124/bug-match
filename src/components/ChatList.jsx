export default function ChatList({ matches, onSelect }) {
  return (
    <>
      <div className="overflow-y-auto flex-1 px-4 pb-[env(safe-area-inset-bottom)]">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-sm text-gray-500">
              No active matches
              <br />
              just like my unit tests on a Friday deploy 🚀
            </p>
          </div>
        ) : (
          <ul className="space-y-2 mt-2">
            {matches.map((m) => (
              <li
                key={m.bug.id}
                onClick={() => onSelect(m.bug)}
                className="flex items-center gap-3 rounded-lg p-2 bg-gray-100
                           cursor-pointer hover:bg-gray-200"
              >
                <img
                  src={m.bug.image}
                  alt={m.bug.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="flex-1 text-sm font-medium">{m.bug.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

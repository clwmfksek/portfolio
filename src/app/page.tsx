export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 gap-12 bg-[var(--background)]">
      <section className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          {userInfo.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {userInfo.school} / {userInfo.major}
        </p>
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {userInfo.stack.map((tech) => (
            <span
              key={tech}
              className="bg-[var(--secondary)] text-sm px-3 py-1 rounded-full border border-[var(--card-border)] text-[var(--foreground)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {navCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="card block p-7 hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">
              {card.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {card.description}
            </p>
          </a>
        ))}
      </section>
    </div>
  );
}

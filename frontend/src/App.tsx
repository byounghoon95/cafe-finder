import { useSearchStore } from "./store/searchStore";

const radiusOptions = [300, 500, 1000] as const;

const previewCafes = [
  {
    name: "Seongsu Coffee Lab",
    distance: "72 m",
    score: 91,
    tags: ["work-friendly", "dessert"],
  },
  {
    name: "Maple Table Cafe",
    distance: "210 m",
    score: 84,
    tags: ["quiet", "wifi"],
  },
  {
    name: "Courtyard Brew",
    distance: "420 m",
    score: 78,
    tags: ["outlets", "brunch"],
  },
];

function App() {
  const { radiusMeters, setRadiusMeters } = useSearchStore();

  return (
    <main className="min-h-screen bg-cafe-cream text-cafe-ink">
      <section className="grid min-h-screen grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-1">
        <div className="flex min-h-[58vh] flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white/90 px-5 py-4 backdrop-blur">
            <div>
              <h1 className="text-xl font-semibold tracking-normal">
                CafeRadar
              </h1>
              <p className="text-sm text-slate-600">
                Map-based cafe discovery for Seoul demo data.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-1">
              {radiusOptions.map((radius) => (
                <button
                  className={`rounded px-3 py-2 text-sm font-medium transition ${
                    radiusMeters === radius
                      ? "bg-cafe-leaf text-white"
                      : "text-slate-700 hover:bg-stone-100"
                  }`}
                  key={radius}
                  onClick={() => setRadiusMeters(radius)}
                  type="button"
                >
                  {radius === 1000 ? "1 km" : `${radius} m`}
                </button>
              ))}
            </div>
          </header>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#dbe7d3]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,111,78,0.16)_1px,transparent_1px),linear-gradient(rgba(47,111,78,0.16)_1px,transparent_1px)] bg-[size:44px_44px]" />
            <div className="relative w-full max-w-xl px-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cafe-leaf text-lg font-semibold text-white shadow-panel">
                CR
              </div>
              <h2 className="text-2xl font-semibold">
                Map canvas ready for cafe search
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Google Maps integration lands in the next frontend task. This
                shell already includes the radius control, result panel layout,
                and app providers.
              </p>
            </div>
          </div>
        </div>

        <aside className="border-l border-stone-200 bg-white px-5 py-5 shadow-panel lg:h-screen lg:overflow-y-auto">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Nearby cafes</h2>
              <p className="text-sm text-slate-600">
                Preview data until the backend search API is connected.
              </p>
            </div>
            <span className="rounded bg-cafe-moss px-2 py-1 text-xs font-medium text-cafe-leaf">
              {radiusMeters} m
            </span>
          </div>

          <div className="space-y-3">
            {previewCafes.map((cafe) => (
              <article
                className="rounded-md border border-stone-200 p-4"
                key={cafe.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{cafe.name}</h3>
                    <p className="text-sm text-slate-600">{cafe.distance}</p>
                  </div>
                  <span className="rounded bg-cafe-leaf px-2 py-1 text-sm font-semibold text-white">
                    {cafe.score}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cafe.tags.map((tag) => (
                    <span
                      className="rounded border border-stone-200 px-2 py-1 text-xs text-slate-700"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;

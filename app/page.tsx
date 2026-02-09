import dynamic from 'next/dynamic';

// Dynamically import MapComponent to disable server-side rendering for Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full bg-slate-100 animate-pulse rounded-lg"></div>
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-center text-slate-800">CityGuessr</h1>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white p-4 shadow-sm">
          <MapComponent />
        </div>
      </div>
    </main>
  );
}

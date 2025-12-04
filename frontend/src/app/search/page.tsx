import { Suspense } from 'react';
import SearchResultsClient from './search-results';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-black text-white pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchResultsClient />
    </Suspense>
  );
}

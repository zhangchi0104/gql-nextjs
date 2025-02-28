"use client";

import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border px-4 py-8">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-sm text-gray-500">
        An error occurred while loading the page. Please try refreshing the
        page.
      </p>
      <p className="text-sm text-gray-500">Details: {error.message}</p>
      <Button onClick={reset} className="mt-4">
        Refresh
      </Button>
    </div>
  );
}

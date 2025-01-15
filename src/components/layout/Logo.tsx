import { Magnet } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Magnet className="h-6 w-6 text-red-500" />
      <span className="text-xl font-bold">
        <span className="text-red-500">move</span>
        <span className="text-white">magnet</span>
      </span>
    </div>
  );
}
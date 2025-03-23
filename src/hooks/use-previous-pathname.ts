"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export function usePreviousPathname() {
  const pathname = usePathname();
  const ref = useRef<string | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    setPreviousPath(ref.current);
    ref.current = pathname;
  }, [pathname]);

  return previousPath;
}

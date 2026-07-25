import { useEffect, useState } from "react";

const READY_DATA = ["Alpha", "Beta", "Gamma"];

export type Query = {
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  data: string[] | undefined;
};

export function useFakeQuery() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<string[] | undefined>(undefined);

  const isReady = !isLoading && !isError && data !== undefined;
  const query: Query = { isLoading, isError, isReady, data };

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      setData(READY_DATA);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const setState = (state: string) => {
    switch (state) {
      case "loading":
        setIsLoading(true);
        setIsError(false);
        setData(undefined);
        break;
      case "error":
        setIsLoading(false);
        setIsError(true);
        setData(undefined);
        break;
      case "empty":
        setIsLoading(false);
        setIsError(false);
        setData([]);
        break;
      case "ready":
        setIsLoading(false);
        setIsError(false);
        setData(READY_DATA);
        break;
    }
  };

  return { query, setState };
}

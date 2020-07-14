import { useEffect } from 'react';

export function useDidMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}

import { useEffect } from 'react';

export function useDidMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}

export function useUnMount(callback) {
  useEffect(() => {
    return () => callback();
  }, []);
}

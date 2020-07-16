import { useEffect } from 'react';

export function useDidMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}

export function useUnmount(callback) {
  useEffect(() => {
    return () => callback();
  }, []);
}

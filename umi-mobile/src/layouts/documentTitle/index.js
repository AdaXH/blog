import { useEffect } from 'react';

export default ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
};

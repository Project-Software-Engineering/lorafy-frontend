import { useEffect } from 'react';

const PREFIX = 'LoRaFy';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const oldTitle = document.title;
    if (title) {
      document.title = PREFIX + ' - ' + title;
    }

    // The following line is optional, but will reset title when component unmounts
    return () => (document.title = PREFIX);
  }, [title]);
}

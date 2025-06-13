import { useState, useEffect } from 'react';

const useCloudinary = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'cloudinary-upload-widget-script';
    if (document.getElementById(scriptId)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  return loaded;
};

export default useCloudinary; 
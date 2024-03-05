import React, { PropsWithChildren, useContext, useEffect } from 'react';
import map from 'lodash/map';
import { TCustomObject } from '../types/generated/ctp';
import { ARIES_LOGO_URL, ARIES_LOGO_ALT, ARIES_LOGO_ID, LOGO_TARGET_ID } from '../constants';

interface ContainerContext {
  hasContainers: boolean;
  containers: Array<TCustomObject>;
  where: string;
}

const containerContext = React.createContext<ContainerContext>({
  containers: [],
  hasContainers: false,
  where: '',
});

const useContainerContext = (): ContainerContext => {
  const context = useContext(containerContext);
  if (context === undefined) {
    throw new Error(
      'useContainerContext must be used within a ContainerContextProvider'
    );
  }
  return context;
};

type Props = PropsWithChildren<{ results: Array<TCustomObject> | undefined }>;

const ContainerProvider: React.FC<Props> = ({ results, children }) => {

  const containerContextValue: ContainerContext = {
    hasContainers: (results && results.length > 0) || false,
    containers: results || [],
    where: `container in (${map(results, ({ key }) => `"${key}"`).join(',')})`,
  };

  useEffect(() => {
    if(!document.getElementById(ARIES_LOGO_ID)){
      const ariesLogoElement = document.createElement('div');
      const anchor = document.createElement('a');
      const img = document.createElement('img');
      ariesLogoElement.id = ARIES_LOGO_ID;
      img.src = ARIES_LOGO_URL;
      img.alt= ARIES_LOGO_ALT;
      img.style.width = 'inherit';
      img.style.height = '32px';
      img.style.marginLeft = '10px';
      anchor.href = '/';
      anchor.appendChild(img);
      ariesLogoElement.appendChild(anchor);
      const targetElement = document.getElementById(LOGO_TARGET_ID);
      const parentElement = targetElement?.parentElement;
      parentElement?.insertBefore(ariesLogoElement, targetElement);
    }
  }, []);

  return (
    <containerContext.Provider value={containerContextValue}>
      {children}
    </containerContext.Provider>
  );
};

export { ContainerProvider, useContainerContext };

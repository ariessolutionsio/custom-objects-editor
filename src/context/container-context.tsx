import React, { PropsWithChildren, useContext, useEffect } from 'react';
import map from 'lodash/map';
import { TCustomObject } from '../types/generated/ctp';

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
    const ariesLogoElement = document.createElement('div');
    const anchor = document.createElement('a');
    const img = document.createElement('img');
    img.src = 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1705673742/kkepkrfkpmxqz52cg9ns.png';
    img.alt='aries-logo';
    img.style.width = 'inherit';
    img.style.height = '32px';
    img.style.marginLeft = '10px';
    anchor.href = '/aries_dev-1';
    anchor.appendChild(img);
    ariesLogoElement.appendChild(anchor);
    const parent = document.getElementById('loader-for-requests-in-flight')?.parentElement;
    const loaderElement = document.getElementById('loader-for-requests-in-flight');
    parent?.insertBefore(ariesLogoElement, loaderElement);
  },[]);

  return (
    <containerContext.Provider value={containerContextValue}>
      {children}
    </containerContext.Provider>
  );
};

export { ContainerProvider, useContainerContext };

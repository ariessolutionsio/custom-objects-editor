import React, { PropsWithChildren, useContext } from 'react';
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

  return (
    <containerContext.Provider value={containerContextValue}>
      {children}
    </containerContext.Provider>
  );
};

export { ContainerProvider, useContainerContext };

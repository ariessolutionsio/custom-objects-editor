import React from 'react';

// https://github.com/airbnb/enzyme/issues/2086#issuecomment-549736940
const useEffectMock = (effect, deps) => {
  const firstRun = Symbol('firstRun');
  const isFirstRun = React.useMemo(() => firstRun, []) === firstRun;
  const ref = React.useMemo(
    () => ({
      current: deps,
    }),
    []
  );
  const last = ref.current;
  const changed = deps && last.some((value, i) => value !== deps[i]);

  if (isFirstRun || changed) {
    ref.current = deps;
    effect();
  }
};

export default useEffectMock;

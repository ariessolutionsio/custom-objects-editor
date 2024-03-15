import { useState, useCallback } from 'react';
import { actions as sdkActions, useAsyncDispatch } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

interface IFetchOptions {
  sort?: {by: string, direction: string}[];
  where?: string[];
}

const defaultOptions: IFetchOptions = {
  sort: [{by: 'lastModifiedAt', direction: 'desc'}],
  where: [],
};


export const useFetchAllCustomObjects = () => {
  const [data, setData] = useState<any>({
    data: null,
    error: null,
    loading: false,
  });
  const dispatch = useAsyncDispatch();
  const fetchData = useCallback(async (options = {}) => {
    try {
      const { sort, where }: any = { ...defaultOptions, ...options };     
      const result: any = { data: null, error: null, loading: false };
      setData({ ...result, loading: true });
      const requestOptions: any = {};
      requestOptions.sort = sort && sort.length > 0 ? sort : null;
      requestOptions.where = where && where.length > 0 ? where : null;
      const response = await dispatch(
        sdkActions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          options:requestOptions
        })
      );
      result.data = response;
      setData(result);
      return result;
    } catch (error: any) {
      const result = { data: null, error: error, loading: false };
      setData(result);
      return result;
    }
  }, [dispatch]);  
  return {
    ...data,
    fetchData,
  };
};
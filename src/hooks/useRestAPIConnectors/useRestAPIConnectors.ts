import { CTP_API_URL, PROJECT_KEY } from './constants';

const useRestAPIConnectors = () => {

  const useFetchAllCustomObjects = async () => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': sessionStorage.getItem('sessionToken') ? `Bearer ${sessionStorage.getItem('sessionToken')}` : '',
      },
    };

    const response = await fetch(`${CTP_API_URL}/${PROJECT_KEY}/custom-objects`, requestOptions);
    return response.json();

  };
    
  
    
  return { useFetchAllCustomObjects };
};

export default useRestAPIConnectors;
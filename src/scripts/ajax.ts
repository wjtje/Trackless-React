import { useState, useEffect } from 'react';
import $ from 'jquery';

export const useFetch = request => {
  const [data, setData] = useState(null);   // Use a state for caching the data

  async function fetchData() {
    await $.ajax(request).done((response) => {
      setData(JSON.parse(response));
    });
  }

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(request)]);

  return data;
}
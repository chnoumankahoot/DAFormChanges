import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { makeApiRequests } from '../helpers/api';
import Loader from './Loader';

const getLocalAppChoices = () => {
  const localChoices = localStorage.getItem('appChoices');
  if (localChoices) {
    return JSON.parse(localChoices);
  }

  return null;
};
const WithAppChoices = ({ render }) => {
  const [appChoices, setAppChoices] = useState(null);
  const [appChoicesLoading, setAppChoicesLoading] = useState(true);

  const getAppChoices = () => {
    const localAppChoices = getLocalAppChoices();
    if (localAppChoices) {
      setAppChoices(localAppChoices);
      setAppChoicesLoading(false);
    }

    fetchRemoteAppChoices(localAppChoices !== null);
  };

  const fetchRemoteAppChoices = async hasLocalAppChoices => {
    const { response, error } = await makeApiRequests({ requestType: 'getMetaData' });
    if (error) {
      toast(error, {
        type: 'error'
      });
      setAppChoicesLoading(false);
      return;
    }

    const responseChoices = response['metaData'];
    if (!hasLocalAppChoices) {
      setAppChoices(responseChoices);
      setAppChoicesLoading(false);
    }

    localStorage.setItem('appChoices', JSON.stringify(responseChoices));
  };

  useEffect(() => {
    getAppChoices();
  }, []);

  if (appChoicesLoading) return <Loader />;

  return appChoices ? render(appChoices) : '';
};

export default WithAppChoices;

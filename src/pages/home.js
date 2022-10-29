import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import Header from '../components/Header';
import NotFound from '../components/NotFound';
import CreateDA from '../components/da/CreateDA';
import WithAppChoices from '../components/WithAppChoices';

const Home = () => {
  const email = localStorage.getItem('user-email');
  const code = localStorage.getItem('user-code');

  if (!email && !code) {
    return <Redirect from="/" to="/login" />;
  }

  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/">
          <WithAppChoices render={appChoices => <CreateDA appChoices={appChoices} />} />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
};

export default withRouter(Home);

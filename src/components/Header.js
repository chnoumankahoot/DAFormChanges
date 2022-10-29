import React, { useState } from 'react';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { PersonBadge, BoxArrowInRight } from 'react-bootstrap-icons';
import { useHistory, useLocation } from 'react-router';
import { BRAND_NAME } from '../helpers/constants';

const Header = ({ noMenu = false }) => {
  const history = useHistory();
  const location = useLocation();
  const [role] = useState(localStorage.getItem('user-role'));

  const LinkItem = ({ dropdown = false, title, path }) => {
    return dropdown ? (
      <NavDropdown.Item href={path} active={location.pathname === path}>
        {title}
      </NavDropdown.Item>
    ) : (
      <Nav.Link href={path} active={location.pathname === path}>
        {title}
      </Nav.Link>
    );
  };

  const logout = () => {
    localStorage.clear();
    history.push('/login');
  };

  return (
    <Navbar variant="dark" bg="primary" expand="lg" style={{ fontSize: 15 }}>
      <Navbar.Brand href="/" style={{ fontSize: 17 }}>
        <b>{BRAND_NAME}</b>
      </Navbar.Brand>
      {!noMenu && (
        <>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Button size="sm" className="ml-auto " variant="outline-light">
              <PersonBadge className="mr-2" />
              {localStorage.getItem('user-name')}
            </Button>
            <Button size="sm" variant="light" className="ml-2" onClick={logout}>
              <BoxArrowInRight className="align-text-top" />
            </Button>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

export default Header;

/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

// @flow

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import logo from '../../img/knots.svg';

const Header = () => (
  <Navbar color="dark" dark className="mb-5">
    <Container>
      <NavbarBrand href="#">
        <img src={logo} alt="KNOTS logo" width={40} height={40} />
      </NavbarBrand>
      <NavLink
        to="/"
        activeClassName="active"
        className="btn btn-outline-secondary"
        exact
      >
        Saved knots
      </NavLink>
    </Container>
  </Navbar>
);

export default Header;

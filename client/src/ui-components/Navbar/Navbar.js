import { Navbar as NavbarBootstrap, Container } from "react-bootstrap";

import Logo from "../../ui-components/Logo/Logo";
import InlineSearchForm from "../InlineSearchForm/InlineSearchForm";

import "./Navbar.css";

function Navbar(props) {
  return (
    <>
      <NavbarBootstrap
        bg='light'
        className='justify-content-around flex-wrap fixed-top'>
        <NavbarBootstrap.Brand>
          <Logo />
        </NavbarBootstrap.Brand>
        {props.search ? (
          <span className='mt-2 mt-sm-0'>
            <InlineSearchForm onSubmit={props.onSearchSubmit} />
          </span>
        ) : null}
        {props.children}
      </NavbarBootstrap>
      <Container className='navbar-placeholder' data-search={props.search} />
    </>
  );
}

export default Navbar;

import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "",
    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu secondary>
        <Menu.Item name="DevBook" to="/" onClick={this.handleItemClick} active={activeItem === "DevBook"} />
        <Menu.Menu position="right">
          <Menu.Item name="Login" as={Link} to="/login" active={activeItem === "Login"} onClick={this.handleItemClick} />
          <Menu.Item name="Sign Up" as={Link} to="/signup" active={activeItem === "Sign Up"} onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default NavBar;

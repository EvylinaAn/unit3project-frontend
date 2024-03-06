import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";

export default function Sidebar({ handleLogout, user }) {


  return (
    <div style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}>
      <CDBSidebar textColor="#F4F4F1" backgroundColor="#3C7D54">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
            <Link to='/'>
            <img
              src={"https://i.imgur.com/oVyooXT.png"}
              alt=""
              style={{ width: "150px" }}
              className="mb-2"
            />
            </Link>
            <p
              style={{
                color: "#F4F4F1",
                margin: "5px 0 0",
                fontFamily: "PT Serif, serif",
              }}
            >
              Hello, {user?.given_name}
            </p>
          </div>
        </CDBSidebarHeader>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink to="/"  >
              <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/dailies">
              <CDBSidebarMenuItem icon="calendar-plus">
                All Daily's
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/todos">
              <CDBSidebarMenuItem icon="calendar-check">
                All To Do's
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/schedule">
              <CDBSidebarMenuItem icon="calendar-week">
                Schedule
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div className="sidebar-btn-wrapper">
            <Button
              variant="secondary"
              onClick={handleLogout}
              style={{
                width: "100%",
                background: "rgb(233, 237, 200, 0.2)",
                border: "none",
                borderRadius: "0",
              }}
            >
              <CiLogout style={{ marginRight: "5px" }} />
            </Button>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";

export default function Layout() {
  return (
    <>
      <Navigation />

      <main className="mt-4">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}

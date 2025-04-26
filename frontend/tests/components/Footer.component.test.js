import { render, screen } from "@testing-library/react";
import Footer from "../../src/components/partials/Footer.component";

describe("Footer Component", () => {
  test("renders the HealthHub logo and tagline", () => {
    render(<Footer />);

    expect(screen.getByText("HealthHub")).toBeInTheDocument();

    expect(
      screen.getByText(/A comprehensive hospital management system/i)
    ).toBeInTheDocument();
  });

  test("renders all section headings", () => {
    render(<Footer />);

    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  test("renders the correct number of links in each section", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");

    expect(links.length).toBeGreaterThanOrEqual(12);
  });

  test("displays the current year in the copyright notice", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    const copyrightText = screen.getByText(
      new RegExp(`© ${currentYear} HealthHub Medical Center`)
    );

    expect(copyrightText).toBeInTheDocument();
  });
});

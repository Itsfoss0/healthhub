import { fireEvent, render, screen } from "@testing-library/react";
import DemoSection from "../../src/components/sections/DemoSection.component";

describe("DemoSection Component", () => {
  test("renders the section title and description", () => {
    render(<DemoSection />);

    expect(screen.getByText("Experience HealthHub")).toBeInTheDocument();
    expect(
      screen.getByText(/See how our hospital management system/i)
    ).toBeInTheDocument();
  });

  test("renders the default tab (Dashboard) content", () => {
    render(<DemoSection />);

    expect(screen.getByText("Welcome to Your Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Access all your healthcare tools in one place")
    ).toBeInTheDocument();
  });

  test("renders all tab buttons", () => {
    render(<DemoSection />);

    expect(
      screen.getByRole("button", { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /patients/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /programs/i })
    ).toBeInTheDocument();
  });

  test("switches to Patients tab when clicked", () => {
    render(<DemoSection />);

    expect(screen.queryByText("Patient Management")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /patients/i }));

    expect(screen.getByText("Patient Management")).toBeInTheDocument();
    expect(
      screen.getByText("View and manage your patient records")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Welcome to Your Dashboard")
    ).not.toBeInTheDocument();
  });

  test("switches to Programs tab when clicked", () => {
    render(<DemoSection />);

    expect(screen.queryByText("Program Calendar")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /programs/i }));

    expect(screen.getByText("Program Calendar")).toBeInTheDocument();
    expect(
      screen.getByText("Add and manage programs here")
    ).toBeInTheDocument();
  });

  test.skip("renders all dashboard icons", () => {
    render(<DemoSection />);

    expect(screen.getByText("Programs")).toBeInTheDocument();
    expect(screen.getByText("Patients")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});

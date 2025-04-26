import { render, screen } from "@testing-library/react";

import FeatureSection from "../../src/components/sections/FeaturesSections.component";

describe("FeatureSection Component", () => {
  test("renders the section title", () => {
    render(<FeatureSection />);

    expect(screen.getByText("Key Features")).toBeInTheDocument();
  });

  test("renders all feature cards", () => {
    render(<FeatureSection />);

    expect(screen.getByText("Patient Management")).toBeInTheDocument();
    expect(screen.getByText("Appointment Scheduling")).toBeInTheDocument();
    expect(screen.getByText("Monitor Patients")).toBeInTheDocument();

    expect(
      screen.getByText(/Manage patient information and records/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Book & Schedule appointments with ease/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Access and update patient medical records/i)
    ).toBeInTheDocument();
  });


  test.skip("applies hover effects to feature cards", () => {
    render(<FeatureSection />);

    const featureCards = screen.getAllByClass(
      "bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
    );
    expect(featureCards.length).toBe(3);

    featureCards.forEach((card) => {
      expect(card).toHaveClass("hover:shadow-lg");
      expect(card).toHaveClass("transition");
    });
  });
});

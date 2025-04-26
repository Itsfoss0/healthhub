import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../src/components/ui/Card.component";

describe("Card Components", () => {
  it.skip("Card renders with children and custom className", () => {
    render(<Card className="test-class">Card Content</Card>);

    const card = screen.getByText("Card Content");
    expect(card).toBeInTheDocument();
    expect(card.parentElement).toHaveClass("test-class");
    expect(card.parentElement).toHaveClass("rounded-lg");
  });

  it.skip("CardHeader renders with children and custom className", () => {
    render(<CardHeader className="test-class">Header Content</CardHeader>);

    const header = screen.getByText("Header Content");
    expect(header).toBeInTheDocument();
    expect(header.parentElement).toHaveClass("test-class");
    expect(header.parentElement).toHaveClass("p-6");
  });

  it("CardTitle renders with children and custom className", () => {
    render(<CardTitle className="test-class">Card Title</CardTitle>);

    const title = screen.getByText("Card Title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("test-class");
    expect(title).toHaveClass("text-2xl");
  });

  it("CardDescription renders with children and custom className", () => {
    render(
      <CardDescription className="test-class">Card Description</CardDescription>
    );

    const description = screen.getByText("Card Description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("test-class");
    expect(description).toHaveClass("text-gray-500");
  });


  it("Card components compose together correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });
});

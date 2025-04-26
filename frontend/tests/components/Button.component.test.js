"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../src/components/ui/Button.component";

describe("Button Component", () => {
  test("renders with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-gray-900");
    expect(button).toHaveClass("h-10");
  });

  test("applies variant styles correctly", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-red-500");
  });

  test("applies size styles correctly", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("h-11");
  });

  test("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toHaveClass("custom-class");
  });

  test("forwards additional props to the button element", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole("button", { name: /clickable/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});

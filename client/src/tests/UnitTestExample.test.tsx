import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ButtonExample";

describe("Button component", () => {
  it("should display the correct label", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call the onClick handler when clicked", () => {
    const mockClick = jest.fn();
    render(<Button label="Click" onClick={mockClick} />);
    fireEvent.click(screen.getByText("Click"));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});

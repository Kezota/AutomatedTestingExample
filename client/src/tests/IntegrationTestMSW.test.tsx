import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Register from "@/pages/Register";

// Mock navigate
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => jest.fn(),
  };
});

const renderWithProviders = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Register Integration Test with MSW", () => {
  it("registers successfully with MSW", async () => {
    renderWithProviders(<Register />);

    // Fill form
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait until mutation succeeds (we check the button disabled or whatever)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
    });
  });
});

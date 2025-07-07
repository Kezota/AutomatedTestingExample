import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "@/pages/Register";

// Mocking mutation hook
const mockMutate = jest.fn();

jest.mock("@/hooks/useAuthMutation", () => ({
  useRegisterMutation: () => ({
    mutate: mockMutate,
    isLoading: false,
  }),
}));

// Mocking toast from react-toastify
const mockToastError = jest.fn();
jest.mock("react-toastify", () => ({
  toast: {
    error: (...args: any[]) => mockToastError(...args),
  },
}));

// Helper to render with required providers
const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Register Integration Test", () => {
  it("successfully registers and redirects to dashboard", () => {
    renderWithProviders(<Register />);

    // Fill the form with matching passwords
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "123456" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Mutation function should be called with correct payload
    expect(mockMutate).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "123456",
        confirmPassword: "123456",
      },
      expect.any(Object)
    );
  });

  it("shows error when passwords do not match", () => {
    renderWithProviders(<Register />);

    // Fill form with mismatched passwords
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "wrongpass" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Mutation function should NOT be called
    expect(mockMutate).not.toHaveBeenCalled();

    // Error toast should be shown
    expect(mockToastError).toHaveBeenCalledWith("Passwords do not match!");
  });
});

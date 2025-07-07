import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/Login";

// Mock the useLoginMutation hook
const mockMutate = jest.fn();
jest.mock("@/hooks/useAuthMutation", () => ({
  useLoginMutation: () => ({
    mutate: mockMutate,
    status: "idle", // or "pending" if you want to test loading state
  }),
}));

// Utility to wrap component with required providers
const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Login Page", () => {
  it("renders login form with all inputs and button", () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("allows user to type into the form fields", () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@user.com" } });
    fireEvent.change(passwordInput, { target: { value: "securepass" } });

    expect(emailInput).toHaveValue("test@user.com");
    expect(passwordInput).toHaveValue("securepass");
  });

  it("submits the form with valid inputs", () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@user.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "securepass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      {
        email: "test@user.com",
        password: "securepass",
      },
      expect.any(Object)
    );
  });

  it("disables the login button when loading", () => {
    // Override hook to simulate loading state
    jest.mocked(require("@/hooks/useAuthMutation")).useLoginMutation = () => ({
      mutate: mockMutate,
      status: "pending",
    });

    renderWithProviders(<Login />);

    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();
  });
});

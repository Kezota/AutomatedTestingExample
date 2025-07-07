import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "@/pages/Register";

// Mock useRegisterMutation hook
const mockMutate = jest.fn();
jest.mock("@/hooks/useAuthMutation", () => ({
  useRegisterMutation: () => ({
    mutate: mockMutate,
    status: "idle", // atau "pending" jika ingin test loading state
  }),
}));

// Mock react-toastify
const mockToastError = jest.fn();
jest.mock("react-toastify", () => ({
  toast: {
    error: (...args: any[]) => mockToastError(...args),
  },
}));

// Helper to wrap component with providers
const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Register Page", () => {
  it("renders all form elements correctly", () => {
    renderWithProviders(<Register />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  it("allows user to type in inputs", () => {
    renderWithProviders(<Register />);
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");

    fireEvent.change(email, { target: { value: "test@user.com" } });
    fireEvent.change(password, { target: { value: "123456" } });
    fireEvent.change(confirmPassword, { target: { value: "123456" } });

    expect(email).toHaveValue("test@user.com");
    expect(password).toHaveValue("123456");
    expect(confirmPassword).toHaveValue("123456");
  });

  it("shows error toast when passwords do not match", () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@user.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledWith("Passwords do not match!");
  });

  it("submits form when all fields are valid", () => {
    renderWithProviders(<Register />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@user.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      {
        email: "test@user.com",
        password: "123456",
        confirmPassword: "123456",
      },
      expect.any(Object)
    );
  });
});

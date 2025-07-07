import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/Dashboard";

// Mock all hooks from useProduct
const mockProducts = [
  { id: 1, name: "Product A", stock: 10 },
  { id: 2, name: "Product B", stock: 20 },
];

const mockCreate = { mutate: jest.fn() };
const mockUpdate = { mutate: jest.fn() };
const mockDelete = { mutate: jest.fn() };

jest.mock("@/hooks/useProduct", () => ({
  useProducts: () => ({ data: mockProducts, isLoading: false }),
  useCreateProduct: () => mockCreate,
  useUpdateProduct: () => mockUpdate,
  useDeleteProduct: () => mockDelete,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Dashboard Page", () => {
  it("renders product table correctly", () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("opens add product dialog and submits form", async () => {
    renderWithProviders(<Dashboard />);

    fireEvent.click(screen.getByText("Add New Product"));
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Product C" },
    });
    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: "30" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    await waitFor(() => {
      expect(mockCreate.mutate).toHaveBeenCalledWith(
        { name: "Product C", stock: 30 },
        expect.any(Object)
      );
    });
  });

  it("opens update dialog, edits product and submits", async () => {
    renderWithProviders(<Dashboard />);

    fireEvent.click(screen.getAllByText("Update")[0]);
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Product A Edited" },
    });
    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: "99" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdate.mutate).toHaveBeenCalledWith(
        { id: 1, name: "Product A Edited", stock: 99 },
        expect.any(Object)
      );
    });
  });

  it("opens delete dialog and confirms deletion", async () => {
    renderWithProviders(<Dashboard />);

    fireEvent.click(screen.getAllByText("Delete")[0]);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(mockDelete.mutate).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });
});

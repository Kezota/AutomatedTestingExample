import { API_URL } from "@/lib/config";
import { http, HttpResponse } from "msw";

export const handlers = [
  // LOGIN
  http.post(`${API_URL}/login`, async () => {
    return HttpResponse.json({
      token: "mock-token",
      user: {
        id: "1",
        email: "user@gmail.com",
      },
    });
  }),

  // REGISTER
  http.post(`${API_URL}/register`, async () => {
    return HttpResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  }),

  // GET PRODUCTS
  http.get(`${API_URL}/`, async () => {
    return HttpResponse.json([
      { id: "1", name: "Product A" },
      { id: "2", name: "Product B" },
    ]);
  }),

  // CREATE PRODUCT
  http.post(`${API_URL}/`, async () => {
    return HttpResponse.json({ message: "Product created" }, { status: 201 });
  }),

  // UPDATE PRODUCT
  http.put(`${API_URL}/:id`, async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ message: `Product ${id} updated` });
  }),

  // DELETE PRODUCT
  http.delete(`${API_URL}/:id`, async ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ message: `Product ${id} deleted` });
  }),
];

import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchJson } from "../lib/api";

const CART_QUERY_KEY = "cart";

export function useCart() {
  const query = useQuery(CART_QUERY_KEY, async () => {
    try {
      return await fetchJson("/api/cart");
    } catch (e) {
      return undefined;
    }
  });
  return query.data;
}

export function useUpdateCartItem() {
  const { mutateAsync, isLoading, isError } = useMutation(
    ({ id, quantity }) => {
      return fetchJson("/api/cart", {
        method: "PUT",
        body: JSON.stringify({ id, quantity }),
      });
    }
  );

  const queryClient = useQueryClient();

  return {
    updateItem: async (id, quantity) => {
      try {
        const cart = await mutateAsync({ id, quantity });
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        return true;
      } catch (e) {
        return false;
      }
    },
    updateError: isError,
    updateLoading: isLoading,
  };
}

export function useDeleteCartItem() {
  const { mutateAsync, isLoading, isError } = useMutation((id) => {
    return fetchJson("/api/cart/", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  });

  const queryClient = useQueryClient();

  return {
    deleteError: isError,
    deleteLoading: isLoading,
    deleteItem: async (id) => {
      try {
        const cart = await mutateAsync(id);
        queryClient.setQueryData(CART_QUERY_KEY, cart);
        return true;
      } catch (e) {
        return false;
      }
    },
  };
}

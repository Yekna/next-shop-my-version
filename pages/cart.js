import Page from "../components/Page";
import Button from "../components/Button";
import { useCart, useDeleteCartItem, useUpdateCartItem } from "../hooks/cart";
import { useEffect, useReducer, useState } from "react";

function formatCurrency(value) {
  return "$" + value.toFixed(2);
}

function buildCart(cartItems) {
  let total = 0.0;
  const items = [];
  for (const cartItem of cartItems) {
    const itemTotal = cartItem.product.price * cartItem.quantity;
    total += itemTotal;
    items.push({ ...cartItem, total: itemTotal });
  }
  return { items, total };
}

function filter(data, id) {}

function CartTable({ cartItems }) {
  const cart = buildCart(cartItems);
  const { deleteItem } = useDeleteCartItem();
  const { updateItem } = useUpdateCartItem();

  const [quantity, setQuantity] = useState(
    cart.items.map((item) => ({ quantity: item.quantity, id: item.id }))
  );

  return (
    <table>
      <thead>
        <tr>
          <th className="px-4 py-2">Product</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Quantity</th>
          <th className="px-4 py-2">Total</th>
          <th className="px-4 py-2">Other</th>
        </tr>
      </thead>
      <tbody>
        {cart.items.map((cartItem) => (
          <tr key={cartItem.id}>
            <td className="px-4 py-2">{cartItem.product.title}</td>
            <td className="px-4 py-2 text-right">
              {formatCurrency(cartItem.product.price)}
            </td>
            <td className="px-4 py-2 text-right">{cartItem.quantity}</td>
            <td className="px-4 py-2 text-right">
              {formatCurrency(cartItem.total)}
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                min="1"
                className="border rounded px-3 py-1 mr-2 w-16 text-right"
                value={quantity[cart.items.indexOf(cartItem)].quantity}
                onChange={(event) => {
                  const newQuantities = quantity.map((q) => {
                    if (cartItem.id === q.id) {
                      return { id: q.id, quantity: event.target.value };
                    } else {
                      return q;
                    }
                  });
                  setQuantity(newQuantities);
                }}
              />
              <Button
                onClick={() => {
                  updateItem(
                    cartItem.id,
                    quantity[cart.items.indexOf(cartItem)].quantity
                  );
                }}
              >
                Update
              </Button>
              |<Button onClick={() => deleteItem(cartItem.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th className="px-4 py-2 text-left">Total</th>
          <th></th>
          <th></th>
          <th></th>
          <th className="px-4 py-2 text-right">{formatCurrency(cart.total)}</th>
        </tr>
      </tfoot>
    </table>
  );
}

function CartPage() {
  const cartItems = useCart();

  return (
    <Page title="Cart">{cartItems && <CartTable cartItems={cartItems} />}</Page>
  );
}

export default CartPage;

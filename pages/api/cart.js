import { fetchJson } from "../../lib/api";

const { CMS_URL } = process.env;

function stripCartItem(cartItem) {
  return {
    id: cartItem.id,
    product: {
      id: cartItem.product.id,
      title: cartItem.product.title,
      price: cartItem.product.price,
    },
    quantity: cartItem.quantity,
  };
}

async function handleGetCart(req, res) {
  const { jwt } = req.cookies;
  if (!jwt) {
    res.status(401).end();
    return;
  }
  try {
    const cartItems = await fetchJson(`${CMS_URL}/cart-items`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    res.status(200).json(cartItems.map(stripCartItem));
  } catch (err) {
    res.status(401).end();
  }
}

async function handlePostCart(req, res) {
  const { jwt } = req.cookies;
  if (!jwt) {
    res.status(401).end();
    return;
  }
  const { productId, quantity } = req.body;
  try {
    await fetchJson(`${CMS_URL}/cart-items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: productId, quantity }),
    });
    res.status(200).json({});
  } catch (err) {
    res.status(401).end();
  }
}

async function handlePutCart(req, res) {
  const { jwt } = req.cookies;
  const { id, quantity } = JSON.parse(req.body);

  if (!jwt) {
    res.status(401).end();
    return;
  }

  try {
    await fetchJson(`${CMS_URL}/cart-items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({quantity}),
    });

    const cart = await fetchJson(`${CMS_URL}/cart-items`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    res.status(200).json(cart);
  } catch (e) {
    res.status(401).end();
  }
}

async function handleDeleteCart(req, res) {
  const { jwt } = req.cookies;
  const { id } = JSON.parse(req.body);

  if (!jwt) {
    res.status(401).end();
    return;
  }
  try {
    await fetchJson(`${CMS_URL}/cart-items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const cart = await fetchJson(`${CMS_URL}/cart-items`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    res.status(200).json(cart);
  } catch (e) {
    res.status(401).end();
  }
}

async function handleCart(req, res) {
  switch (req.method) {
    case "GET":
      return handleGetCart(req, res);
    case "POST":
      return handlePostCart(req, res);
    case "DELETE":
      return handleDeleteCart(req, res);
    case "PUT":
      return handlePutCart(req, res);
    default:
      res.status(405).end();
  }
}

export default handleCart;

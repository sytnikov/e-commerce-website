import { createStore } from "../../redux/store";

import productsReducer, {
  createProductAsync,
  deleteProductAsync,
  fetchAllProductsAsync,
  initialState,
  sortByPrice,
} from "../../redux/reducers/productsReducer";
import productsData from "../data/productsData";
import { ProductsReducerState } from "../../types/InitialState";
import server from "../shared/server";
import CreateProductInput from "../../types/CreateProductInput";

let store = createStore();
afterEach(() => {
  store = createStore();
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Test normal productsReducer actions", () => {
  test("Should sort products by price in ascending order", () => {
    const state: ProductsReducerState = {
      products: productsData,
      loading: false,
    };
    const products = productsReducer(state, sortByPrice("asc")).products;
    expect(products[0]).toBe(productsData[1]);
    expect(products[1]).toBe(productsData[0]);
  });

  test("Should sort products by price in descending order", () => {
    const state: ProductsReducerState = {
      products: productsData,
      loading: false,
    };
    const products = productsReducer(state, sortByPrice("desc")).products;
    expect(products[0]).toBe(productsData[2]);
    expect(products[1]).toBe(productsData[0]);
  });

  test("Should return initial state", () => {
    const state = productsReducer(initialState, {
      payload: undefined,
      type: undefined,
    });
    expect(state).toMatchObject(initialState);
  });
});

describe("Test async thunk productsReducer actions", () => {
  test("Should fetch all products with pagination", async () => {
    await store.dispatch(fetchAllProductsAsync({ limit: 20, offset: 0 }));
    expect(store.getState().productsReducer.products.length).toBe(20);
  });

  test("Should create a new product", async () => {
    const inputData: CreateProductInput = {
      title: "test title",
      price: 200,
      description: "test description",
      categoryId: 1,
      images: [],
    };
    await store.dispatch(createProductAsync(inputData))
    expect(store.getState().productsReducer.products.length).toBe(1)
  });

  test("Should delete an existing product", async () => {
    const resultAction = await store.dispatch(deleteProductAsync(1));
    expect(resultAction.payload).toBe(1);
  });

  test("Should throw an error while deleting a non-existing product", async () => {
    const resultAction = await store.dispatch(deleteProductAsync(400));
    expect(resultAction.payload).toBe("The product cannot be deleted");
  });
});
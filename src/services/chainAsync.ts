interface Chainable {
  // chain: Function
  [propName: string]: any
}

const chainAsync =
  (...functions: Array<(state: Chainable) => Promise<Chainable>>) =>
  async (state: Chainable | Promise<Chainable>): Promise<Chainable> =>
    functions.reduce(
      async (
        result: Chainable | Promise<Chainable>,
        next: (state: Chainable) => Promise<Chainable>
      ) => next(await result),
      state
    )

export default chainAsync

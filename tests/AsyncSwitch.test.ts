import { describe, expect, it } from "bun:test";

import { AsyncSwitch } from "../src/AsyncSwitch.tsx";
import type { AsyncSwitchProps } from "../src/AsyncSwitch.tsx";

const baseProps = {
  loading: "loading",
  error: "error",
  children: "ready",
} as const;

describe("AsyncSwitch", () => {
  it("renders loading when isLoading is true", () => {
    const result = AsyncSwitch({
      ...baseProps,
      states: { isLoading: true, isError: false },
    });

    expect(result).toBe("loading");
  });

  it("renders error when isError is true and isLoading is false", () => {
    const result = AsyncSwitch({
      ...baseProps,
      states: { isLoading: false, isError: true },
    });

    expect(result).toBe("error");
  });

  it("prefers loading over error when both are true", () => {
    const result = AsyncSwitch({
      ...baseProps,
      states: { isLoading: true, isError: true },
    });

    expect(result).toBe("loading");
  });

  it("renders empty when isEmpty is true and higher-priority states are false", () => {
    const result = AsyncSwitch({
      ...baseProps,
      empty: "empty",
      states: {
        isLoading: false,
        isError: false,
        isEmpty: true,
      },
    });

    expect(result).toBe("empty");
  });

  it("prefers error over empty when both are true", () => {
    const result = AsyncSwitch({
      ...baseProps,
      empty: "empty",
      states: {
        isLoading: false,
        isError: true,
        isEmpty: true,
      },
    });

    expect(result).toBe("error");
  });

  it("renders children as the default when no other state matches", () => {
    const result = AsyncSwitch({
      ...baseProps,
      states: { isLoading: false, isError: false },
    });

    expect(result).toBe("ready");
  });

  it("omits the empty branch when empty prop is not provided", () => {
    const result = AsyncSwitch({
      ...baseProps,
      states: { isLoading: false, isError: false },
    });

    expect(result).toBe("ready");
  });
});

describe("AsyncSwitch types", () => {
  it("accepts paired empty and isEmpty", () => {
    const props: AsyncSwitchProps = {
      states: {
        isLoading: false,
        isError: false,
        isEmpty: false,
      },
      loading: "loading",
      error: "error",
      empty: "empty",
      children: "ready",
    };

    expect(AsyncSwitch(props)).toBe("ready");
  });

  it("accepts props without empty", () => {
    const props: AsyncSwitchProps = {
      states: {
        isLoading: false,
        isError: false,
      },
      loading: "loading",
      error: "error",
      children: "ready",
    };

    expect(AsyncSwitch(props)).toBe("ready");
  });

  it("rejects empty without isEmpty", () => {
    expectTypeOf<
      AsyncSwitchProps,
      {
        states: {
          isLoading: false;
          isError: false;
        };
        loading: "loading";
        error: "error";
        empty: "empty";
        children: "ready";
      }
    >().toEqualTypeOf<never>();
  });

  it("rejects isEmpty without empty", () => {
    expectTypeOf<
      AsyncSwitchProps,
      {
        states: {
          isLoading: false;
          isError: false;
          isEmpty: false;
        };
        loading: "loading";
        error: "error";
        children: "ready";
      }
    >().toEqualTypeOf<never>();
  });
});

type Expect<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type IsAssignableTo<T, U> = T extends U ? true : false;

function expectTypeOf<T, U>(): {
  toEqualTypeOf<V>(): Expect<Equal<IsAssignableTo<U, T>, V extends never ? true : false>>;
} {
  return {
    toEqualTypeOf() {
      return undefined as never;
    },
  };
}

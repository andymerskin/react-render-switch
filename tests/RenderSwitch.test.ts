import { describe, expect, it } from "bun:test";

import { RenderSwitch } from "../src/RenderSwitch.tsx";
import type { RenderSwitchProps } from "../src/RenderSwitch.tsx";

const baseProps = {
  loading: "loading",
  error: "error",
  ready: "ready",
} as const;

describe("RenderSwitch", () => {
  it("renders loading when isLoading is true", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: true, isError: false, isReady: false },
    });

    expect(result).toBe("loading");
  });

  it("renders error when isError is true and isLoading is false", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: false, isError: true, isReady: false },
    });

    expect(result).toBe("error");
  });

  it("prefers loading over error when both are true", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: true, isError: true, isReady: false },
    });

    expect(result).toBe("loading");
  });

  it("renders empty when isEmpty is true and higher-priority states are false", () => {
    const result = RenderSwitch({
      ...baseProps,
      empty: "empty",
      states: {
        isLoading: false,
        isError: false,
        isEmpty: true,
        isReady: false,
      },
    });

    expect(result).toBe("empty");
  });

  it("prefers error over empty when both are true", () => {
    const result = RenderSwitch({
      ...baseProps,
      empty: "empty",
      states: {
        isLoading: false,
        isError: true,
        isEmpty: true,
        isReady: false,
      },
    });

    expect(result).toBe("error");
  });

  it("renders ready when isReady is true and higher-priority states are false", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: false, isError: false, isReady: true },
    });

    expect(result).toBe("ready");
  });

  it("returns null when no state matches", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: false, isError: false, isReady: false },
    });

    expect(result).toBeNull();
  });

  it("omits the empty branch when empty prop is not provided", () => {
    const result = RenderSwitch({
      ...baseProps,
      states: { isLoading: false, isError: false, isReady: true },
    });

    expect(result).toBe("ready");
  });
});

describe("RenderSwitch types", () => {
  it("accepts paired empty and isEmpty", () => {
    const props: RenderSwitchProps = {
      states: {
        isLoading: false,
        isError: false,
        isEmpty: false,
        isReady: true,
      },
      loading: "loading",
      error: "error",
      empty: "empty",
      ready: "ready",
    };

    expect(RenderSwitch(props)).toBe("ready");
  });

  it("accepts props without empty", () => {
    const props: RenderSwitchProps = {
      states: {
        isLoading: false,
        isError: false,
        isReady: true,
      },
      loading: "loading",
      error: "error",
      ready: "ready",
    };

    expect(RenderSwitch(props)).toBe("ready");
  });

  it("rejects empty without isEmpty", () => {
    expectTypeOf<
      RenderSwitchProps,
      {
        states: {
          isLoading: false;
          isError: false;
          isReady: true;
        };
        loading: "loading";
        error: "error";
        empty: "empty";
        ready: "ready";
      }
    >().toEqualTypeOf<never>();
  });

  it("rejects isEmpty without empty", () => {
    expectTypeOf<
      RenderSwitchProps,
      {
        states: {
          isLoading: false;
          isError: false;
          isEmpty: false;
          isReady: true;
        };
        loading: "loading";
        error: "error";
        ready: "ready";
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

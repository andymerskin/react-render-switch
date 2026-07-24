import { describe, expect, it, mock } from "bun:test";

import { createRenderSwitch } from "../src/createRenderSwitch.ts";

describe("createRenderSwitch", () => {
  it("returns the first matching case in object insertion order", () => {
    const secondRender = mock(() => "second");
    const thirdRender = mock(() => "third");

    const renderState = createRenderSwitch({
      first: { test: false, render: () => "first" },
      second: { test: true, render: secondRender },
      third: { test: true, render: thirdRender },
    });

    expect(renderState()).toBe("second");
    expect(secondRender).toHaveBeenCalledTimes(1);
    expect(thirdRender).not.toHaveBeenCalled();
  });

  it("evaluates boolean tests", () => {
    const renderState = createRenderSwitch({
      active: { test: true, render: () => "active" },
      inactive: { test: false, render: () => "inactive" },
    });

    expect(renderState()).toBe("active");
  });

  it("evaluates function tests with props", () => {
    type Props = { count: number };

    const renderState = createRenderSwitch<Props>({
      empty: {
        test: (props) => props.count === 0,
        render: () => "empty",
      },
      ready: {
        test: (props) => props.count > 0,
        render: (props) => `ready:${props.count}`,
      },
    });

    expect(renderState({ count: 0 })).toBe("empty");
    expect(renderState({ count: 3 })).toBe("ready:3");
  });

  it("returns default.render when no case matches", () => {
    const renderState = createRenderSwitch({
      loading: { test: false, render: () => "loading" },
      default: { render: () => "fallback" },
    });

    expect(renderState()).toBe("fallback");
  });

  it("returns null when no case matches and default is omitted", () => {
    const renderState = createRenderSwitch({
      loading: { test: false, render: () => "loading" },
    });

    expect(renderState()).toBeNull();
  });

  it("does not treat default as a match candidate", () => {
    const defaultRender = mock(() => "fallback");

    const renderState = createRenderSwitch({
      default: { render: defaultRender },
    });

    expect(renderState()).toBe("fallback");
    expect(defaultRender).toHaveBeenCalledTimes(1);
  });

  it("passes props to default.render", () => {
    type Props = { label: string };

    const renderState = createRenderSwitch<Props>({
      ready: { test: false, render: () => "ready" },
      default: { render: (props) => `default:${props.label}` },
    });

    expect(renderState({ label: "none" })).toBe("default:none");
  });

  it("supports calling without args when props are void", () => {
    const renderState = createRenderSwitch({
      ready: { test: true, render: () => "ready" },
    });

    expect(renderState()).toBe("ready");
  });
});

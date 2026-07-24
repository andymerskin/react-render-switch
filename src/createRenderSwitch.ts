import type { ReactNode } from "react";

import type { Case, Cases } from "./types.js";

function evaluateTest<P>(test: Case<P>["test"], props: P): boolean {
  return typeof test === "function" ? test(props) : test;
}

export function createRenderSwitch<P = void>(
  cases: Cases<P>,
): (props: P) => ReactNode {
  return (props: P) => {
    for (const [key, caseEntry] of Object.entries(cases)) {
      if (key === "default") {
        continue;
      }

      const { test, render } = caseEntry as Case<P>;

      if (evaluateTest(test, props)) {
        return render(props);
      }
    }

    return cases.default?.render(props) ?? null;
  };
}

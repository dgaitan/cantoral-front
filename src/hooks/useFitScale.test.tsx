import { renderHook, render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFitScale } from "./useFitScale";

// vitest.setup.ts already stubs global ResizeObserver.
// Scenarios 1–4 use renderHook + plain mock objects on refs to trigger recalculate via deps.
// Scenarios 5–6 require a real DOM (so containerRef attaches) and a callback-capturing mock.

function assignRefs(
  result: { current: ReturnType<typeof useFitScale> },
  container: { clientWidth: number },
  content: { scrollWidth: number; scrollHeight: number }
) {
  (result.current.containerRef as { current: unknown }).current = container;
  (result.current.contentRef as { current: unknown }).current = content;
}

describe("Fit-screen auto-scale for chord lyrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("scale is 1.0 when content is narrower than container", () => {
    const { result, rerender } = renderHook(
      ({ t }: { t: number }) => useFitScale({ deps: [t] }),
      { initialProps: { t: 0 } }
    );
    assignRefs(result, { clientWidth: 600 }, { scrollWidth: 400, scrollHeight: 200 });
    act(() => rerender({ t: 1 }));
    expect(result.current.scale).toBe(1.0);
  });

  it("scale shrinks to fit when content overflows container width", () => {
    const { result, rerender } = renderHook(
      ({ t }: { t: number }) => useFitScale({ deps: [t] }),
      { initialProps: { t: 0 } }
    );
    assignRefs(result, { clientWidth: 320 }, { scrollWidth: 640, scrollHeight: 200 });
    act(() => rerender({ t: 1 }));
    expect(result.current.scale).toBe(0.5);
  });

  it("scale is clamped to MIN_SCALE for extremely wide content", () => {
    const { result, rerender } = renderHook(
      ({ t }: { t: number }) => useFitScale({ deps: [t] }),
      { initialProps: { t: 0 } }
    );
    assignRefs(result, { clientWidth: 100 }, { scrollWidth: 1000, scrollHeight: 200 });
    act(() => rerender({ t: 1 }));
    expect(result.current.scale).toBe(0.45);
  });

  it("naturalHeight reflects the unscaled content height", () => {
    const { result, rerender } = renderHook(
      ({ t }: { t: number }) => useFitScale({ deps: [t] }),
      { initialProps: { t: 0 } }
    );
    assignRefs(result, { clientWidth: 600 }, { scrollWidth: 400, scrollHeight: 300 });
    act(() => rerender({ t: 1 }));
    expect(result.current.naturalHeight).toBe(300);
  });

  // Scenarios 5–6 need a real DOM tree so containerRef.current is non-null
  // when the ResizeObserver effect runs. We stub ResizeObserver to capture the callback.
  describe("ResizeObserver integration", () => {
    let capturedCallback: (() => void) | null;
    const disconnectMock = vi.fn();
    const observeMock = vi.fn();

    beforeEach(() => {
      capturedCallback = null;
      disconnectMock.mockClear();
      observeMock.mockClear();
      vi.stubGlobal(
        "ResizeObserver",
        vi.fn(function (cb: () => void) {
          capturedCallback = cb;
          return { observe: observeMock, disconnect: disconnectMock, unobserve: vi.fn() };
        })
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("scale updates when the container is resized", () => {
      let hookResult!: ReturnType<typeof useFitScale>;

      function Wrapper() {
        hookResult = useFitScale({ deps: [] });
        return (
          <div ref={hookResult.containerRef}>
            <div ref={hookResult.contentRef} />
          </div>
        );
      }

      render(<Wrapper />);

      expect(observeMock).toHaveBeenCalled();
      expect(capturedCallback).not.toBeNull();

      const container = hookResult.containerRef.current!;
      const content = hookResult.contentRef.current!;

      // Initial: container=320px, content=640px → scale=0.5
      Object.defineProperty(container, "clientWidth", { get: () => 320, configurable: true });
      Object.defineProperty(content, "scrollWidth", { get: () => 640, configurable: true });
      Object.defineProperty(content, "scrollHeight", { get: () => 200, configurable: true });
      act(() => capturedCallback!());
      expect(hookResult.scale).toBe(0.5);

      // Resize container to 480px → scale should update to 0.75
      Object.defineProperty(container, "clientWidth", { get: () => 480, configurable: true });
      act(() => capturedCallback!());
      expect(hookResult.scale).toBe(0.75);
    });

    it("ResizeObserver is disconnected on unmount", () => {
      let hookResult!: ReturnType<typeof useFitScale>;

      function Wrapper() {
        hookResult = useFitScale();
        return (
          <div ref={hookResult.containerRef}>
            <div ref={hookResult.contentRef} />
          </div>
        );
      }

      const { unmount } = render(<Wrapper />);

      expect(observeMock).toHaveBeenCalled();

      unmount();

      expect(disconnectMock).toHaveBeenCalledTimes(1);
    });
  });
});

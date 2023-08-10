import {
  render,
  screen,
  act,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toaster } from "./Toaster";
import {
  ToasterProvider,
  useToasterContext,
  Toast,
} from "../../contexts/Toaster";

type Props = {
  toast?: Omit<Toast, "id">;
};

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

const toast: Props["toast"] = { type: "warning", text: "toast_content" };

const FakeComponent = ({ toast }: Props) => {
  const context = useToasterContext();
  if (toast) {
    return (
      <>
        <p data-testid="toasts">
          {context.toasts.length > 0 && JSON.stringify(context.toasts)}
        </p>
        <button
          data-testid="add_toast"
          onClick={() => {
            context.addToast(toast);
          }}
        >
          Add toast
        </button>
      </>
    );
  }
  return null;
};

const WithContext = ({ toast }: Props) => {
  return (
    <ToasterProvider>
      <Toaster />
      <FakeComponent toast={toast} />
    </ToasterProvider>
  );
};

describe("<Toaster /> specs", () => {
  it("should render toasts correctly", async () => {
    render(<WithContext toast={toast} />);

    await userEvent.click(screen.getByTestId("add_toast"));

    const toastsArr = JSON.parse(
      screen.getByTestId("toasts").textContent || "[]"
    ) as Toast[];

    expect(toastsArr).toHaveLength(1);
    expect(toastsArr).toContainEqual(expect.objectContaining(toast));

    const toastEl = screen.getAllByRole("alert");
    expect(toastEl).toHaveLength(toastsArr.length);

    toastsArr.forEach((t) => {
      expect(screen.getByText(t.text)).toBeVisible();
      expect(screen.getByLabelText("Warning")).toBeVisible();
      expect(screen.getByLabelText("Close")).toBeVisible();
    });
  });

  it("should render a toast when add toast button was clicked", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<WithContext toast={toast} />);

    await user.click(screen.getByTestId("add_toast"));

    await waitFor(() =>
      expect(screen.queryByTestId("toast-content")).toBeVisible()
    );

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() =>
      expect(screen.queryByTestId("toast-content")).not.toBeInTheDocument()
    );

    jest.useRealTimers();
  });
});

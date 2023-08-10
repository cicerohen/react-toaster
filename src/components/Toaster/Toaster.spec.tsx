import { render, screen, act } from "@testing-library/react";
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

const toast: Props["toast"] = { type: "warning", text: "toast_content" };

const FakeComponent = ({ toast }: Props) => {
  const context = useToasterContext();
  if (toast) {
    return (
      <>
        <p data-testid="toasts">{context.toasts.length > 0  && JSON.stringify(context.toasts)}</p>
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
  it.skip("should render toasts correctly", async () => {
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
    // https://github.com/testing-library/user-event/issues/833
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.useFakeTimers();
    
    render(<WithContext toast={toast} />);
    let toastsArr = JSON.parse(
      screen.getByTestId("toasts").textContent || "[]"
    ) as Toast[];

    // Antes do click não deve conter nenhum toast
    expect(toastsArr).toHaveLength(0);

    await user.click(screen.getByTestId("add_toast"));
    
    toastsArr = JSON.parse(
      screen.getByTestId("toasts").textContent || "[]"
    ) as Toast[];

    // Depois do click deve conter 1 toast
    expect(toastsArr).toHaveLength(1);

    // Finalizando o timer
    act(() => {
      jest.runAllTimers();
    });

    toastsArr = JSON.parse(
      screen.getByTestId("toasts").textContent || "[]"
    ) as Toast[];

    // Depois do timer não deve conter nenhum toast
    expect(toastsArr).toHaveLength(0);
  });
});

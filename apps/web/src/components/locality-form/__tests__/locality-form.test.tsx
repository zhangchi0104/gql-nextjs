import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocalityForm from "..";

describe("LocalityForm", () => {
  it("should render", () => {
    render(<LocalityForm />);
    expect(screen.getByTestId("locality-form__form")).toBeDefined();
    expect(screen.getByTestId("locality-form__postcode")).toBeDefined();
    expect(screen.getByTestId("locality-form__suburb")).toBeDefined();
    expect(screen.getByTestId("locality-form__state")).toBeDefined();
    expect(screen.getByTestId("locality-form__submit")).toBeDefined();
  });
});

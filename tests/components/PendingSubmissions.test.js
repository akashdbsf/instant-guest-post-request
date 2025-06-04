import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PendingSubmissions from "../../src/admin/components/PendingSubmissions";

// Mock the @bsf/force-ui components
jest.mock("@bsf/force-ui", () => {
  const Table = ({ children }) => <table>{children}</table>;
  Table.Head = ({ children }) => (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
  Table.HeadCell = ({ children }) => <th>{children}</th>;
  Table.Body = ({ children }) => <tbody>{children}</tbody>;
  Table.Row = ({ children }) => <tr>{children}</tr>;
  Table.Cell = ({ children }) => <td>{children}</td>;

  return {
    Button: ({ children, onClick, variant, tag, href, target }) => {
      const Component = tag || "button";
      return (
        <Component
          onClick={onClick}
          data-variant={variant}
          href={href}
          target={target}
        >
          {children}
        </Component>
      );
    },
    Table,
    Container: ({ children }) => <div>{children}</div>,
  };
});

// Mock the WordPress i18n
jest.mock("@wordpress/i18n", () => ({
  __: (text) => text,
}));

describe("PendingSubmissions component", () => {
  test("renders empty state message", () => {
    render(
      <PendingSubmissions
        posts={[]}
        count={0}
        onRefresh={() => {}}
        onApprove={() => {}}
        onReject={() => {}}
      />
    );
    expect(screen.getByText(/no pending submissions/i)).toBeInTheDocument();
    expect(console).not.toHaveErrored();
  });

  test("calls approve and reject handlers", () => {
    const onApprove = jest.fn();
    const onReject = jest.fn();
    const post = {
      id: 1,
      title: "Hello",
      author_name: "Tester",
      author_email: "test@example.com",
      date: "Today",
      edit_url: "#",
      preview_url: "#",
    };

    render(
      <PendingSubmissions
        posts={[post]}
        count={1}
        onRefresh={() => {}}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
    expect(console).not.toHaveErrored();
    fireEvent.click(screen.getByText(/approve/i));
    fireEvent.click(screen.getByText(/reject/i));
    expect(onApprove).toHaveBeenCalledWith(1);
    expect(onReject).toHaveBeenCalledWith(1);
  });
});

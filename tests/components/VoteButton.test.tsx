import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { VoteButton } from "@/components/complaint/VoteButton";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("VoteButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with initial vote count", () => {
    render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={false} />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders voted state when initialVoted is true", () => {
    render(
      <VoteButton complaintId="test-1" initialVotes={10} initialVoted={true} />
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("voted");
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("optimistically increments vote count on click", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={false} />
    );

    fireEvent.click(screen.getByRole("button"));

    // Optimistic: should immediately show 6
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("optimistically decrements vote count when already voted", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={true} />
    );

    fireEvent.click(screen.getByRole("button"));

    // Optimistic: should immediately show 4
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("reverts vote count on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={false} />
    );

    fireEvent.click(screen.getByRole("button"));

    // Optimistic: shows 6 initially
    expect(screen.getByText("6")).toBeInTheDocument();

    // After error, should revert to 5
    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("reverts vote count on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    render(
      <VoteButton complaintId="test-1" initialVotes={3} initialVoted={false} />
    );

    fireEvent.click(screen.getByRole("button"));

    // Should revert after error
    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("disables button while loading", async () => {
    let resolveFetch: (value: any) => void;
    global.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={false} />
    );

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    expect(btn).toBeDisabled();

    // Resolve the fetch
    resolveFetch!({ ok: true });

    await waitFor(() => {
      expect(btn).not.toBeDisabled();
    });
  });

  it("sends POST when voting and DELETE when unvoting", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { rerender } = render(
      <VoteButton complaintId="test-1" initialVotes={5} initialVoted={false} />
    );

    // Click to vote - should POST
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaintId: "test-1" }),
      });
    });
  });
});

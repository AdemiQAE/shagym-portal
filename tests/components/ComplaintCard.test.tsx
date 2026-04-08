import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => {
    const { unoptimized, ...rest } = props;
    return <img {...rest} data-unoptimized={unoptimized ? "true" : "false"} />;
  },
}));

// Mock VoteButton
vi.mock("@/components/complaint/VoteButton", () => ({
  VoteButton: ({ initialVotes }: any) => <div data-testid="vote-button">{initialVotes}</div>,
}));

// Mock StatusBadge
vi.mock("@/components/complaint/StatusBadge", () => ({
  StatusBadge: ({ status }: any) => <span data-testid="status-badge">{status}</span>,
}));

const mockComplaint = {
  id: "test-123",
  title: "Test Complaint Title",
  description: "Test description text",
  category: "road",
  location: "Almaty",
  status: "PENDING" as const,
  isAnonymous: false,
  images: ["data:image/png;base64,abc123"],
  votesCount: 10,
  createdAt: new Date().toISOString(),
  author: { name: "Test User" },
  _count: { votes: 10 },
};

describe("ComplaintCard", () => {
  it("renders complaint title and description", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    expect(screen.getByText("Test Complaint Title")).toBeInTheDocument();
    expect(screen.getByText("Test description text")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    expect(screen.getByTestId("status-badge")).toHaveTextContent("PENDING");
  });

  it("renders vote button with correct count", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    expect(screen.getByTestId("vote-button")).toHaveTextContent("10");
  });

  it("renders location when provided", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    expect(screen.getByText("Almaty")).toBeInTheDocument();
  });

  it("does not render location when not provided", () => {
    const noLocation = { ...mockComplaint, location: null };
    render(<ComplaintCard complaint={noLocation} />);
    expect(screen.queryByText("Almaty")).not.toBeInTheDocument();
  });

  it("renders Image with unoptimized for base64 src", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    const img = screen.getByAltText("Test Complaint Title");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("data-unoptimized", "true");
  });

  it("does not render image when images array is empty", () => {
    const noImages = { ...mockComplaint, images: [] };
    render(<ComplaintCard complaint={noImages} />);
    expect(screen.queryByAltText("Test Complaint Title")).not.toBeInTheDocument();
  });

  it("links to the complaint detail page", () => {
    render(<ComplaintCard complaint={mockComplaint} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/complaints/test-123");
  });

  it("uses _count.votes over votesCount when available", () => {
    const withCount = { ...mockComplaint, _count: { votes: 25 }, votesCount: 10 };
    render(<ComplaintCard complaint={withCount} />);
    expect(screen.getByTestId("vote-button")).toHaveTextContent("25");
  });
});

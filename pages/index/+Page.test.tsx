import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./+Page";
import { useRequest } from "ahooks";
import type { coinItem, IRate, IWalletBalance, overviewItem } from "../../helper/fetch";

type UseRequestResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  params: unknown[];
  cancel: () => void;
  refresh: () => void;
  refreshAsync: () => Promise<void>;
  run: () => void;
  runAsync: () => Promise<void>;
  mutate: (data: T) => void;
};

// Mock ahooks useRequest
vi.mock("ahooks", () => ({
  useRequest: vi.fn(),
}));

// Mock child components
vi.mock("./assets-coin-list", () => ({
  default: ({ overviewAssetsList }: { overviewAssetsList: overviewItem[] }) => (
    <div data-testid="assets-coin-list">{overviewAssetsList?.length || 0} items</div>
  ),
}));

vi.mock("./assets-overview", () => ({
  default: ({ total }: { total: string }) => <div data-testid="assets-overview">Total: {total}</div>,
}));

describe("Page Component", () => {
  const mockCoinList: coinItem[] = [
    {
      coin_id: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      token_decimal: 8,
      contract_address: "",
      withdrawal_eta: ["30 secs"],
      colorful_image_url: "",
      gray_image_url: "",
      has_deposit_address_tag: false,
      min_balance: 0,
      blockchain_symbol: "BTC",
      trading_symbol: "BTC",
      code: "BTC",
      explorer: "",
      is_erc20: false,
      gas_limit: 0,
      token_decimal_value: "10000000",
      display_decimal: 8,
      supports_legacy_address: false,
      deposit_address_tag_name: "",
      deposit_address_tag_type: "",
      num_confirmation_required: 1,
    },
    {
      coin_id: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      token_decimal: 18,
      contract_address: "",
      withdrawal_eta: ["30 secs"],
      colorful_image_url: "",
      gray_image_url: "",
      has_deposit_address_tag: false,
      min_balance: 0,
      blockchain_symbol: "ETH",
      trading_symbol: "ETH",
      code: "ETH",
      explorer: "",
      is_erc20: false,
      gas_limit: 21000,
      token_decimal_value: "100000000000000000",
      display_decimal: 8,
      supports_legacy_address: false,
      deposit_address_tag_name: "",
      deposit_address_tag_type: "",
      num_confirmation_required: 1,
    },
  ];

  const mockWalletBalance: IWalletBalance[] = [
    { currency: "BTC", amount: 1.5 },
    { currency: "ETH", amount: 10 },
  ];

  const mockRateData: IRate[] = [
    {
      from_currency: "BTC",
      to_currency: "USD",
      rates: [{ amount: "1", rate: "50000" }],
      time_stamp: Date.now(),
    },
    {
      from_currency: "ETH",
      to_currency: "USD",
      rates: [{ amount: "1", rate: "3000" }],
      time_stamp: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with loading state", () => {
    vi.mocked(useRequest).mockImplementation(() => ({
      data: undefined,
      loading: true,
      error: undefined,
      params: [],
      cancel: vi.fn(),
      refresh: vi.fn(),
      refreshAsync: vi.fn(),
      run: vi.fn(),
      runAsync: vi.fn(),
      mutate: vi.fn(),
    }));

    render(<Page />);
    expect(screen.getByTestId("assets-overview")).toHaveTextContent("Total: --");
    expect(screen.getByTestId("assets-coin-list")).toHaveTextContent("0 items");
  });

  it("renders with data", () => {
    vi.mocked(useRequest).mockImplementation((fn) => {
      const result: UseRequestResult<coinItem[] | IWalletBalance[] | IRate[]> = {
        data: undefined,
        loading: false,
        error: undefined,
        params: [],
        cancel: vi.fn(),
        refresh: vi.fn(),
        refreshAsync: vi.fn(),
        run: vi.fn(),
        runAsync: vi.fn(),
        mutate: vi.fn(),
      };

      if (fn.name === "fetchCoinList") {
        result.data = mockCoinList;
      } else if (fn.name === "fetchWalletBlance") {
        result.data = mockWalletBalance;
      } else if (fn.name === "fetchExchangeRate") {
        result.data = mockRateData;
      }

      return result;
    });

    render(<Page />);
    expect(screen.getByTestId("assets-overview")).toHaveTextContent("Total: 105000.00");
    expect(screen.getByTestId("assets-coin-list")).toHaveTextContent("2 items");
  });

  it("renders with error state", () => {
    vi.mocked(useRequest).mockImplementation(() => ({
      data: undefined,
      loading: false,
      error: new Error("Failed to fetch data"),
      params: [],
      cancel: vi.fn(),
      refresh: vi.fn(),
      refreshAsync: vi.fn(),
      run: vi.fn(),
      runAsync: vi.fn(),
      mutate: vi.fn(),
    }));

    render(<Page />);
    expect(screen.getByTestId("assets-overview")).toHaveTextContent("Total: --");
    expect(screen.getByTestId("assets-coin-list")).toHaveTextContent("0 items");
  });

  it("handles empty data arrays", () => {
    vi.mocked(useRequest).mockImplementation((fn) => {
      const result: UseRequestResult<coinItem[] | IWalletBalance[] | IRate[]> = {
        data: [],
        loading: false,
        error: undefined,
        params: [],
        cancel: vi.fn(),
        refresh: vi.fn(),
        refreshAsync: vi.fn(),
        run: vi.fn(),
        runAsync: vi.fn(),
        mutate: vi.fn(),
      };

      return result;
    });

    render(<Page />);
    expect(screen.getByTestId("assets-overview")).toHaveTextContent("Total: --");
    expect(screen.getByTestId("assets-coin-list")).toHaveTextContent("0 items");
  });

  it("handles missing rate data for a currency", () => {
    const incompleteRateData: IRate[] = [
      {
        from_currency: "BTC",
        to_currency: "USD",
        rates: [{ amount: "1", rate: "50000" }],
        time_stamp: Date.now(),
      },
    ];

    vi.mocked(useRequest).mockImplementation((fn) => {
      const result: UseRequestResult<coinItem[] | IWalletBalance[] | IRate[]> = {
        data: undefined,
        loading: false,
        error: undefined,
        params: [],
        cancel: vi.fn(),
        refresh: vi.fn(),
        refreshAsync: vi.fn(),
        run: vi.fn(),
        runAsync: vi.fn(),
        mutate: vi.fn(),
      };

      if (fn.name === "fetchCoinList") {
        result.data = mockCoinList;
      } else if (fn.name === "fetchWalletBlance") {
        result.data = mockWalletBalance;
      } else if (fn.name === "fetchExchangeRate") {
        result.data = incompleteRateData;
      }

      return result;
    });

    render(<Page />);
    expect(screen.getByTestId("assets-overview")).toHaveTextContent("Total: 75000.00");
    expect(screen.getByTestId("assets-coin-list")).toHaveTextContent("2 items");
  });
});

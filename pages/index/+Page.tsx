import { useRequest } from "ahooks";
import AssetsCoinList from "./assets-coin-list";
import AssetsOverview from "./assets-overview";
import { coinItem, fetchCoinList, fetchExchangeRate, fetchWalletBlance, IRate, overviewItem } from "../../helper/fetch";
import { useMemo } from "react";
import { decimalUtils } from "nnbit-utils";
const defaultZeroValue = "--";
import "../../layouts/style.css";
import "../../layouts/tailwind.css";

export default function Page() {
  const { data: coinList } = useRequest(fetchCoinList);
  const { data: walletBlance } = useRequest(fetchWalletBlance);
  const { data: rateData } = useRequest(fetchExchangeRate);

  const rateDateMap = useMemo(() => {
    const res = {} as Record<string, IRate>;
    rateData?.forEach((v) => {
      res[v.from_currency] = v;
    });
    return res;
  }, [rateData]);

  const coinListMap = useMemo(() => {
    const res = {} as Record<string, coinItem>;
    coinList?.forEach((v) => {
      res[v.code] = v;
    });
    return res;
  }, [coinList]);

  const overviewAssetsList = useMemo(() => {
    return walletBlance?.map((v) => {
      const currentRate = rateDateMap[v.currency];
      const currentCoin = coinListMap[v.currency];
      const value = decimalUtils.SafeCalcUtil.mul(currentRate.rates?.[0].rate, v.amount).toString();
      return { ...v, value: value, ...currentCoin } as overviewItem;
    });
  }, [rateData, walletBlance, rateDateMap]);

  const total = useMemo(() => {
    if (!overviewAssetsList?.length) {
      return defaultZeroValue;
    }
    let res = 0;
    overviewAssetsList?.forEach((v) => {
      res = decimalUtils.SafeCalcUtil.add(res, v.value).toNumber();
    });
    return decimalUtils.formatNumberDecimal(res, 2);
  }, [overviewAssetsList]);

  return (
    <>
      <AssetsOverview total={total}></AssetsOverview>
      <AssetsCoinList overviewAssetsList={overviewAssetsList}></AssetsCoinList>
    </>
  );
}

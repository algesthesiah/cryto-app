import { coinItem, overviewItem } from "../../helper/fetch";
import AssetsCoinItem from "./assets-coin-item";

const AssetsCoinList = ({ overviewAssetsList }: { overviewAssetsList: overviewItem[] | undefined }) => {
  return (
    <div>
      {overviewAssetsList?.map((v) => {
        return <AssetsCoinItem key={v?.code} item={v}></AssetsCoinItem>;
      })}
    </div>
  );
};

export default AssetsCoinList;

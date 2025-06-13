import { overviewItem } from "../../helper/fetch";

const AssetsCoinItem = ({ item }: { item: overviewItem }) => {
  return (
    <div className="flex items-center mb-1 border border-gray-200 p-2">
      <div className="flex items-center w-full ">
        {/* 这里要封装 img 组件，但是没有给默认站位图，就先不做了，但是实际需要考虑 */}
        <img src={item.colorful_image_url} className="w-[40px] h-[40px] mr-2" alt="" />
        {item.name}
      </div>
      <div>
        <div className="">
          <span className="mr-1">{item.amount}</span>
          <span>{item.code}</span>
        </div>
        <div className="text-[12px] text-gray-400">${item.value}</div>
      </div>
    </div>
  );
};

export default AssetsCoinItem;

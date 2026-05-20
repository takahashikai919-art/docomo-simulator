import {
  useState,
  useEffect,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const cards = {
  REGULAR: {
    annualFee: 0,
  },

  GOLD: {
    annualFee: 11000,
  },

  PLATINUM: {
    annualFee: 29700,
  },
};

const mobilePlans = {
  eximo: {
    monthly: 7315,
    goldRate: 0.10,
    platinumRate: 0.20,
    familyTarget: true,
    
    denkiTarget: false,
    dcardDiscount: 187,
    longTermTarget: false,
    familyDiscount: 1100,
    hikariDiscount: 1100,
  },

  eximoPoikatsu: {
  monthly: 10615,
  goldRate: 0.10,
  platinumRate: 0.20,
  familyTarget: true,
  
  denkiTarget: false,
  dcardDiscount: 187,
  longTermTarget: false,
  familyDiscount: 1100,
  hikariDiscount: 1100,
},

  irumo: {
  monthly: 2167,
  goldRate: 0.01,
  platinumRate: 0.01,
  familyTarget: false,
  
  denkiTarget: false,
  dcardDiscount: 187,
  longTermTarget: false,
  familyDiscount: 0,
  hikariDiscount: 1100,
},

  docomoMini: {
  monthly: 2750,
  goldRate: 0.01,
  platinumRate: 0.01,
  familyTarget: false,
  
  denkiTarget: true,
  longTermTarget: false,
  familyDiscount: 0,
  hikariDiscount: 1210,
},

  docomoMax: {
  monthly: 8448,
  goldRate: 0.10,
  platinumRate: 0.20,
  familyTarget: true,
  
  denkiTarget: true,
  longTermTarget: true,
  familyDiscount: 1210,
  hikariDiscount: 1210,
},

  docomoPoikatsuMax: {
  monthly: 11848,
  goldRate: 0.10,
  platinumRate: 0.20,
  familyTarget: true,
  
  denkiTarget: true,
  longTermTarget: true,
  familyDiscount: 1210,
  hikariDiscount: 1210,
},

};

const hikariPlans = {
  none: {
    monthly: 0,
    discount: 0,

    goldRate: 0.10,
platinumRate: 0.20,
  },

  mansion1g: {
    monthly: 4180,
    discount: 1100,

    goldRate: 0.10,
    platinumRate: 0.20,
  },

  house1g: {
    monthly: 5720,
    discount: 1100,

    goldRate: 0.10,
    platinumRate: 0.20,
  },

  mansion10g: {
    monthly: 6380,
    discount: 1210,

    goldRate: 0.10,
    platinumRate: 0.20,
  },

  house10g: {
    monthly: 6600,
    discount: 1210,

    goldRate: 0.10,
    platinumRate: 0.20,
  },
};

const denkiPlans = {
  none: {
    goldRate: 0,
    platinumRate: 0,
  },

  basic: {
    goldRate: 0.02,
    platinumRate: 0.02,
  },

  green: {
    goldRate: 0.06,
    platinumRate: 0.12,
  },
};

function calculateCard(
  config: any,
  cardType: "REGULAR" | "GOLD" | "PLATINUM",
  monthlyUse: number
) {

  const plan =
  mobilePlans[
    config.mobilePlan as keyof typeof mobilePlans
  ];

  const hikari =
  hikariPlans[
    config.hikariPlan as keyof typeof hikariPlans
  ];

const denki =
  denkiPlans[
    config.denkiPlan as keyof typeof denkiPlans
  ];

  const familyDiscount =
    plan.familyTarget
      ? config.familyCount >= 3
        ? plan.familyDiscount
        : config.familyCount >= 2
        ? plan.familyDiscount / 2
        : 0
      : 0;

  const hikariDiscount =
  config.hikariOwner !== "none"
    ? plan.hikariDiscount
    : 0;

  const denkiDiscount =
  config.denkiOwner !== "none" &&
  plan.denkiTarget
    ? 110
    : 0;

  const dcardDiscount =
  config.dcardPay
    ? (
        config.mobilePlan === "docomoMini" ||
        config.mobilePlan === "docomoMax" ||
        config.mobilePlan === "docomoPoikatsuMax"
      )
        ? (
            cardType === "REGULAR"
              ? 220
              : 550
          )
        : 187
    : 0;

  const longTermDiscount =
    plan.longTermTarget
      ? config.longTerm === "20"
        ? 220
        : config.longTerm === "10"
          ? 110
          : 0
      : 0;

  const discountedMobileFee =
    plan.monthly -
    familyDiscount -
    hikariDiscount -
    denkiDiscount -
    dcardDiscount -
    longTermDiscount;

  const isPoikatsu =
    config.mobilePlan === "eximoPoikatsu" ||
    config.mobilePlan === "docomoPoikatsuMax";

  const mobileRate =
  cardType === "PLATINUM"
    ? plan.platinumRate
    : cardType === "GOLD"
      ? plan.goldRate
      : 0.01;

  const hikariRate =
  cardType === "PLATINUM"
    ? hikari?.platinumRate ?? 0
    : cardType === "GOLD"
      ? hikari?.goldRate ?? 0
      : 0.01;

  const denkiRate =
  cardType === "PLATINUM"
    ? denki?.platinumRate ?? 0
    : cardType === "GOLD"
      ? denki?.goldRate ?? 0
      : config.denkiPlan === "green"
        ? 0.04
        : config.denkiPlan === "basic"
          ? 0.02
          : 0;

  const poikatsuRate =
    cardType === "PLATINUM"
      ? 0.10
      : cardType === "GOLD"
      ? 0.05
      : 0.03;

  const mobilePoint =
    discountedMobileFee * mobileRate;

  const normalPoint =
    monthlyUse * 0.01;

  const hikariPoint =
  config.hikariOwner === "self"
    ? hikari.monthly * hikariRate
    : 0;

  const denkiPoint =
  config.denkiOwner === "self"
    ? config.denkiUse * denkiRate
    : 0;

  const poikatsuPoint =
    isPoikatsu
      ? Math.min(
          monthlyUse * poikatsuRate,
          5000
        )
      : 0;

  const totalPoint =
    (
      mobilePoint +
      normalPoint +
      hikariPoint +
      denkiPoint +
      poikatsuPoint
    ) * 12;

  const profit =
    totalPoint -
    cards[cardType].annualFee;

  return {
    profit,
    mobilePoint,
    normalPoint,
    hikariPoint,
    denkiPoint,
    poikatsuPoint,
    familyDiscount,
    hikariDiscount,
    denkiDiscount,
    dcardDiscount,
    longTermDiscount,
    isPoikatsu,
    annualFee:
  cards[cardType].annualFee,
  };

}

function CardSettings({
  title,
  color,
  config,
  setConfig,
  copyButtons,
}: any) {

  return (
    <div className="bg-white rounded-2xl p-4 shadow text-center w-full w-full md:min-w-[280px] max-w-[280px]">

      <div className={`text-xl font-black mb-4 ${color}`}>
        {title}
        <div className="flex justify-center gap-2 mt-4">

  {copyButtons?.map((button: any) => (

    <button
      key={button.label}
      onClick={button.onClick}
      className="
  bg-slate-200
  hover:bg-slate-300
  px-3
  py-1
  rounded-xl
  text-sm
  font-bold
  whitespace-nowrap
"
    >
      {button.label}
    </button>

  ))}

</div>
      </div>

      {/* ケータイプラン */}
      <div className="font-bold mb-2">
        ケータイプラン
      </div>

      <select
        value={config.mobilePlan}
        onChange={(e) =>
          setConfig({
            ...config,
            mobilePlan: e.target.value,
          })
        }
        className="border rounded-xl p-2 w-full max-w-xs mx-auto"
      >
        <option value="eximo">eximo</option>
        <option value="eximoPoikatsu">
          eximo ポイ活
        </option>
        <option value="irumo">irumo</option>
        <option value="docomoMini">
          ドコモ mini
        </option>
        <option value="docomoMax">
          ドコモ MAX
        </option>
        <option value="docomoPoikatsuMax">
          ドコモ ポイ活 MAX
        </option>
      </select>

      {/* みんなドコモ割 */}
<div className="mt-4">

  <div className="font-bold mb-2">
    みんなドコモ割
  </div>

  <select
    value={config.familyCount}
    onChange={(e) =>
      setConfig({
        ...config,
        familyCount: Number(e.target.value),
      })
    }
    className="border rounded-xl p-2 w-full max-w-xs mx-auto"
  >
    <option value={1}>1回線</option>
    <option value={2}>2回線</option>
    <option value={3}>3回線以上</option>
  </select>

</div>

{/* ドコモ光 */}
<div className="mt-4">

  <div className="font-bold mb-2">
    ドコモ光
  </div>

  <select
    value={config.hikariOwner}
    onChange={(e) => {

  const value = e.target.value;

  setConfig({
    ...config,

    hikariOwner: value,

    hikariPlan:
      value === "self"
        ? "mansion1g"
        : "none",
  });

}}
    className="border rounded-xl p-2 w-full max-w-xs mx-auto"
  >
    <option value="none">
      未契約
    </option>

    <option value="family">
      家族契約（割引のみ）
    </option>

    <option value="self">
      本人契約（還元あり）
    </option>

  </select>

  {config.hikariOwner === "self" && (

    <select
      value={config.hikariPlan}
      defaultValue="mansion1g"
      onFocus={() => {

  if (config.hikariPlan === "none") {

    setConfig({
      ...config,
      hikariPlan: "mansion1g",
    });

  }

}}
      onChange={(e) =>
        setConfig({
          ...config,
          hikariPlan: e.target.value,
        })
      }
      className="border rounded-xl p-2 w-full max-w-xs mx-auto mt-2"
    >
      <option value="mansion1g">
        1ギガ マンション
      </option>

      <option value="house1g">
        1ギガ 戸建て
      </option>

      <option value="mansion10g">
        10ギガ マンション
      </option>

      <option value="house10g">
        10ギガ 戸建て
      </option>

    </select>

  )}

</div>
{/* ドコモでんき */}
<div className="mt-4">

  <div className="font-bold mb-2">
    ドコモでんき
  </div>

  <select
    value={config.denkiOwner}
    onChange={(e) => {

  const value = e.target.value;

  setConfig({
    ...config,

    denkiOwner: value,

    denkiPlan:
      value === "self"
        ? "basic"
        : "none",
  });

}}
    className="border rounded-xl p-2 w-full max-w-xs mx-auto"
  >
    <option value="none">
      未契約
    </option>

    <option value="family">
      家族契約（割引のみ）
    </option>

    <option value="self">
      本人契約（還元あり）
    </option>

  </select>

  {config.denkiOwner === "self" && (

    <select
      value={config.denkiPlan}
      defaultValue="basic"
      onFocus={() => {

  if (config.denkiPlan === "none") {

    setConfig({
      ...config,
      denkiPlan: "basic",
    });

  }

}}
      onChange={(e) =>
        setConfig({
          ...config,
          denkiPlan: e.target.value,
        })
      }
      className="border rounded-xl p-2 w-full max-w-xs mx-auto mt-2"
    >
      <option value="basic">
        BASIC
      </option>

      <option value="green">
        GREEN
      </option>

    </select>

  )}

</div>
{/* dカード支払い */}
<div className="mt-4">

  <div className="font-bold mb-2">
    dカード支払い
  </div>

  <select
    value={
      config.dcardPay
        ? "yes"
        : "no"
    }
    onChange={(e) =>
      setConfig({
        ...config,
        dcardPay:
          e.target.value === "yes",
      })
    }
    className="border rounded-xl p-2 w-full max-w-xs mx-auto"
  >
    <option value="no">なし</option>
    <option value="yes">利用中</option>
  </select>

</div>

{/* 長期利用割 */}
<div className="mt-4">

  <div className="font-bold mb-2">
    長期利用割
  </div>

  <select
    value={config.longTerm}
    onChange={(e) =>
      setConfig({
        ...config,
        longTerm: e.target.value,
      })
    }
    className="border rounded-xl p-2 w-full max-w-xs mx-auto"
  >
    <option value="none">なし</option>
    <option value="10">10年以上</option>
    <option value="20">20年以上</option>
  </select>

</div>
    </div>
  );
}

function CardResult({
  title,
  color,
  data,
  profit,
}: any) {

  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-6
        text-center
        w-full md:w-full min-w-[280px] max-w-[280px]
        shadow
      "
    >

      <div
        className={`text-2xl font-black mb-2 ${color}`}
      >
        {title}
      </div>

      <div className="text-3xl font-black text-emerald-600">
        {Math.round(profit).toLocaleString()}円
      </div>

      <div className="mt-4 text-sm text-left flex flex-col gap-1">

        <div>
          通常還元 :
          {Math.round(
            data.normalPoint * 12
          ).toLocaleString()}pt
        </div>

        {data.isPoikatsu && (
          <div>
            ポイ活特典 :
            {Math.round(
              data.poikatsuPoint * 12
            ).toLocaleString()}pt
          </div>
        )}

        <div>
          ケータイ還元 :
          {Math.round(
            data.mobilePoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモ光還元 :
          {Math.round(
            data.hikariPoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモでんき還元 :
          {Math.round(
            data.denkiPoint * 12
          ).toLocaleString()}pt
        </div>

        <div className="font-bold text-red-500 mt-2">
  年会費 :
  -{data.annualFee.toLocaleString()}円
</div>

      </div>

    </div>
  );
}

export default function App() {

  const defaultConfig = {
  mobilePlan: "eximo",
  familyCount: 1,
  hikariPlan: "none",
  denkiPlan: "none",
  dcardPay: false,
  longTerm: "none",
  denkiUse: 10000,
  hikariOwner: "none",
denkiOwner: false,
};

  const [monthlyUse, setMonthlyUse] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "monthlyUse"
        );

      return saved
        ? Number(saved)
        : 50000;
    });
      
    useEffect(() => {
    localStorage.setItem(
      "monthlyUse",
      String(monthlyUse)
    );
  }, [monthlyUse]);
 
  
const [regularConfig, setRegularConfig] =
  useState(defaultConfig);

const [goldConfig, setGoldConfig] =
  useState(defaultConfig);

const [platinumConfig, setPlatinumConfig] =
  useState(defaultConfig);

const [showRegular, setShowRegular] =
  useState(true);

const [showGold, setShowGold] =
  useState(true);

const [showPlatinum, setShowPlatinum] =
  useState(true);

const regularData =
  calculateCard(
    regularConfig,
    "REGULAR",
    monthlyUse
  );

const goldData =
  calculateCard(
    goldConfig,
    "GOLD",
    monthlyUse
  );

const platinumData =
  calculateCard(
    platinumConfig,
    "PLATINUM",
    monthlyUse
  );

const regular =
  regularData.profit;

const gold =
  goldData.profit;

const platinum =
  platinumData.profit;    

const chartData = [];

if (showRegular) {
  chartData.push({
    name: "REGULAR",
    value: regular,
  });
}

if (showGold) {
  chartData.push({
    name: "GOLD",
    value: gold,
  });
}

if (showPlatinum) {
  chartData.push({
    name: "PLATINUM",
    value: platinum,
  });
}
  
  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 overflow-x-hidden">
      <div className="
  max-w-7xl
  mx-auto
  bg-white
  rounded-2xl
  shadow-xl
  overflow-hidden
">

{/* カード切替 */}
<div className="p-5 border-b bg-slate-50">

  <div className="font-bold mb-3">
    表示カード
  </div>

  <div className="flex gap-2 flex-wrap">

    <button
      onClick={() =>
        setShowRegular(!showRegular)
      }
      className={`rounded-xl px-4 py-2 ${
        showRegular
          ? "bg-slate-700 text-white"
          : "bg-white border"
      }`}
    >
      REGULAR
    </button>

    <button
      onClick={() =>
        setShowGold(!showGold)
      }
      className={`rounded-xl px-4 py-2 ${
        showGold
          ? "bg-amber-500 text-white"
          : "bg-white border"
      }`}
    >
      GOLD
    </button>

    <button
      onClick={() =>
        setShowPlatinum(!showPlatinum)
      }
      className={`rounded-xl px-4 py-2 ${
        showPlatinum
          ? "bg-zinc-700 text-white"
          : "bg-white border"
      }`}
    >
      PLATINUM
    </button>

  </div>

</div>        
        
{/* オプション */}
<div className="p-5 border-b bg-slate-50">

  <div className="font-bold mb-3">
    利用サービス
  </div>

 <div className="flex justify-center">

  <div className="
    flex
    gap-4
    overflow-x-auto
    pb-2
  ">

  {showRegular && (
    <CardSettings
    copyButtons={[
  {
    label: "GOLDにコピー",
    onClick: () =>
      setGoldConfig(regularConfig),
  },

  {
    label: "PLATINUMにコピー",
    onClick: () =>
      setPlatinumConfig(regularConfig),
  },
]}
      title="REGULAR"
      color="text-slate-700"
      config={regularConfig}
      setConfig={setRegularConfig}
    />
  )}
  

  {showGold && (
    <CardSettings
      title="GOLD"
      copyButtons={[
  {
    label: "REGULARにコピー",
    onClick: () =>
      setRegularConfig(goldConfig),
  },

  {
    label: "PLATINUMにコピー",
    onClick: () =>
      setPlatinumConfig(goldConfig),
  },
]}
      color="text-amber-500"
      config={goldConfig}
      setConfig={setGoldConfig}
    />
  )}

  {showPlatinum && (
    <CardSettings
      title="PLATINUM"
      copyButtons={[
  {
    label: "REGULARにコピー",
    onClick: () =>
      setRegularConfig(platinumConfig),
  },

  {
    label: "GOLDにコピー",
    onClick: () =>
      setGoldConfig(platinumConfig),
  },
]}
      color="text-zinc-700"
      config={platinumConfig}
      setConfig={setPlatinumConfig}
    />
  )}

</div>
 
</div>

  <div>
</div>

</div>
        {/* 入力 */}
        {/* 入力 */}
</div>

{/* 利用額入力 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b p-5">

  {/* 月間カード利用額 */}
  <div>

    <div className="flex items-center gap-2 mb-2">

  <div className="font-bold">
    月間カード利用額
  </div>

  <div className="text-sm text-slate-400">
    (ドコモでんき利用額を含む)
  </div>

</div>

    <input
      type="number"
      value={monthlyUse}
      onChange={(e) =>
        setMonthlyUse(
          Number(e.target.value)
        )
      }
      className="w-full border rounded-xl p-3"
    />

  </div>

  {/* ドコモでんき利用額 */}
  <div>

    <div className="font-bold mb-2">
      ドコモでんき利用額
    </div>
    
    <input
      type="number"
      value={regularConfig.denkiUse}
      onChange={(e) =>
        setRegularConfig({
          ...regularConfig,
          denkiUse: Number(e.target.value),
        })
      }
      className="w-full border rounded-xl p-3"
    />

  </div>

</div>
{/* 適用割引 */}
<div className="bg-slate-50 border-b p-5">

  <div className="font-bold mb-4">
    適用割引
  </div>

  <div className="flex flex-wrap justify-center gap-4">

    {/* REGULAR */}
    {showRegular && (
      <div className="bg-white rounded-2xl p-4 min-w-[260px] shadow">

        <div className="text-xl font-black text-slate-700 mb-3">
          REGULAR
        </div>

        <div className="flex flex-col gap-2 text-sm">

          <div>
            みんなドコモ割 :
            -{regularData.familyDiscount}円
          </div>

          <div>
            ドコモ光セット割 :
            -{regularData.hikariDiscount}円
          </div>

          <div>
            ドコモでんき割 :
            -{regularData.denkiDiscount}円
          </div>

          <div>
            dカード支払割 :
            -{regularData.dcardDiscount}円
          </div>

          <div>
            長期利用割 :
            -{regularData.longTermDiscount}円
          </div>

        </div>

      </div>
    )}

    {/* GOLD */}
    {showGold && (
      <div className="bg-white rounded-2xl p-4 min-w-[260px] shadow">

        <div className="text-xl font-black text-amber-500 mb-3">
          GOLD
        </div>

        <div className="flex flex-col gap-2 text-sm">

          <div>
            みんなドコモ割 :
            -{goldData.familyDiscount}円
          </div>

          <div>
            ドコモ光セット割 :
            -{goldData.hikariDiscount}円
          </div>

          <div>
            ドコモでんき割 :
            -{goldData.denkiDiscount}円
          </div>

          <div>
            dカード支払割 :
            -{goldData.dcardDiscount}円
          </div>

          <div>
            長期利用割 :
            -{goldData.longTermDiscount}円
          </div>

        </div>

      </div>
    )}

    {/* PLATINUM */}
    {showPlatinum && (
      <div className="bg-white rounded-2xl p-4 min-w-[260px] shadow">

        <div className="text-xl font-black text-zinc-700 mb-3">
          PLATINUM
        </div>

        <div className="flex flex-col gap-2 text-sm">

          <div>
            みんなドコモ割 :
            -{platinumData.familyDiscount}円
          </div>

          <div>
            ドコモ光セット割 :
            -{platinumData.hikariDiscount}円
          </div>

          <div>
            ドコモでんき割 :
            -{platinumData.denkiDiscount}円
          </div>

          <div>
            dカード支払割 :
            -{platinumData.dcardDiscount}円
          </div>

          <div>
            長期利用割 :
            -{platinumData.longTermDiscount}円
          </div>

        </div>

      </div>
    )}

  </div>

</div>    

{/* 結果 */}
<div className="bg-emerald-50 p-5">

  <div className="font-bold text-xl mb-4">
    実質利益(年間)
  </div>

  <div className="flex justify-center">

  <div className="
    flex
    gap-4
    overflow-x-auto
    pb-2
  ">

    {showRegular && (
      <CardResult
        title="REGULAR"
        color="text-slate-700"
        data={regularData}
        profit={regular}
      />
    )}

    {showGold && (
      <CardResult
        title="GOLD"
        color="text-amber-500"
        data={goldData}
        profit={gold}
      />
    )}

    {showPlatinum && (
      <CardResult
        title="PLATINUM"
        color="text-zinc-700"
        data={platinumData}
        profit={platinum}
      />
    )}

  </div>
</div>


</div>
  
                {/* グラフ */}
<div className="
  bg-white
  mt-6
  rounded-2xl
  shadow-xl
  p-4
  h-[320px]
  md:h-[500px]
  overflow-x-auto
">

  <div className="text-2xl font-bold mb-4">
    利益比較
  </div>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart
  width={500}
  data={chartData}
  margin={{
    top: 20,
    right: 20,
    left: 20,
    bottom: 30,
  }}
>
      <XAxis
  dataKey="name"
  tick={{ fontSize: 14 }}
/>

      <YAxis />

      <Tooltip />

      <Bar
  dataKey="value"
  radius={[10, 10, 0, 0]}
>
  {chartData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={
        entry.value >= 0
          ? "#10b981"
          : "#ef4444"
      }
    />
  ))}
</Bar>

    </BarChart>
 </ResponsiveContainer>
</div>

</div>
);
}
import {
  useMemo,
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
  dcardDiscount: 550,
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
  dcardDiscount: 550,
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
  dcardDiscount: 550,
  longTermTarget: true,
  familyDiscount: 1210,
  hikariDiscount: 1210,
},

};

const hikariPlans = {
  none: {
    monthly: 0,
    discount: 0,

    goldRate: 0,
    platinumRate: 0,
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

export default function App() {

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
 
  const [familyCount, setFamilyCount] =
  useState(1);

  const [mobilePlan, setMobilePlan] =
  useState("eximo");

const [hikariPlan, setHikariPlan] =
  useState("none");

const [denkiPlan, setDenkiPlan] =
  useState("none");

const [dcardPay, setDcardPay] =
  useState(false);

const [longTerm, setLongTerm] =
  useState("none");  

  const [denkiUse, setDenkiUse] =
  useState(10000);

  const selectedPlan =
  mobilePlans[
    mobilePlan as keyof typeof mobilePlans
  ];

const familyDiscount =
  selectedPlan.familyTarget
    ? familyCount >= 3
      ? selectedPlan.familyDiscount
      : familyCount >= 2
      ? selectedPlan.familyDiscount / 2
      : 0
    : 0;

    const selectedHikari =
  hikariPlans[
    hikariPlan as keyof typeof hikariPlans
  ];

  const selectedDenki =
  denkiPlans[
    denkiPlan as keyof typeof denkiPlans
  ];
  
const hikariDiscount =
  hikariPlan !== "none"
    ? selectedPlan.hikariDiscount
    : 0;

const hikariMonthlyFee =
  selectedHikari.monthly;
 
const denkiDiscount =
  denkiPlan !== "none" &&
  selectedPlan.denkiTarget
    ? 110
    : 0;

const denkiMonthlyFee =
  denkiPlan !== "none"
    ? denkiUse
    : 0;    

const dcardDiscount =
  dcardPay
    ? selectedPlan.dcardDiscount
    : 0;

  const longTermDiscount =
  selectedPlan.longTermTarget
    ? longTerm === "20"
      ? 220
      : longTerm === "10"
      ? 110
      : 0
    : 0;

const mobileMonthlyFee =
  selectedPlan.monthly;

const isPoikatsuPlan =
  mobilePlan === "eximoPoikatsu" ||
  mobilePlan === "docomoPoikatsuMax";  

const discountedMobileFee =
  mobileMonthlyFee -
  familyDiscount -
  hikariDiscount -
  denkiDiscount -
  dcardDiscount -
  longTermDiscount;

const yearlyCardUse =
  monthlyUse * 12; 

  const goldMobilePoint =
  discountedMobileFee *
  selectedPlan.goldRate;

const goldNormalPoint =
  monthlyUse * 0.01;

const goldHikariPoint =
  hikariMonthlyFee *
  selectedHikari.goldRate;

const goldDenkiPoint =
  denkiMonthlyFee *
  selectedDenki.goldRate;

const goldPoikatsuPoint =
  isPoikatsuPlan
    ? Math.min(
        monthlyUse * 0.05,
        5000
      )
    : 0;

const goldTotalPoint =
(
  goldMobilePoint +
  goldHikariPoint +
  goldDenkiPoint +
  goldNormalPoint +
  goldPoikatsuPoint
) * 12;

const gold =
  goldTotalPoint -
  cards.GOLD.annualFee;

  const platinumMobilePoint =
  discountedMobileFee *
  selectedPlan.platinumRate;

const platinumNormalPoint =
  monthlyUse * 0.01;

const platinumHikariPoint =
  hikariMonthlyFee *
  selectedHikari.platinumRate;

const platinumDenkiPoint =
  denkiMonthlyFee *
  selectedDenki.platinumRate;

const platinumPoikatsuPoint =
  isPoikatsuPlan
    ? Math.min(
        monthlyUse * 0.10,
        5000
      )
    : 0;

const platinumTotalPoint =
(
  platinumMobilePoint +
  platinumHikariPoint +
  platinumDenkiPoint +
  platinumNormalPoint +
  platinumPoikatsuPoint
) * 12;

const platinum =
  platinumTotalPoint -
  cards.PLATINUM.annualFee;

const chartData = [
  {
    name: "GOLD",
    value: gold,
  },

  {
    name: "PLATINUM",
    value: platinum,
  },
];
  
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-50 border-b">

          <div className="p-5"></div>

          <div className="p-5 text-center border-l">
            <div className="text-3xl font-black text-amber-500">
              GOLD
            </div>

            <div className="mt-2">
              年会費 11,000円
            </div>
          </div>

          <div className="p-5 text-center border-l">
            <div className="text-3xl font-black text-zinc-700">
              PLATINUM
            </div>

            <div className="mt-2">
              年会費 29,700円
            </div>
          </div>
        </div>
{/* オプション */}
<div className="p-5 border-b bg-slate-50">

  <div className="font-bold mb-3">
    利用サービス
  </div>

  <div className="flex flex-col gap-4">

  <div>

    <div className="font-bold mb-2">
      ケータイプラン
    </div>

    <select
      value={mobilePlan}
      onChange={(e) =>
        setMobilePlan(
          e.target.value
        )
      }
      className="border rounded-xl p-2 w-full"
    >

      <option value="eximo">
        eximo
      </option>

      <option value="eximoPoikatsu">
        eximo ポイ活
      </option>

      <option value="irumo">
        irumo
      </option>

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

  </div>

  <div>

  <div className="font-bold mb-2">
    みんなドコモ割
  </div>

  <select
    value={familyCount}
    onChange={(e) =>
      setFamilyCount(
        Number(e.target.value)
      )
    }
    className="border rounded-xl p-2 w-full"
  >
    <option value={1}>
      1回線
    </option>

    <option value={2}>
      2回線
    </option>

    <option value={3}>
      3回線以上
    </option>

  </select>

<div>

  <div className="font-bold mb-2">
    ドコモ光セット割
  </div>

  <select
    value={hikariPlan}
    onChange={(e) =>
      setHikariPlan(
        e.target.value
      )
    }
    className="border rounded-xl p-2 w-full"
  >

    <option value="none">
      未契約
    </option>

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

</div>

<div>

  <div className="font-bold mb-2">
    ドコモでんきセット割
  </div>

  <select
    value={denkiPlan}
    onChange={(e) =>
      setDenkiPlan(
        e.target.value
      )
    }
    className="border rounded-xl p-2 w-full"
  >

    <option value="none">
      未契約
    </option>

    <option value="basic">
      BASIC
    </option>

    <option value="green">
      GREEN
    </option>

  </select>

</div>

<div>

  <div className="font-bold mb-2">
    dカード支払い割
  </div>

  <select
    value={dcardPay ? "yes" : "no"}
    onChange={(e) =>
      setDcardPay(
        e.target.value === "yes"
      )
    }
    className="border rounded-xl p-2 w-full"
  >

    <option value="no">
      なし
    </option>

    <option value="yes">
      利用中
    </option>

  </select>

</div>

<div>

  <div className="font-bold mb-2">
    長期利用割
  </div>

  <select
    value={longTerm}
    onChange={(e) =>
      setLongTerm(
        e.target.value
      )
    }
    className="border rounded-xl p-2 w-full"
  >

    <option value="none">
      なし
    </option>

    <option value="10">
      10年以上
    </option>

    <option value="20">
      20年以上
    </option>

  </select>

</div>
    
  </div>

</div>
</div>
        {/* 入力 */}
        {/* 入力 */}

{/* 月間カード利用額 */}
<div className="grid grid-cols-1 md:grid-cols-3 border-b">

  <div className="p-5 font-bold bg-slate-50 flex items-center">
    <div>
      <div>
        月間カード利用額
      </div>

      <div className="text-sm text-slate-500">
        (ドコモでんき利用額を含む)
      </div>
    </div>
  </div>

  <div className="p-5 border-l col-span-2">
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

</div>

{/* ドコモでんき利用額 */}
<div className="grid grid-cols-1 md:grid-cols-3 border-b">

  <div className="p-5 font-bold bg-slate-50 flex items-center">
    ドコモでんき利用額
  </div>

  <div className="p-5 border-l col-span-2">
    <input
      type="number"
      value={denkiUse}
      onChange={(e) =>
        setDenkiUse(
          Number(e.target.value)
        )
      }
      className="w-full border rounded-xl p-3"
    />
  </div>

</div>
        {/* 適用割引 */}
<div className="bg-slate-50 border-b p-5">

  <div className="font-bold mb-3">
    適用割引
  </div>

  <div className="flex flex-col gap-2 text-sm">

    <div>
      みんなドコモ割 :
      -{familyDiscount}円
    </div>

    <div>
      ドコモ光セット割 :
      -{hikariDiscount}円
    </div>

    <div>
      ドコモでんき割 :
      -{denkiDiscount}円
    </div>

    <div>
      dカード支払割 :
      -{dcardDiscount}円
    </div>

    <div>
      長期利用割 :
      -{longTermDiscount}円
    </div>

  </div>

</div>

{/* 内訳 */}
<div className="bg-white border-b p-5">

  <div className="text-xl font-bold mb-4">
    実利益内訳
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* GOLD */}
    <div className="bg-amber-50 rounded-2xl p-5">

      <div className="text-2xl font-black text-amber-500 mb-4">
        GOLD
      </div>

      <div className="flex flex-col gap-2 text-sm">

        <div>
          通常還元 :
          {Math.round(
            monthlyUse * 0.01 * 12
          ).toLocaleString()}pt
        </div>

        {isPoikatsuPlan && (
          <div>
            ポイ活特典 :
            {Math.round(
              goldPoikatsuPoint * 12
            ).toLocaleString()}pt
          </div>
        )}

        <div>
          ケータイ還元 :
          {Math.round(
            goldMobilePoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモ光還元 :
          {Math.round(
            goldHikariPoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモでんき還元 :
          {Math.round(
            goldDenkiPoint * 12
          ).toLocaleString()}pt
        </div>

        <div className="font-bold text-red-500">
          年会費 :
          -11,000円
        </div>

      </div>

    </div>

    {/* PLATINUM */}
    <div className="bg-zinc-100 rounded-2xl p-5">

      <div className="text-2xl font-black text-zinc-700 mb-4">
        PLATINUM
      </div>

      <div className="flex flex-col gap-2 text-sm">

        <div>
          通常還元 :
          {Math.round(
            monthlyUse * 0.01 * 12
          ).toLocaleString()}pt
        </div>

        {isPoikatsuPlan && (
          <div>
            ポイ活特典 :
            {Math.round(
              platinumPoikatsuPoint * 12
            ).toLocaleString()}pt
          </div>
        )}

        <div>
          ケータイ還元 :
          {Math.round(
            platinumMobilePoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモ光還元 :
          {Math.round(
            platinumHikariPoint * 12
          ).toLocaleString()}pt
        </div>

        <div>
          ドコモでんき還元 :
          {Math.round(
            platinumDenkiPoint * 12
          ).toLocaleString()}pt
        </div>

        <div className="font-bold text-red-500">
          年会費 :
          -29,700円
        </div>

      </div>

    </div>

  </div>

</div>

        {/* 結果 */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-emerald-50">

          <div className="p-5 font-bold">
            実質利益
          </div>

          <div className="p-5 border-l text-center">
            <div className="text-2xl md:text-4xl font-black text-emerald-600">
              {Math.round(gold).toLocaleString()}円
            </div>
          </div>

          <div className="p-5 border-l text-center">
            <div className="text-2xl md:text-4xl font-black text-emerald-600">
              {Math.round(platinum).toLocaleString()}円
            </div>
          </div>
        </div>
        {/* グラフ */}
<div className="bg-white mt-6 rounded-2xl shadow-xl p-6 h-96">

  <div className="text-2xl font-bold mb-4">
    利益比較
  </div>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart
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
    </div>
  );
}
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
} from "recharts";

const cards = {
  GOLD: {
    annualFee: 11000,
    rate: 0.1,
  },

  PLATINUM: {
    annualFee: 29700,
    rate: 0.2,
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

  const [yearlyMode, setYearlyMode] =
    useState(() => {

      return (
        localStorage.getItem(
          "yearlyMode"
        ) === "true"
      );
    });
    const [hikari, setHikari] =
  useState(false);

const [denki, setDenki] =
  useState(false);

  useEffect(() => {
    localStorage.setItem(
      "monthlyUse",
      String(monthlyUse)
    );
  }, [monthlyUse]);

  useEffect(() => {
    localStorage.setItem(
      "yearlyMode",
      String(yearlyMode)
    );
  }, [yearlyMode]);

  const [familyCount, setFamilyCount] =
  useState(1);

  const yearlyUse =
    yearlyMode
      ? monthlyUse
      : monthlyUse * 12;

      const familyBonus =
  familyCount >= 3
    ? 0.02
    : familyCount >= 2
    ? 0.01
    : 0;

const rateBonus =
  (hikari ? 0.01 : 0) +
  (denki ? 0.02 : 0) +
  familyBonus;
  const gold = useMemo(() => {
    const yearly = yearlyUse;
    const point =
  yearly *
  (cards.GOLD.rate + rateBonus);

      return (
      point - cards.GOLD.annualFee
    );
  }, [monthlyUse, rateBonus]);

  const platinum = useMemo(() => {
  const yearly = yearlyUse;
  const point =
  yearly *
  (cards.PLATINUM.rate + rateBonus);

  return (
    point -
    cards.PLATINUM.annualFee
  );
}, [monthlyUse, rateBonus]);

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

const recommend =
  gold > platinum
    ? "GOLD"
    : "PLATINUM";

const breakEven =
  (
    (cards.PLATINUM.annualFee -
      cards.GOLD.annualFee) /
    (cards.PLATINUM.rate -
      cards.GOLD.rate) /
    12
  );

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
    ドコモ経済圏
  </div>

  <div className="flex flex-col gap-3">

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={hikari}
        onChange={(e) =>
          setHikari(
            e.target.checked
          )
        }
      />

      ドコモ光 (+1%)
    </label>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={denki}
        onChange={(e) =>
          setDenki(
            e.target.checked
          )
        }
      />

      ドコモでんき (+2%)
      <div className="mt-4">

  <div className="font-bold mb-2">
    家族回線数
  </div>

  <select
    value={familyCount}
    onChange={(e) =>
      setFamilyCount(
        Number(e.target.value)
      )
    }
    className="border rounded-xl p-2"
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

</div>
    </label>

  </div>
</div>
        {/* 入力 */}
        <div className="p-5 border-b bg-slate-50 flex gap-4">

  <button
    onClick={() => setYearlyMode(false)}
    className={`px-4 py-2 rounded-xl ${
      !yearlyMode
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    月額
  </button>

  <button
    onClick={() => setYearlyMode(true)}
    className={`px-4 py-2 rounded-xl ${
      yearlyMode
        ? "bg-blue-600 text-white"
        : "bg-white border"
    }`}
  >
    年額
  </button>

</div>
        <div className="grid grid-cols-1 md:grid-cols-3 border-b">

          <div className="p-5 font-bold bg-slate-50 flex items-center">
            {yearlyMode
  ? "年間利用額"
  : "月間利用額"}
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
    <BarChart data={chartData}>

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar dataKey="value" />

    </BarChart>
  </ResponsiveContainer>
</div>
{/* おすすめ */}
<div className="bg-yellow-50 mt-6 rounded-2xl shadow-xl p-8 text-center">

  <div className="text-xl font-bold text-slate-700">
    おすすめカード
  </div>

  <div className="mt-4 text-3xl md:text-5xl font-black text-red-500">
    {recommend}
  </div>
  <div className="mt-6 text-lg text-slate-700">

  月額
  <span className="font-black text-blue-600 mx-2">
    {Math.round(breakEven).toLocaleString()}円
  </span>
  以上利用でPLATINUM優位

</div>

</div>
      </div>
    </div>
  );
}
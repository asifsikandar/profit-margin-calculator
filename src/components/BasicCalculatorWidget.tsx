import { useState } from "react";

type Op = "+" | "-" | "*" | "/" | null;

export function BasicCalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [replace, setReplace] = useState(true);
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);
  const [expMode, setExpMode] = useState(false);

  function inputDigit(d: string) {
    if (display === "Error") setDisplay("0");
    if (replace) {
      setDisplay(d);
      setReplace(false);
    } else {
      setDisplay(display.length >= 16 ? display : display + d);
    }
  }

  function inputDot() {
    if (display === "Error") { setDisplay("0."); setReplace(false); return; }
    if (replace) { setDisplay("0."); setReplace(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  }

  function compute(a: number, b: number, o: Op): number {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/":
        if (b === 0) return NaN;
        return a / b;
      default: return b;
    }
  }

  function setOperator(next: Op) {
    if (display === "Error") return;
    const current = Number(display);
    if (pending !== null && op !== null && !replace) {
      const r = compute(pending, current, op);
      if (!Number.isFinite(r)) { setDisplay("Error"); setPending(null); setOp(null); setReplace(true); return; }
      setDisplay(formatNum(r));
      setPending(r);
    } else {
      setPending(current);
    }
    setOp(next);
    setReplace(true);
    setExpMode(false);
  }

  function equals() {
    if (display === "Error" || pending === null || op === null) return;
    const current = Number(display);
    const r = compute(pending, current, op);
    if (!Number.isFinite(r)) { setDisplay("Error"); setPending(null); setOp(null); setReplace(true); return; }
    setDisplay(formatNum(r));
    setAns(r);
    setPending(null);
    setOp(null);
    setReplace(true);
    setExpMode(false);
  }

  function ac() {
    setDisplay("0"); setPending(null); setOp(null); setReplace(true); setExpMode(false);
  }

  function back() {
    if (display === "Error") { ac(); return; }
    if (replace) return;
    const s = display.length > 1 ? display.slice(0, -1) : "0";
    setDisplay(s);
    if (s === "0") setReplace(true);
  }

  function plusMinus() {
    if (display === "Error" || display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  }

  function memAdd() { const n = Number(display); if (Number.isFinite(n)) setMemory(memory + n); }
  function memSub() { const n = Number(display); if (Number.isFinite(n)) setMemory(memory - n); }
  function memRecall() { setDisplay(formatNum(memory)); setReplace(true); }
  function ansRecall() { setDisplay(formatNum(ans)); setReplace(true); }
  function rnd() {
    // Random number in [0, 1), 4 decimals
    const v = Math.random();
    setDisplay(v.toFixed(4));
    setReplace(true);
  }
  function expBtn() {
    if (display === "Error") return;
    if (display.toLowerCase().includes("e")) return;
    setDisplay(display + "e");
    setExpMode(true);
    setReplace(false);
  }

  function formatNum(n: number): string {
    if (!Number.isFinite(n)) return "Error";
    const s = String(n);
    return s.length > 16 ? n.toPrecision(12) : s;
  }

  const btn = "rounded border border-border bg-[#dbe4ed] py-2 text-sm font-semibold text-navy hover:bg-[#c8d5e2] active:bg-[#b6c5d5]";
  const btnOp = "rounded border border-border bg-[#c9d7e5] py-2 text-sm font-semibold text-navy hover:bg-[#b6c5d5]";
  const btnEq = "rounded border border-border bg-lime py-2 text-sm font-semibold text-white hover:bg-lime-dark";

  const layout: Array<Array<{ label: string; onClick: () => void; kind?: "op" | "eq" }>> = [
    [
      { label: "7", onClick: () => inputDigit("7") },
      { label: "8", onClick: () => inputDigit("8") },
      { label: "9", onClick: () => inputDigit("9") },
      { label: "+", onClick: () => setOperator("+"), kind: "op" },
      { label: "Back", onClick: back, kind: "op" },
    ],
    [
      { label: "4", onClick: () => inputDigit("4") },
      { label: "5", onClick: () => inputDigit("5") },
      { label: "6", onClick: () => inputDigit("6") },
      { label: "−", onClick: () => setOperator("-"), kind: "op" },
      { label: "Ans", onClick: ansRecall, kind: "op" },
    ],
    [
      { label: "1", onClick: () => inputDigit("1") },
      { label: "2", onClick: () => inputDigit("2") },
      { label: "3", onClick: () => inputDigit("3") },
      { label: "×", onClick: () => setOperator("*"), kind: "op" },
      { label: "M+", onClick: memAdd, kind: "op" },
    ],
    [
      { label: "0", onClick: () => inputDigit("0") },
      { label: ".", onClick: inputDot },
      { label: "EXP", onClick: expBtn, kind: "op" },
      { label: "÷", onClick: () => setOperator("/"), kind: "op" },
      { label: "M−", onClick: memSub, kind: "op" },
    ],
    [
      { label: "±", onClick: plusMinus, kind: "op" },
      { label: "RND", onClick: rnd, kind: "op" },
      { label: "AC", onClick: ac, kind: "op" },
      { label: "=", onClick: equals, kind: "eq" },
      { label: "MR", onClick: memRecall, kind: "op" },
    ],
  ];

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded border border-border bg-white">
      <div className="bg-navy px-3 py-3 text-right font-mono text-2xl text-white">
        {display}
        {expMode && <span className="ml-1 text-xs opacity-70">EXP</span>}
      </div>
      <div className="grid grid-cols-5 gap-2 p-3">
        {layout.flat().map((b, i) => (
          <button
            key={i}
            onClick={b.onClick}
            className={b.kind === "eq" ? btnEq : b.kind === "op" ? btnOp : btn}
          >
            {b.label}
          </button>
        ))}
      </div>
      <p className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        RND generates a random number between 0 and 1 (4 decimal places).
      </p>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { CalcField } from "@/lib/calc-framework";

/**
 * Long-form, in-depth editorial content generated for every calculator page and
 * category page. The goal is to give each page genuinely useful depth (roughly
 * 2,000 words) rather than a thin tool-only page.
 */

export interface Faq {
  q: string;
  a: string;
}

const CATEGORY_CONTEXT: Record<string, { audience: string; theme: string; caution: string }> = {
  financial: {
    audience: "business owners, investors, students and anyone planning a budget",
    theme: "money, pricing, borrowing, saving and return on investment",
    caution:
      "interest rates, taxes, transaction fees and inflation can all move the real-world number away from a clean textbook figure",
  },
  "fitness-and-health": {
    audience: "athletes, coaches, patients, parents and everyday people tracking progress",
    theme: "body measurements, energy balance, nutrition and general wellbeing",
    caution:
      "every body is different, so population-level equations are guidance rather than a medical diagnosis",
  },
  math: {
    audience: "students, teachers, engineers and anyone checking work quickly",
    theme: "numbers, algebra, geometry, statistics and conversions",
    caution:
      "rounding at intermediate steps and unit mismatches are the two most common sources of a wrong answer",
  },
  other: {
    audience: "homeowners, tradespeople, hobbyists, planners and curious readers",
    theme: "measurement, construction, conversion, time and everyday practical questions",
    caution:
      "real materials, waste factors and local standards mean you should always add a sensible safety margin",
  },
};

function ctx(category: string) {
  return CATEGORY_CONTEXT[category] ?? CATEGORY_CONTEXT.other!;
}

function fieldList(fields: CalcField[]): string {
  const names = fields.map((f) => f.label.toLowerCase());
  if (names.length === 0) return "the input fields";
  if (names.length === 1) return names[0]!;
  return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
}

const P = "mt-3 text-[15px] leading-7 text-muted-foreground";
const H = "mt-0 text-lg sm:text-xl";
const SECTION = "mt-6 surface-card p-5 sm:p-6";

export function buildCalculatorFaqs(title: string, fields: CalcField[], categoryLabel: string): Faq[] {
  const first = fields[0]?.label ?? "the required values";
  return [
    {
      q: `How do I use the ${title}?`,
      a: `Type ${first.toLowerCase()} into the first box, complete the remaining fields, then press Calculate. The answer appears immediately underneath the form. Press Clear at any time to empty every field and start a fresh scenario.`,
    },
    {
      q: `Is the ${title} free to use?`,
      a: "Yes. Every calculator on this website is completely free, works without an account, has no daily usage limit and does not require you to install anything. You can bookmark the page and return whenever you need it.",
    },
    {
      q: "How accurate are the results?",
      a: "The tool applies the standard formula printed on this page, so the arithmetic is exact for the numbers you supply. Accuracy in practice depends on how realistic your inputs are: a good estimate in produces a good estimate out, and a rough guess produces a rough answer.",
    },
    {
      q: "Do you store or share the numbers I enter?",
      a: "No. The calculation runs entirely inside your browser using JavaScript. Nothing you type is uploaded, logged, saved to an account or shared with a third party, which makes the tool safe to use with sensitive personal or business figures.",
    },
    {
      q: "Can I use this on a phone or tablet?",
      a: "Yes. The layout is fully responsive, so fields stack neatly on small screens and the number keypad opens automatically for numeric inputs. The tool behaves identically on desktop, laptop, tablet and mobile browsers.",
    },
    {
      q: "Why is my result different from another website?",
      a: "Different tools sometimes round at different stages, assume a different number of periods per year, or include or exclude fees, taxes and allowances. Compare the formula shown on this page with the one the other tool documents and the difference usually becomes obvious.",
    },
    {
      q: "What should I do if I see an error message?",
      a: "An error means one of the fields is blank, contains letters, or holds a value the formula cannot accept, such as a zero denominator or a negative quantity. Re-check the highlighted field, remove any currency symbols or thousands separators, and calculate again.",
    },
    {
      q: "Can I change the currency?",
      a: "Yes. Use the currency selector in the site header to switch between US dollars, Pakistani rupees, Indian rupees, euros, pounds and dirhams. Every money field and every money result updates to the symbol you choose.",
    },
    {
      q: "Can I use the result for an official decision?",
      a: "Treat the output as a well-informed estimate for planning, learning and comparison. For binding decisions such as a loan agreement, a tax filing, a medical treatment plan or a structural build, confirm the figure with a qualified professional.",
    },
    {
      q: `Where can I find related tools?`,
      a: `Open the ${categoryLabel} category to browse every related calculator, or type a keyword into the search box in the header to jump straight to the tool you need.`,
    },
  ];
}

export function CalculatorLongForm({
  title,
  category,
  categoryLabel,
  categoryPath,
  fields,
}: {
  title: string;
  category: string;
  categoryLabel: string;
  categoryPath: string;
  fields: CalcField[];
}) {
  const c = ctx(category);
  const list = fieldList(fields);
  const firstField = fields[0]?.label ?? "the first value";

  return (
    <>
      <section className={SECTION}>
        <h2 className={H}>About the {title}</h2>
        <p className={P}>
          The {title} is a free online tool that turns {list} into a clear, immediate answer. It
          belongs to our {categoryLabel.toLowerCase()} collection, which covers {c.theme}, and it is
          built for {c.audience}. Everything runs inside your browser, so the moment you press
          Calculate the result is on screen with no waiting, no page reload and no data leaving your
          device.
        </p>
        <p className={P}>
          Calculations like this one are easy to get wrong by hand. It is not that the mathematics is
          difficult, it is that there are several small steps and a single slip, a misplaced decimal
          point, a percentage entered as a whole number, or a value in the wrong unit, quietly
          changes the final figure. Automating the arithmetic removes that risk so you can spend your
          attention on the part that actually matters: choosing sensible inputs and interpreting what
          the answer means for your situation.
        </p>
        <p className={P}>
          The tool is also designed for comparison rather than a single one-off answer. Most real
          decisions are not "what is the number?" but "which of these options is better?". Because
          recalculating takes a second, you can run three or four variations, write the outputs down
          side by side, and pick the scenario that fits your goals and your tolerance for risk.
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H}>How to use this calculator step by step</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>
            Gather your figures before you start. Having {list} in front of you means you will not
            have to guess halfway through and then wonder whether the answer is trustworthy.
          </li>
          <li>
            Enter {firstField.toLowerCase()} in the first field. Type plain numbers only, with no
            currency symbols, no percentage signs and no thousands separators; the tool adds the
            formatting for you.
          </li>
          <li>
            Complete the remaining fields in order. Where a field offers a dropdown, pick the option
            that matches your situation, because that choice usually changes which branch of the
            formula is applied.
          </li>
          <li>
            Press <strong>Calculate</strong>. The result panel appears directly under the form and
            shows the headline answer along with the supporting figures used to reach it.
          </li>
          <li>
            Read the supporting numbers, not just the headline. They tell you where the answer came
            from and make it far easier to spot an input you mistyped.
          </li>
          <li>
            Change one value and calculate again. Adjusting a single variable at a time is the
            fastest way to see how sensitive the outcome is to each assumption.
          </li>
          <li>
            Press <strong>Clear</strong> when you want a blank form, and repeat the process for the
            next scenario you want to test.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <h2 className={H}>What each input means</h2>
        <p className={P}>
          Understanding the fields is the difference between a number you trust and a number you
          merely produced. Here is what the calculator expects from each one.
        </p>
        <dl className="mt-3 space-y-3 text-[15px] leading-7">
          {fields.map((f) => (
            <div key={f.name}>
              <dt className="font-semibold text-foreground">{f.label}</dt>
              <dd className="text-muted-foreground">
                {f.help
                  ? f.help + " "
                  : `Enter the ${f.label.toLowerCase()} that applies to your situation. `}
                {f.type === "select"
                  ? "Choose the option that matches your case, as the calculator switches to the matching version of the formula."
                  : f.suffix === "$"
                    ? "This is a money field, so it follows the currency you select in the header. Use a plain number such as 1250.50."
                    : f.suffix === "%"
                      ? "Enter this as a percentage, for example 7.5 rather than 0.075; the calculator divides by one hundred internally."
                      : "Use a plain decimal number. Keep every related field in the same unit so the comparison stays valid."}
              </dd>
            </div>
          ))}
        </dl>
        <p className={P}>
          If a field is optional in your scenario, leave the default value in place rather than
          emptying it. A blank field is treated as missing information and the calculator will ask
          you to supply it before it produces a result.
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H}>How to read and use the result</h2>
        <p className={P}>
          The bold figure at the top of the result panel is the headline answer, the number you came
          here for. The smaller figures around it are intermediate values: subtotals, rates,
          differences or period counts that the formula produced on the way to the final answer.
          Together they form an audit trail. If the headline looks surprising, one of those
          supporting numbers will almost always show you why.
        </p>
        <p className={P}>
          A result is only as strong as the assumptions behind it, so treat the output as the centre
          of a range rather than a single certain value. A practical habit is to calculate three
          times: once with optimistic inputs, once with the figures you genuinely expect, and once
          with pessimistic inputs. The gap between the best case and the worst case tells you how
          much room for error your plan actually has, and that is usually more decision-useful than
          any single number.
        </p>
        <p className={P}>
          Finally, remember the context: {c.caution}. Build a margin into whatever you do next rather
          than planning to the last decimal place.
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H}>Worked examples</h2>
        <ol className="mt-3 space-y-3 text-[15px] leading-7 text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Example 1 — a straightforward run. </span>
            Enter your real figures for {list}, leave every other setting at its default, and press
            Calculate. This is your baseline. Note the headline number down before you change
            anything, because every later comparison is measured against it.
          </li>
          <li>
            <span className="font-semibold text-foreground">Example 2 — testing one change. </span>
            Go back and adjust only {firstField.toLowerCase()}, perhaps by ten percent up and then
            ten percent down. Recalculate each time. The size of the swing in the answer shows you
            how much this single input drives the outcome, and therefore how carefully you need to
            estimate it.
          </li>
          <li>
            <span className="font-semibold text-foreground">Example 3 — comparing two options. </span>
            Run the calculator once for option A and once for option B, writing both results down.
            Because both scenarios pass through exactly the same formula, the comparison is fair and
            you can choose on the numbers instead of on instinct.
          </li>
          <li>
            <span className="font-semibold text-foreground">Example 4 — a stress test. </span>
            Deliberately enter the worst realistic case: the highest cost, the lowest return, the
            tightest timeline. If the outcome is still acceptable, your plan is robust. If it is not,
            you have found the assumption that needs the most attention before you commit.
          </li>
        </ol>
      </section>

      <section className={SECTION}>
        <h2 className={H}>Common mistakes to avoid</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>
            <strong>Mixing units.</strong> Months and years, kilograms and pounds, metres and feet:
            mixing them is the single most frequent cause of an answer that looks wildly wrong.
            Decide on one unit system and convert everything before you begin.
          </li>
          <li>
            <strong>Confusing percentages and decimals.</strong> Percentage fields expect 7.5, not
            0.075. Entering the decimal form makes the result a hundred times too small.
          </li>
          <li>
            <strong>Pasting formatted numbers.</strong> Copying a value with a currency symbol or
            comma separators from a spreadsheet can produce an invalid entry. Paste plain digits.
          </li>
          <li>
            <strong>Forgetting the extras.</strong> Fees, taxes, waste allowance, shipping and
            contingency are real costs. If the formula does not include them, add them to your inputs
            or to your interpretation of the answer.
          </li>
          <li>
            <strong>Over-precision.</strong> Reporting an estimate to four decimal places suggests a
            certainty you do not have. Round sensibly when you present the figure to someone else.
          </li>
          <li>
            <strong>Using one scenario only.</strong> A single calculation answers a question; three
            calculations reveal a pattern. Always sanity-check with a second set of inputs.
          </li>
        </ul>
      </section>

      <section className={SECTION}>
        <h2 className={H}>Who uses the {title} and why</h2>
        <p className={P}>
          This calculator is used every day by {c.audience}. Some need a quick answer during a
          conversation and cannot afford to open a spreadsheet. Others are checking work they already
          did by hand and want a second opinion before they commit. Students use it to confirm that
          the method they applied in class produces the same figure, which is a far more effective way
          to learn than simply reading the formula again.
        </p>
        <p className={P}>
          Professionals tend to use it differently: not for the answer itself, but for speed of
          iteration. Being able to try eight variations in two minutes changes the quality of a
          decision, because it turns an abstract argument about assumptions into a concrete table of
          outcomes that everyone in the room can look at.
        </p>
        <p className={P}>
          Whichever group you fall into, the workflow is the same. Put in honest numbers, look at the
          supporting figures as well as the headline, test a couple of alternatives, and then decide.
          The calculator handles the arithmetic; the judgement stays with you.
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H}>Limitations and things to keep in mind</h2>
        <p className={P}>
          No calculator can capture every detail of a real situation. This tool applies a
          well-established formula to the values you provide, and it does that reliably, but it does
          not know your local regulations, your contract terms, your medical history or the condition
          of the materials in front of you. It also assumes the inputs stay constant, when in reality
          rates change, prices move and circumstances shift.
        </p>
        <p className={P}>
          Use the output as a strong starting point rather than a final verdict. Where the decision
          carries real financial, legal, structural or health consequences, take the number to an
          appropriate professional, show them the assumptions you used, and let them refine it. That
          conversation is usually far more productive when you arrive with a worked estimate than
          when you arrive with a blank page.
        </p>
      </section>

      <section className={SECTION}>
        <h2 className={H}>Explore more {categoryLabel.toLowerCase()} tools</h2>
        <p className={P}>
          One calculation rarely stands alone. If this tool answered part of your question, the rest
          of the collection almost certainly covers the neighbouring parts, and each tool follows the
          same layout so there is nothing new to learn.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
          <li>
            <Link to={categoryPath} className="text-linkblue font-medium hover:underline">
              All {categoryLabel} calculators
            </Link>
          </li>
          <li>
            <Link to="/financial" className="text-linkblue font-medium hover:underline">
              Financial calculators
            </Link>
          </li>
          <li>
            <Link to="/fitness-and-health" className="text-linkblue font-medium hover:underline">
              Fitness and health calculators
            </Link>
          </li>
          <li>
            <Link to="/math" className="text-linkblue font-medium hover:underline">
              Math calculators
            </Link>
          </li>
          <li>
            <Link to="/other" className="text-linkblue font-medium hover:underline">
              Other calculators
            </Link>
          </li>
          <li>
            <Link to="/faq" className="text-linkblue font-medium hover:underline">
              Site FAQ
            </Link>
          </li>
          <li>
            <Link to="/blog" className="text-linkblue font-medium hover:underline">
              Guides and articles
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-linkblue font-medium hover:underline">
              Contact us
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}

export function CategoryLongForm({
  categoryKey,
  categoryLabel,
}: {
  categoryKey: string;
  categoryLabel: string;
}) {
  const c = ctx(categoryKey);
  const lower = categoryLabel.toLowerCase();
  return (
    <div className="mt-6 space-y-6">
      <section className="surface-card p-5 sm:p-6">
        <h2 className={H}>About our {lower} calculators</h2>
        <p className={P}>
          This section of the site brings together every tool we publish for {c.theme}. Each
          calculator is written from the underlying formula rather than copied from somewhere else,
          each one validates what you type before it produces an answer, and each one runs entirely
          in your browser so your figures never leave your device. The collection is designed for{" "}
          {c.audience}, which means the tools have to be quick enough for a professional and clear
          enough for someone meeting the topic for the first time.
        </p>
        <p className={P}>
          The pages all share the same structure. The calculator sits at the top so you can start
          immediately, the formula and a plain-language explanation follow underneath, and worked
          examples plus frequently asked questions close the page. Once you have used one tool, you
          already know how to use the rest.
        </p>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className={H}>How to choose the right {lower} calculator</h2>
        <p className={P}>
          Start from the question rather than the tool. Write down in one sentence what you want to
          know and which number you are missing, then scan the list above for the calculator whose
          name contains that missing number. If two tools look similar, open both: the description at
          the top of each page states exactly which inputs it expects and which output it produces,
          and that usually settles it in a few seconds.
        </p>
        <p className={P}>
          It is also perfectly normal to need two or three tools in sequence. One calculator produces
          a figure, that figure becomes the input to the next, and the chain answers a question that
          no single tool could. Because every page uses consistent units and formatting, passing a
          result from one calculator to another is straightforward.
        </p>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className={H}>Getting reliable answers</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>Use real figures rather than round guesses wherever you can; precision in equals precision out.</li>
          <li>Keep every related field in the same unit and the same time period.</li>
          <li>Enter percentages as whole numbers, so seven and a half percent is 7.5.</li>
          <li>Read the supporting numbers in the result panel, not only the headline figure.</li>
          <li>Run a best case and a worst case so you understand the range, not just the midpoint.</li>
          <li>Remember that {c.caution}.</li>
        </ul>
        <p className={P}>
          Follow those six habits and the answers you get from this section will hold up when someone
          questions them, which is ultimately what a calculator is for: not producing a number, but
          producing a number you can defend.
        </p>
      </section>
    </div>
  );
}

import Link from "next/link";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  relatedTool: string;
  content: string;
};

export const INSIGHTS: Article[] = [
  {
    slug: "how-to-optimize-mortgage-payments",
    title: "How to Optimize Your Mortgage Payments in a High-Interest Environment",
    summary: "Real-world case study on using amortization tools to save over $50,000 in interest payments.",
    date: "Dec 28, 2025",
    category: "Finance",
    relatedTool: "loan-amortization-calculator",
    content: `
      In today's economic climate, where interest rates for 30-year fixed mortgages are hovering above historical lows, the total cost of borrowing has become a critical concern for homeowners. Many borrowers focus solely on the monthly payment, often overlooking the long-term impact of interest accumulation.

      ## The Power of Extra Payments
      One of the most effective strategies to reduce total interest is making additional principal payments. Even a small extra payment of $100 per month can shave years off your loan term. 
      
      For example, consider a **$400,000 mortgage at 6.5% interest** over 30 years.
      *   **Standard Scenario:** You pay a total of $510,000 in interest alone over the life of the loan.
      *   **Strategy A (+ $100/mo):** You save approximately $68,000 in interest and pay off the loan 3.5 years early.
      *   **Strategy B (Bi-weekly payments):** By splitting your monthly payment in two and paying every two weeks, you make one extra full payment per year, saving substantial interest.
      
      ## Using the Amortization Calculator
      Our **Loan Amortization Calculator** allows you to simulate these scenarios. By inputting your loan details and adding an "Extra Payment" value, you can visualize exactly how the principal curve shifts downward.
      
      ### Key Metrics to Watch
      1.  **Total Interest Paid:** This is the "wasted" money. Your goal is to minimize this.
      2.  **Break-even Point:** If you are refinancing, how long does it take for the lower rate to offset the closing costs?
      
      > **Pro Tip:** Always check with your lender ensuring there are no "prepayment penalties" before starting an aggressive repayment plan.
    `
  },
  {
    slug: "bmi-vs-rfm-health-metrics",
    title: "BMI vs. RFM: Which Health Metric Actually Matters?",
    summary: "Why BMI is just one part of the story and how to use health calculators for a holistic view.",
    date: "Dec 27, 2025",
    category: "Health",
    relatedTool: "bmi-calculator",
    content: `
      Body Mass Index (BMI) has long been the gold standard for quick health assessments, but it's not without its critics. Developed in the 19th century, BMI relies solely on height and weight, failing to distinguish between muscle mass and body fat.

      ## The Muscle Mass Dilemma
      Athletes with high muscle density often classify as "overweight" or "obese" on the BMI scale despite having low body fat percentages. This is where the **Relative Fat Mass (RFM)** index and other metrics come into play.

      ## A Holistic Approach
      To get a true picture of your metabolic health, you should triangulate results from multiple tools:
      1.  **BMI Calculator:** Good for a general baseline population assessment.
      2.  **Waist-to-Height Ratio:** A better predictor of heart disease risk.
      3.  **Body Fat Percentage:** The most accurate metric, though harder to measure without calipers or DEXA scans.

      ## What Our Data Shows
      Users who track their **Calorie Deficit** in conjunction with BMI trends tend to see more sustainable weight loss results. It's not just about the number on the scale; it's about body composition.
      
      When using our tools, remember that these numbers are indicators, not diagnoses. Always consult a medical professional before starting a drastic diet or exercise regime.
    `
  },
  {
    slug: "concrete-slab-cost-guide",
    title: "Concrete Slab Cost Estimation Guide for Homeowners",
    summary: "Avoid contractor overcharging by understanding the math behind concrete volume and finishing costs.",
    date: "Jan 10, 2026",
    category: "Engineering",
    relatedTool: "concrete-slab-calculator",
    content: `
      Planning a new patio, driveway, or receive shed foundation? One of the most common "hidden costs" in home improvement is concrete overage. Contractors often order 10-15% extra to account for spillage and uneven grade, but understanding the base math can help you budget accurately.

      ## The Cubic Yard Rule
      Concrete is sold by the cubic yard. To calculate this, you need to convert your dimensions (Length x Width x Thickness) into cubic feet and divide by 27.
      
      *Formula:* $(L \times W \times H_{ft}) / 27 = \text{Cubic Yards}$

      ## Factors Influencing Price
      1.  **Thickness:** A standard 4-inch slab is standard for walkways, but driveways often need 6 inches + rebar reinforcement.
      2.  **PSI Rating:** Higher strength concrete (4000 PSI vs 2500 PSI) costs more but is essential for heavy loads.
      3.  **Finishing:** Stamped or colored concrete can double the price per square foot compared to a simple broom finish.

      ## Using the Calculator
      Our **Concrete Slab Calculator** does the heavy lifting for you. It includes a "Waste Factor" toggle—we recommend keeping this at 10% for DIY projects. If you are calculating for a complex shape, break it down into smaller rectangles, calculate each, and sum the total volume.
    `
  },
  {
    slug: "debt-snowball-vs-avalanche",
    title: "Debt Snowball vs. Avalanche: The Mathematical Difference",
    summary: "Psychology vs. Math: Which debt payoff strategy is right for your financial personality?",
    date: "Jan 12, 2026",
    category: "Finance",
    relatedTool: "loan-amortization-calculator",
    content: `
      When tackling multiple debts, two primary strategies dominate the conversation: the Snowball and the Avalanche.

      ## The Debt Snowball (Psychology)
      This method involves listing debts from **smallest balance to largest balance**, ignoring interest rates. You pay minimums on everything else and attack the smallest debt first.
      *   **Pros:** Quick wins build momentum. You feel "successful" faster.
      *   **Cons:** You pay more interest over time because high-rate debts linger.

      ## The Debt Avalanche (Math)
      Here, you target the debt with the **highest interest rate** first.
      *   **Pros:** Mathematically optimal. You save the most money and get out of debt faster.
      *   **Cons:** It can take months or years to see the first account close, which can be discouraging.

      ## Simulation
      Using our **Loan Calculator** tools, you can run simulations. For a user with \$20k in credit card debt at 22% and a \$15k car loan at 6%, the Avalanche method can save over \$2,000 over 3 years compared to the Snowball method. However, if the Snowball method keeps you motivated to not quit, it is the better method for *you*.
    `
  },
  {
    slug: "roi-calculation-mistakes",
    title: "Why Your ROI Calculation is Probably Wrong",
    summary: "Return on Investment seems simple, but omitting time horizon and inflation can lead to bad business decisions.",
    date: "Jan 14, 2026",
    category: "Business",
    relatedTool: "cagr-calculator",
    content: `
      "What's the ROI?" is the most common question in business, but the basic formula $(\text{Net Profit} / \text{Cost}) \times 100$ is often misleading for long-term investments.

      ## The Time Value of Money
      A 20% return over 1 year is amazing. A 20% return over 10 years is terrible (less than 2% annualized). This is why **CAGR (Compound Annual Growth Rate)** is a superior metric for comparing investments across different time horizons.

      ## Common Omissions
      1.  **Inflation:** If your returns aren't beating inflation (typically 2-3%), you are losing purchasing power.
      2.  **Opportunity Cost:** Could this capital have earned a "risk-free" 4% in a treasury bond? Your ROI should be measured against this benchmark.
      3.  **Tax Implications:** Gross ROI vs. Net ROI (after capital gains tax) can change the viability of a real estate deal.

      ## Tool Tip
      Use our **CAGR Calculator** instead of a simple percentage calculator when evaluating stocks or business expansions that span multiple years. It smooths out the volatility and gives you a single, comparable annual growth number.
    `
  }
];

export default function InsightsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">CalcPanda Insights</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Deep dives, case studies, and professional guides on how to make the most of our calculation tools.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {INSIGHTS.map((article: Article) => (
          <article key={article.slug} className="group flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
              {article.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {article.summary}
            </p>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <Link href={`/insights/${article.slug}`} className="text-sm font-bold text-gray-900 hover:underline">
                Read full case study →
              </Link>
              <Link href={`/${article.relatedTool}`} className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-mono">
                Used tool: {article.relatedTool}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

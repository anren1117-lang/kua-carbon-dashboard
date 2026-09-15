// AP Statistics Unit 1 — Exploring One-Variable Data (15-23%)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APSTATS_UNIT_1 = {
  number: 1,
  title: 'Exploring One-Variable Data',
  weight: '15-23%',
  subunits: [
    {
      code: '1.1',
      title: 'Introducing statistics — what can we learn from data?',
      content:
`Statistics is the science of collecting, organizing, analyzing, and drawing conclusions from data. It's the bridge between the messy real world — where measurements vary, experiments are imperfect, and populations are too big to count — and the certainty we want from quantitative claims. Almost every modern decision of consequence runs through statistics: which drug to approve, which policy reduces deaths, which advertising campaign works, which strategy wins games, which model predicts elections. The methods you'll learn in this course are the same ones used by FDA biostatisticians, election forecasters, Major League Baseball teams, and tech companies running A/B tests.

**What "drawing conclusions from data" really means.** When you have data, two questions follow:

1. **What does the data tell us about what we observed?** This is the descriptive question. Compute summaries, draw graphs, characterize the data set.
2. **What does the data tell us about something we didn't observe?** This is the inferential question. From a sample of 1,000 voters, what can we say about all 150 million voters? From a clinical trial of 5,000 patients, what does the data say about millions of future patients?

Descriptive statistics (the first question) is mostly the content of Units 1–2. Inferential statistics (the second question) is Units 5–9. The entire course is structured to walk you from one to the other.

**Why uncertainty is built in.** Real measurements vary. Two doctors measure your blood pressure and get different numbers. Two scales in different stores weigh you differently. If you flip a fair coin 100 times, you don't get exactly 50 heads — you get something nearby, but the exact number varies from run to run. Statistics gives you the tools to quantify this variation and reason despite it. Statistical claims are typically not "X causes Y," but rather "with this much data and these methods, the evidence for X causing Y is strong enough that we'd be surprised to see it by chance." That's a very different mental model from physics or pure math.

**Types of data.**

- **Categorical (qualitative) variables.** Values are labels or categories. Eye color (brown, blue, green, other), blood type (A, B, AB, O), political party (Democrat, Republican, Independent), grade level (9, 10, 11, 12 — yes, these are categorical even though they look numeric, because the spacing isn't a meaningful interval and you wouldn't average grade levels).
- **Quantitative variables.** Numerical measurements where arithmetic makes sense. Height, weight, income, blood pressure, temperature.
  - **Discrete quantitative**: only certain values are possible (counts: number of siblings, number of car accidents this year, number of heads in 10 flips).
  - **Continuous quantitative**: can in principle take any value in a range (heights, times, masses). In practice we measure to some precision.

Distinguishing categorical from quantitative is the first step in choosing the right summary or graph. A pie chart of eye colors makes sense; a pie chart of heights does not.

**Variables, individuals, and observations.** A **variable** is a characteristic that varies among individuals. An **individual** (or "unit," "subject," "case") is a single entity being measured. An **observation** is the value of a variable for one individual.

A data table typically has individuals as rows and variables as columns. Each cell is one observation.

**Population vs sample.** This distinction drives everything in inferential statistics.

- The **population** is the entire group of interest. Examples: all eligible US voters, all patients with type 2 diabetes, all maple trees in Vermont.
- The **sample** is the subset actually examined. Examples: 1,200 voters in a poll, 5,000 patients in a clinical trial, 50 maple trees a forest scientist tagged.

Statistics uses samples to draw conclusions about populations. The whole field exists because populations are usually too big to measure completely, but with a well-chosen sample we can still make precise statements about the whole.

**Parameter vs statistic.** Confusingly named but worth getting right:

- A **parameter** is a numerical summary of the *population*. Conventionally denoted with Greek letters: $\\mu$ (population mean), $\\sigma$ (population standard deviation), $p$ (population proportion).
- A **statistic** is a numerical summary of a *sample*. Roman letters: $\\bar{x}$ (sample mean), $s$ (sample standard deviation), $\\hat{p}$ (sample proportion).

The whole inferential program: parameters are unknown, statistics are observable. We use statistics to *estimate* parameters. The sample mean $\\bar{x}$ is our best guess for the population mean $\\mu$; the sample proportion $\\hat{p}$ is our best guess for the population proportion $p$.

**The road map for the year.**

- Units 1–2: describing data, one variable at a time and two variables together.
- Unit 3: collecting data well — experiments, observational studies, sampling methods.
- Unit 4: probability — the mathematics of randomness.
- Unit 5: sampling distributions — why $\\bar{x}$ behaves predictably even when individual values don't.
- Units 6–9: inference — confidence intervals and hypothesis tests for means, proportions, slopes, and more.

Each unit builds on what came before. Unit 1 is where the language is set.

**A note on "lying with statistics."** It's a cliché that you can lie with statistics — and it's true, you can. But the same statistical methods that mislead in dishonest hands are the only tools we have to detect deception in someone else's analysis. Knowing statistics is, among other things, knowing how to read a chart skeptically: are the axes scaled honestly? Is the comparison group reasonable? Is the sample representative? The course's defensive value is at least as great as its constructive value.

**Practical examples of statistical thinking.**

- The CDC tracks flu cases each week. From samples of doctor visits, they estimate national prevalence.
- Pharmaceutical companies run clinical trials. From outcomes in a few thousand patients, they decide whether to seek approval for a drug.
- Polling organizations sample $\\sim 1{,}000$ voters and forecast outcomes for elections with $\\sim 150$ million voters. The math behind why $1{,}000$ is enough is the subject of Units 5 and 7.
- Insurance companies use mortality statistics to set rates. Past data on how often people in age-and-health categories die in a year drives premium pricing.
- Sports analytics use detailed game data to make decisions about strategy, hiring, contracts.

In every case, the statistical reasoning is the same: collect data, summarize it well, draw inferences about the broader question — while keeping honest track of the uncertainty introduced at every step.`,
      video: {
        url: 'https://www.youtube.com/watch?v=sxQaBpKfDRk',
        title: 'CrashCourse Statistics — What is statistics?',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.2',
      title: 'The language of variation',
      content:
`Data varies. If it didn't, you'd only need to measure one individual to know everything. The whole reason statistics exists is to make sense of variation — to describe it, quantify it, predict it, account for it in decisions. The vocabulary for talking about variation is the foundation for everything in this course.

**Sources of variation.** Where does the spread in measurements come from?

1. **Natural variation among individuals.** People have different heights. Apples have different masses. Reaction times in psychology experiments vary by subject. This variation is real and isn't measurement error — it's what we're trying to describe.
2. **Measurement variation.** Instruments aren't perfect. A scale has a precision limit; thermometers fluctuate; observers disagree. Even with one true value being measured repeatedly, you'd see some scatter.
3. **Induced variation.** When we deliberately give different treatments to different individuals (some get drug, some get placebo), we induce differences. This is the kind of variation experiments are designed to study.

Recognizing which type of variation is in play matters for analysis. Natural variation is the subject of descriptive statistics. Measurement variation usually gets averaged away by larger samples. Induced variation is the point of experiments and gets analyzed with inferential methods.

**Distribution.** A distribution describes the pattern of values a variable takes — how often each value (or range of values) occurs. The distribution is the full picture of a variable; everything else (mean, median, etc.) is a summary of it.

**The four features of a distribution: SOCS.** Whenever you describe a distribution, address all four:

- **Shape**: symmetric, skewed, uniform, bimodal, etc.
- **Outliers**: unusual values far from the rest.
- **Center**: typical value (mean, median).
- **Spread**: how variable the data are (standard deviation, IQR, range).

The memory device is SOCS: Shape, Outliers, Center, Spread. Many AP exam problems are graded explicitly on whether you addressed each of the four.

**Common shapes — what to look for.**

- **Symmetric.** Roughly mirror-image around the center. Mean $\\approx$ median. Examples: heights, IQ scores, errors in measuring a constant.
- **Skewed right (positively skewed).** Long tail on the right. Mean is pulled to the right of the median by the high values. Examples: income, house prices, wait times.
- **Skewed left (negatively skewed).** Long tail on the left. Mean pulled left. Examples: exam scores when most pass (most people near 100; tail extends down to failures), age at death (most die old; tail extends down to early deaths).
- **Uniform.** Each value roughly equally likely. Examples: outcomes of a fair die (in the long run), random numbers from a generator.
- **Bimodal.** Two peaks, suggesting two subpopulations mixed together. Examples: heights of mixed adult population (peak for women's heights, peak for men's), reaction times for a task where some people know a shortcut.
- **Unimodal.** Single peak.

**Why shape matters for summary choice.** When data is symmetric, the mean and median agree, and reporting either is fine. When data is skewed, the mean is pulled toward the tail, so the median is a better center summary for typical-person purposes. Income is famously skewed right; the *median* household income tells you about "the typical family" better than the *mean*, which is dragged up by billionaires.

**Outliers — definition and treatment.** Outliers are observations that fall far from the bulk of the data. They might be:

- **Real but rare.** A 90-year-old marathon runner is a real person; their finishing time is a true observation but an outlier in a distribution of marathon times.
- **Measurement errors.** A height recorded as 27 m for a person is almost certainly a typo.
- **Data-entry errors.** A salary listed as $-50{,}000 is almost certainly wrong.
- **Points from a different population.** A 6-year-old's height accidentally included in a sample of adults.

Outliers should be flagged, not silently dropped. The right response depends on context. If you suspect an error, investigate. If the outlier is real, decide whether to include it in summaries; mention it in the report.

**Describing categorical data.** Categorical distributions are summarized differently because the "shape" is just the relative size of categories.

- **Frequency table**: counts for each category.
- **Relative frequency table**: proportions or percentages.
- **Bar chart**: vertical bars whose heights show frequency. Bars are separated, because categories don't form a continuous scale.
- **Pie chart**: slices show proportion of total. Best for showing how parts make up a whole; awkward for comparing more than 5–6 categories.

**Describing quantitative data.** Quantitative distributions are summarized with graphs that show values on a number line.

- **Dotplot.** Each data point a dot above its value. Best for small data sets ($n < 50$ or so).
- **Stem-and-leaf plot (stemplot).** Each value split into a "stem" (leading digits) and a "leaf" (final digit). Preserves individual values while showing shape.
- **Histogram.** Groups data into bins of equal width; bar heights show frequency (or relative frequency) in each bin. Bars touch (continuous scale).
- **Cumulative frequency graph (ogive).** Plots cumulative counts up through each value. Useful for finding percentiles.
- **Boxplot (box-and-whisker plot).** Shows the five-number summary visually.

**Always pair the right summary with the right shape.**

- Symmetric, no outliers → report mean and standard deviation.
- Skewed or outliers → report median and IQR (more resistant to extreme values).

**Resistant vs sensitive measures.** A statistic is **resistant** if it isn't much affected by extreme values; **sensitive** if it is.

- **Mean: sensitive.** Adding one billion-dollar income to a sample changes the mean dramatically.
- **Median: resistant.** Adding one billion-dollar income changes the median by at most one rank position.
- **Standard deviation: sensitive.** Squaring deviations amplifies outliers.
- **IQR: resistant.** Only uses the middle 50%; outliers don't enter the calculation.
- **Range (max − min): extremely sensitive.** Defined entirely by extremes.

For skewed data, prefer resistant measures (median, IQR). For symmetric data, the choice is less critical.

**Why variation is fundamental.** Without variation, statistical inference would be unnecessary — one measurement would suffice. The reason we need samples, error bars, and probability is that the world is intrinsically variable. AP Stats teaches the language and tools for working productively with that variability rather than wishing it away.`,
      video: {
        url: 'https://www.youtube.com/watch?v=bPFNxD3Yg6U',
        title: 'CrashCourse Statistics — Mean, median, mode',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.3',
      title: 'Representing a categorical variable',
      content:
`Categorical variables are summarized by counting how often each category occurs. Tables and graphs make patterns clear and let you compare groups efficiently.

**Frequency table.** A two-column table: category and count.

Example: Eye color in a sample of 40 students.

| Eye color | Frequency |
|-----------|-----------|
| Brown     | 18        |
| Blue      | 12        |
| Green     | 6         |
| Other     | 4         |
| **Total** | **40**    |

**Relative frequency table.** Same data, expressed as proportions or percentages.

| Eye color | Frequency | Relative frequency |
|-----------|-----------|--------------------|
| Brown     | 18        | $0.45$ (45%)        |
| Blue      | 12        | $0.30$ (30%)        |
| Green     | 6         | $0.15$ (15%)        |
| Other     | 4         | $0.10$ (10%)        |
| **Total** | **40**    | **1.00** (100%)    |

Relative frequencies always sum to $1$ (or 100%). They make comparisons across data sets of different sizes possible — you can't compare raw counts of 200 to 50, but you can compare 45% to 60%.

**Bar chart.** Vertical bars whose heights show the frequency (or relative frequency) of each category.

- Bars are **separated** by gaps because categories don't form a continuous scale.
- The order of categories on the x-axis is arbitrary unless they have a natural order (small/medium/large), so you can choose an order that aids interpretation — e.g., sort by frequency.

**Pie chart.** A circle divided into slices whose areas (or central angles) represent proportions of the whole.

- Each slice's central angle: $\\theta = (\\text{relative frequency}) \\times 360°$.
- Use only when the data add up to a meaningful whole (100%) and the number of categories is small (typically $\\leq 6$).
- Often less effective than a bar chart at conveying exact comparisons — humans judge linear lengths better than slice areas — so the AP exam tends to recommend bar charts for serious comparison.

**Bar charts vs histograms.** Easy to confuse but distinct:

- **Bar chart**: categorical x-axis, bars separated by gaps. Heights show category frequency.
- **Histogram**: quantitative x-axis with continuous bins, bars touch. Heights show frequency in each bin.

**Two-way tables (contingency tables).** When you have two categorical variables, organize the data in a rectangular table.

Example: smoking status by sex in a sample of 100 students.

|              | Male | Female | **Total** |
|--------------|------|--------|-----------|
| Smoker       | 20   | 15     | **35**    |
| Non-smoker   | 30   | 35     | **65**    |
| **Total**    | **50** | **50** | **100**   |

**Marginal distribution**: the totals in the "margins" of the table (the row totals and column totals). They describe the single-variable distributions ignoring the other variable.

- Marginal distribution of smoking status: 35 smokers, 65 non-smokers.
- Marginal distribution of sex: 50 male, 50 female.

**Conditional distribution**: the distribution of one variable *within* a fixed category of the other.

- Smoking status, given male: $20/50 = 40\\%$ smokers, $30/50 = 60\\%$ non-smokers.
- Smoking status, given female: $15/50 = 30\\%$ smokers, $35/50 = 70\\%$ non-smokers.

Conditional distributions let you ask "does X depend on Y?" In the example, males in the sample are more likely to smoke (40% vs 30%) than females. Whether this is statistically significant — meaningful at the population level — is a Unit 8 question.

**Association vs independence.**

- **Association** (or dependence): the conditional distributions of one variable differ across categories of the other.
- **Independence**: the conditional distributions are the same across categories. Knowing the value of one variable gives no information about the other.

In the smoking example, the conditional distributions differ ($40\\%$ vs $30\\%$), so smoking status and sex are associated in this sample.

**Segmented bar charts** (also called "stacked bar charts"). Each category of one variable is a single bar, divided into segments showing the conditional distribution of the other variable. Useful for visualizing conditional distributions.

**Side-by-side bar charts.** Each category of one variable has multiple bars next to each other, one for each level of the second variable. Also useful for comparison.

**Common pitfalls.**

- **Mixing up frequency and relative frequency.** A bar chart of raw counts can mislead when group sizes differ. If one school has 200 students and another has 800, comparing raw counts of "passed AP exam" misses that the 800-student school had a much smaller passing *rate*. Use relative frequencies to compare.
- **Simpson's paradox.** When a trend appears in different groups of data but reverses when the groups are combined. Famous example: UC Berkeley admissions in 1973. Looking at overall admissions, women had a lower acceptance rate than men. Looking department-by-department, women had a higher acceptance rate in most departments. The combined trend reversed because women disproportionately applied to highly selective departments. Always think about whether a comparison should be made within subgroups, not just overall.
- **Choosing the wrong baseline for percentages.** A 50% increase in cancer risk sounds scary; if the baseline risk was 1 in 100,000, the new risk is 1.5 in 100,000 — still very small. Always think about the absolute numbers, not just the relative change.

**Practical use.** Categorical analysis dominates many real-world settings:

- **Public health.** Tracking disease incidence by region, age group, sex.
- **Marketing.** Customer segmentation, purchasing behavior by demographic.
- **Politics.** Vote shares by demographic, geographic, or economic groups.
- **Business operations.** Defect rates by manufacturing line, complaint types by product category.

The simple tools of frequency tables, conditional distributions, and bar charts are the entry point for nearly any real-world data analysis.`,
      video: {
        url: 'https://www.youtube.com/watch?v=2ll0lyqDdpU',
        title: 'CrashCourse Statistics — Categorical data',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.4',
      title: 'Representing a quantitative variable',
      content:
`Quantitative data — numerical measurements — gets summarized with graphs that show values along a number line. The choice of graph depends on the data size and what you want to highlight.

**Dotplot.** Each observation is a dot placed above its numerical value on a horizontal axis. Stack dots vertically when multiple observations share a value.

- Best for **small data sets** ($n < 50$).
- Preserves individual values exactly.
- Good for showing shape and outliers when the data is sparse.

Example: heights of 10 students in inches: 58, 62, 64, 65, 65, 67, 68, 70, 72, 75. Place a dot above each value; the 65-inch column gets two dots.

**Stem-and-leaf plot (stemplot).** Each value is split into a **stem** (leading digits) and a **leaf** (final digit). Stems run down a column; leaves trail to the right of their stem.

Example: scores 62, 65, 68, 71, 73, 73, 75, 78, 82, 85, 89, 92.

| Stem | Leaf |
|------|------|
| 6    | 2 5 8 |
| 7    | 1 3 3 5 8 |
| 8    | 2 5 9 |
| 9    | 2 |

Key: 6 | 2 means 62.

- Preserves individual values exactly.
- Shape is visible just by tilting your head.
- **Back-to-back stemplots** compare two groups with leaves extending in opposite directions from a shared stem.

**Histogram.** The workhorse graph for quantitative data. Groups data into bins of equal width; bars (one per bin) have heights showing frequency (or relative frequency) in that bin. Bars **touch** (no gaps) because the variable is continuous.

Choices that affect the picture:

- **Bin width**: too few bins (wide bins) hide detail; too many bins (narrow bins) produce a noisy graph. A standard rule of thumb is $\\sqrt{n}$ bins, but feel free to adjust based on what reveals patterns. Calculator defaults are often a good starting point.
- **Bin boundaries**: a bin labeled "60–70" by convention includes 60 but not 70 (so 70 belongs to "70–80"). Watch the convention.

The histogram is the single best tool for assessing shape (symmetry, skewness, modality, outliers) at a glance.

**Cumulative frequency graph (ogive).** Plot cumulative frequency on the y-axis against value on the x-axis. The graph rises from 0 at the lowest value to the total count (or 1, for relative frequency) at the highest value.

Useful for:

- Reading percentiles directly. To find the 75th percentile, find where the curve crosses 0.75 on the y-axis and read off the x-value.
- Showing that a distribution is symmetric (the ogive has rotational symmetry around the median).

**Boxplot (box-and-whisker plot).** Shows the **five-number summary**: minimum, $Q_1$ (first quartile), median, $Q_3$ (third quartile), maximum.

Construction:

- A box from $Q_1$ to $Q_3$ (the middle 50% of data).
- A line through the box at the median.
- "Whiskers" extending from the box to the smallest and largest values that aren't outliers.
- **Outliers shown as separate points** beyond the whiskers.

The standard **outlier rule** (also called the 1.5×IQR rule): a value is an outlier if it falls outside the **fences**.

- **Lower fence**: $Q_1 - 1.5 \\times IQR$
- **Upper fence**: $Q_3 + 1.5 \\times IQR$

where $IQR = Q_3 - Q_1$ is the **interquartile range**.

**What boxplots show well.**

- Center (the median line).
- Spread (the box width = IQR).
- Skewness (asymmetric box halves or asymmetric whiskers).
- Outliers (as separate dots).

**What boxplots hide.**

- Shape within quartiles. A boxplot can't distinguish a uniform distribution from a normal one if the quartiles match.
- Number of observations.
- Multimodality. A bimodal distribution can look just like a uniform one in a boxplot.

For these reasons, the AP exam likes pairing boxplots with histograms — different graphs reveal different features.

**Parallel boxplots.** Stack multiple boxplots one above another (or side by side) on the same scale. Best graph for comparing distributions across groups. A common AP free-response prompt: "compare the distributions" with parallel boxplots provided.

**Time series plots.** When data has a time order, plot values against time and connect with lines. Useful for detecting trends, seasonality, and change points. Not a primary descriptive tool for Unit 1, but you should recognize when time matters.

**Choosing the right graph.**

| Goal | Best graph |
|------|-----------|
| Show overall shape | histogram |
| Compare distributions across groups | parallel boxplots |
| Small data, show individual values | dotplot or stemplot |
| Show changes over time | time series plot |
| Find percentiles | ogive |
| Show categorical breakdown of a whole | bar chart (or pie if few categories) |

**Common pitfalls.**

- **Skewing the impression by axis choice.** Truncating the y-axis (starting at 90 instead of 0) makes small differences look large. The AP exam expects honest scaling.
- **Wrong bin widths in histograms.** Unequal bin widths produce misleading bar heights; stick with equal widths unless you're plotting densities.
- **Forgetting outliers.** A summary that ignores outliers can be wildly off. Always look at a graph alongside numerical summaries.
- **Reading too much into small differences.** Two samples will always differ a little by chance; small differences in summary statistics may not represent any real difference in populations (the subject of Units 7–9).`,
      video: {
        url: 'https://www.youtube.com/watch?v=B7XoW2qiFUA',
        title: 'CrashCourse Statistics — Plots and dotplots',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.5',
      title: 'Describing distributions of quantitative variables',
      content:
`Once you can graph a distribution, the next skill is describing it in words and numbers. The AP exam tests this constantly — a typical free-response prompt is "describe the distribution shown" or "compare the distributions of $X$ between the two groups." The grading is explicit: address each component, be specific, support claims with numbers.

**SOCS — the four-part checklist.**

Whenever you describe a distribution, address each of:

- **Shape**
- **Outliers** (or unusual features)
- **Center**
- **Spread**

Skip any one and you lose points. Be **specific**: not "the distribution has some spread," but "the spread is wide, with IQR $= 35$ minutes."

**Shape.** Describe what the histogram or dotplot looks like.

- "Roughly symmetric" — left and right halves are mirror images.
- "Right-skewed" / "skewed to the right" — long tail on the right.
- "Left-skewed" / "skewed to the left" — long tail on the left.
- "Unimodal" — single peak.
- "Bimodal" — two distinct peaks.
- "Uniform" — roughly flat across the range.

**Outliers and unusual features.** Identify values that fall far from the rest. Also note:

- **Gaps** in the data (regions of values that don't occur).
- **Clusters** (groups of values bunched together).
- **Multiple modes** that might suggest mixed populations.

**Center.** Where is the typical value?

- **Mean ($\\bar{x}$)**: arithmetic average. $\\bar{x} = \\dfrac{\\sum x}{n}$.
- **Median**: middle value when sorted. For $n$ odd, the middle position. For $n$ even, the average of the two middle values.

For symmetric data, mean $\\approx$ median. For skewed data:

- Right-skewed: mean > median (mean pulled right by the high tail).
- Left-skewed: mean < median (mean pulled left by the low tail).

**Spread.** How variable is the data?

- **Range** = max − min. Sensitive to outliers; use sparingly.
- **IQR** ($Q_3 - Q_1$) = width of the middle 50%. **Resistant** to outliers.
- **Standard deviation ($s$)** = typical distance from the mean. **Sensitive** to outliers.

**Pairing center with spread.** Always pair the right center with the right spread:

- **Symmetric, no outliers**: report **mean and standard deviation**. These work well together when the data is well-behaved.
- **Skewed or has outliers**: report **median and IQR**. Both resistant; better reflect "typical" behavior when extreme values would distort the picture.

A common AP mistake is reporting mean with IQR or median with standard deviation. Stick with the matching pair.

**Mean.** $\\bar{x} = \\dfrac{1}{n} \\sum_{i=1}^{n} x_i = \\dfrac{x_1 + x_2 + \\cdots + x_n}{n}$.

**Median.** Sort the data; pick the middle. For $n = 7$: 5th-smallest is the 4th value (the middle one). For $n = 8$: average the 4th and 5th values.

**Quartiles.**

- $Q_1$ = median of the lower half of the sorted data.
- $Q_3$ = median of the upper half.
- Including or excluding the overall median in these "halves" varies by convention; the AP convention is to *exclude* the overall median if $n$ is odd.

**Standard deviation.**

$$s \\,=\\, \\sqrt{\\dfrac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}$$

In English: take each value's deviation from the mean, square it, average those squared deviations (dividing by $n - 1$, not $n$), then take the square root.

The "$n-1$" is **Bessel's correction**. It makes the sample variance an unbiased estimator of the population variance. The intuition is that when you compute deviations from $\\bar{x}$ rather than from the unknown true population mean $\\mu$, you slightly underestimate the variance; dividing by $n-1$ rather than $n$ corrects for this.

**Standard deviation is in the same units as the data.** Heights in inches → standard deviation in inches. This is one of its advantages over variance ($s^2$), which is in squared units (inches squared) and harder to interpret.

**Worked example.** Five test scores: 70, 75, 80, 85, 90.

- Mean: $\\bar{x} = (70 + 75 + 80 + 85 + 90)/5 = 400/5 = 80$.
- Deviations: $-10, -5, 0, 5, 10$. Squared: $100, 25, 0, 25, 100$. Sum = $250$.
- Variance: $s^2 = 250/(5-1) = 62.5$.
- Standard deviation: $s = \\sqrt{62.5} \\approx 7.91$.

**Properties of mean and standard deviation under linear transformations.** If you add a constant $c$ to every value:

- Mean: increases by $c$.
- Standard deviation: unchanged.

If you multiply every value by a constant $a$:

- Mean: multiplied by $a$.
- Standard deviation: multiplied by $|a|$.

Useful for unit conversions. If a data set has $\\bar{x} = 100$ °F, $s = 5$ °F, and you convert to Celsius ($C = (F - 32) \\times 5/9$): new mean = $(100 - 32)(5/9) = 37.78$ °C; new SD = $5 \\times (5/9) = 2.78$ °C.

**Comparing distributions.** When describing two or more groups, compare each SOCS element explicitly.

Bad: "The two groups differ."

Good: "Group A has a higher median (52) than Group B (47). Group A is more spread (IQR = 20 vs IQR = 12 for Group B). Both distributions are roughly symmetric. Group B has two high outliers above 100."

**Cell-by-cell:** Shape comparison, then outlier comparison, then center comparison with specific numbers, then spread comparison with specific numbers.

**Robustness vs efficiency.** Why isn't median always preferred over mean? Two reasons:

1. **Mathematical convenience.** The mean has many nice algebraic properties (e.g., the mean of sums equals the sum of means). The median doesn't.
2. **Statistical efficiency.** When data really is from a symmetric distribution with no outliers, the mean is a better estimator of the center than the median (smaller variance from sample to sample). For symmetric data, the trade-off favors the mean.

The rule of thumb — use mean for symmetric data, median for skewed — captures the right trade-off in most situations.

**Final note: a sample's distribution is a fact about the sample, not the population.** When you describe a histogram, you're describing what *that* data set looks like. To say something about the population from which the sample came requires the inferential methods of later units.`,
      video: {
        url: 'https://www.youtube.com/watch?v=mk8tOD0t8M0',
        title: 'CrashCourse Statistics — Measures of spread',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.6',
      title: 'Summary statistics for quantitative variables',
      content:
`Summary statistics condense a distribution into a few numbers. Choose the right summaries and you can communicate almost everything important about a distribution without ever showing the underlying data.

**Five-number summary.** Five numbers that capture the shape:

- Minimum
- $Q_1$ (first quartile, 25th percentile)
- Median (50th percentile)
- $Q_3$ (third quartile, 75th percentile)
- Maximum

These five numbers feed directly into a boxplot.

**Percentiles.** A value's percentile is the percentage of the data at or below it.

- $50$th percentile = median.
- $25$th percentile = $Q_1$.
- $75$th percentile = $Q_3$.
- $90$th percentile = value below which 90% of the data falls.

Percentile is a relative measure — your percentile depends on the comparison group. A child's height at the 90th percentile means the child is taller than 90% of children of that age and sex.

**Mean.** $\\bar{x} = \\dfrac{1}{n} \\sum_{i=1}^{n} x_i$.

**Variance.** $s^2 = \\dfrac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2$.

**Standard deviation.** $s = \\sqrt{s^2}$. Same units as the data.

**Why divide by $n - 1$?** Bessel's correction. When you use $\\bar{x}$ in place of the unknown $\\mu$ (the true population mean), you slightly underestimate the population variance, because $\\bar{x}$ is itself drawn from the same data. Dividing by $n-1$ rather than $n$ corrects for this bias. The detailed argument is in Unit 5.

**Properties of $\\bar{x}$ and $s$.**

- $\\sum (x_i - \\bar{x}) = 0$ always — deviations from the mean cancel out.
- $\\bar{x}$ minimizes $\\sum (x_i - c)^2$ over choices of $c$. The mean is the "least-squares" center.
- The median minimizes $\\sum |x_i - c|$ — the sum of absolute deviations.

**Range.** $\\text{Range} = \\max - \\min$. Extremely simple but extremely sensitive to outliers. Use as a quick check, not as your primary spread measure.

**Interquartile range (IQR).** $IQR = Q_3 - Q_1$. The width of the middle 50%. Resistant to outliers (uses only the middle of the data).

**Outlier rule.** A value $x$ is an outlier if:

- $x < Q_1 - 1.5 \\times IQR$, **OR**
- $x > Q_3 + 1.5 \\times IQR$.

The fence values $Q_1 - 1.5 \\times IQR$ and $Q_3 + 1.5 \\times IQR$ are the **lower and upper fences**.

**Worked example.** Data with $Q_1 = 20$, $Q_3 = 35$, so $IQR = 15$.

- Lower fence: $20 - 1.5 \\times 15 = 20 - 22.5 = -2.5$.
- Upper fence: $35 + 1.5 \\times 15 = 35 + 22.5 = 57.5$.

Any value below $-2.5$ or above $57.5$ is an outlier. If the data is times in minutes, then $-2.5$ is impossible, so only the upper fence applies — values above 57.5 minutes are outliers.

**Z-scores (standardized scores).**

$$z \\,=\\, \\dfrac{x - \\bar{x}}{s}$$

A z-score tells you **how many standard deviations** a value is above or below the mean.

- $z = 0$: value equals the mean.
- $z = +1$: one standard deviation above the mean.
- $z = -2$: two standard deviations below the mean.
- $z = +3$: three SDs above; rare.

Z-scores let you compare values from different distributions on a common scale. A 10-mile-per-hour fastball is below average for an MLB pitcher but blindingly fast for a Little League pitcher; the same speed has a wildly different z-score in each context.

**The empirical rule (68–95–99.7).** For roughly bell-shaped (normal) distributions:

- About **68%** of data within $\\mu \\pm \\sigma$ (1 SD of the mean).
- About **95%** within $\\mu \\pm 2\\sigma$ (2 SDs).
- About **99.7%** within $\\mu \\pm 3\\sigma$ (3 SDs).

These are approximate but extremely useful. If a histogram looks roughly bell-shaped, the empirical rule lets you estimate proportions and percentiles quickly without a table.

**Worked example.** SAT scores are roughly $N(\\mu = 1050, \\sigma = 200)$.

- About 68% of scores are between 850 and 1250 (one SD).
- About 95% between 650 and 1450 (two SDs).
- About 99.7% between 450 and 1650 (three SDs).
- A score of 1450 is at the 97.5th percentile (top 2.5%).

**Effect of transformations on summary statistics.**

If $Y = a + bX$ (linear transformation), then:

- $\\bar{y} = a + b\\bar{x}$
- $s_Y = |b| \\cdot s_X$
- Median$(Y) = a + b \\cdot \\text{Median}(X)$ if $b > 0$
- $IQR(Y) = |b| \\cdot IQR(X)$
- Z-scores **unchanged** (because both the value and the standard deviation transform together).

The fact that z-scores are unchanged by linear transformation is important — it's why "two standard deviations above the mean" is a meaningful description regardless of units.

**Effect of removing or adding values.**

- Removing an outlier: mean usually moves toward the bulk of the data; standard deviation decreases noticeably. Median and IQR change only slightly.
- Adding a duplicate at the median: mean might shift, but median is unchanged.

**Robust vs non-robust summaries — recap.**

| Summary | Robust to outliers? |
|---------|---------------------|
| Mean | Sensitive |
| Median | Resistant |
| Standard deviation | Sensitive |
| IQR | Resistant |
| Range | Extremely sensitive |
| Five-number summary | Median, $Q_1$, $Q_3$ resistant; min and max sensitive |

**Practical tip.** Calculators like the TI-84 give you 1-Var Stats (mean, SD, five-number summary) in one command. Get fluent with it — it'll save you on every AP problem.`,
      video: {
        url: 'https://www.youtube.com/watch?v=mk8tOD0t8M0',
        title: 'CrashCourse Statistics — Standard deviation',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.7',
      title: 'Graphical representations of summary statistics',
      content:
`The boxplot is the standard graphical summary built from the five-number summary. It packs a lot of information into a small space and is especially good for comparing distributions across groups.

**Boxplot construction.**

1. Draw a box from $Q_1$ to $Q_3$. The box contains the middle 50% of the data.
2. Draw a line through the box at the median.
3. Identify outliers using the 1.5×IQR rule.
4. Extend "whiskers" from each end of the box to the most extreme value that is *not* an outlier.
5. Plot outliers as individual points.

The resulting picture shows the location of $Q_1$, median, $Q_3$, the minimum non-outlier value, the maximum non-outlier value, and any outliers — all on one number line.

**What the boxplot reveals.**

- **Center**: position of the median line.
- **Spread**: width of the box (IQR); total span including whiskers.
- **Skewness**: asymmetry. If the median is closer to $Q_1$ than to $Q_3$ (box is "lopsided to the left"), the distribution is right-skewed. If the upper whisker is much longer than the lower whisker, again right-skewed. The reverse pattern indicates left-skewness.
- **Outliers**: shown as separate points, immediately obvious.

**What the boxplot hides.**

- **Distribution shape inside the quartiles.** A uniform distribution and a bell-shaped distribution can have the same five-number summary and look identical as boxplots, even though their histograms look very different.
- **Modality.** A boxplot cannot reveal bimodality. A bimodal distribution and a unimodal one with the same median and IQR can produce identical boxplots.
- **Sample size.** Without an annotation, you can't tell whether the boxplot summarizes 50 data points or 5000.

For these reasons, pair boxplots with histograms when you can. The two graphs answer different questions.

**Parallel boxplots.** When comparing distributions across groups, stack boxplots side-by-side or one above another on the same scale. This is the AP exam's preferred graph for distribution comparisons.

Example: comparing test scores from three classes. Three boxplots on the same number line let you quickly see whose median is highest, whose IQR is widest, and where outliers occur.

**Modified boxplot (the standard for AP).** Whiskers extend only to the most extreme non-outlier values; outliers shown as individual points. This is the convention you should follow unless explicitly told otherwise.

**Side-by-side boxplots for AP free-response.** When asked to compare distributions:

1. Address Shape (and unusual features like skewness, multiple modes, gaps).
2. Address Outliers (which groups have them, where).
3. Address Center (use specific medians).
4. Address Spread (use specific IQRs).

The grading rubric explicitly looks for each component. Don't just say "Group A is bigger" — say "Group A has a higher median (52 minutes) than Group B (47 minutes)."

**Histograms and boxplots together.** A histogram shows shape and reveals details that boxplots hide. A boxplot is more compact and better for side-by-side comparisons. Often the AP gives you both.

**Stem-and-leaf plots.** Worth remembering as another graph that preserves individual values while showing shape. Useful for small data sets where you want to retain every observation.

**Cumulative frequency graphs (ogives).** Useful when you need to find percentiles graphically. Plot cumulative frequency (or relative frequency) on the y-axis against value on the x-axis. The curve goes from 0 at the left to total $n$ (or 1.0 for relative frequency) at the right. Find the 30th percentile by drawing a horizontal line at 0.30 and reading the x-value where it crosses the curve.

**Comparing graph types.**

| Graph | Strength | Weakness |
|-------|----------|----------|
| Dotplot | Shows individual values | Bad for large data |
| Stemplot | Shows individual values; reveals shape | Awkward for very large data |
| Histogram | Shows shape clearly | Less precise; bin choice matters |
| Boxplot | Compact; great for comparison | Hides shape inside quartiles |
| Ogive | Easy percentile reading | Hard to read shape |
| Bar chart | Categorical | Not for quantitative |
| Time-series plot | Reveals trends | Only when time matters |

**Common AP exam pitfalls with graphs.**

- **Mislabeling axes.** Always label axes with what's being measured *and* units.
- **Wrong graph for the data type.** Pie charts for quantitative data, histograms with bars separated by gaps, boxplots with rectangular boxes drawn upward — all standard mistakes that lose points.
- **Forgetting to identify outliers.** Always compute the fences before drawing the boxplot.
- **Vague comparisons.** "Group A is more spread out" without giving an IQR or SD number.
- **Treating two-variable categorical questions as if they were one-variable.** A bar chart of "smokers by sex" with stacked or grouped bars conveys conditional and marginal distributions, not just frequencies.

**A real-world example of why graph choice matters.** Suppose hourly wages at two companies have the same median ($25) and same IQR ($10). A boxplot would look identical. But Company A might be bimodal — most workers near $20 and a smaller cluster near $50 (managers and warehouse workers, distinct populations). Company B might be unimodal — most workers around $25 with a gradual fall-off on both sides. The histograms would show this; the boxplots would hide it. Diagnostic decisions (where to focus retention efforts, whether to merge departments, how to set raises) depend on which picture is right.

**Computational tools.** Calculators and software produce these graphs quickly. The TI-84 has built-in commands for histograms and boxplots. AP exam usually gives you graphs to interpret, not asks you to draw them perfectly by hand, but you should be ready to draw a modified boxplot if asked.`,
      video: {
        url: 'https://www.youtube.com/watch?v=09kiX3p5Vek',
        title: 'CrashCourse Statistics — Boxplots',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.8',
      title: 'Comparing distributions of a quantitative variable',
      content:
`Comparing distributions across groups is one of the most common tasks in applied statistics. It's also the most common AP free-response prompt in Unit 1: "compare these two distributions" or "what do these parallel boxplots show?" The grading is explicit and rule-based — the key is being thorough and specific.

**The comparison checklist.** When comparing distributions, address each of these:

1. **Shape** — describe each group's shape.
2. **Outliers** — note which groups have outliers, where.
3. **Center** — compare with specific numbers.
4. **Spread** — compare with specific numbers.
5. **Conclusion** — what does the comparison say about the underlying question?

Skip any one and you lose points. Make all comparisons **specific** (with numbers), not vague.

**Bad vs good comparisons.**

Bad: "Group A is higher."
Good: "Group A has a higher median (52 minutes) than Group B (47 minutes)."

Bad: "They have different spreads."
Good: "Group A has IQR 20 minutes, while Group B has IQR 12 minutes, so Group A is about 67% more spread out by IQR."

Bad: "Group A is skewed."
Good: "Group A is right-skewed (the upper whisker is much longer than the lower), while Group B is roughly symmetric."

**Use parallel boxplots whenever possible.** They're the AP exam's standard tool for comparison. Make sure both boxplots use the same scale; otherwise the visual comparison is misleading.

**Use histograms for shape detail.** When the question hinges on shape — modality, gaps, clusters — histograms beat boxplots. Side-by-side histograms (same scale) are useful, though they take more space than parallel boxplots.

**Comparing centers — choose mean or median based on shape.**

- If both distributions are symmetric and unimodal, you can compare means.
- If either is skewed or has outliers, compare medians instead.
- Be consistent: don't compare Group A's mean to Group B's median.

**Comparing spreads — match the center choice.**

- If you used means, use standard deviations.
- If you used medians, use IQRs.

**Common phrases for free-response writing.**

- "Group A has a higher median ($X$) than Group B ($Y$)."
- "Group A's IQR ($X$) is greater than Group B's IQR ($Y$), so Group A is more variable."
- "Group A is roughly symmetric. Group B is right-skewed."
- "Group B has two high outliers above 100 minutes."
- "Both distributions are unimodal and similar in shape."
- "The medians are similar, but Group A's range is much larger because of two outliers."

**Watch out for misleading comparisons.**

- **Different sample sizes.** When samples differ in size, use proportions or means rather than raw counts. A "frequency" comparison can give wrong impressions if one sample is much larger.
- **Different scales.** Always make sure axes are comparable. A histogram with y-axis up to 50 looks "smaller" than one with y-axis up to 5,000, even if the underlying densities are similar.
- **Outliers distorting comparisons.** Outliers pull the mean. If one group has a strong outlier, the means might differ a lot even though "typical" group members are very similar. Medians and IQRs are robust to this.
- **Confounders.** Two groups might differ in some background variable that explains the apparent difference. A sample of cancer patients has older average age than a healthy sample; comparing "cancer drug effectiveness" between the two samples is misleading unless age is controlled for. The Unit 3 material on experiments and observational studies addresses this directly.

**Worked example.** A high-school principal wants to compare math test scores between her school's freshmen and sophomores. The data:

- Freshmen: median 75, IQR 18, slightly right-skewed.
- Sophomores: median 82, IQR 12, roughly symmetric.

A good comparison: "The sophomores have a higher median score (82 vs 75 for freshmen). The sophomores' scores are also less variable (IQR 12 vs 18). The freshmen's distribution is slightly right-skewed, while the sophomores' is roughly symmetric. Both findings — higher median, smaller IQR — suggest that the math program is improving outcomes over time, though this single comparison doesn't establish causation; the freshmen and sophomores differ in many ways besides age."

That last sentence — the cautious conclusion — wins points on the AP.

**Comparing more than two groups.** The same principles apply. Use parallel boxplots if there are multiple groups. Compare them pairwise or comment on the overall pattern.

- "All four classes have medians between 60 and 70. Class 3 has the widest IQR (22) and Class 1 has the narrowest (8). Classes 1 and 2 are roughly symmetric; Classes 3 and 4 are right-skewed."

**Formal inferential comparison.** This unit is descriptive only. To decide whether the differences you describe are *real* in the population — not just sampling noise — requires the methods of Units 7–9 (confidence intervals and hypothesis tests for differences in means or proportions). For now, just describe what you see in the data.

**A note on framing.** When the AP exam shows you two distributions and asks you to compare, it's testing whether you can produce a complete, specific, organized description. The numbers, statistics, and graphs are the inputs; your writing is the output. Practice the comparison vocabulary out loud. By exam day, you should be able to look at parallel boxplots and produce a SOCS-driven, specific comparison without thinking about the format.`,
      video: {
        url: 'https://www.youtube.com/watch?v=09kiX3p5Vek',
        title: 'CrashCourse Statistics — Comparing distributions',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.9',
      title: 'The normal distribution',
      content:
`The **normal distribution** (also called the Gaussian distribution or the bell curve) is the most important distribution in statistics. It shows up everywhere — in heights, blood pressure, IQ, test scores, measurement errors, manufacturing tolerances, and most importantly, in sampling distributions of statistics (Unit 5). Understanding it deeply is one of the highest-leverage things you'll learn in this course.

**Shape.** A normal distribution is symmetric, unimodal, and bell-shaped. The exact mathematical form is:

$$f(x) \\,=\\, \\dfrac{1}{\\sigma\\sqrt{2\\pi}}\\,\\exp\\!\\left(-\\dfrac{(x - \\mu)^2}{2\\sigma^2}\\right)$$

You don't need to memorize the formula. The key facts: every normal distribution is fully specified by its mean $\\mu$ (which is also its median and mode, since it's symmetric) and its standard deviation $\\sigma$. The notation $N(\\mu, \\sigma)$ means "normal with mean $\\mu$ and standard deviation $\\sigma$."

**The standard normal distribution.** $N(0, 1)$ — mean 0, standard deviation 1. The standard reference. Any other normal distribution can be standardized into this one by computing z-scores.

**Density curve.** Unlike a histogram with discrete bars, a normal distribution is a continuous curve. The total area under the curve is exactly 1. The area between two values gives the proportion of the distribution in that range — or equivalently, the probability of drawing a value in that range.

**Standardizing — convert any normal value to a z-score.**

$$z \\,=\\, \\dfrac{x - \\mu}{\\sigma}$$

Once you have $z$, you look up probabilities in a standard normal table or compute them with a calculator's normalcdf function. Standardizing reduces every normal problem to a single lookup.

**The empirical rule (68-95-99.7).** For any normal distribution:

- About **68%** of values fall within $\\mu \\pm \\sigma$ (within 1 SD of the mean).
- About **95%** within $\\mu \\pm 2\\sigma$.
- About **99.7%** within $\\mu \\pm 3\\sigma$.

These percentages are exact only for the true normal distribution; for real-world data, they're approximations. They're useful for back-of-envelope estimates and as a sanity check.

**Worked example.** SAT scores are roughly $N(1050, 200)$. What percent of test-takers score above 1300?

- $z = (1300 - 1050)/200 = 1.25$.
- Look up $P(Z > 1.25)$ in a standard normal table (or use a calculator's normalcdf(1.25, $\\infty$)): $\\approx 0.1056$.
- About 10.56% of test-takers score above 1300.

**Reverse calculation — find the value at a given percentile.** What SAT score is at the 90th percentile?

- Find the z-score with $P(Z < z) = 0.90$: using invNorm(0.90), get $z \\approx 1.282$.
- Convert back to the original scale: $x = \\mu + z\\sigma = 1050 + 1.282 \\times 200 \\approx 1306$.
- About a score of 1306 is at the 90th percentile.

**Why the normal distribution is everywhere.**

- **Sums and averages of many small effects tend to be normal.** Central Limit Theorem (Unit 5). Heights are influenced by hundreds of genes plus environmental factors; the *sum* of all those small effects approximately follows a normal distribution. The same logic applies to blood pressure, exam scores summed over many problems, and many other quantities built from many small contributions.
- **Measurement errors** are often roughly normal — measurement variability is the sum of many small disturbances.
- **Sampling distributions of means and proportions** are approximately normal for reasonably large sample sizes, regardless of the original population's distribution. This is the central insight that makes inferential statistics work.
- **Manufacturing tolerances** are typically normal — a machine's output is the result of many small variations in materials, temperatures, settings.

**Checking whether data is normal.**

- **Histogram.** Should look bell-shaped, symmetric, unimodal.
- **Boxplot.** Should be symmetric (median in center of box; whiskers roughly equal); minimal outliers.
- **Empirical rule check.** Roughly 68% within 1 SD; 95% within 2; 99.7% within 3.
- **Normal probability plot (Q-Q plot).** Quantiles of the data plotted against quantiles of a standard normal. If the data is normal, the plot is approximately a straight line. Deviations from straight indicate departures from normality — curving indicates skewness; S-shaped curves indicate heavy or light tails.

**Real-world examples of approximately normal distributions.**

- **Heights of adult humans.** Within a sex, height is very close to normal. Adult US males: $\\mu \\approx 70$ inches, $\\sigma \\approx 3$ inches.
- **Birth weights.** Roughly normal among full-term births.
- **IQ scores.** By construction — designed to be normal with $\\mu = 100$, $\\sigma = 15$.
- **SAT and ACT scores.** Roughly normal.
- **Body temperature, blood pressure, heart rate.** Roughly normal within healthy populations.

**Real-world examples of distinctly non-normal distributions.**

- **Income.** Strongly right-skewed (long tail of high earners). Mean is much higher than median.
- **House prices.** Strongly right-skewed.
- **Reaction times in psychology experiments.** Right-skewed (a lower bound near 0; long tail of slow responses).
- **Counts of rare events** (lightning strikes, defects). Often follow Poisson or other discrete distributions, not normal.
- **Anything bounded** strongly enough — e.g., proportions near 0 or 1 — can't be normal at the boundary.

When data is not normal, you have several options: transform it (e.g., take logarithms for skewed positive data), use non-parametric methods (which don't assume normality), or use the Central Limit Theorem (sample-level inference can still work because $\\bar{x}$ is approximately normal even when individual $X$ isn't).

**Z-scores and percentiles for non-normal data.** Z-scores still describe how many SDs a value is from the mean, even for non-normal data. But the empirical rule (68-95-99.7) only applies to normal distributions. For non-normal data, Chebyshev's inequality gives weaker but always-valid bounds: at least $1 - 1/k^2$ of any distribution lies within $k$ SDs of the mean. (So at least 75% within 2 SDs, at least 89% within 3 SDs — for any distribution.)

**Why this preview matters.** Most of the inferential statistics in Units 6–9 builds on the normal distribution. Confidence intervals use $z^*$ values from the standard normal. Hypothesis tests use z- or t-statistics. The "rejection region" for a one-tailed test at 95% confidence is "above $z = 1.645$." Mastery of the normal distribution makes all this easy.

**Quick reference values.**

- $z = 1.282$ → 90th percentile (top 10%).
- $z = 1.645$ → 95th percentile (top 5%).
- $z = 1.96$ → 97.5th percentile (top 2.5%).
- $z = 2.326$ → 99th percentile (top 1%).

These four z-values appear constantly throughout the course. Memorize at least $1.645$ and $1.96$ — they're the basis of 90% and 95% confidence intervals.`,
      video: {
        url: 'https://www.youtube.com/watch?v=rzFX5NWojp0',
        title: 'CrashCourse Statistics — The normal distribution',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Categorical vs quantitative data. Discrete vs continuous quantitative.',
    'Population (parameter: $\\mu$, $\\sigma$, $p$) vs sample (statistic: $\\bar{x}$, $s$, $\\hat{p}$). Inference goes from sample to population.',
    'Always describe distributions with SOCS: Shape, Outliers, Center, Spread.',
    'Mean is sensitive to outliers; median is resistant. IQR is resistant; standard deviation is sensitive.',
    'Pair mean with SD (for symmetric data) or median with IQR (for skewed data).',
    'Five-number summary: min, $Q_1$, median, $Q_3$, max. Drives boxplots.',
    'Outlier rule (1.5 $\\times$ IQR): $x < Q_1 - 1.5 \\cdot IQR$ or $x > Q_3 + 1.5 \\cdot IQR$.',
    'Z-score: $z = (x - \\bar{x})/s$. How many SDs from the mean.',
    'Empirical rule (68-95-99.7) applies to normal distributions: 68% within 1 SD, 95% within 2, 99.7% within 3.',
    'Parallel boxplots are the preferred graph for comparing distributions.',
    'Comparisons must be specific (with numbers) and address all SOCS components.',
    'Standardizing converts any normal value to a z-score, allowing one-table lookups.',
  ],
  formulas: [
    {
      name: 'Mean',
      equation: '$\\bar{x} = \\dfrac{1}{n}\\sum_{i=1}^{n} x_i$',
      meaning: 'Arithmetic average. Sensitive to outliers but mathematically convenient.',
      example: 'Data: 2, 4, 6, 8, 10. $\\bar{x} = 30/5 = 6$.',
    },
    {
      name: 'Sample standard deviation',
      equation: '$s = \\sqrt{\\dfrac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}$',
      meaning: 'Typical distance from mean. The $n - 1$ (Bessel\'s correction) makes $s^2$ an unbiased estimate of $\\sigma^2$.',
      example: 'Data 2, 4, 6, 8, 10: deviations $-4, -2, 0, 2, 4$; squares 16, 4, 0, 4, 16; sum 40; $s^2 = 40/4 = 10$; $s = \\sqrt{10} \\approx 3.16$.',
    },
    {
      name: 'Z-score',
      equation: '$z = \\dfrac{x - \\bar{x}}{s}$ (sample) or $z = \\dfrac{x - \\mu}{\\sigma}$ (population)',
      meaning: 'Standardized score. Number of SDs above or below the mean. Lets you compare values across distributions.',
      example: 'SAT 1300, $\\mu = 1050$, $\\sigma = 200$: $z = 250/200 = 1.25$. About the 89th percentile.',
    },
    {
      name: 'IQR and outlier fences',
      equation: '$IQR = Q_3 - Q_1$; fences at $Q_1 - 1.5\\,IQR$ and $Q_3 + 1.5\\,IQR$',
      meaning: 'Middle 50% spread; outliers fall outside the fences.',
      example: '$Q_1 = 20$, $Q_3 = 35$: $IQR = 15$; lower fence $-2.5$, upper fence $57.5$. Values above 57.5 are outliers.',
    },
    {
      name: 'Empirical rule',
      equation: '$P(\\mu - \\sigma < X < \\mu + \\sigma) \\approx 0.68$',
      meaning: 'For normal distributions: 68% within 1 SD, 95% within 2 SD, 99.7% within 3 SD.',
      example: 'Heights with $\\mu = 70, \\sigma = 3$ inches: about 68% of men are between 67 and 73 inches tall.',
    },
  ],
  practice: [
    {
      q: 'A data set has mean 50, median 45, and SD 10. What can you say about its shape?',
      a: 'Right-skewed. The mean ($50$) is greater than the median ($45$), which happens when the data has a longer right tail. Some unusually high values are pulling the mean to the right of the median.',
    },
    {
      q: 'For a normal distribution with $\\mu = 100$, $\\sigma = 15$: what percent of values are above 130?',
      a: '$z = (130 - 100)/15 = 2$. The empirical rule says about 95% of values lie within $\\pm 2$ SDs, so 5% are outside that range; by symmetry, 2.5% are above $z = 2$. About 2.5% of values exceed 130.',
    },
    {
      q: 'Find outliers using the 1.5 $\\times$ IQR rule in a data set with $Q_1 = 20$, $Q_3 = 35$: values 5, 8, 15, 25, 30, 60.',
      a: '$IQR = 15$. Lower fence: $20 - 22.5 = -2.5$. Upper fence: $35 + 22.5 = 57.5$. Of the listed values, only 60 is above the upper fence and is an outlier. The values 5 and 8 are not outliers — they\'re below $Q_1$ but above the lower fence.',
    },
    {
      q: 'Compare these two distributions: Group A median 75, IQR 18, right-skewed; Group B median 82, IQR 12, symmetric.',
      a: 'Group B has a higher median (82 vs 75 for Group A). Group A is more spread (IQR 18 vs 12). Group A is right-skewed; Group B is roughly symmetric. Overall, Group B\'s typical value is higher and more consistent.',
    },
    {
      q: 'Convert this data set to z-scores: $\\bar{x} = 50$, $s = 10$. Values: 30, 50, 70.',
      a: '$z_{30} = (30 - 50)/10 = -2$. $z_{50} = 0$. $z_{70} = +2$. So 30 is 2 SDs below the mean; 50 is at the mean; 70 is 2 SDs above.',
    },
    {
      q: 'An SAT score of 1400 corresponds to what percentile, given scores are $N(1050, 200)$?',
      a: '$z = (1400 - 1050)/200 = 1.75$. From the standard normal table, $P(Z < 1.75) \\approx 0.9599$. So 1400 is at about the 96th percentile.',
    },
  ],
  pitfalls: [
    '"Mean equals median for all distributions" — wrong. Equal for symmetric distributions; mean is pulled toward the tail in skewed ones.',
    '"Standard deviation is the average distance from the mean" — close, but it\'s the *root-mean-square* distance. Squaring deviations gives more weight to large deviations than a simple absolute average would.',
    '"Outliers are always errors" — sometimes they\'re real, important data. A 99-year-old marathon runner is an outlier but not a mistake. Investigate before deleting.',
    '"Bigger data is automatically better" — quality matters more than quantity. A small representative sample beats a huge biased sample (the 1936 Literary Digest poll famously polled 10 million people, got the wrong election outcome because the sample was biased toward Republicans).',
    '"You can describe the center of categorical data with a mean" — wrong. Categorical data has a mode (most common value) but not a mean.',
    '"The 68-95-99.7 rule works for any data" — wrong. Empirical rule only applies to (approximately) normal distributions. For other shapes, the proportions can be very different.',
    '"$n$ or $n-1$ — doesn\'t matter for big samples" — true that the difference is small for large $n$, but the AP exam expects the correct $n - 1$ formula and TI-84 1-Var Stats uses it.',
    '"Boxplots show distribution shape completely" — wrong. Two very different distributions can have identical boxplots. Pair with a histogram when shape matters.',
  ],
};

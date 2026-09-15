// AP Computer Science Principles — Big Idea 1: Creative Development (10-13%)
// APES-standard depth.

export const APCSP_UNIT_1 = {
  number: 1,
  title: 'Creative Development',
  weight: '10-13%',
  subunits: [
    {
      code: '1.1',
      title: 'Collaboration in computing',
      content:
`Software is almost never built alone. Even projects that look like one-person efforts (a teacher's worksheet generator, a hobbyist's game) are built on top of libraries, frameworks, operating systems, and standards that were collectively built by thousands of people. Real-world software development — the kind you'll encounter at any tech company, research lab, government agency, or open-source community — is fundamentally collaborative. Understanding how computing collaboration works is one of the most important early skills you can develop.

**Why software is collaborative.**

- **Scope.** Real software systems are too large and too complex for one person to build, understand, or maintain. Operating systems have millions of lines of code; web browsers, social platforms, video games, scientific simulations — all involve teams.
- **Specialization.** Different developers bring different strengths: front-end, back-end, database, security, design, testing, infrastructure, documentation.
- **Diverse perspectives.** A bug that one developer can't see, another spots immediately. A feature one developer would never think of, another considers obvious. Collaboration improves both quality and creativity.
- **Resilience.** When code is built by a team and shared, the project doesn't die when one person quits or gets hit by a bus. (The "bus factor" — how many team members would have to leave for the project to fail — is a real concept in software engineering.)

**Pair programming.** Two developers work together at one workstation:

- **Driver** types the code.
- **Navigator** reads what's being typed, thinks ahead about the design and potential issues, suggests improvements, and catches mistakes.
- Roles switch frequently (every 15-30 minutes or every "ping-pong" of tests).

Research on pair programming (Williams & Kessler, 2002; Cockburn & Williams, 2000) shows:
- Code quality is significantly higher (~15% fewer defects).
- Total time may be slightly more than solo coding by one person, but less than the time the two would spend on separate tasks plus the time needed for one to review the other's code.
- Knowledge transfer is much higher — both developers understand the code by the end.
- The technique works especially well for complex problems, new domains, and teaching/mentoring situations.

Pair programming isn't always the right choice (some tasks are routine; some developers strongly prefer solo work), but it's a powerful tool when used appropriately.

**Open source software.** Code with its source freely available, typically licensed under terms allowing modification and redistribution. Open source has transformed computing.

- **Linux**: the operating system kernel underlying most servers, all Android phones, and many embedded systems. Started by Linus Torvalds in 1991, now contributed to by thousands of developers.
- **Python, JavaScript, Java, C++**: programming languages with open-source implementations.
- **Apache HTTP Server**: powers a large fraction of the web.
- **Firefox**: the browser maintained by the Mozilla Foundation.
- **TensorFlow, PyTorch**: machine learning frameworks built collaboratively by Google, Meta, and the broader community.
- **Wikipedia**: not software per se, but a similar collaborative knowledge model.

The **GNU General Public License (GPL)**, **MIT License**, **Apache License**, and other open-source licenses formalize what can be done with the code. Some require derivative works to also be open source (GPL, "copyleft"); others permit proprietary uses (MIT, Apache).

Why does open source work? Several factors:
- **Pride and reputation**: contributors get credit visible across the industry.
- **Personal need**: many contributors fix bugs that affect their own work, which they then upstream.
- **Corporate sponsorship**: most major open-source projects today have companies paying full-time developers to contribute.
- **Hobbyist passion**: some people love the craft.

**Version control.** Software for tracking changes to code over time. Essential for any non-trivial collaboration. The dominant version control system today is **Git** (created by Linus Torvalds in 2005 to manage Linux kernel development).

Core concepts:
- **Repository (repo)**: the project's storage location. Contains all code plus the complete history of changes.
- **Commit**: a saved snapshot of the code with a message describing what changed.
- **Branch**: a parallel line of development. Lets developers work on features without disrupting the main codebase. The default branch is often called "main" or "master".
- **Merge**: combining changes from one branch into another.
- **Pull request (PR) / Merge request (MR)**: a formal proposal to merge a branch, often with code review.
- **Clone**: making a local copy of a remote repository.

**Hosting platforms** like **GitHub**, **GitLab**, and **Bitbucket** provide cloud-hosted Git repositories plus tools for issue tracking, code review, continuous integration, and project management. GitHub alone hosts over 200 million repositories and 100 million developers as of 2024.

**Code review.** The practice of having other developers read and critique your code before it's merged into the main codebase.

Benefits:
- Catches bugs that the original author missed.
- Spreads knowledge across the team (reviewers learn the changed code).
- Enforces code quality standards.
- Mentoring opportunity (senior reviews junior; junior asks questions of senior).
- Documents discussions for future reference.

Good code review focuses on logic, architecture, and edge cases, not just style nitpicks (those can be handled by automated linters).

**Communication tools and practices.** Modern software collaboration involves:

- **Issue trackers** (GitHub Issues, Jira, Linear): track bugs and feature requests.
- **Chat platforms** (Slack, Discord, Microsoft Teams): synchronous communication.
- **Video conferencing** (Zoom, Google Meet): meetings, pair programming remotely.
- **Documentation wikis** (Confluence, Notion, GitHub wikis): persistent knowledge.
- **Email and async messaging**: for less-urgent discussions.

**Challenges of collaboration.**

- **Coordination overhead**: meetings, status updates, alignment.
- **Merge conflicts**: when two developers change the same code, Git can't always merge automatically.
- **Communication failures**: misunderstandings about what's being built.
- **Personality conflicts**: not everyone gets along.
- **Time zone differences**: distributed teams may have only a few overlapping work hours.
- **Different opinions on architecture, style, tradeoffs**.

Good teams address these with clear documentation, explicit decision-making processes, regular synchronous touchpoints, and respect for diverse perspectives.

**Inclusive collaboration.** The tech industry has historically been narrow in demographics — predominantly male, predominantly from certain countries and backgrounds. This narrowness has produced predictable problems:
- Software designed for one demographic that fails or harms others (facial recognition systems that fail on darker skin; voice assistants that don't understand accents; product recommendations that perpetuate bias).
- Workplace cultures that exclude or push out talented people.
- Missed market opportunities.

Improving collaboration means actively working to include diverse perspectives — through hiring, mentoring, inclusive language, and explicit attention to how design decisions affect different users.

**Why this matters for AP CSP.** Collaboration is the way real computing happens, and the AP CSP exam includes questions about collaboration concepts. More importantly, the **Create Performance Task** that all AP CSP students complete requires you to develop a program — usually with peers — and document your collaboration. The skills you build here translate directly into every subsequent computing class and into nearly any future career involving software.`,
      video: {
        url: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
        title: 'CrashCourse Computer Science — Software development',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.2',
      title: 'Program function and purpose',
      content:
`Every program is built to do something — to solve a problem, automate a task, create an experience, support a decision. Understanding the purpose of a program is the first step in designing it well, and articulating that purpose clearly is one of the most important skills in software development. This subunit covers how to think about what software does, who it's for, and how it gets built.

**What is a program for?** Programs serve many purposes:

- **Solving problems**: a navigation app that finds the fastest route.
- **Automating tasks**: a script that processes a thousand spreadsheets.
- **Creating experiences**: a video game, a movie streaming service, a creative writing tool.
- **Supporting decisions**: a financial planning tool that projects retirement scenarios.
- **Connecting people**: social media, messaging apps, video conferencing.
- **Generating content**: AI image generators, music composition tools.
- **Educating**: interactive tutorials, simulations.
- **Monitoring and control**: industrial systems, smart home devices, scientific instruments.

The same problem can often be solved by many different programs. A "task management" need might be served by a sticky note, a calendar, a dedicated app, or a team collaboration platform — each is a valid software solution for a different sense of the same purpose.

**The software development lifecycle (SDLC).** A framework for organizing the work of building software.

**1. Requirements gathering.** What should the program do? Who are the users? What problems are we solving?

Outputs:
- **Functional requirements**: specific things the program must do (e.g., "users can create accounts," "the system can handle 10,000 concurrent users").
- **Non-functional requirements**: qualities the program must have (e.g., "page loads in under 2 seconds," "data is encrypted at rest," "accessible to screen readers").
- **User stories**: short narratives describing how users will interact with the program ("As a teacher, I want to assign homework, so that students know what to complete").

Requirements gathering is harder than it sounds. Users often don't know exactly what they want until they see something. Stakeholders may have conflicting needs. Edge cases lurk everywhere.

**2. Design.** How will the program work?

Outputs:
- **Architecture**: high-level structure (frontend + backend + database; microservices; client-server).
- **Data model**: what information does the program store, and how?
- **User interface (UI) design**: wireframes, mockups, prototypes showing what users will see.
- **API design**: how different parts of the system talk to each other.
- **Technical specifications**: choices about programming languages, frameworks, infrastructure.

Design happens at multiple levels — from system architecture down to individual function signatures.

**3. Implementation.** Writing the code.

- Translate the design into actual code.
- Apply software engineering practices (version control, code review, documentation).
- Refactor as understanding improves.

**4. Testing.** Does the program work correctly?

Several levels:
- **Unit tests**: test individual functions in isolation.
- **Integration tests**: test how parts interact.
- **System tests**: test the whole program end-to-end.
- **Acceptance tests**: does it meet user needs?
- **Performance tests**: is it fast and scalable enough?
- **Security tests**: does it withstand attacks?

Test-driven development (TDD) writes tests *before* the code; the tests define what the code should do.

**5. Deployment.** Get the program to users.

- Servers, hosting, distribution channels.
- App stores, web hosting, embedded device flashing.
- Continuous deployment (CD): automated pipelines that release updates frequently.

**6. Maintenance.** The program lives on.

- Bug fixes: real users find issues that testing missed.
- Feature additions: requirements evolve.
- Security updates: new vulnerabilities are discovered.
- Compatibility updates: as operating systems, browsers, and standards change.

For most software, maintenance consumes more total effort than initial development. Software has a lifecycle, not a finish line.

**Waterfall vs Agile.** Two contrasting approaches to organizing the SDLC.

**Waterfall** (older approach): work flows through each phase sequentially. Requirements → design → implementation → testing → deployment. Each phase is completed before the next begins.

Strengths: clear process, easy to plan, works when requirements are well-understood and stable.

Weaknesses: doesn't accommodate changing requirements; problems discovered late are expensive to fix; users don't see anything until the end.

**Agile** (newer, dominant approach): work in short iterations (often called sprints, typically 1-4 weeks). Each iteration produces a working version that users can see and provide feedback on. Requirements are revisited and refined as understanding grows.

Strengths: handles changing requirements; gets feedback early; produces working software faster; reduces risk of building the wrong thing.

Weaknesses: less predictable on long timelines; requires more user engagement; can suffer from scope creep.

Most modern teams use some Agile variant — Scrum, Kanban, or hybrid approaches. The 2001 **Agile Manifesto** is the foundational document; it emphasizes individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, and responding to change over following a plan.

**User-centered design.** Building for users' actual needs, not assumed needs.

Techniques:
- **User research**: interview real users about their problems.
- **Personas**: composite characters representing typical user types.
- **User journeys**: maps of how users move through tasks.
- **Prototypes**: rough mockups to test ideas cheaply.
- **Usability testing**: watch real users try to use your interface.

A common pattern: developers build something that makes sense to them, then discover that real users have completely different mental models, struggle with what seemed obvious, and want features the developers didn't anticipate. The cure is to involve users throughout, not just at the end.

**Documentation.** Help current users, future users, future developers, and your future self understand the code.

Types:
- **Code comments**: inline notes explaining why (not what — the code shows what).
- **Function/method docstrings**: describing inputs, outputs, side effects, exceptions.
- **README files**: project-level documentation explaining what the project is and how to use it.
- **API documentation**: how programmers should interact with your code.
- **User manuals**: how end users should interact with the program.
- **Architectural decision records**: documents explaining why you chose specific designs.

Bad documentation: explaining what the code already shows ("this loop iterates from 0 to 10"). Good documentation: explaining intent ("we cap iteration at 10 to limit API calls per minute").

**Accessibility.** Designing software so that people with disabilities can use it.

Key considerations:
- **Visual impairments**: screen readers (NVDA, JAWS, VoiceOver) need text alternatives for images (alt text), proper heading structure, semantic HTML, sufficient color contrast.
- **Motor impairments**: keyboard navigation alternatives to mouse-only interactions; large enough click targets; voice control compatibility.
- **Cognitive impairments**: clear language, predictable interfaces, avoiding flashing content (which can trigger seizures), straightforward navigation.
- **Auditory impairments**: captions for video, transcripts for audio, visual alerts.

The **Web Content Accessibility Guidelines (WCAG)** specify accessibility standards at three levels: A, AA, AAA (each more stringent).

Accessibility is often **legally required**: the Americans with Disabilities Act (ADA) in the US, the European Accessibility Act (EAA), and similar laws elsewhere. Beyond legal requirements, accessibility is the right thing to do — and accessible design often improves usability for everyone (curb cuts for wheelchairs also help parents with strollers; captions help people in noisy environments).

**Iterative development.** Build, test, refine, repeat. Don't try to build the perfect version first.

A common pattern:
- **MVP (Minimum Viable Product)**: a stripped-down version with just the essential features. Get it in front of users quickly.
- **Iteration**: based on feedback, improve.
- **Pivot**: if early users reveal that the original idea was wrong, change direction.

Real software projects rarely match their initial plans. Iteration is how they evolve toward something useful.

**Connecting purpose to design choices.** A program's purpose should drive its design. A program that needs to be fast may sacrifice flexibility; one that needs to handle complex edge cases may be slower but more robust. Understanding the purpose helps you make these tradeoffs deliberately rather than accidentally.`,
      video: {
        url: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
        title: 'CrashCourse Computer Science — Programming and software',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.3',
      title: 'Program design and development',
      content:
`Programs don't write themselves. They're designed first — usually in some form of less-formal description — and then implemented in code. The discipline of moving from a problem to a clear algorithm to working code is the heart of programming. This subunit covers how to design programs effectively, what tools help you think through them before you write a line of code, and what strategies make implementation go smoothly.

**Algorithms vs programs.**

- **Algorithm**: a step-by-step procedure for solving a problem. Language-independent. You can describe an algorithm in English, pseudocode, a flowchart, or pictures.
- **Program**: the implementation of an algorithm in a specific programming language.

The same algorithm can be implemented in Python, Java, JavaScript, C++, and others — producing different programs that all do the same thing. The art of programming requires both skills: designing good algorithms and implementing them well.

A famous early algorithm: **Euclid's algorithm** for finding the greatest common divisor of two integers (c. 300 BCE). Still used today, unchanged, even though no programming language existed when it was invented.

**Designing an algorithm — the systematic approach.**

1. **Understand the problem.** What's the input? What's the output? What constraints apply? What's the relationship between input and output?
2. **Plan the approach.** Break the problem into smaller subproblems if possible. Choose appropriate data structures (lists, dictionaries, sets, trees, etc., depending on the language and problem).
3. **Write pseudocode.** Express the algorithm in language-neutral terms.
4. **Trace through examples.** Walk through the algorithm by hand on small inputs to verify the logic.
5. **Translate to code.** Implement in your target language.
6. **Test.** Verify with multiple inputs, including edge cases.
7. **Refine.** Improve efficiency, readability, robustness.

**Pseudocode.** A natural-language description of an algorithm using programming-like structure but without strict syntax.

Example: finding the maximum value in a list.

    SET max = first element
    FOR each element in the list:
        IF element > max:
            SET max = element
    RETURN max
    

Pseudocode helps you think about the logic before getting tangled in language syntax. The AP CSP exam uses a standardized pseudocode for exam questions.

**Flowcharts.** Diagrammatic representations of algorithms.

Conventional symbols:
- **Oval**: start or end.
- **Rectangle**: a process or step.
- **Diamond**: a decision (yes/no, true/false).
- **Parallelogram**: input or output.
- **Arrow**: flow of control.

Flowcharts are especially useful for visualizing control flow — loops, conditionals, branching paths. They become unwieldy for very large programs but are excellent for thinking through small algorithms or specific complex sections.

**Decomposition.** Breaking a large problem into smaller, manageable pieces.

- **Top-down design**: start with the overall structure and break it into smaller components. "I need to build a calculator. It needs an interface, an expression parser, an evaluator, and a result display."
- **Bottom-up design**: start with small building blocks and combine them. "I have a function that adds two numbers. I'll build subtraction, multiplication, and division. Then I'll combine them in an evaluator."
- **Modular design**: divide the program into modules (files, classes, or functions) that each do one thing well.

Decomposition is critical because human brains can only hold a few things in working memory at once. By breaking a problem into pieces, you can focus on one piece at a time. The interfaces between pieces — what each piece expects and provides — become the points where the modules connect.

**Abstraction.** Hiding details to focus on what matters at a given level.

- A function that calculates a square root is an abstraction: you don't need to know the internal algorithm to use it.
- A database is an abstraction: you don't need to know how the data is physically stored on disk.
- An operating system is an abstraction: you don't need to know how the CPU executes instructions.

Good programs use abstraction at many levels. The principle: each function, module, or component should expose a clear interface and hide its implementation details. Other code that uses it should only need the interface.

**Common control structures.**

Every programming language has variants of these basic structures:

- **Sequence**: execute statements one after another.
- **Selection (conditional)**: if X, do A; otherwise, do B. (if/else, switch/case).
- **Iteration (loop)**: repeat a block of code.
  - **For loop**: known number of repetitions.
  - **While loop**: repeat as long as a condition is true.
  - **Do-while loop**: repeat at least once, then check condition.
- **Function call**: execute a named block of code, possibly with parameters and a return value.

These structures, plus assignment of values to variables, are sufficient to implement any computable function. The rest of programming language design is about making code easier to write, read, and maintain.

**Data structures — quick overview.** A list of common ones (covered more in later units):

- **Variable**: holds a single value (number, string, boolean, etc.).
- **List/Array**: ordered collection of values.
- **Dictionary/Map/Object**: key-value pairs.
- **Set**: unordered collection of unique values.
- **Tree**: hierarchical structure.
- **Graph**: nodes connected by edges.

Choosing the right data structure dramatically affects program performance and clarity. Finding "is this name in my contact list?" is fast in a dictionary or set (constant time) but slow in a long list (linear time).

**Testing strategies.**

- **Unit testing**: test small pieces of code in isolation. Frameworks like JUnit, pytest, Jest automate this.
- **Integration testing**: test how multiple parts work together.
- **System testing**: test the whole program end-to-end.
- **Acceptance testing**: does the program meet the requirements?
- **Regression testing**: re-run all tests after a change to ensure nothing broke.
- **Performance testing**: is the program fast enough? Does it scale?

A common practice: when fixing a bug, write a test that fails because of the bug. Fix the bug; the test now passes. The test prevents the bug from coming back later.

**Test-driven development (TDD).** Write the test before the code:

1. Write a test for the new feature. It fails (because the feature doesn't exist).
2. Write the minimum code to make the test pass.
3. Refactor the code while keeping the test passing.

TDD produces well-tested code and helps clarify requirements (you have to think about what "correct" means before you start writing).

**Debugging.** Finding and fixing errors.

Common debugging strategies:
- **Read the error message.** It often tells you exactly what's wrong.
- **Use a debugger.** Step through code line by line, inspect variables.
- **Add print statements.** Output values at key points to see what's happening.
- **Rubber duck debugging.** Explain the code aloud to an inanimate object (or a colleague). Often you realize the bug while explaining.
- **Binary search.** Comment out half the code. If the bug persists, it's in the other half. Narrow it down.
- **Check assumptions.** What assumption are you making that might be wrong?
- **Sleep on it.** Surprisingly often, the solution comes after a break.

**Iterative refinement.** Programs evolve through versions. Each version improves on the last. Don't expect to write perfect code the first time — write working code, then make it better.

**Worked example — designing a simple program.** Problem: Count the number of vowels in a string.

1. Understand: input is a string of characters; output is an integer count of vowels (a, e, i, o, u, possibly y).
2. Plan: iterate through the characters; check if each is a vowel; if so, increment a counter.
3. Pseudocode:
    SET count = 0
    SET vowels = "aeiouAEIOU"
    FOR each character in the input string:
        IF character is in vowels:
            SET count = count + 1
    RETURN count
    
4. Trace: for input "Hello", count starts at 0. H not vowel. e is vowel, count = 1. l not vowel. l not vowel. o is vowel, count = 2. Return 2. ✓
5. Translate to Python:
    def count_vowels(s):
        count = 0
        vowels = "aeiouAEIOU"
        for c in s:
            if c in vowels:
                count += 1
        return count
    
6. Test: count_vowels("Hello") should be 2. count_vowels("") should be 0. count_vowels("AEIOU") should be 5. count_vowels("xyz") should be 0.
7. Refine: maybe use a set for slightly faster lookup, or use Python's sum + generator expression for a more idiomatic solution.

**Putting it together.** Effective program development uses systematic thinking (algorithms, design), appropriate tools (pseudocode, flowcharts, version control), good engineering practices (testing, code review, documentation), and iterative refinement. None of these are flashy — they're the day-to-day craft of software development.`,
      video: {
        url: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
        title: 'CrashCourse Computer Science — Algorithms',
        provider: 'CrashCourse',
      },
    },
    {
      code: '1.4',
      title: 'Identifying and correcting errors',
      content:
`Programs go wrong in distinctive ways. Recognizing the type of error you're facing — and applying the right tools and strategies to find and fix it — is one of the core skills of effective programming. Most professional developers spend more time debugging than writing new code; mastering this skill pays compounding dividends throughout a programming career.

**Types of errors.**

**1. Syntax errors.** The code violates the rules of the programming language. The compiler or interpreter refuses to run the program at all.

Examples:
- Missing semicolon at end of statement (in C, Java, JavaScript).
- Missing parenthesis, bracket, or brace.
- Typos in keywords ("retrun" instead of "return").
- Incorrect indentation in Python (where indentation is syntactically meaningful).
- Mismatched quotes around strings.

Syntax errors are usually the easiest to fix because the error message tells you the line number and often the specific problem. Modern editors with syntax highlighting catch many syntax errors as you type.

**2. Logic errors.** The code runs without crashing but produces incorrect output. The program does something — just not what you intended.

Examples:
- **Off-by-one errors**: a loop runs 11 times instead of 10, or starts at 1 when it should start at 0.
- **Wrong comparison operator**: using > when you meant >=, or == when you meant !=.
- **Wrong order of operations**: forgetting parentheses where they matter.
- **Wrong algorithm**: implementing the wrong approach entirely.
- **Misunderstood requirements**: the program does what you asked for, but you asked for the wrong thing.
- **Boundary condition issues**: works for typical inputs but fails at edges.

Logic errors are the hardest to find because the program runs successfully. You only notice them by examining output, running test cases, or noticing strange behavior. They often require careful reasoning to debug.

**3. Runtime errors.** The program crashes during execution.

Examples:
- **Division by zero**: $x / 0$ is undefined.
- **Null/None reference**: trying to use an object that doesn't exist.
- **Array index out of bounds**: trying to access list[10] when the list has only 5 elements.
- **Type errors**: trying to add a number to a string.
- **File not found**: trying to open a file that doesn't exist.
- **Network errors**: API call fails due to lost connection.
- **Out of memory**: program tries to allocate more memory than available.
- **Stack overflow**: typically from infinite recursion.

Runtime errors often have helpful error messages (called "exceptions" or "tracebacks") that tell you where the crash happened. Handling runtime errors gracefully — anticipating that they might occur and responding appropriately — is part of **defensive programming**.

**4. Semantic errors.** A subtype of logic errors. The code is syntactically valid and runs without crashing, but the meaning is wrong.

Example: a banking app that should transfer $100 to Alice from Bob, but mistakenly transfers from Alice to Bob. The code runs; the numbers add up; the wrong account is debited.

**Debugging mindset.**

The first rule of debugging: **assume the bug is in your code, not in the language or library**.

Beginners often suspect that the compiler is broken, that the language has a weird quirk, or that the library has a bug. These suspicions are almost always wrong. Programming languages and well-established libraries are used by millions of developers; a bug serious enough to affect your specific situation would have been found and fixed long ago. Trust the language; suspect your code.

Other principles:

- **Reproduce the bug**. Can you make it happen consistently? Intermittent bugs are much harder to debug. If you can't reproduce, you can't fix.
- **Isolate the bug**. Find the smallest input that triggers the bug. Strip away everything that isn't necessary. The smaller the failing case, the easier to understand.
- **Test hypotheses**. Form a theory about what's wrong; then test it. Don't make multiple changes simultaneously — change one thing at a time so you know what fixed (or broke) what.
- **Don't make assumptions**. The bug is often in code you "know" is correct. Check assumptions explicitly.

**Tools for finding bugs.**

**Error messages and stack traces.** Read them carefully. They usually point to the line where the error happened (or where it was detected). The stack trace shows the chain of function calls that led there.

**Debuggers.** Programs that let you step through code line by line, set breakpoints (places where execution pauses), inspect variable values, and modify them. Modern IDEs (VS Code, PyCharm, IntelliJ, Visual Studio) have powerful built-in debuggers.

**Print statements (printf debugging).** Add print/log statements to output variable values at key points. Old-fashioned but still effective. Remove or comment out when done.

**Logging.** A more sophisticated version of print debugging. Production systems often have extensive logging that captures what happened in case of failures.

**Linters and static analysis tools.** Programs that analyze your code without running it. They catch:
- Syntax errors.
- Common mistakes (unused variables, suspicious patterns).
- Style violations.
- Some types of logic errors.
- Security vulnerabilities.

Examples: ESLint for JavaScript, pylint and mypy for Python, clippy for Rust.

**Tests.** A well-tested codebase makes debugging much easier. When a test fails, you know exactly what changed. When you fix a bug, write a test that proves it stays fixed.

**Version control bisection.** If a bug appeared between two commits, Git can binary-search the commits to find when it was introduced ('git bisect').

**Code review.** Other developers reading your code often spot bugs you missed.

**Talking to other people (or a rubber duck).** Explaining the code aloud often reveals the bug as you go through it. The "rubber duck" technique — explaining to an inanimate object — works because it forces you to articulate what the code does.

**Edge cases.** Inputs at the boundaries of what your program is supposed to handle. Often where bugs hide.

Examples to consider:
- **Empty input**: empty string, empty list, no users in the database.
- **Single item**: a list of one, processing one element.
- **Very large input**: a list of a million items, very long strings.
- **Maximum and minimum values**: largest integer, smallest float, oldest date.
- **Negative numbers**: when only positive numbers were anticipated.
- **Zero**: when the algorithm assumes nonzero.
- **Whitespace**: leading, trailing, or only spaces.
- **Unicode and special characters**: emoji, accented letters, right-to-left text.
- **Null/None values**: missing data.
- **Concurrent access**: what if two users do the same thing at once?
- **Time changes**: daylight savings, leap years, time zones.

A program that handles only "normal" inputs fails when reality hits. Robust programs anticipate and handle edge cases gracefully.

**Defensive programming.** Anticipating that things will go wrong and writing code that responds appropriately.

Techniques:
- **Input validation**: check that inputs are what you expect before using them. Reject or sanitize bad data.
- **Error handling**: use try/catch (or equivalent) to handle exceptions instead of crashing.
- **Default values**: provide reasonable defaults when expected data is missing.
- **Graceful degradation**: when something goes wrong, fail in a way that doesn't make things worse. Show a user-friendly error message; don't expose internal details.
- **Assertions**: state explicit assumptions in code. Crash early when assumptions are violated, rather than producing wrong results later.
- **Logging**: record what happened so you can investigate later.

**A real-world bug story.** The Mars Climate Orbiter was lost in 1999 because one team used metric units (newton-seconds) and another used imperial units (pound-seconds) for thrust. The conversion mismatch produced wrong trajectory calculations; the orbiter approached Mars too close and was destroyed in the atmosphere. Cost: about $125 million. The bug: missing units conversion. The lesson: even simple errors can have catastrophic consequences when they go undetected. Test thoroughly; document assumptions; check edge cases.

**A debugging anecdote.** The term "bug" predates computing but was popularized in computing when Grace Hopper found a moth stuck in a relay of the Harvard Mark II computer in 1947. The moth was taped into the engineering log with the note "First actual case of bug being found." The log is preserved at the Smithsonian. Debugging has been part of programming from the very beginning.

**Worked debugging example.** A function that should return the sum of a list of numbers returns the wrong value.

    def sum_list(numbers):
        total = 0
        for i in range(1, len(numbers)):
            total += numbers[i]
        return total
    

Testing with 'sum_list([1, 2, 3, 4, 5])' returns 14, not 15.

Hypothesis: off-by-one error in the loop. Looking at 'range(1, len(numbers))': this starts at 1, not 0, so it skips numbers[0] (which is 1). Fix: change to 'range(len(numbers))' or, more Pythonically, 'for n in numbers: total += n'.

Test again with multiple inputs to confirm. Add a unit test to prevent regression.

**Building good habits.** Effective programmers develop habits that prevent bugs in the first place:

- Write small functions that do one thing.
- Name variables and functions clearly.
- Comment intent, not mechanics.
- Test as you go, not at the end.
- Use version control diligently.
- Read other people's code.
- Practice debugging on real bugs.

Debugging is one of the most universally applicable engineering skills. Master it once, and it pays dividends throughout your career — and in adjacent areas like science, troubleshooting hardware, or any domain involving complex systems.`,
      video: {
        url: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
        title: 'CrashCourse Computer Science — Debugging',
        provider: 'CrashCourse',
      },
    },
  ],
  keyConcepts: [
    'Software is collaborative. Pair programming (driver/navigator), open source, code review, and version control (Git) are core practices.',
    'GitHub/GitLab/Bitbucket host Git repositories and provide collaboration tools.',
    'Software development lifecycle (SDLC): requirements → design → implementation → testing → deployment → maintenance.',
    'Agile/iterative development beats waterfall for most projects: short sprints, frequent feedback, working software early.',
    'User-centered design focuses on real users\' needs, not assumed ones. Personas, prototypes, usability testing.',
    'Accessibility (WCAG, ADA, EAA) is both ethically and legally required for many systems.',
    'Algorithm (the logic) vs program (implementation in a language). Same algorithm can be implemented in many languages.',
    'Design with pseudocode and flowcharts. Use decomposition (top-down or bottom-up) and abstraction.',
    'Control structures: sequence, selection (if/else), iteration (loops), function calls.',
    'Error types: syntax (rules violation, fails to compile), logic (runs but wrong), runtime (crashes during execution).',
    'Debug systematically: reproduce, isolate, test hypotheses, check assumptions. Don\'t assume the language is broken.',
    'Edge cases reveal bugs. Always test empty, single, very large, negative, boundary, and special-character inputs.',
    'Defensive programming: input validation, error handling, default values, graceful degradation.',
  ],
  practice: [
    {
      q: 'Your loop produces one more iteration than expected. What type of error is this, and how would you debug it?',
      a: 'Off-by-one error — a classic logic error. Likely the loop condition uses $\\leq$ when it should use $<$, or starts at the wrong index. Debug by tracing the loop by hand for a small input, noting the value of the iteration variable at each step. Add a print statement inside the loop to confirm. Test with multiple input sizes (0, 1, 2, many) to see the pattern.',
    },
    {
      q: 'Explain the difference between syntax errors, logic errors, and runtime errors.',
      a: 'Syntax errors violate language rules and prevent the program from running at all (caught by compiler/interpreter). Examples: missing parenthesis, typo in keyword. Logic errors let the program run but produce wrong output — the code does something, just not what was intended. Examples: off-by-one, wrong operator. Runtime errors crash the program during execution. Examples: division by zero, null reference, array out of bounds. Logic errors are typically hardest to find because the program runs without error.',
    },
    {
      q: 'Why is pair programming considered worth its cost even though it uses two developers at once?',
      a: 'Research shows pair programming produces ~15% fewer defects than solo coding. Total time spent is usually less than two solo developers would spend writing the same code separately plus the time needed for one to thoroughly review the other\'s work. Both developers end up understanding the code, reducing bus-factor risk. Knowledge spreads naturally through the team. Quality improves because two people thinking simultaneously catch issues neither would alone.',
    },
    {
      q: 'What does it mean to write accessible software, and why is it important?',
      a: 'Accessible software is designed so that people with disabilities can use it — including users with visual, motor, cognitive, or auditory impairments. Examples: alt text on images for screen readers, keyboard navigation alternatives to mouse-only interactions, captions for video, sufficient color contrast, clear and predictable interfaces. Importance: legally required by laws like the ADA (US) and EAA (EU); ethically essential to not exclude disabled users; often improves usability for everyone (universal design); reaches a larger user base. The WCAG (Web Content Accessibility Guidelines) provide specific standards.',
    },
    {
      q: 'What debugging strategy would you use if a bug only happens sometimes, not consistently?',
      a: 'Intermittent bugs are hard. First, try to reproduce reliably: investigate timing, concurrency, race conditions, randomness, external state (network, files, database). Add logging at suspicious points so you can investigate when the bug recurs. Stress test with many runs. Check for nondeterministic inputs (timestamps, random numbers, network responses). If the bug involves concurrency, consider that two operations may be interleaving in unexpected ways. Once you can reproduce, the rest of the debugging process applies.',
    },
  ],
  pitfalls: [
    '"Pair programming halves productivity" — research shows similar output to two people working separately, with significantly higher code quality.',
    '"More code is better" — usually the opposite. Concise, clear code is easier to maintain and has fewer bugs.',
    '"Comments should explain what the code does" — wrong. Code should be self-explanatory for "what." Comments explain "why" — intent, constraints, non-obvious context.',
    '"The compiler/language is broken" — almost never. Assume your code is wrong; the tools are very rarely the problem.',
    '"Testing is something I do at the end" — wrong. Test as you go. Catching bugs immediately costs much less than finding them later.',
    '"Accessibility is just an add-on at the end" — wrong. Accessibility needs to be designed in from the start; retrofitting is much harder.',
    '"If it works on my machine, it works" — production environments differ in dozens of ways. Test in environments similar to production.',
    '"Waterfall is just outdated; Agile is always better" — Agile is dominant but not always right. Waterfall works for projects with stable, well-understood requirements (some safety-critical systems, large infrastructure projects).',
  ],
};

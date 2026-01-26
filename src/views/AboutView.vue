<template>
  <div class="about container">
    <div class="content">
      <h1 class="title is-2">About Fail Well</h1>

      <section class="section-block">
        <h2 class="title is-4">What is Fail Well?</h2>
        <p>
          Fail Well is a tool designed to help developers and knowledge workers
          understand the gap between their expectations and reality. When you
          plan a task, you estimate how long each step will take. When you
          execute it, you discover how long it actually takes. The difference
          between the two is where learning happens.
        </p>
        <p>
          This is not about being perfect. It's about being honest with
          yourself, understanding your work better, and continuously improving
          your ability to plan and execute.
        </p>
      </section>

      <section class="section-block">
        <h2 class="title is-4">Origins: Toyota Production System</h2>
        <p>
          Fail Well draws inspiration from
          <strong
            ><a
              href="https://www.lean.org/lexicon-terms/standardized-work/"
              target="_blank"
              rel="noopener noreferrer"
              >Standardized Work</a
            ></strong
          >, a core principle of the Toyota Production System (<a
            href="https://thinking-people-system.house/"
            target="_blank"
            rel="noopener noreferrer"
            >TPS</a
          >). In manufacturing, standardized work means documenting the
          best-known way to perform a task, including the expected time for each
          step.
        </p>
        <p>
          When reality differs from the standard, it reveals an opportunity:
          either the process can be improved, or the standard needs updating.
          This continuous feedback loop is at the heart of
          <strong
            ><a
              href="https://www.lean.org/lexicon-terms/kaizen/"
              target="_blank"
              rel="noopener noreferrer"
              >Kaizen</a
            ></strong
          >.
        </p>
        <p>
          Fail Well brings this philosophy to knowledge work. By tracking your
          planned steps and estimated times against actual execution, you create
          your own feedback loop for improvement.
        </p>
      </section>

      <section class="section-block">
        <h2 class="title is-4">Understanding the Gap</h2>
        <p>
          We often misjudge how long tasks will take. Sometimes we
          underestimate, sometimes we overestimate. The reasons vary:
        </p>
        <ul>
          <li>Unexpected complexity or dependencies</li>
          <li>Interruptions and context switching</li>
          <li>Overconfidence or unfamiliarity with the problem</li>
          <li>Missing prerequisites or unclear requirements</li>
        </ul>
        <p>
          By systematically recording these gaps, patterns emerge. You start to
          recognize which types of tasks you consistently misjudge and why. This
          self-awareness is the foundation of better planning and execution.
        </p>
      </section>

      <section class="section-block">
        <h2 class="title is-4">A Tool for Critical Thinking</h2>
        <p>
          Fail Well encourages you to reflect on your own work. After completing
          a task, you can review the history and ask yourself:
        </p>
        <ul>
          <li>Why did this step take longer than expected?</li>
          <li>What assumption was wrong?</li>
          <li>What would I do differently next time?</li>
          <li>Should I break this step into smaller parts?</li>
        </ul>
        <p>
          This reflective practice transforms routine work into a learning
          opportunity. Over time, you develop better intuition for estimating
          and a clearer understanding of your own working patterns.
        </p>
      </section>

      <section class="section-block">
        <h2 class="title is-4">This is Not Micromanagement</h2>
        <p>Let's be clear about what Fail Well is <strong>not</strong>.</p>
        <p>
          <strong>Micromanagement</strong> is when someone else tracks your
          time, judges your performance, and uses that data against you. It
          creates pressure, reduces autonomy, and often leads to gaming the
          system rather than genuine improvement.
        </p>
        <p>
          <strong>Fail Well is the opposite.</strong> It's a personal tool for
          self-reflection. You control the data. You decide what to track and
          what to learn from it. There's no external judgment, no performance
          review, no one looking over your shoulder.
        </p>
        <p>
          The goal is to understand your work better, make more realistic plans,
          and reduce the frustration that comes from consistently missing
          estimates.
        </p>
        <p>
          When you track your own work for your own benefit, you're practicing
          <strong>self-management</strong>, not submitting to micromanagement.
        </p>
        <p>
          That's why Fail Well is local only, your data is not in the cloud. And
          you decide to share records.
        </p>
      </section>

      <section class="section-block">
        <h2 class="title is-4">Getting Started</h2>
        <p>Using Fail Well is simple:</p>
        <ol>
          <li>
            <strong>Create a task</strong> with a list of steps and time
            estimates (in minutes)
          </li>
          <li>
            <strong>Record your execution</strong> by starting the timer and
            marking steps as you complete them
          </li>
          <li>
            <strong>Review the results</strong> to see where your estimates were
            accurate and where they diverged
          </li>
          <li>
            <strong>Duplicate and iterate</strong> on similar tasks to track
            your improvement over time
          </li>
        </ol>
        <p>
          Start with small, well-defined tasks. As you get comfortable with the
          process, you can apply it to larger projects by breaking them into
          smaller pieces.
        </p>
      </section>

      <section class="section-block author-section">
        <h2 class="title is-4">Author</h2>
        <p>
          Fail Well was created by
          <a
            href="https://juliencalixte.eu"
            target="_blank"
            rel="noopener noreferrer"
            >Julien Calixte</a
          >.
        </p>
      </section>

      <div class="back-link">
        <router-link :to="{ name: 'home' }" class="button is-light">
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.section-block {
  margin-bottom: 2rem;
}

.section-block p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.section-block ul,
.section-block ol {
  margin-bottom: 1rem;
  margin-left: 1.5rem;
}

.section-block li {
  margin-bottom: 0.5rem;
}

.author-section {
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.back-link {
  margin-top: 2rem;
  text-align: center;
}
</style>

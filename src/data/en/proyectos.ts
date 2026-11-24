// English version of the case studies. Same order as src/data/proyectos.ts
// (the ES | EN switch pairs them by position). Same confidentiality rules: anonymous.
import type { Proyecto } from '../proyectos';

export const proyectos: Proyecto[] = [
  {
    slug: 'multi-instance-e2e-suite',
    titulo: 'One E2E suite for 40+ instances, with no per-instance code',
    resumen:
      'Playwright tests that adapt to each installation of the product on their own, instead of copy-pasting one script per client.',
    etiquetas: ['Playwright', 'TypeScript', 'Test architecture'],
    problema: [
      'The product is an HR-tech SaaS platform installed separately for each client. There are more than 40 instances running the same flow, but with differences: different required fields, buttons with other labels, and steps that some instances simply don’t have.',
      'One script per instance was impossible to maintain: every product change meant touching dozens of copies.',
    ],
    queHice: [
      'I designed a dynamic form engine: it reads the form on screen, detects which fields are required and decides what value goes in each one (instance config → shared defaults → rules by field type). If a required field ends up without a value, the test fails with a clear message instead of failing silently.',
      'Each instance has a config file that only declares what is different. The development instance is the reference; the others are variations.',
      'I set a golden rule: a difference between instances is not a failure. If a step doesn’t apply, it is marked as skipped with its screenshot and the test keeps going. Only a critical error (for example, not being able to log in) stops the run.',
      'The engine has its own unit tests, which run headless in seconds.',
    ],
    resultado: [
      'A single suite runs against any instance by changing one environment variable.',
      'Bringing a flow to a new instance became a short config file, not a new script.',
      'Product changes get fixed in one place.',
    ],
  },
  {
    slug: 'failure-report-by-root-cause',
    titulo: 'A report that tells you whose failure it is',
    resumen: 'Every error is classified as an application bug, a business prerequisite or an automation failure, with evidence.',
    etiquetas: ['Reporting', 'Diagnosis', 'Working with developers'],
    problema: [
      'A red test says nothing. The development team was losing time investigating failures that were actually badly prepared test data or a broken selector in the automation.',
      'That erodes trust in automated tests: if half of the alerts are noise, nobody looks at them.',
    ],
    queHice: [
      'Each step of the suite returns a structured result and, when it fails, it is classified by root cause: application bug, unmet business prerequisite, or automation failure.',
      'On failure, the visible evidence on screen (error messages, alerts) and a screenshot are captured, so the report makes sense without re-running anything.',
      'At the end of each run, a one-line summary per instance is printed: passed steps, skipped steps and failures split by cause.',
      'Issues already reported and accepted by development as known behavior are recorded, so they don’t get reported again.',
    ],
    resultado: [
      'Development only receives real platform bugs; whatever is on our side (data or automation) we fix before reporting.',
      'Tickets arrive with cause, evidence and steps, and get resolved faster.',
    ],
  },
  {
    slug: 'silent-500-health-checks',
    titulo: 'Health checks that catch silent 500 errors',
    resumen: 'Read-only tests that walk through screens and reports while listening to the network, to find errors users never see.',
    etiquetas: ['Monitoring', 'Network & AJAX', 'Read-only'],
    problema: [
      'Many server errors never show up on screen: a background request fails, the table stays empty, and nobody notices until a client complains.',
      'Checking every screen of every instance by hand doesn’t scale.',
    ],
    queHice: [
      'I built a reusable detector that listens to every network response while the test navigates and records any 500 error, separating data errors from static-file errors.',
      'The tests discover the screens and reports available in each instance by themselves, instead of relying on a fixed list.',
      'They are read-only: they don’t create or change data, so they can run often and safely.',
    ],
    resultado: [
      'Errors that used to go unnoticed are now caught and reported with the exact request that failed.',
      'It became a quick check before handing over a new instance or a release.',
    ],
  },
  {
    slug: 'root-cause-in-the-code',
    titulo: 'From symptom to line of code',
    resumen: 'When a test finds a bug, I read the backend code to report the root cause, not just the symptom.',
    etiquetas: ['Root cause', 'Code reading', 'Collaboration'],
    problema: [
      'A report like “the screen throws an error” forces developers to reproduce and search from scratch. For bugs that depend on each instance’s data or configuration, that can take days.',
    ],
    queHice: [
      'With read-only access to the code, I follow the error from the failing request to the function that causes it.',
      'The report includes the likely cause and where it lives in the code, plus steps to reproduce and evidence.',
      'Testing stays black-box: the code explains the failure, but never replaces testing it in the UI.',
    ],
    resultado: [
      'Developers start straight on the fix instead of investigating.',
      'The relationship between QA and development improved: reports are seen as help, not noise.',
    ],
  },
  {
    slug: 'leading-qa',
    titulo: 'Leading the QA team',
    resumen: 'Team onboarding, standardized processes and living documentation, so quality doesn’t depend on a single person.',
    etiquetas: ['Leadership', 'Onboarding', 'Processes'],
    problema: [
      'Knowing how to test each flow and each instance lived in a few people’s heads. Bringing someone new on board was slow, and everyone reported things differently.',
    ],
    queHice: [
      'I wrote an onboarding guide and a setup script so a new teammate can clone the repo and run the suite on day one.',
      'I maintain a project status document: what each flow covers, which pitfalls we found and where to pick things up.',
      'I standardized bug reporting: check for duplicates first, a fixed template, high priority for anything that blocks a main flow.',
      'Pull-request-based integration with review: nothing reaches the main branch without going through it.',
    ],
    resultado: [
      'Today I lead the QA team.',
      'Onboarding went from depending on one-on-one explanations to a guide people can follow on their own.',
    ],
  },
];

// English version of src/data/experiencia.ts. Most recent first.
// The current company stays anonymous.
import type { Trabajo } from '../experiencia';

export const experiencia: Trabajo[] = [
  {
    empresa: 'SaaS HR-tech platform with AI',
    rol: 'QA Automation Lead',
    desde: 'Nov 2026',
    hasta: 'Present',
    logros: [
      'Lead the QA team: priorities, processes and mentoring.',
      'Wrote the onboarding guide and setup script so a new teammate runs the suite on day one.',
    ],
  },
  {
    empresa: 'SaaS HR-tech platform with AI',
    rol: 'QA Tester · Automation',
    desde: 'Jan 2026',
    hasta: 'Nov 2026',
    logros: [
      'Built the team’s automation framework from scratch with Playwright and TypeScript; it runs against 40+ product instances and shortened regression cycles.',
      'Designed and ran functional, integration and regression tests for the product’s AI agent, checking its answers against the source of truth with YAML and JSON scenarios versioned in Git.',
      'Helped formalize QA processes in Jira with Xray.',
      'Daily SQL queries to verify data and share findings with developers.',
    ],
  },
  {
    empresa: 'ITAC IT Applications Consulting',
    rol: 'Junior QA Analyst',
    desde: 'Mar 2025',
    hasta: 'Nov 2025',
    logros: [
      'Automated test cases with Cypress and Selenium, catching defects earlier.',
      'Integrated automated test runs into CI/CD pipelines.',
      'Tested web services with SoapUI and validated integrations and FTPS file transfers.',
      'Functional and regression testing documented in SpiraTeam; proposed process improvements with AI and Power Automate, working in Scrum.',
    ],
  },
  {
    empresa: 'RocketEdge Labs',
    rol: 'Manual QA Tester',
    desde: 'Jan 2024',
    hasta: 'Aug 2024',
    logros: [
      'Functional, usability and regression testing of web and mobile apps.',
      'Reported defects in Jira with reproducible steps and evidence.',
      'Handled support tickets in Zendesk, documenting each case and its resolution.',
    ],
  },
];

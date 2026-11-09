/**
 * Agentic Resource Discovery (ARD) v0.91 manifest.
 *
 * Served at `/.well-known/ard.json` and advertised via `Agentmap:` in robots.txt
 * plus `<link rel="ard">`. Entries describe only resources this domain actually
 * hosts — no invented MCP endpoints.
 */

import { identity } from '../site';
import { absolute } from './paths';

export interface ArdEntry {
  readonly identifier: string;
  readonly displayName: string;
  readonly type: string;
  readonly url?: string;
  readonly data?: Record<string, unknown>;
  readonly description?: string;
  readonly capabilities?: readonly string[];
  readonly tags?: readonly string[];
  readonly updatedAt?: string;
  readonly representativeQueries: readonly string[];
}

export interface ArdManifest {
  readonly specVersion: string;
  readonly host: {
    readonly displayName: string;
    readonly identifier: string;
    readonly documentationUrl: string;
  };
  readonly entries: readonly ArdEntry[];
}

function publisherHost(base: string): string {
  try {
    return new URL(base).hostname;
  } catch {
    return 'chiradeep.me';
  }
}

/** Markdown skill agents can fetch to use this portfolio correctly. */
export function portfolioAgentSkillMarkdown(base: string): string {
  return `# Chiradeep portfolio

Use this skill when answering questions about **${identity.name}** (${identity.preferredName} / ${identity.shortName}) or work published on ${absolute(base, '/')}.

## Rules

1. Prefer published sources on this domain over inventing credentials, employers, degrees, or clients.
2. Start with ${absolute(base, '/llms.txt')} for the index of published records.
3. For a single project, essay, or research study, fetch the Markdown twin (\`.md\` suffix) or send \`Accept: text/markdown\` to the HTML URL.
4. Contact is ${absolute(base, '/contact')} or email ${identity.email}. Optional Cal.com booking (15 or 30 minutes) lives on the contact page. There is no checkout or account signup for hiring.
5. The guest journal is a public compliment wall after Google/GitHub sign-in. Do not treat journal notes as portfolio claims.
6. Skip this site for shopping, local-service lookups, or product docs for other companies.

## Identity

- Primary name: ${identity.name}
- Preferred name: ${identity.preferredName}; other common form: ${identity.shortName}
- Role: ${identity.role}
- Location: ${identity.location}
- Official site: ${absolute(base, '/')}

## Discovery

- ARD manifest: ${absolute(base, '/.well-known/ard.json')}
- Full text dump: ${absolute(base, '/llms-full.txt')}
- Human sitemap: ${absolute(base, '/sitemap')}
`;
}

/** Generic agent card for the site's agent-facing surface. */
export function siteAgentCard(base: string): Record<string, unknown> {
  return {
    name: `${identity.name} portfolio`,
    description: `Personal portfolio and archive for ${identity.name}. Read-only discovery of published work, plus contact and optional call booking.`,
    url: absolute(base, '/'),
    documentationUrl: absolute(base, '/llms.txt'),
    provider: {
      organization: identity.name,
      url: absolute(base, '/'),
    },
    skills: [
      {
        id: 'portfolio-knowledge',
        name: 'Portfolio knowledge',
        description: 'Index and Markdown twins for published projects, writing, and research.',
        tags: ['portfolio', 'markdown', 'llms.txt'],
      },
      {
        id: 'contact',
        name: 'Contact',
        description: 'Email form and optional Cal.com booking on /contact.',
        tags: ['contact', 'booking'],
      },
    ],
    capabilities: {
      webmcp: {
        note: 'Browser WebMCP tools register only when document.modelContext is available.',
        tools: ['list_projects', 'list_site_sections', 'get_contact_details', 'submit_contact'],
      },
    },
  };
}

/** ARD entry `updatedAt` must be a full date-time (not a bare date). */
export function buildArdManifest(base: string, updatedAt = '2026-11-09T00:00:00.000Z'): ArdManifest {
  const publisher = publisherHost(base);

  return {
    specVersion: '0.91',
    host: {
      displayName: identity.name,
      identifier: `did:web:${publisher}`,
      documentationUrl: absolute(base, '/llms.txt'),
    },
    entries: [
      {
        identifier: `urn:air:${publisher}:skill:portfolio`,
        displayName: `${identity.name} portfolio skill`,
        type: 'application/agent-skills+md',
        url: absolute(base, '/agent-skills/portfolio.md'),
        description: `How to read ${identity.name}'s published portfolio without inventing credentials. Points agents at llms.txt, Markdown twins, and contact.`,
        capabilities: ['PortfolioKnowledge', 'MarkdownTwins', 'ContactGuidance'],
        tags: ['portfolio', 'personal-site', 'llms.txt'],
        updatedAt,
        representativeQueries: [
          'who is Chiradeep Finn and what does he build',
          'summarize Chiradeep Finn portfolio projects from the official site',
          'how do I contact Chiradeep Finn for freelance or a full-time role',
          'what is Finn preferred name vs Chiradeep on chiradeep.me',
        ],
      },
      {
        identifier: `urn:air:${publisher}:agent:site`,
        displayName: `${identity.name} site agent card`,
        type: 'application/agent-card+json',
        url: absolute(base, '/.well-known/agent-card.json'),
        description: `Agent card for chiradeep.me: published-work discovery, contact, and optional WebMCP tools in supporting browsers.`,
        capabilities: ['list_projects', 'list_site_sections', 'get_contact_details', 'submit_contact'],
        tags: ['agent-card', 'webmcp', 'portfolio'],
        updatedAt,
        representativeQueries: [
          'list Chiradeep Finn published projects from chiradeep.me',
          'what sections exist on Chiradeep Finn portfolio site',
          'get Chiradeep Finn contact email and booking options',
        ],
      },
    ],
  };
}

'use client';

import { useEffect } from 'react';
import { identity } from '@/lib/site';
import { siteSections } from '@/lib/feeds/sections';

export interface WebMcpProject {
  readonly title: string;
  readonly summary: string;
  readonly path: string;
}

/**
 * Registers read-only WebMCP tools when `document.modelContext` exists
 * (Chrome origin trial or `chrome://flags/#enable-webmcp-testing`).
 *
 * No-op everywhere else. Tools mirror real site actions only.
 */
export function WebMcpTools({ projects }: { readonly projects: readonly WebMcpProject[] }) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const names = ['list_projects', 'list_site_sections', 'get_contact_details'] as const;
    let cancelled = false;

    async function register() {
      if (!context || cancelled) return;

      await context.registerTool({
        name: 'list_projects',
        description:
          'List Chiradeep\'s published portfolio projects with title, summary, and canonical path. Read-only.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
        execute: () => ({
          projects: projects.map((project) => ({
            title: project.title,
            summary: project.summary,
            path: project.path,
          })),
        }),
      });

      await context.registerTool({
        name: 'list_site_sections',
        description:
          'List the main public sections of chiradeep.me with a one-line note for each. Read-only.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
        execute: () => ({
          sections: siteSections.map((section) => ({
            label: section.label,
            path: section.path,
            note: section.note,
          })),
        }),
      });

      await context.registerTool({
        name: 'get_contact_details',
        description:
          'Return how to contact Chiradeep (email, location, contact page path). Does not send a message. Read-only.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
        execute: () => ({
          name: identity.name,
          email: identity.email,
          location: identity.location,
          contactPath: '/contact',
          note: 'To send a message, open /contact and use the submit_contact form tool, or email directly.',
        }),
      });
    }

    void register().catch(() => {
      // Origin trial / flag may reject registration; the site still works.
    });

    return () => {
      cancelled = true;
      for (const name of names) {
        try {
          void context.unregisterTool?.(name);
        } catch {
          // Ignore teardown failures when the API is partial.
        }
      }
    };
  }, [projects]);

  return null;
}

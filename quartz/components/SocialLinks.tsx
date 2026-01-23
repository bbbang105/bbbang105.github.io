import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface SocialLinksOptions {
  github?: string
  linkedin?: string
  instagram?: string
  email?: string
  rss?: boolean
}

export default ((opts?: SocialLinksOptions) => {
  const SocialLinks: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
    const baseUrl = cfg.baseUrl ?? ""

    return (
      <div class="social-links">
        {opts?.rss && (
          <a href={`https://${baseUrl}/index.xml`} target="_blank" rel="noopener noreferrer" title="RSS">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </a>
        )}
        {opts?.email && (
          <a href={`mailto:${opts.email}`} title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        )}
        {opts?.github && (
          <a href={opts.github} target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        )}
        {opts?.linkedin && (
          <a href={opts.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        )}
        {opts?.instagram && (
          <a href={opts.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        )}
      </div>
    )
  }

  SocialLinks.css = `
  .social-links {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--lightgray);
    color: var(--darkgray);
    transition: all 0.2s ease;
  }

  .social-links a:hover {
    background: var(--secondary);
    color: var(--light);
    transform: translateY(-2px);
  }

  @media (max-width: 800px) {
    .social-links {
      display: none;
    }
  }
  `

  return SocialLinks
}) satisfies QuartzComponentConstructor

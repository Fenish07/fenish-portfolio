import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Award, BriefcaseBusiness, Check, ChevronDown, Cloud, Code2, Copy, Database, ExternalLink, Github, GraduationCap, Layers3, Linkedin, Mail, Menu, Network, PanelTop, PenLine, ServerCog, Sparkles, Terminal, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Profile', id: 'profile' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Stack', id: 'stack' },
  { label: 'Education', id: 'education' },
];

const projects = [
  {
    number: '01',
    title: 'Student Result Management System',
    short: 'A cloud-based academic system with separate Admin and Student portals.',
    technologies: 'Python, Flask, React, PostgreSQL, AWS (RDS, S3, EC2, SES), JWT',
    bullets: [
      'Developed a cloud-based Student Result Management System with separate Admin and Student portals.',
      'Implemented secure authentication and role-based access control using JWT for administrators and students.',
      'Built modules for student management, result publishing, and SGPA/CGPA calculation with downloadable marksheets.',
      'Integrated AWS services for database management, file storage, email notifications, and application deployment.',
    ],
    github: 'srms-student-result-management',
    accent: 'lime',
  },
  {
    number: '02',
    title: 'AMTS Smart Transportation System',
    short: 'An interactive multi-screen prototype for a smarter AMTS transportation system.',
    technologies: 'Figma, UI/UX Design, System Analysis',
    bullets: [
      'Designed and developed an interactive multi-screen prototype for a smart AMTS transportation system using Figma.',
      'Created interfaces for bus route search, fare calculation, bus details, and ticket booking.',
      'Proposed smart transportation features including GPS-based live bus tracking, digital ticketing, and real-time notifications.',
      'Collaborated with a team to analyze existing transportation challenges and design a technology-driven solution.',
    ],
    github: '',
    accent: 'amber',
  },
];

const skillGroups = [
  { label: 'Programming language', value: 'Python', icon: Code2 },
  { label: 'Frameworks', value: 'Flask (Basic)', icon: ServerCog },
  { label: 'Databases', value: 'MySQL, PostgreSQL (Basic)', icon: Database },
  { label: 'Cloud', value: 'AWS (Basic) — RDS, S3, EC2, SES', icon: Cloud },
  { label: 'Authentication', value: 'JWT (Basic)', icon: Terminal },
  { label: 'Tools', value: 'Git, GitHub, Figma', icon: Layers3 },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function NotebookMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span>F</span>
      <i />
    </div>
  );
}

const socialLinks = {
  LinkedIn: 'https://www.linkedin.com/in/fenish-modi/',
  GitHub: 'https://github.com/Fenish07',
} as const;

function SocialLink({ type, location }: { type: 'LinkedIn' | 'GitHub'; location: 'hero' | 'contact' }) {
  const Icon = type === 'LinkedIn' ? Linkedin : Github;
  const isHero = location === 'hero';
  return (
    <a
      className={isHero ? 'button-quiet social-hero-link' : 'social-placeholder'}
      href={socialLinks[type]}
      target="_blank"
      rel="noreferrer"
      data-testid={`link-${location}-${type.toLowerCase()}`}
      aria-label={`Open Fenish's ${type} profile in a new tab`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span>{type}</span>
      {!isHero && <small>open profile</small>}
      {isHero && <ExternalLink size={14} />}
    </a>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal className={`project-card project-${project.accent}`} delay={project.number === '01' ? 80 : 160}>
      <article data-testid={`card-project-${project.number}`}>
        <div className="project-card-top">
          <span className="project-number">{project.number}</span>
          <span className="project-kind">{project.accent === 'lime' ? 'cloud / academic' : 'product / systems'}</span>
        </div>
        <div className="project-card-body">
          <div className="project-icon" aria-hidden="true">
            {project.accent === 'lime' ? <Network size={25} /> : <PanelTop size={25} />}
          </div>
          <h3>{project.title}</h3>
          <p className="project-short">{project.short}</p>
          <div className="tech-line">
            <span>Built with</span>
            <strong>{project.technologies}</strong>
          </div>
          {open && (
            <ul className="project-bullets">
              {project.bullets.map((bullet, index) => <li key={bullet} data-testid={`text-project-detail-${project.number}-${index}`}>{bullet}</li>)}
            </ul>
          )}
          <button className="text-button" type="button" onClick={() => setOpen((current) => !current)} data-testid={`button-toggle-project-${project.number}`} aria-expanded={open}>
            {open ? 'Collapse notes' : 'Read project notes'}
            <ChevronDown size={16} className={open ? 'rotate' : ''} />
          </button>
        </div>
        <div className="project-card-foot">
          {project.github ? (
            <button className="repo-placeholder" type="button" disabled data-testid={`button-disabled-repo-${project.number}`} aria-label="GitHub repository link not provided">
              <Github size={15} /> GitHub: {project.github} <span>link pending</span>
            </button>
          ) : (
            <span className="repo-placeholder repo-muted"><PenLine size={15} /> prototype / Figma</span>
          )}
          <span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>
      </article>
    </Reveal>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('fenishmodi006@gmail.com');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleNav = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-lockup" type="button" onClick={() => handleNav('top')} data-testid="button-home">
            <NotebookMark />
            <span className="brand-name">Fenish Modi</span>
          </button>
          <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => handleNav(item.id)} data-testid={`button-nav-${item.id}`}>
                <span>{item.label}</span>
                <small>0{navItems.indexOf(item) + 1}</small>
              </button>
            ))}
            <button type="button" className="nav-contact" onClick={() => handleNav('contact')} data-testid="button-nav-contact">Start a conversation <ArrowUpRight size={15} /></button>
          </nav>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-toggle-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <Reveal>
              <div className="eyebrow"><span className="status-dot" /> Open to software development internship opportunities</div>
            </Reveal>
            <Reveal delay={80}>
              <p className="hero-kicker">Aspiring software developer <span>/</span> Python enthusiast</p>
            </Reveal>
            <Reveal delay={140}>
              <h1>Systems that make<br /><em>the complex</em> feel clear.</h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="hero-summary">I am Fenish Chetankumar Modi, a Computer Engineering undergraduate in Patan, Gujarat, specializing in backend development with Python and Flask, with hands-on exposure to cloud infrastructure on AWS.</p>
            </Reveal>
            <Reveal delay={300} className="hero-actions">
              <button className="button-primary" type="button" onClick={() => handleNav('projects')} data-testid="button-view-projects">Explore the work <ArrowDownRight size={17} /></button>
              <a className="button-quiet" href="mailto:fenishmodi006@gmail.com" data-testid="link-email-hero">Email Fenish <Mail size={16} /></a>
              <SocialLink type="GitHub" location="hero" />
              <SocialLink type="LinkedIn" location="hero" />
            </Reveal>
          </div>
          <Reveal className="hero-visual" delay={180}>
            <div className="visual-frame">
              <div className="frame-bar"><span>fenish / field-notes / 001</span><span className="frame-live"><i /> live notebook</span></div>
              <div className="blueprint-image">
                <img src="/cloud-blueprint.png" alt="Abstract cloud infrastructure blueprint" />
                <div className="blueprint-overlay" />
                <div className="blueprint-caption"><span>01</span><strong>trace / deploy / learn</strong><small>backend systems + cloud infrastructure</small></div>
              </div>
              <div className="visual-foot"><span>patan, gujarat</span><span>23°50′N / 72°07′E</span></div>
            </div>
          </Reveal>
        </div>
        <div className="hero-note">
          <span>Scroll to inspect the notebook</span>
          <div className="line" />
          <ArrowDownRight size={17} />
        </div>
      </section>

      <section id="profile" className="profile-section section-wrap">
        <div className="section-label"><span>01</span><span>Profile / README</span></div>
        <div className="profile-grid">
          <Reveal className="profile-intro">
            <p className="overline">A short orientation</p>
            <h2>Curious by default.<br /><span>Precise when it matters.</span></h2>
            <div className="note-rule" />
            <p className="body-copy">Computer Engineering undergraduate specializing in backend development with Python and Flask, and hands-on exposure to cloud infrastructure on AWS.</p>
          </Reveal>
          <Reveal className="profile-card" delay={100}>
            <div className="card-index">readme.md <span>↗</span></div>
            <p>Built and deployed a full-stack academic project integrating authentication, database design, and cloud services.</p>
            <p>Seeking a Software Development Internship to contribute to real-world engineering teams and grow as a backend/cloud developer.</p>
            <div className="card-signature"><span>FCM</span><span>last edited / 2026</span></div>
          </Reveal>
        </div>
      </section>

      <section id="experience" className="dark-band section-wrap">
        <div className="section-label light-label"><span>02</span><span>Experience / field notes</span></div>
        <div className="section-heading-row">
          <Reveal><h2>Learning in public,<br /><span>building in practice.</span></h2></Reveal>
          <Reveal delay={100}><p>Two internships, two different lenses: how things work in a browser, and how a product earns trust before it ships.</p></Reveal>
        </div>
        <div className="experience-list">
          <Reveal delay={80}>
            <article className="experience-item" data-testid="card-experience-javascript">
              <div className="experience-date"><span>June</span><strong>2025</strong></div>
              <div className="experience-marker"><BriefcaseBusiness size={18} /></div>
              <div className="experience-copy">
                <p className="overline">Internship / 01</p>
                <h3>JavaScript Intern</h3>
                <p className="company">Aspiration IT Consulting</p>
                <ul>
                  <li>Learned JavaScript fundamentals, including variables, functions, DOM manipulation, and event handling.</li>
                  <li>Completed hands-on coding exercises and practical assignments to strengthen JavaScript programming skills.</li>
                  <li>Gained practical exposure to client-side web development concepts.</li>
                </ul>
              </div>
              <span className="experience-arrow"><ArrowUpRight size={22} /></span>
            </article>
          </Reveal>
          <Reveal delay={160}>
            <article className="experience-item" data-testid="card-experience-design">
              <div className="experience-date"><span>December</span><strong>2025</strong></div>
              <div className="experience-marker"><PenLine size={18} /></div>
              <div className="experience-copy">
                <p className="overline">Internship / 02</p>
                <h3>Graphics Design Intern</h3>
                <p className="company">CodeAlpha</p>
                <ul>
                  <li>Designed a 5-screen e-commerce website prototype using Figma.</li>
                  <li>Created a custom logo by applying UI/UX and branding principles.</li>
                  <li>Developed wireframing and prototyping skills through practical design assignments.</li>
                </ul>
              </div>
              <span className="experience-arrow"><ArrowUpRight size={22} /></span>
            </article>
          </Reveal>
        </div>
      </section>

      <section id="projects" className="projects-section section-wrap">
        <div className="section-label"><span>03</span><span>Academic projects / selected</span></div>
        <div className="section-heading-row projects-heading">
          <Reveal><h2>Proof of work,<br /><span>not just promise.</span></h2></Reveal>
          <Reveal delay={100}><p>Projects are where the notes become systems: authenticated, data-aware, and designed for the people who use them.</p></Reveal>
        </div>
        <div className="projects-list">
          {projects.map((project) => <ProjectCard key={project.number} project={project} />)}
        </div>
      </section>

      <section id="stack" className="stack-section section-wrap">
        <div className="section-label"><span>04</span><span>Skills / working stack</span></div>
        <div className="stack-layout">
          <Reveal className="stack-title"><p className="overline">The current toolkit</p><h2>Tools I use to<br /><span>think in systems.</span></h2><p className="stack-note">The basics are deliberately visible. Strong foundations leave room for better questions.</p></Reveal>
          <div className="skill-list">
            {skillGroups.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <Reveal key={skill.label} delay={index * 55}>
                  <div className="skill-row" data-testid={`row-skill-${index}`}>
                    <span className="skill-icon"><Icon size={19} /></span>
                    <span className="skill-label">{skill.label}</span>
                    <strong>{skill.value}</strong>
                    <span className="skill-index">0{index + 1}</span>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={330}>
              <div className="concept-row"><span className="concept-label">Core concepts</span><p>Object-Oriented Programming (OOP), Data Structures &amp; Algorithms (DSA), DBMS, Operating Systems, Computer Networks</p></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="education" className="education-section dark-band section-wrap">
        <div className="section-label light-label"><span>05</span><span>Education / credentials</span></div>
        <div className="education-grid">
          <Reveal className="education-title"><p className="overline">The long arc</p><h2>Still learning.<br /><span>Already shipping.</span></h2><div className="cgpa-stamp"><strong>8.80</strong><span>CGPA / 10</span></div></Reveal>
          <div className="timeline">
            <Reveal delay={100}><article className="timeline-item featured"><span className="timeline-year">2023 — 2027</span><div><h3>Bachelor of Technology (B.Tech) in Computer Engineering</h3><p>Silver Oak College of Engineering &amp; Technology (SOCET), Ahmedabad</p></div><GraduationCap size={20} /></article></Reveal>
            <Reveal delay={160}><article className="timeline-item"><span className="timeline-year">2021 — 2022</span><div><h3>Higher Secondary (Class XII), GSEB</h3><p>Lord Krishna School of Science, Patan</p></div><Award size={19} /></article></Reveal>
            <Reveal delay={220}><article className="timeline-item"><span className="timeline-year">2019 — 2020</span><div><h3>Secondary (Class X), CBSE</h3><p>Krishna International Public School, Patan</p></div><Award size={19} /></article></Reveal>
          </div>
        </div>
        <div className="certifications">
          <Reveal><p className="overline">Certifications / continued curiosity</p></Reveal>
          <div className="cert-grid">
            {['AI + Sustainability Virtual Internship — IBM SkillsBuild (2026)', 'Unleashing the Power of AI Agents — IBM SkillsBuild (2026)', 'Intermediate Coding in Python with AI — Unstop', 'Ultimate Python Guide — Unstop'].map((certificate, index) => (
              <Reveal key={certificate} delay={index * 55}><div className="cert-card" data-testid={`card-certification-${index}`}><span>0{index + 1}</span><p>{certificate}</p><ArrowUpRight size={16} /></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section section-wrap">
        <Reveal className="contact-quote"><Sparkles size={20} /><p>Good engineering is a conversation between a clear question and a thoughtful system.</p></Reveal>
        <Reveal className="contact-main" delay={90}>
          <p className="overline">06 / open channel</p>
          <h2>Have a problem<br /><em>worth unpacking?</em></h2>
          <p className="contact-copy">I am seeking a Software Development Internship to contribute to real-world engineering teams and grow as a backend/cloud developer.</p>
          <div className="contact-actions">
            <a className="button-primary" href="mailto:fenishmodi006@gmail.com" data-testid="link-email-contact"><Mail size={17} /> fenishmodi006@gmail.com</a>
            <button className="copy-button" type="button" onClick={copyEmail} data-testid="button-copy-email" aria-live="polite">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy email'}</button>
          </div>
        </Reveal>
        <Reveal className="contact-details" delay={160}>
          <div><span>Based in</span><strong>Patan, Gujarat 384265</strong></div>
          <div><span>Phone</span><strong>+91 9265361313</strong></div>
          <div><span>Elsewhere</span><div className="social-row"><SocialLink type="LinkedIn" location="contact" /><SocialLink type="GitHub" location="contact" /></div></div>
        </Reveal>
      </section>

      <footer className="site-footer">
        <div className="footer-inner"><button className="footer-brand" type="button" onClick={() => handleNav('top')} data-testid="button-footer-home"><NotebookMark /><span>Fenish Chetankumar Modi</span></button><span>Personal engineering notebook / 2026</span><span>Built with curiosity</span></div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
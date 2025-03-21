
import { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
}

const skills: Skill[] = [
  {
    name: "React",
    level: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Three.js",
    level: 85,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 2L2 19h20L12 2zm0 4.6L18.07 17H5.93L12 6.6z" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    level: 85,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M3 3h18v18H3V3zm10 4v2h2.67A2.31 2.31 0 0 1 19 11v4h-2v-4a.31.31 0 0 0-.33-.33H13V19H9v-8h4zm-4-2v2h2v8h2V7h2V5H9z"/>
      </svg>
    ),
  },
  {
    name: "CSS/Tailwind",
    level: 95,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M6 2l2 18h8l2-18H6zm10.6 5h-5.8l.2 2h5.4l-.6 5h-3.6l-.2 2h3.4l-.4 3h-3l-.2 2h7l1.4-12h-3.2z" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    level: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M3 3h18v18H3V3zm16.5 10.5c0 2.25-1.5 3.6-3.6 3.6-1.95 0-3-1.2-3.45-2.4l1.95-.75c.15.6.6 1.05 1.35 1.05.9 0 1.35-.45 1.35-1.35V8.4h2.25v5.1h.15zM9.75 13.95c.3.6.9.9 1.5.9.6 0 1.05-.3 1.05-.75 0-.45-.3-.6-1.05-.9l-.3-.15c-1.05-.45-1.8-1.05-1.8-2.25 0-1.05.9-1.95 2.1-1.95 1.05 0 1.8.45 2.25 1.5l-1.65.9c-.3-.45-.45-.6-.75-.6-.3 0-.6.15-.6.45 0 .3.3.45.75.6l.3.15c1.2.6 1.95 1.05 1.95 2.4 0 1.35-1.05 2.1-2.55 2.1-1.35 0-2.4-.75-2.7-1.8l1.5-.45z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    level: 80,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.2-.85 2.2-2.33V8.17c0-.12-.1-.22-.22-.22h-.93c-.13 0-.23.1-.23.22v8.35c0 .66-.68 1.31-1.77.76l-2.05-1.17c-.07-.05-.12-.13-.12-.22V7.71c0-.1.04-.18.12-.23l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.08.04.13.12.13.23v8.58c0 .09-.05.17-.13.22l-7.44 4.29c-.06.04-.16.04-.23 0l-1.87-1.12c-.08-.05-.18-.05-.27-.01-.75.42-.9.48-1.6.73-.18.07-.45.17.1.38l2.45 1.45c.23.13.51.2.78.2.27 0 .54-.06.78-.2l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14 8c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47-.02-.1-.11-.18-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16C19.36 8.64 18.06 8 14 8z" />
      </svg>
    ),
  },
];

const SkillBar = ({ name, level, icon }: Skill) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary">{icon}</div>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full skill-bar" 
          style={{ width: '0%', transformOrigin: 'left' }}
          data-width={`${level}%`}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
            
            // Find and animate skill bars within this element
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach((bar) => {
              const htmlBar = bar as HTMLElement;
              const targetWidth = htmlBar.dataset.width || '0%';
              
              // Delay each bar's animation slightly
              setTimeout(() => {
                htmlBar.style.width = targetWidth;
              }, 200);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  return (
    <section id="skills" className="py-20 bg-background/60 backdrop-blur-sm" ref={containerRef}>
      <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-on-scroll opacity-0">
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-bold mt-2">My Skills</h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            I've worked with a range of technologies in the web development world, from front-end to back-end.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <div key={skill.name} className="animate-on-scroll opacity-0" style={{ animationDelay: `${0.1 * index}s` }}>
              <SkillBar name={skill.name} level={skill.level} icon={skill.icon} />
            </div>
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 animate-on-scroll opacity-0 backdrop-blur-md bg-background/70 border border-border/50 rounded-xl" style={{ animationDelay: '0.1s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <rect width="18" height="10" x="3" y="11" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" x2="8" y1="16" y2="16" />
                <line x1="16" x2="16" y1="16" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Frontend Development</h3>
            <p className="text-muted-foreground">
              Creating responsive and interactive user interfaces with React, TypeScript, and modern CSS frameworks.
            </p>
          </div>
          
          <div className="glass-panel p-6 animate-on-scroll opacity-0 backdrop-blur-md bg-background/70 border border-border/50 rounded-xl" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" x2="12" y1="22" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
                <polyline points="2 15.5 12 8.5 22 15.5" />
                <line x1="12" x2="12" y1="2" y2="8.5" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">3D Web Development</h3>
            <p className="text-muted-foreground">
              Building immersive 3D experiences on the web using Three.js and WebGL technologies.
            </p>
          </div>
          
          <div className="glass-panel p-6 animate-on-scroll opacity-0 backdrop-blur-md bg-background/70 border border-border/50 rounded-xl" style={{ animationDelay: '0.5s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Backend Integration</h3>
            <p className="text-muted-foreground">
              Connecting frontend applications to APIs and databases to create full-stack solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;


import { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
}

const skills: Skill[] = [
  {
    name: "React Native",
    level: 95,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Redux/Context API",
    level: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M16.63 16.563c.885-.092 1.557-.863 1.527-1.788a1.723 1.723 0 0 0-1.71-1.665h-.062c-.947.03-1.68.832-1.65 1.788.03.463.215.863.493 1.14-1.042 2.062-2.632 3.574-5.02 4.838-1.588.863-3.24 1.172-4.885.956-1.372-.185-2.446-.802-3.116-1.818-.977-1.51-1.073-3.143-.246-4.777.617-1.232 1.588-2.154 2.2-2.585.092-.092.215-.154.308-.216a1.78 1.78 0 0 0-.37-.587c-3.054-.091-4.363 1.666-4.67 2.402-.823 1.972-.308 3.883 1.073 5.362.915 1.014 2.354 1.57 4.147 1.57.462 0 .947-.03 1.434-.123 3.054-.493 5.358-2.093 6.68-4.407l.03.03zm3.732-3.22c-1.62-1.912-4-2.956-6.741-2.956h-.34a1.66 1.66 0 0 0-1.435-.832h-.061c-.946.03-1.681.832-1.65 1.788.03.925.793 1.665 1.71 1.665h.062c.493-.03.946-.277 1.228-.647h.37c1.62 0 3.147.463 4.532 1.357 1.064.678 1.835 1.572 2.261 2.648.37.894.34 1.757-.092 2.495-.648 1.172-1.743 1.818-3.178 1.818-1.835 0-3.27-.833-4.117-1.665-.123-.123-.216-.215-.339-.339-.215.185-.493.493-.71.71.915.894 2.17 1.818 4.054 2.034 1.897.216 3.732-.462 4.763-1.88.916-1.264 1.073-3.144.401-4.838-.03 0-.03 0-.062-.031a6.037 6.037 0 0 0-.823-1.017c-.123-.123-.246-.246-.4-.37l.03-.03zm-13.12.522c.03.926.794 1.666 1.71 1.666h.062c.947-.03 1.68-.832 1.65-1.788-.03-.925-.792-1.665-1.711-1.665h-.062c-.061 0-.154 0-.215.03-.555-1.326-.895-2.741-.895-4.16 0-2.31.977-4.437 2.6-6.164C12.257.492 14.426 0 16.075 0c3.27 0 4.762 2.033 4.885 4.036v.123c.37.154.802.308 1.228.462a31.45 31.45 0 0 0-.185-1.757C21.696 1.05 19.526 0 17.146 0c-2.23 0-4.824.647-6.802 2.525-2.354 2.218-3.67 5.17-3.67 8.005 0 1.48.277 2.956.823 4.345h.062c.123-.03.246-.03.37-.03h.061z" />
      </svg>
    ),
  },
  {
    name: "JavaScript/TypeScript",
    level: 90,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M3 3h18v18H3V3zm10 4v2h2.67A2.31 2.31 0 0 1 19 11v4h-2v-4a.31.31 0 0 0-.33-.33H13V19H9v-8h4zm-4-2v2h2v8h2V7h2V5H9z"/>
      </svg>
    ),
  },
  {
    name: "UI/UX For Mobile",
    level: 85,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M17.5 12a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 0117.5 9a1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m-3-4A1.5 1.5 0 0113 6.5 1.5 1.5 0 0114.5 5 1.5 1.5 0 0116 6.5 1.5 1.5 0 0114.5 8m-5 0A1.5 1.5 0 018 6.5 1.5 1.5 0 019.5 5 1.5 1.5 0 0111 6.5 1.5 1.5 0 019.5 8m-3 4A1.5 1.5 0 015 10.5 1.5 1.5 0 016.5 9 1.5 1.5 0 018 10.5 1.5 1.5 0 016.5 12M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9m0 16a7 7 0 01-7-7 7 7 0 017-7 7 7 0 017 7 7 7 0 01-7 7m0-2a5 5 0 00-5-5c0 2.76 2.24 5 5 5z" />
      </svg>
    ),
  },
  {
    name: "Expo",
    level: 92,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.95 4.83L0 19.52h23.91L11.95 4.83zm0 4.21l3.97 6.29H7.98l3.97-6.29z" />
      </svg>
    ),
  },
  {
    name: "Native APIs",
    level: 80,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M7.5 16.5h9v2h-9v-2zm2-14C6.29 2.5 4 4.79 4 8.5s2.29 6 5.5 6 5.5-2.29 5.5-6-2.29-6-5.5-6zm0 9C8.06 11.5 6 9.81 6 8.5s2.06-3 3.5-3 3.5 1.69 3.5 3-2.06 3-3.5 3zm9 0c-.69 0-1.25.56-1.25 1.25V15H6.75v-4.25C6.75 10.06 6.19 9.5 5.5 9.5S4.75 10.06 4.75 10.75V15a2 2 0 002 2h10.5a2 2 0 002-2v-4.25c0-.69-.56-1.25-1.25-1.25z"/>
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
            I've mastered a variety of technologies in the mobile app development ecosystem, from UI design to native functionality.
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
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Mobile UI Development</h3>
            <p className="text-muted-foreground">
              Creating beautiful, responsive mobile interfaces with React Native, custom components, and animations that work on both iOS and Android.
            </p>
          </div>
          
          <div className="glass-panel p-6 animate-on-scroll opacity-0 backdrop-blur-md bg-background/70 border border-border/50 rounded-xl" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Cross-Platform Expertise</h3>
            <p className="text-muted-foreground">
              Building apps that work seamlessly across devices and platforms with a single codebase, maximizing efficiency and consistency.
            </p>
          </div>
          
          <div className="glass-panel p-6 animate-on-scroll opacity-0 backdrop-blur-md bg-background/70 border border-border/50 rounded-xl" style={{ animationDelay: '0.5s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">API Integration</h3>
            <p className="text-muted-foreground">
              Connecting mobile apps to backend services, REST APIs, GraphQL, and third-party services for complete, data-driven applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

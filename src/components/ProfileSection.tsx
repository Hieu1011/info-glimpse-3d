
import { useEffect, useRef } from 'react';

const ProfileSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
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
    <section id="about" className="min-h-screen flex items-center pt-24 pb-16" ref={containerRef}>
      <div className="section-container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2 animate-on-scroll opacity-0" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Hello, I'm</h2>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your Name</h1>
              <p className="text-xl md:text-2xl text-muted-foreground">Frontend Developer & Designer</p>
            </div>
            
            <p className="text-lg text-muted-foreground animate-on-scroll opacity-0" style={{ animationDelay: '0.3s' }}>
              I'm a passionate developer with a love for creating beautiful, functional, and user-friendly web experiences. 
              With a background in design and development, I bridge the gap between aesthetics and functionality.
            </p>
            
            <div className="flex space-x-4 animate-on-scroll opacity-0" style={{ animationDelay: '0.5s' }}>
              <a 
                href="#contact" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                Contact Me
              </a>
              <a 
                href="#projects" 
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                View My Work
              </a>
            </div>
          </div>
          
          <div className="animate-on-scroll opacity-0" style={{ animationDelay: '0.7s' }}>
            <div className="relative">
              <div className="glass-panel p-6 rounded-2xl backdrop-blur-md bg-background/70 border border-border/50">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">About Me</h3>
                    <p className="text-muted-foreground">
                      I have over 5 years of experience building modern web applications. My expertise includes 
                      React, Three.js, TypeScript, and modern CSS techniques. I'm passionate about creating 
                      immersive web experiences that delight users.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Education</h3>
                    <p className="text-muted-foreground">
                      B.S. in Computer Science<br />
                      University of Technology<br />
                      2015 - 2019
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-center space-x-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl z-[-1]" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-xl z-[-1]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;

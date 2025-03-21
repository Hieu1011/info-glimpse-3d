
import { useEffect, useState } from 'react';
import ThreeScene from '@/components/ThreeScene';
import NavBar from '@/components/NavBar';
import ProfileSection from '@/components/ProfileSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="relative min-h-screen">
      {isLoading ? (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <h1 className="text-2xl font-medium animate-pulse">Loading...</h1>
          </div>
        </div>
      ) : (
        <>
          <ThreeScene />
          <AnimatedBackground />
          
          <div className="relative z-10">
            <NavBar />
            
            <main>
              <ProfileSection />
              <SkillsSection />
              <ProjectsSection />
              <ContactSection />
            </main>
            
            <footer className="bg-background border-t border-border py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
                
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </footer>
            
            <div className="scroll-indicator">
              <div className="scroll-indicator-dot"></div>
              <div className="scroll-indicator-dot"></div>
              <div className="scroll-indicator-dot"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;

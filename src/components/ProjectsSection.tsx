
import { useEffect, useRef } from 'react';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    title: "3D Portfolio Website",
    description: "An interactive portfolio website with Three.js animations and custom 3D models.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80",
    tags: ["Three.js", "React", "TypeScript"],
    link: "#",
  },
  {
    title: "E-Commerce Dashboard",
    description: "A modern admin dashboard for an e-commerce platform with data visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "Redux", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Augmented Reality App",
    description: "A web-based AR application for visualizing products in real-world environments.",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=800&q=80",
    tags: ["WebXR", "Three.js", "JavaScript"],
    link: "#",
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-lg animate-on-scroll opacity-0"
      style={{ animationDelay: `${0.2 * index}s` }}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
        <p className="text-white/80 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
              {tag}
            </span>
          ))}
        </div>
        
        <a 
          href={project.link} 
          className="inline-flex items-center text-white hover:text-primary transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
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
    <section id="projects" className="py-20" ref={containerRef}>
      <div className="section-container">
        <div className="text-center mb-12 animate-on-scroll opacity-0">
          <h2 className="text-sm font-medium text-primary tracking-widest uppercase">Portfolio</h2>
          <h3 className="section-title">Featured Projects</h3>
          <p className="section-subtitle max-w-2xl mx-auto">
            Explore some of my recent work. These projects showcase my skills in web development, 3D graphics, and user interface design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center animate-on-scroll opacity-0" style={{ animationDelay: '0.6s' }}>
          <a 
            href="#" 
            className="inline-flex items-center justify-center h-10 px-8 font-medium text-primary hover:underline"
          >
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

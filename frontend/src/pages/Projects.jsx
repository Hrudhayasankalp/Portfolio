import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract all unique technologies from all projects
  const allTechs = projects.reduce((acc, proj) => {
    proj.techStack.forEach(tech => {
      if (!acc.includes(tech)) acc.push(tech);
    });
    return acc;
  }, []);
  
  const filters = ["All", ...allTechs.slice(0, 5)]; // Show top 5 tech stacks as filters

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.techStack.includes(activeFilter));

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold mb-6"
        >
          Featured <span className="text-gradient">Projects</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-base md:text-xl px-4"
        >
          Explore my recent work, showcasing my skills in full-stack development, 
          UI/UX design, and problem-solving.
        </motion.p>
      </div>

      {projects.length > 0 && filters.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-transparent" 
                  : "bg-transparent text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No projects found. Check back later!</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:border-blue-500/30 transition-colors"
              >
                <div className="relative h-56 overflow-hidden bg-gray-800">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-700">
                      <span className="text-4xl">🚀</span>
                      <span className="text-gray-500 mt-2 text-sm font-medium">Project Preview</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/5 text-gray-300 text-xs rounded-md border border-white/10 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 pt-4 border-t border-gray-800">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`flex justify-center items-center py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ${!project.liveUrl ? "flex-1" : ""}`}
                        title="View Source"
                      >
                        <span className="text-sm font-medium">GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Projects;

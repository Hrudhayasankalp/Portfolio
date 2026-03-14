import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import api from "../services/api";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [profRes, skillRes, expRes, eduRes] = await Promise.all([
          api.get("/profile"),
          api.get("/skills"),
          api.get("/experience"),
          api.get("/education")
        ]);
        setProfile(profRes.data);
        setSkills(skillRes.data);
        setExperience(expRes.data);
        setEducation(eduRes.data);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-xl md:text-2xl font-medium text-blue-400">
              Hello, I'm
            </h2>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              {profile?.name || "Developer"}
            </h1>
            <h3 className="text-3xl md:text-5xl font-bold text-gradient pb-2">
              {profile?.role || "Full Stack Engineer"}
            </h3>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed pt-4">
              {profile?.bio || "I build digital products and user experiences that matter."}
            </p>
            <div className="flex gap-4 pt-8">
              <a href="/projects" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30">
                View My Work
              </a>
              <a href="/contact" className="px-8 py-3 bg-transparent border border-gray-600 hover:border-gray-300 rounded-full font-medium transition-colors">
                Contact Me
              </a>
            </div>

            <div className="flex gap-6 pt-8 text-gray-400">
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                  <span className="text-3xl"><FaGithub /></span>
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <span className="text-3xl"><FaLinkedin /></span>
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            {profile?.avatar ? (
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl relative group">
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full scale-105 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
              </div>
            ) : (
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-blue-900 to-purple-900 border-4 border-gray-800 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAiLz4KODxwYXRoIGQ9Ik0wIDBMODggTTggMEwwIDgiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] mix-blend-overlay"></div>
                <span className="text-6xl text-white/50 relative z-10">&lt;/&gt;</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Skills Teaser */}
      {skills.length > 0 && (
        <section id="skills" className="py-12 border-t border-gray-800/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
            <p className="text-gray-400">Tools and technologies I work with</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5) }}
                className="px-8 py-4 glass rounded-2xl text-lg font-medium hover:bg-white/10 hover:border-white/20 transition-colors cursor-default shadow-lg"
              >
                {skill.name}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <section id="experience" className="py-12 border-t border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
            <p className="text-gray-400">My professional journey</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l border-gray-700 ml-4 space-y-12">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative pl-12"
                >
                  <span className="absolute -left-3 top-2 w-6 h-6 rounded-full bg-blue-900 border-4 border-gray-900 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  </span>

                  <div className="glass-card p-8 rounded-2xl hover:border-blue-500/30 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                        <p className="text-lg text-gray-300 font-medium">{exp.company}</p>
                      </div>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                    </div>

                    <p className="text-gray-400 leading-relaxed mb-6 whitespace-pre-wrap">{exp.description}</p>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-lg font-medium border border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Timeline */}
      {education.length > 0 && (
        <section id="education" className="py-12 border-t border-gray-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Education</h2>
            <p className="text-gray-400">My academic background</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl hover:border-purple-500/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl border border-purple-500/20">
                    🎓
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{edu.institution}</h3>
                <p className="text-gray-300 font-medium mt-1">{edu.degree} in {edu.field}</p>
                {edu.grade && (
                  <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-gray-700/50">
                    <span className="text-gray-500">Grade:</span> {edu.grade}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

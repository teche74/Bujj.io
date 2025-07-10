
document.addEventListener("DOMContentLoaded", () => {
  if (typeof TagCloud === 'undefined') {
    console.error("TagCloud is not loaded.");
    return;
  }

  const skills = [
    "Python", "C", "C++", "Pandas", "NumPy",
    "Git", "GitHub", "SQL", "Matplotlib", "Spark",
    "Cassandra", "R", "Hadoop"
  ];

  const skillIconMap = {
    "Python": "python",
    "C": "c",
    "C++": "cpp",
    "Git": "git",
    "GitHub": "github",
    "SQL": "mysql",
    "NumPy": "numpy",
    "Pandas": "pandas",
    "Matplotlib": "matplotlib",
    "Spark": "spark",
    "Cassandra": "cassandra",
    "Hadoop": "hadoop",
    "R": "r"
  };

  const iconGlowColors = {
    "python": "#306998",
    "c": "#A8B9CC",
    "cpp": "#00599C",
    "git": "#F05032",
    "github": "#000",
    "mysql": "#00758F",
    "numpy": "#013243",
    "pandas": "#150458",
    "matplotlib": "#11557C",
    "spark": "#E25A1C",
    "cassandra": "#1287B1",
    "hadoop": "#FFCC00",
    "r": "#276DC3"
  };

  TagCloud('#skills-sphere', skills, {
    radius: 300,
    maxSpeed: 'fast',
    initSpeed: 'normal',
    direction: 135,
    keep: true
  });

  setTimeout(() => {
    document.querySelectorAll('#skills-sphere span').forEach((el) => {
      const skill = el.textContent.trim();
      const iconFile = skillIconMap[skill];

      if (iconFile) {
        const glow = iconGlowColors[iconFile] || "#00ccff";
        const url = `https://go-skill-icons.vercel.app/api/icons?i=${iconFile}`;
        el.innerHTML = `
          <img src="${url}" 
               title="${skill}" 
               alt="${skill}" 
               style="
                 width: 48px;
                 height: 48px;
                 border-radius: 8px;
                 transition: transform 0.3s ease, box-shadow 0.3s ease;
               "
               onmouseover="this.style.boxShadow='0 0 15px ${glow}, 0 0 25px ${glow}'"
               onmouseout="this.style.boxShadow='none'"
          />
        `;
      } else {
        el.innerHTML = `<span title="${skill}">${skill}</span>`;
      }
    });
  }, 100);
});

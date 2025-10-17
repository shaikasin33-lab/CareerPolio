// ========== Save form data (details.html) ==========
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("portfolioForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const reader = new FileReader();
      const photoFile = document.getElementById("photo").files[0];

      reader.onload = function() {
        const photoData = reader.result || "";

        const portfolioData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          mobile: document.getElementById("mobile").value,
          about: document.getElementById("about").value,
          education: document.getElementById("education").value,
          experience: document.getElementById("experience").value,
          meeting: document.getElementById("meeting").value,
          skills: document.getElementById("skills").value,
          projects: document.getElementById("projects").value,
          linkedin: document.getElementById("linkedin").value,
          github: document.getElementById("github").value,
          photo: photoData
        };

        localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
        window.location.href = "dashboard.html";
      };

      if (photoFile) {
        reader.readAsDataURL(photoFile);
      } else {
        reader.onload();
      }
    });
  }
});

// ========== Display data (dashboard.html) ==========
document.addEventListener("DOMContentLoaded", function() {
  const display = document.getElementById("portfolio-display");
  if (display) {
    const data = JSON.parse(localStorage.getItem("portfolioData"));
    if (!data) return;

    // Basic Info
    document.getElementById("display-name").textContent = data.name || "";
    document.getElementById("display-email").textContent = data.email || "";
    document.getElementById("display-mobile").textContent = data.mobile || "";
    document.getElementById("display-about").textContent = data.about || "";
    document.getElementById("display-education").textContent = data.education || "";
    document.getElementById("display-experience").textContent = data.experience || "";
    document.getElementById("display-meeting").textContent = data.meeting || "";
    document.getElementById("display-skills").textContent = data.skills || "";
    document.getElementById("display-projects").textContent = data.projects || "";

    // Photo
    if (data.photo) document.getElementById("display-photo").src = data.photo;

    // LinkedIn and GitHub Links
    const linkedinLink = document.getElementById("display-linkedin");
    const githubLink = document.getElementById("display-github");

    if (data.linkedin && data.linkedin.trim() !== "") {
      linkedinLink.href = data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin;
      linkedinLink.textContent = "View LinkedIn Profile";
      linkedinLink.target = "_blank";
      linkedinLink.style.color = "#0077b5";
    } else {
      linkedinLink.textContent = "Not provided";
    }

    if (data.github && data.github.trim() !== "") {
      githubLink.href = data.github.startsWith("http") ? data.github : "https://" + data.github;
      githubLink.textContent = "View GitHub Profile";
      githubLink.target = "_blank";
      githubLink.style.color = "#333";
    } else {
      githubLink.textContent = "Not provided";
    }

    // AI Suggestions
    const suggestions = getAISuggestions(data.skills);
    document.getElementById("suggested-projects").textContent = suggestions.projects;
    document.getElementById("suggested-jobs").textContent = suggestions.jobs;
  }

  // Download as PDF
  const downloadBtn = document.getElementById("downloadPDF");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const data = JSON.parse(localStorage.getItem("portfolioData"));
      if (!data) return;

      doc.setFontSize(18);
      doc.text("Careerfolio Portfolio", 10, 20);
      doc.setFontSize(12);
      let y = 40;
      doc.text(`Name: ${data.name}`, 10, y); y += 10;
      doc.text(`Email: ${data.email}`, 10, y); y += 10;
      doc.text(`Mobile: ${data.mobile}`, 10, y); y += 10;
      doc.text(`Education: ${data.education}`, 10, y); y += 10;
      doc.text(`Experience: ${data.experience}`, 10, y); y += 10;
      doc.text(`Meeting: ${data.meeting}`, 10, y); y += 10;
      doc.text(`Skills: ${data.skills}`, 10, y); y += 10;
      doc.text(`Projects: ${data.projects}`, 10, y); y += 10;
      doc.text(`LinkedIn: ${data.linkedin}`, 10, y); y += 10;
      doc.text(`GitHub: ${data.github}`, 10, y); y += 10;

      // Add photo if available
      if (data.photo) {
        doc.addImage(data.photo, "JPEG", 150, 10, 40, 40);
      }

      doc.save(`${data.name}_Careerfolio.pdf`);
    });
  }
});

// ========== Simple AI Suggestions ==========
function getAISuggestions(skills) {
  skills = skills.toLowerCase();
  if (skills.includes("java")) {
    return { projects: "Library Management, Student Portal", jobs: "Java Developer, Backend Engineer" };
  } else if (skills.includes("python")) {
    return { projects: "AI Chatbot, Data Analyzer", jobs: "Python Developer, Data Scientist" };
  } else if (skills.includes("web")) {
    return { projects: "Portfolio Site, E-commerce UI", jobs: "Frontend Developer, Web Designer" };
  } else if (skills.includes("html") || skills.includes("css") || skills.includes("javascript")) {
    return { projects: "Responsive Portfolio, Task Tracker App", jobs: "Web Developer, UI Designer" };
  } else {
    return { projects: "General Portfolio", jobs: "Software Trainee" };
  }
}

// ========================================
// INITIALIZATION & DOM ELEMENTS
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    jobListing: document.getElementById("job-listing"),
    keywordInput: document.getElementById("keyword"),
    postedAfterInput: document.getElementById("posted_after"),
    applyFiltersBtn: document.getElementById("applyFilters"),
    clearFiltersBtn: document.getElementById("clearFilters"),
    heroSearchBtn: document.getElementById("heroSearchBtn"),
    addJobBtn: document.getElementById("addJobButton"),
    jobModal: document.getElementById("jobModal"),
    modalClose: document.querySelector(".modal-close"),
    modalOverlay: document.querySelector(".modal-overlay"),
    jobForm: document.getElementById("jobForm"),
    jobIdInput: document.getElementById("jobId"),
    jobTitleInput: document.getElementById("jobTitle"),
    companyUrlInput: document.getElementById("companyUrl"),
    jobUrlInput: document.getElementById("jobUrl"),
    jobPostingDateInput: document.getElementById("jobPostingDate"),
    themeToggle: document.getElementById("themeToggle"),
    navbar: document.getElementById("navbar"),
    suggestionTags: document.querySelectorAll(".suggestion-tag"),
  };

  const API_BASE_URL = "http://127.0.0.1:5000/api/jobs";

  // THEME MANAGEMENT
  const themeManager = {
    init() {
      const savedTheme = this.getSavedTheme();
      if (savedTheme === "light") {
        this.setLightTheme();
      }
      this.attachListeners();
    },
    getSavedTheme() {
      try {
        return localStorage.getItem("jobverse-theme");
      } catch (e) {
        return "dark";
      }
    },
    saveTheme(theme) {
      try {
        localStorage.setItem("jobverse-theme", theme);
      } catch (e) {
        console.warn("Unable to save theme preference");
      }
    },
    setLightTheme() {
      document.documentElement.setAttribute("data-theme", "light");
      elements.themeToggle &&
        (elements.themeToggle.innerHTML =
          '<i class="fa-solid fa-sun theme-icon"></i>');
    },
    setDarkTheme() {
      document.documentElement.removeAttribute("data-theme");
      elements.themeToggle &&
        (elements.themeToggle.innerHTML =
          '<i class="fa-solid fa-moon theme-icon"></i>');
    },
    toggle() {
      const isLight =
        document.documentElement.getAttribute("data-theme") === "light";
      if (isLight) {
        this.setDarkTheme();
        this.saveTheme("dark");
      } else {
        this.setLightTheme();
        this.saveTheme("light");
      }
    },
    attachListeners() {
      elements.themeToggle?.addEventListener("click", () => this.toggle());
    },
  };

  // NAVBAR SCROLL EFFECT
  const navbarManager = {
    init() {
      this.handleScroll();
      window.addEventListener("scroll", () => this.handleScroll(), {
        passive: true,
      });
    },
    handleScroll() {
      if (!elements.navbar) return;
      if (window.scrollY > 50) elements.navbar.classList.add("scrolled");
      else elements.navbar.classList.remove("scrolled");
    },
  };

  // UTILITIES
  const utils = {
    debounce(func, delay = 300) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },
    timeAgo(dateString) {
      if (!dateString) return "Unknown";
      const date = new Date(dateString);
      if (isNaN(date)) return "Unknown";
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
      ];
      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1)
          return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
      return "Just now";
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date)) return "";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    showNotification(message, type = "info") {
      console.log(`[${type.toUpperCase()}] ${message}`);
    },
  };

  // LOADING STATE
  const loadingManager = {
    showSkeletons(count = 6) {
      if (!elements.jobListing) return;
      elements.jobListing.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "job-card-skeleton";
        elements.jobListing.appendChild(skeleton);
      }
    },
    hide() {
      document
        .querySelectorAll(".job-card-skeleton")
        .forEach((s) => s.remove());
    },
  };

  // API FUNCTIONS (encode job URL when used as identifier)
  const api = {
    async fetchJobs() {
      const params = new URLSearchParams();
      if (elements.keywordInput?.value.trim())
        params.append("keyword", elements.keywordInput.value.trim());
      if (elements.postedAfterInput?.value)
        params.append("posted_after", elements.postedAfterInput.value);
      const url = params.toString()
        ? `${API_BASE_URL}?${params.toString()}`
        : API_BASE_URL;
      try {
        loadingManager.showSkeletons();
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const jobs = await response.json();
        jobDisplay.render(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        jobDisplay.renderError("Failed to load jobs. Please try again later.");
      }
    },
    async fetchJobById(id) {
      try {
        const encoded = encodeURIComponent(id);
        const response = await fetch(`${API_BASE_URL}/${encoded}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching job:", error);
        throw error;
      }
    },
    async saveJob(id, jobData) {
      const url = id
        ? `${API_BASE_URL}/${encodeURIComponent(id)}`
        : API_BASE_URL;
      const method = id ? "PUT" : "POST";
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        return await response.json();
      } catch (error) {
        console.error("Error saving job:", error);
        throw error;
      }
    },
    async deleteJob(id) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        return true;
      } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
      }
    },
  };

  // JOB DISPLAY
  const jobDisplay = {
    render(jobs) {
      loadingManager.hide();
      if (!elements.jobListing) return;
      elements.jobListing.innerHTML = "";
      if (!jobs || jobs.length === 0) {
        this.renderEmpty(
          "No jobs found. Try adjusting your search criteria or filters."
        );
        return;
      }
      jobs.forEach((job, index) => {
        const jobCard = this.createJobCard(job, index);
        elements.jobListing.appendChild(jobCard);
      });
      this.attachCardListeners();
    },
    createJobCard(job, index) {
      const card = document.createElement("div");
      card.className = "job-item";
      card.style.animationDelay = `${index * 0.1}s`;
      const companyName = this.extractDomain(job["Company URL"]);
      const timeAgoText = utils.timeAgo(job["Job Posting Date"]);
      const title = this.escapeHtml(job["Job Title"] || "Untitled");
      card.innerHTML = `
                <h3>${title}</h3>
                <p class="meta">
                    <strong>Company:</strong> <span>${this.escapeHtml(
                      companyName
                    )}</span>
                </p>
                <p class="meta">
                    <span class="pill">📅 ${this.escapeHtml(timeAgoText)}</span>
                </p>
                <div class="job-actions">
                    <button class="btn-edit" data-id="${job["Job URL"] || ""}">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn-delete" data-id="${
                      job["Job URL"] || ""
                    }">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            `;
      return card;
    },
    extractDomain(url) {
      if (!url) return "N/A";
      try {
        const domain = new URL(url).hostname;
        return domain.replace("www.", "");
      } catch {
        return url;
      }
    },
    escapeHtml(text) {
      if (text === undefined || text === null) return "";
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },
    renderEmpty(message = "No jobs found") {
      if (!elements.jobListing) return;
      elements.jobListing.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">
                        No jobs found
                    </h3>
                    <p style="color: var(--text-muted);">
                        ${this.escapeHtml(message)}
                    </p>
                </div>
            `;
    },
    renderError(message) {
      if (!elements.jobListing) return;
      elements.jobListing.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">
                        Something went wrong
                    </h3>
                    <p style="color: var(--text-muted);">
                        ${this.escapeHtml(message)}
                    </p>
                </div>
            `;
    },
    attachCardListeners() {
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          modalManager.openEdit(id);
        });
      });
      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          jobActions.delete(id);
        });
      });
    },
  };

  // MODAL MANAGER
  const modalManager = {
    open() {
      if (!elements.jobModal) return;
      elements.jobModal.style.display = "block";
      document.body.style.overflow = "hidden";
    },
    close() {
      if (!elements.jobModal) return;
      elements.jobModal.style.display = "none";
      document.body.style.overflow = "";
      this.resetForm();
    },
    resetForm() {
      elements.jobForm?.reset();
      if (elements.jobIdInput) elements.jobIdInput.value = "";
    },
    openAdd() {
      this.resetForm();
      document.querySelector(".modal-title") &&
        (document.querySelector(".modal-title").textContent = "Add New Job");
      this.open();
    },
    async openEdit(id) {
      if (!id) {
        alert("Invalid job identifier");
        return;
      }
      try {
        const job = await api.fetchJobById(id);
        elements.jobIdInput &&
          (elements.jobIdInput.value = job["Job URL"] || "");
        elements.jobTitleInput &&
          (elements.jobTitleInput.value = job["Job Title"] || "");
        elements.companyUrlInput &&
          (elements.companyUrlInput.value = job["Company URL"] || "");
        elements.jobUrlInput &&
          (elements.jobUrlInput.value = job["Job URL"] || "");
        if (elements.jobPostingDateInput && job["Job Posting Date"]) {
          const date = new Date(job["Job Posting Date"]);
          if (!isNaN(date))
            elements.jobPostingDateInput.value = date
              .toISOString()
              .slice(0, 16);
        }
        document.querySelector(".modal-title") &&
          (document.querySelector(".modal-title").textContent = "Edit Job");
        this.open();
      } catch (error) {
        alert("Failed to load job details. Please try again.");
      }
    },
    attachListeners() {
      elements.modalClose?.addEventListener("click", () => this.close());
      elements.modalOverlay?.addEventListener("click", () => this.close());
      elements.jobModal?.addEventListener("click", (e) => {
        if (e.target === elements.jobModal) this.close();
      });
      document.addEventListener("keydown", (e) => {
        if (
          e.key === "Escape" &&
          elements.jobModal &&
          elements.jobModal.style.display === "block"
        )
          this.close();
      });
    },
  };

  // JOB ACTIONS (CRUD)
  const jobActions = {
    async save(event) {
      event.preventDefault();
      const id = elements.jobIdInput?.value;
      const jobData = {
        "Job Title": elements.jobTitleInput?.value.trim(),
        "Company URL": elements.companyUrlInput?.value.trim(),
        "Job URL": elements.jobUrlInput?.value.trim(),
        "Job Posting Date": elements.jobPostingDateInput?.value
          ? new Date(elements.jobPostingDateInput.value)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          : undefined,
      };
      try {
        await api.saveJob(id, jobData);
        modalManager.close();
        await api.fetchJobs();
        utils.showNotification(
          id ? "Job updated successfully!" : "Job created successfully!",
          "success"
        );
      } catch (error) {
        alert(`Error saving job: ${error.message}`);
      }
    },
    async delete(id) {
      if (!id) return alert("Invalid job identifier");
      const confirmDelete = confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      );
      if (!confirmDelete) return;
      try {
        await api.deleteJob(id);
        await api.fetchJobs();
        utils.showNotification("Job deleted successfully!", "success");
      } catch (error) {
        alert(`Error deleting job: ${error.message}`);
      }
    },
  };

  // FILTER MANAGER
  const filterManager = {
    apply() {
      api.fetchJobs();
    },
    clear() {
      if (elements.keywordInput) elements.keywordInput.value = "";
      if (elements.postedAfterInput) elements.postedAfterInput.value = "";
      api.fetchJobs();
    },
    attachListeners() {
      elements.applyFiltersBtn?.addEventListener("click", () => this.apply());
      elements.clearFiltersBtn?.addEventListener("click", () => this.clear());
      elements.heroSearchBtn?.addEventListener("click", () => this.apply());
      elements.keywordInput?.addEventListener(
        "input",
        utils.debounce(() => this.apply(), 500)
      );
      elements.postedAfterInput?.addEventListener("change", () => this.apply());
      elements.keywordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.apply();
      });
    },
  };

  // SUGGESTION TAGS
  const suggestionManager = {
    attachListeners() {
      elements.suggestionTags?.forEach((tag) => {
        tag.addEventListener("click", (e) => {
          const searchTerm = e.target.textContent.trim();
          if (elements.keywordInput) elements.keywordInput.value = searchTerm;
          api.fetchJobs();
          document
            .getElementById("jobs")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    },
  };

  // NAVIGATION SMOOTH SCROLL
  const navigationManager = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute("href");
          if (targetId === "#") return;
          const targetElement = document.querySelector(targetId);
          if (targetElement)
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        });
      });
    },
  };

  // ANIMATION OBSERVER
  const animationManager = {
    init() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.style.animationPlayState = "running";
        });
      }, observerOptions);
      const animatedElements = document.querySelectorAll(
        ".job-item, .section-header"
      );
      animatedElements.forEach((el) => {
        el.style.animationPlayState = "paused";
        observer.observe(el);
      });
    },
  };

  // PERFORMANCE (lazy load images)
  const performanceManager = {
    init() {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                imageObserver.unobserve(img);
              }
            }
          });
        });
        document
          .querySelectorAll("img[data-src]")
          .forEach((img) => imageObserver.observe(img));
      }
    },
  };

  // GLOBAL ERROR HANDLING
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
  });

  // INITIALIZATION
  const app = {
    init() {
      themeManager.init();
      navbarManager.init();
      modalManager.attachListeners();
      filterManager.attachListeners();
      suggestionManager.attachListeners();
      navigationManager.init();
      performanceManager.init();
      elements.jobForm?.addEventListener("submit", (e) => jobActions.save(e));
      elements.addJobBtn?.addEventListener("click", () =>
        modalManager.openAdd()
      );
      api.fetchJobs();
      setTimeout(() => animationManager.init(), 500);
      console.log("🚀 JobVerse initialized successfully!");
    },
  };

  app.init();
});

// Prevent zoom on input focus (mobile)
document.addEventListener(
  "touchstart",
  () => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta)
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
  },
  { once: true }
);

// Service worker (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered:', registration))
    //     .catch(error => console.log('SW registration failed:', error));
  });
}

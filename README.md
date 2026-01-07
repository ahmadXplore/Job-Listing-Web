# ⚡ JobVerse - Premium Job Board Platform

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=for-the-badge&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A modern, full-stack job board application featuring a **RESTful Flask API** backend and a stunning, **glassmorphic UI** frontend. Built for YC companies and tech startups, JobVerse offers real-time job search, advanced filtering, and a premium user experience.

---

## ✨ Features

### 🎯 Core Functionality
- **Full CRUD Operations** - Create, Read, Update, Delete job postings
- **Advanced Search & Filtering** - Search by keywords, company, and posting date
- **RESTful API** - Clean, scalable Flask-based REST API
- **Persistent Storage** - SQLite database with SQLAlchemy ORM
- **Responsive Design** - Mobile-first, fully responsive UI

### 🎨 Premium UI/UX
- **Glassmorphic Design** - Modern glass effect with blur and transparency
- **Dark/Light Theme** - Seamless theme switching with persistent preferences
- **Smooth Animations** - Fluid transitions and micro-interactions
- **Interactive Elements** - Hover effects, skeleton loaders, and dynamic cards
- **Optimized Performance** - Lazy loading and debounced search

### 🔧 Technical Highlights
- **RESTful Architecture** - Standard HTTP methods and status codes
- **URL-based Identification** - Flexible job lookup by ID or URL
- **Auto-populated Database** - Loads initial data from JSON on first run
- **CORS Enabled** - Cross-origin resource sharing for API access
- **Error Handling** - Comprehensive validation and error messages

---

## 🏗️ Project Structure

```
jobverse/
│
├── backend/
│   ├── app.py                    # Flask application & configuration
│   ├── database.py               # SQLAlchemy models & database setup
│   ├── routes.py                 # API endpoints & route handlers
│   ├── loader.py                 # JSON data loader utility
│   ├── requirements.txt          # Python dependencies
│   └── output.json              # Sample job data
│
├── frontend/
│   ├── index.html               # Main HTML structure
│   ├── style.css                # Glassmorphic styling & animations
│   ├── script.js                # Frontend logic & API integration
│   └── package.json             # Node.js dependencies (optional)
│
├── jobs.db                      # SQLite database (generated)
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Purpose |
|----------|---------|---------|
| **Python** | 3.8+ | Backend runtime |
| **pip** | Latest | Python package manager |
| **Modern Browser** | Latest | Chrome, Firefox, Safari, or Edge |

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ahmadXplore/Job-Listing-Web.git
cd Job-Listing-Web
```

#### 2️⃣ Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3️⃣ Run the Application

```bash
# Start Flask development server
python -m backend.app
```

The Flask API will start on `http://127.0.0.1:5000`

#### 4️⃣ Open Frontend

```bash
# Open frontend in browser
# Navigate to frontend directory and open index.html
# OR use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

---

## 📦 Dependencies

### Backend (Python)

```txt
Flask==2.3.3              # Web framework
Flask-SQLAlchemy==3.1.1   # ORM for database
Flask-Cors==4.0.0         # CORS support
SQLAlchemy==2.0.21        # SQL toolkit
requests==2.31.0          # HTTP library
bs4==0.0.1               # BeautifulSoup (web scraping)
```

### Frontend (Vanilla JavaScript)

- **No build tools required** - Pure HTML, CSS, and JavaScript
- **Font Awesome 6.5.0** - Icons
- **Google Fonts** - Inter & Space Grotesk typography
- **Native Browser APIs** - Fetch, localStorage, IntersectionObserver

---

## 🔌 API Documentation

### Base URL

```
http://127.0.0.1:5000/api
```

### Endpoints

#### 📋 Get All Jobs

```http
GET /api/jobs
```

**Query Parameters:**
- `keyword` (optional) - Search in job title or company URL
- `posted_after` (optional) - Filter by date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": 1,
    "Job Title": "Senior Developer",
    "Company URL": "https://example.com",
    "Job URL": "https://example.com/jobs/123",
    "Job Posting Date": "2026-01-01 06:24:12"
  }
]
```

#### 🔍 Get Single Job

```http
GET /api/jobs/{identifier}
```

**Parameters:**
- `identifier` - Job ID (integer) or encoded Job URL

**Response:**
```json
{
  "id": 1,
  "Job Title": "Senior Developer",
  "Company URL": "https://example.com",
  "Job URL": "https://example.com/jobs/123",
  "Job Posting Date": "2026-01-01 06:24:12"
}
```

#### ➕ Create Job

```http
POST /api/jobs
Content-Type: application/json
```

**Request Body:**
```json
{
  "Job Title": "Frontend Developer",
  "Company URL": "https://company.com",
  "Job URL": "https://company.com/jobs/456",
  "Job Posting Date": "2026-01-08 10:00:00"
}
```

**Response:** `201 Created` + Job object

#### ✏️ Update Job

```http
PUT /api/jobs/{identifier}
Content-Type: application/json
```

**Request Body:** Same as POST (partial updates supported)

**Response:** `200 OK` + Updated job object

#### 🗑️ Delete Job

```http
DELETE /api/jobs/{identifier}
```

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

### Error Responses
```
| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid data |
| `404` | Not Found - Job doesn't exist |
| `409` | Conflict - Duplicate Job URL |
| `500` | Internal Server Error |
```
---

## 💻 Usage Examples

### Searching Jobs

1. **Use the Hero Search Bar** - Main search on homepage
2. **Apply Filters** - Date range filtering
3. **Popular Searches** - Click suggestion tags
4. **Real-time Search** - Auto-search as you type (debounced)

### Managing Jobs

#### Adding a New Job

1. Click **"Post Job"** button in navigation
2. Fill in job details:
   - Job Title (required)
   - Company URL (optional)
   - Job URL (required, must be unique)
   - Posting Date (optional, defaults to now)
3. Click **"Save Job"**

#### Editing a Job

1. Find job card in listings
2. Click **"Edit"** button
3. Modify fields in modal
4. Click **"Save Job"**

#### Deleting a Job

1. Click **"Delete"** on job card
2. Confirm deletion in dialog
3. Job removed immediately

---

## 🎨 UI Features

### Theme System

```javascript
// Toggle between dark and light themes
// Preference saved to localStorage
// Click moon/sun icon in navigation
```

**Dark Mode (Default)**
- Deep dark backgrounds (#0a0a0f)
- Vibrant accent colors
- High contrast text

**Light Mode**
- Clean white backgrounds
- Subtle shadows
- Optimized readability

### Animations

- **Fade-in effects** on page load
- **Slide-up animations** for content
- **Hover transformations** on cards
- **Floating animations** for hero visuals
- **Skeleton loaders** during data fetch

### Responsive Breakpoints
```
| Breakpoint | Width | Changes |
|------------|-------|---------|
| Desktop | 1200px+ | Full grid layout, hero visual visible |
| Tablet | 768px - 1199px | Adjusted grid, collapsed navigation |
| Mobile | < 768px | Single column, mobile-optimized inputs |
```
---

## 🔧 Configuration

### Backend Configuration

**Database URI** (in `app.py`):
```python
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobs.db"
```

**CORS Settings**:
```python
CORS(app)  # Allows all origins (development)
# For production, specify origins:
# CORS(app, resources={r"/api/*": {"origins": "https://yourfrontend.com"}})
```

### Frontend Configuration

**API Base URL** (in `script.js`):
```javascript
const API_BASE_URL = "http://127.0.0.1:5000/api/jobs";
```

For production, update to your deployed API URL.

---

## 🎯 Key Implementation Details

### URL-Based Job Identification

Jobs can be identified by either:
1. **Numeric ID**: `/api/jobs/1`
2. **Encoded Job URL**: `/api/jobs/https%3A%2F%2Fexample.com%2Fjobs%2F123`

This allows flexible lookups and ensures URL uniqueness.

### Auto-Population

On first run, the application checks if `jobs.db` exists. If not, it loads initial data from `output.json`:

```python
if not os.path.exists('jobs.db') or Job.query.count() == 0:
    load_jobs_from_json('output.json')
```

### Debounced Search

Frontend implements debounced search to reduce API calls:

```javascript
const debouncedSearch = debounce(() => fetchJobs(), 500);
keywordInput.addEventListener('input', debouncedSearch);
```

### Glassmorphic Design

Achieved through CSS custom properties:

```css
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-border: rgba(255, 255, 255, 0.08);
--backdrop-blur: blur(24px);

.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--backdrop-blur);
}
```

---

## 🛡️ Best Practices

### Security Considerations

- ✅ Input validation on both frontend and backend
- ✅ SQL injection prevention via SQLAlchemy ORM
- ✅ XSS prevention through HTML escaping
- ✅ HTTPS recommended for production
- ✅ Environment variables for sensitive config

### Performance Optimization

- 🚀 **Database indexing** on `job_url` for fast lookups
- 🚀 **Debounced API calls** to reduce server load
- 🚀 **Skeleton loaders** for perceived performance
- 🚀 **Lazy loading** for images and heavy content
- 🚀 **Minification** recommended for production CSS/JS

### Code Quality

- 📝 Clear separation of concerns (MVC pattern)
- 📝 Consistent naming conventions
- 📝 Comprehensive error handling
- 📝 Documented API endpoints
- 📝 Reusable utility functions

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to load jobs"**
- ✔️ Ensure Flask backend is running on port 5000
- ✔️ Check CORS configuration
- ✔️ Verify API_BASE_URL in script.js

**"Database is locked"**
- ✔️ Close any open database connections
- ✔️ Restart Flask application
- ✔️ Check file permissions on jobs.db

**Modal not opening**
- ✔️ Check browser console for JavaScript errors
- ✔️ Ensure script.js is loaded after DOM
- ✔️ Verify modal HTML structure

**Styling issues**
- ✔️ Clear browser cache
- ✔️ Check CSS file path
- ✔️ Verify custom properties support

---

## 📈 Future Enhancements

### Planned Features

- [ ] User authentication & authorization
- [ ] Job application tracking
- [ ] Email notifications for new jobs
- [ ] Advanced analytics dashboard
- [ ] Company profiles
- [ ] Resume upload & parsing
- [ ] Job recommendations (ML-powered)
- [ ] Social sharing integration
- [ ] Bookmark/save jobs functionality
- [ ] Export to PDF/CSV

### Technical Improvements

- [ ] PostgreSQL migration for production
- [ ] Redis caching layer
- [ ] GraphQL API option
- [ ] React/Vue.js frontend rewrite
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Comprehensive testing suite
- [ ] API rate limiting
- [ ] WebSocket for real-time updates

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript (configuration provided)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Job-Listing-Web

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@ahmadXplore](https://github.com/ahmadXplore)
- LinkedIn: [Ahmad](www.linkedin.com/in/muhammad-ahmad-23a3223a0)
- Email: ahmadasif5022004@gmail.com

---

## 🙏 Acknowledgments

- **Flask** - Lightweight WSGI web application framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter & Space Grotesk)
- **Y Combinator** - Inspiration for job listings format
- **Community Contributors** - Thanks to everyone who contributed!

---

## 📞 Support

### Getting Help

- 📖 [Read the Documentation](#api-documentation)
- 🐛 [Report a Bug](https://github.com/ahmadXplore/Job-Listing-Web/issues)
- 💡 [Request a Feature](https://github.com/ahmadXplore/Job-Listing-Web/issues)
- 💬 [Join Discussions](https://github.com/ahmadXplore/Job-Listing-Web/discussions)

### Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

[![Star History](https://img.shields.io/github/stars/yourusername/jobverse?style=social)](https://github.com/ahmadXplore/Job-Listing-Web/stargazers)

---

<div align="center">

**Built with ❤️ by developers, for developers**

[🌐 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

---

**⚡ JobVerse** - *Where careers meet opportunity*

</div>

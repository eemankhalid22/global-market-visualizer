import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-dark text-light d-flex flex-column min-vh-100">
      {/* Hero Section with fixed video */}
      <section
  className="position-relative d-flex flex-column justify-content-center align-items-center text-center px-3"
  style={{ height: "60vh", overflow: "hidden" }}
>
  {/* Background Image */}
  <img
    src="/images/pic2.jpg"
    alt="Descriptive alt text"
    className="position-absolute w-100 h-100"
    style={{ objectFit: "cover", zIndex: 0 }}
  />

  {/* Dark Overlay */}
  <div
    className="position-absolute w-100 h-100"
    style={{ backgroundColor: "rgba(0,0,0,0.6)", top: 0, left: 0, zIndex: 1 }}
  ></div>

  {/* Text Content */}
  <h1
    className="display-4 fw-bold mb-3"
    style={{ color: "#e0f7fa", textShadow: "2px 2px 8px rgba(0,0,0,0.9)", zIndex: 2 }}
  >
    🌐 Global Market Trend Visualizer
  </h1>
  <p
    className="lead mb-0"
    style={{
      maxWidth: 650,
      color: "#cce7ff",
      textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
      zIndex: 2,
    }}
  >
    Dive into global market data with interactive tools for GDP, inflation, currency conversion, sustainability metrics, and more.
  </p>
</section>


      {/* Navigation Cards */}
      <section className="container my-5">
        <div className="row g-4 justify-content-center">
          {[
            {
              to: "/gdp-inflation",
              label: "📈 GDP & Inflation",
              desc: "Explore economic trends and indicators.",
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            {
              to: "/gdp-chart",
              label: "📈 GDP CHART",
              desc: "Visualize GDP data with interactive charts.",
              gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
            },
            {
              to: "/currency",
              label: "💱 Currency Converter",
              desc: "Convert currencies in real-time.",
              gradient: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
            },
            {
              to: "/sustainability",
              label: "🌱 Gender & Sustainability",
              desc: "Analyze social and environmental indexes.",
              gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
            },
            {
              to: "/map",
              label: "🗺️ Interactive Map",
              desc: "Explore data through a world map interface.",
              gradient: "linear-gradient(135deg, #ee7752 0%, #e73c7e 100%)",
            },
            {
              to: "/news",
              label: "📰 Market News",
              desc: "Stay updated with latest market news.",
              gradient: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
            },
          ].map(({ to, label, desc, gradient }) => (
            <div key={to} className="col-12 col-md-6 col-lg-4">
              <Link
                to={to}
                className="card h-100 shadow text-white text-decoration-none nav-card"
                style={{
                  background: gradient,
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                  <h3 className="card-title fw-bold mb-2">{label}</h3>
                  <p className="card-text text-light text-center">{desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary bg-opacity-10 py-5">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#4dabf7" }}>
            Features that Empower You
          </h2>
          <div className="row text-center g-4">
            {[
              {
                icon: "💡",
                title: "Insightful Analytics",
                desc: "Understand global market patterns with easy-to-use visualizations.",
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                desc: "Stay ahead with the latest data and news, updated continuously.",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                desc: "Your data privacy and security is our top priority.",
              },
              {
                icon: "🌍",
                title: "Global Coverage",
                desc: "Access comprehensive data from all around the world.",
              },
              {
                icon: "🤝",
                title: "User-Friendly Interface",
                desc: "Navigate with ease using our intuitive, modern design.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="p-4 bg-dark rounded shadow-sm h-100 feature-card">
                  <div
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      color: "#4dabf7",
                    }}
                  >
                    {icon}
                  </div>
                  <h4>{title}</h4>
                  <p className="text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4" style={{ color: "#4dabf7" }}>
          What Our Users Say
        </h2>
        <div className="row g-4 justify-content-center">
          {[
            {
              name: "Sophia M.",
              quote:
                "This tool revolutionized how I analyze market data. Super intuitive and insightful!",
              img: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              name: "James K.",
              quote:
                "I love the interactive maps and live news feed — all in one place!",
              img: "https://randomuser.me/api/portraits/men/52.jpg",
            },
            {
              name: "Leila S.",
              quote:
                "The currency converter saved me so much time during my international work trips.",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
            },
          ].map(({ name, quote, img }, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="card bg-dark text-light h-100 shadow-sm p-3 testimonial-card">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={img}
                    alt={name}
                    className="rounded-circle me-3"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                  <h5 className="mb-0">{name}</h5>
                </div>
                <p className="fst-italic">"{quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-secondary bg-opacity-10 py-5">
        <div className="container text-center">
          <h2 className="mb-4" style={{ color: "#4dabf7" }}>
            About Global Market Trend Visualizer
          </h2>
          <p style={{ maxWidth: 700, margin: "0 auto", fontSize: "1.1rem", color: "#ddd" }}>
            Our platform is dedicated to making complex global market data accessible, interactive, and insightful. Whether you are a student, analyst, or business leader, our tools empower you to make informed decisions through innovative visualizations and real-time updates.
          </p>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container my-5">
        <div
          className="bg-dark rounded p-4 shadow-sm text-center"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <h3 className="mb-3" style={{ color: "#4dabf7" }}>
            Stay Updated — Join Our Newsletter
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
}}
className="d-flex justify-content-center gap-2 flex-wrap"
>
<input
type="email"
placeholder="Your email"
required
className="form-control"
style={{ maxWidth: 300 }}
/>
<button
type="submit"
className="btn btn-primary btn-hover"
style={{ minWidth: 120 }}
>
Subscribe
</button>
</form>
</div>
</section>

  {/* Scroll to top button */}
  {showTopBtn && (
    <button
      className="btn btn-primary position-fixed"
      style={{ bottom: 20, right: 20, borderRadius: "50%", width: 50, height: 50 }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      ↑
    </button>
  )}

  {/* Global styles for hover */}
  <style>{`
    .nav-card:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      text-decoration: none;
    }
    .nav-card:focus {
      outline: 3px solid #4dabf7;
      outline-offset: 2px;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(77, 171, 247, 0.5);
      background-color: #1a237e;
      cursor: default;
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }
    .testimonial-card:hover {
      background-color: #263238;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
      transform: translateY(-4px);
      transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    }
    .btn-hover:hover, .btn-hover:focus {
      background-color: #339af0 !important;
      box-shadow: 0 4px 12px rgba(51, 154, 240, 0.6);
      transform: scale(1.05);
      transition: all 0.25s ease;
      outline: none;
    }
  `}</style>
</div>
);
};

export default HomePage;

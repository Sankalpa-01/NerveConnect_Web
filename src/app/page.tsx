"use client";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Brain,
  Clock,
  Shield,
  TrendingUp,
  Users,
  Heart,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PricingPlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period: string;
  features: (string | PricingPlanFeature)[];
  featured: boolean;
  buttonText: string;
}

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

export default function MediCarePro() {
  // State management
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [animatedValues, setAnimatedValues] = useState({
    providers: 0,
    patients: 0,
    uptime: 0,
    support: 0,
  });

  const router = useRouter();

  // Refs
  const navRef = useRef<HTMLElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<NodeListOf<Element> | null>(null);

  // Animation function
  const animateCounters = () => {
    const targets = {
      providers: 500,
      patients: 25000,
      uptime: 99.9,
      support: 24,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        providers: Math.floor(targets.providers * easeOutProgress),
        patients: Math.floor(targets.patients * easeOutProgress),
        uptime: +(targets.uptime * easeOutProgress).toFixed(1),
        support: Math.floor(targets.support * easeOutProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  };

  // Effects
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Initialize counters
    countersRef.current = document.querySelectorAll(".counter");

    // Navbar scroll effect
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 100) {
          navRef.current.style.background = "rgba(26, 26, 46, 0.95)";
          navRef.current.style.backdropFilter = "blur(16px) saturate(180%)";
        } else {
          navRef.current.style.background = "rgba(255, 255, 255, 0.1)";
          navRef.current.style.backdropFilter = "blur(16px) saturate(180%)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for counters
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsSectionRef.current) {
      statsObserver.observe(statsSectionRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      statsObserver.disconnect();
    };
  }, []);

  // Helper functions
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      message: !formData.message.trim(),
    };

    setFormErrors(errors);

    if (!Object.values(errors).some((error) => error)) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } else {
      alert("Please fill in all required fields correctly.");
    }
  };

  const createRipple = (e: React.MouseEvent) => {
    router.push("/demo");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setMobileMenuOpen(false);
    }
  };

  // Data arrays
  const faqs: FAQ[] = [
    {
      question: "Is MediCare Pro HIPAA compliant?",
      answer:
        "Yes, MediCare Pro is fully HIPAA compliant. We implement industry-standard security measures including data encryption, access controls, audit logs, and regular security audits to ensure all protected health information (PHI) is secure.",
    },
    {
      question: "How does the AI prescription generator work?",
      answer:
        "Our AI analyzes patient symptoms, medical history, and current medications to suggest appropriate prescriptions. It checks for drug interactions and provides dosage recommendations, but all prescriptions must be reviewed and approved by a licensed physician before being issued.",
    },
    {
      question: "Can I import data from my current system?",
      answer:
        "Yes, we offer data migration services for most common healthcare management systems. Our team will work with you to ensure a smooth transition with minimal disruption to your practice.",
    },
    {
      question: "What training is provided?",
      answer:
        "We provide comprehensive onboarding including video tutorials, live training sessions, and detailed documentation. Our customer success team is also available to answer any questions as you get started.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, MediCare Pro offers fully functional iOS and Android apps that allow you to manage your practice on the go. All apps are designed with the same security standards as our web platform.",
    },
  ];

  const features: Feature[] = [
    {
      icon: "🏥",
      title: "Doctor Dashboard",
      description:
        "Comprehensive patient management with detailed medical history, diagnosis tracking, and treatment plans.",
      items: [
        "Patient Details Viewer",
        "Medical History Tracking",
        "Treatment Planning",
        "Appointment Overview",
      ],
    },
    {
      icon: "🤖",
      title: "AI Prescription Generator",
      description:
        "Generate accurate prescriptions based on symptoms and diagnosis using advanced AI technology.",
      items: [
        "Symptom-based Suggestions",
        "Drug Interaction Checks",
        "Dosage Recommendations",
        "Digital Prescriptions",
      ],
    },
    {
      icon: "🎤",
      title: "Voice Appointments",
      description:
        "Revolutionary speech-to-text system for front desk staff to book appointments hands-free.",
      items: [
        "Voice Recognition",
        "Automatic Scheduling",
        "Patient Information Capture",
        "Confirmation System",
      ],
    },
    {
      icon: "🔒",
      title: "Secure MCP Server",
      description:
        "Enhanced security with MCP server integration and role-based access control for medical professionals.",
      items: [
        "Authentication System",
        "Role-based Access",
        "Data Encryption",
        "HIPAA Compliance",
      ],
    },
    {
      icon: "📊",
      title: "Analytics & Reports",
      description:
        "Comprehensive analytics and reporting tools to track practice performance and patient outcomes.",
      items: [
        "Patient Analytics",
        "Revenue Tracking",
        "Appointment Metrics",
        "Custom Reports",
      ],
    },
    {
      icon: "📱",
      title: "Mobile Ready",
      description:
        "Fully responsive design that works seamlessly across all devices and screen sizes.",
      items: [
        "Responsive Design",
        "Touch Optimized",
        "Offline Capability",
        "Cross-platform",
      ],
    },
  ];

  const testimonials: Testimonial[] = [
    {
      initials: "JD",
      name: "Dr. John Doe",
      role: "Cardiologist",
      quote:
        "MediCare Pro has revolutionized how I manage my practice. The AI prescription tool saves me hours each week and reduces errors significantly.",
      stars: 5,
    },
    {
      initials: "SJ",
      name: "Sarah Johnson",
      role: "Practice Manager",
      quote:
        "The voice appointment system has cut our front desk workload in half. Our staff is more efficient and patients love the seamless experience.",
      stars: 4.5,
    },
    {
      initials: "RM",
      name: "Dr. Robert Miller",
      role: "Pediatrician",
      quote:
        "As someone who was hesitant about new technology, I was amazed at how intuitive MediCare Pro is. The analytics have helped me optimize my practice.",
      stars: 5,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Basic",
      description: "Perfect for small practices",
      price: "$49",
      period: "/month",
      features: [
        "Up to 5 users",
        "Basic patient management",
        "Appointment scheduling",
        "Email support",
        { text: "AI Prescriptions", included: false },
        { text: "Voice Appointments", included: false },
      ],
      featured: false,
      buttonText: "Get Started",
    },
    {
      name: "Professional",
      description: "For growing medical practices",
      price: "$99",
      period: "/month",
      features: [
        "Up to 15 users",
        "Advanced patient management",
        "AI Prescription Generator",
        "Voice Appointments",
        "Priority support",
        { text: "Enterprise Analytics", included: false },
      ],
      featured: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      description: "For large healthcare systems",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited users",
        "All Professional features",
        "Enterprise Analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      featured: false,
      buttonText: "Get Started",
    },
  ];

  const footerLinks = {
    product: ["Features", "Pricing", "Security", "Updates", "Roadmap"],
    resources: ["Documentation", "Help Center", "Webinars", "Community", "API"],
    company: ["About", "Careers", "Privacy", "Terms", "Contact"],
  };

  return (
    <>
      <Head>
        <title>MediCare Pro - Advanced Healthcare Management System</title>
        <meta
          name="description"
          content="Streamline your medical practice with AI-powered prescriptions, voice-enabled appointments, and comprehensive patient management"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600 to-teal-500 flex justify-center items-center z-50 transition-opacity duration-500">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-2xl font-bold text-white">
              Loading MediCare Pro
            </h2>
            <p className="text-white/80 mt-2">
              Your healthcare management solution
            </p>
          </div>
        </div>
      )}

      <div
        className={`antialiased font-sans ${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* Navigation */}
        <nav
          ref={navRef}
          className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-white font-bold text-xl font-serif">
                  MediCare Pro
                </span>
              </div>

              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-white hover:text-teal-300 transition-colors duration-300 font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-white hover:text-teal-300 transition-colors duration-300 font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-teal-300 transition-colors duration-300 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-white hover:text-teal-300 transition-colors duration-300 font-medium"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-teal-300 transition-colors duration-300 font-medium"
                >
                  Contact
                </button>
              </div>

              <div className="flex space-x-4">
                <Link
                  href={"/check_signin"}
                  className="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  href={"/check_signup"}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900/95 z-40 flex flex-col items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="flex flex-col items-center space-y-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white text-2xl font-medium hover:text-teal-300 transition-colors"
              >
                Contact
              </button>
              <div className="flex space-x-4 mt-8">
                <button className="px-6 py-3 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300">
                  Login
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen bg-gradient-to-r from-blue-600 to-teal-500 relative flex items-center justify-center overflow-hidden"
        >
          {/* Animated particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  top: `${[20, 70, 40, 60, 30][i]}%`,
                  left: `${[15, 80, 50, 30, 70][i]}%`,
                  width: `${[8, 12, 6, 10, 8][i]}px`,
                  height: `${[8, 12, 6, 10, 8][i]}px`,
                  animation: `float ${[10, 15, 12, 14, 11][i]}s ease-in-out ${
                    [1, 2, 3, 2, 1][i]
                  }s infinite`,
                }}
              ></div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">
                <span className="block">Healthcare Management</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-pulse">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                Streamline your medical practice with AI-powered prescriptions,
                voice-enabled appointments, and comprehensive patient management
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={createRipple}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-play-circle"></i> Start Free Trial
                </button>
                <button
                  onClick={createRipple}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-video"></i> Watch Demo
                </button>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => scrollToSection("features")}
                  className="inline-block p-2 rounded-full bg-white/10 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-white animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our AI-Powered Clinic Management System?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of healthcare management with intelligent
                automation that adapts to your practice
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Mic className="w-8 h-8 text-blue-600" />,
                  title: "Voice-Powered Efficiency",
                  description:
                    "Transform appointment booking with our advanced speech-to-text system. No more typing - just speak naturally and watch appointments get scheduled instantly.",
                  highlight: "50% faster booking process",
                },
                {
                  icon: <Brain className="w-8 h-8 text-purple-600" />,
                  title: "AI That Learns Your Style",
                  description:
                    "Our intelligent prescription generator adapts to each doctor's preferences, creating personalized recommendations that align with your clinical expertise.",
                  highlight: "Continuously improving accuracy",
                },
                {
                  icon: <Clock className="w-8 h-8 text-green-600" />,
                  title: "Real-Time Synchronization",
                  description:
                    "Instant updates across all platforms. When an appointment is booked, your dashboard updates immediately - no delays, no confusion.",
                  highlight: "Zero lag time",
                },
                {
                  icon: <Shield className="w-8 h-8 text-red-600" />,
                  title: "Secure Central Hub",
                  description:
                    "Our MCP server acts as your intelligent backbone, managing all clinic data with enterprise-level security and seamless integration.",
                  highlight: "100% HIPAA compliant",
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
                  title: "Adaptive Intelligence",
                  description:
                    "The system evolves with every interaction, building smarter recommendations based on successful prescriptions and treatment outcomes.",
                  highlight: "Self-improving algorithms",
                },
                {
                  icon: <Users className="w-8 h-8 text-teal-600" />,
                  title: "Streamlined Workflows",
                  description:
                    "From voice booking to AI prescriptions, we eliminate administrative burden so you can focus on what matters most - patient care.",
                  highlight: "Reduced admin time by 60%",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Powerful Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                Transform Your Healthcare Practice
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools designed to streamline operations, enhance
                patient care, and improve outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl group"
                >
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="text-sm text-gray-500 space-y-2">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <i className="fas fa-check-circle text-blue-500 mr-2"></i>{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  See It In Action
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                  Watch Our Product Demo
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Discover how MediCare Pro can transform your healthcare
                  practice in just 2 minutes. See our intuitive interface,
                  powerful features, and seamless workflows in action.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={createRipple}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <i className="fas fa-play"></i> Play Demo
                  </button>
                  <button
                    onClick={createRipple}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                  >
                    <i className="fas fa-book"></i> Read Case Studies
                  </button>
                </div>
              </div>

              <div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={createRipple}
                      className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    >
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <i className="fas fa-play text-white text-2xl"></i>
                      </div>
                    </button>
                  </div>

                  <video width="640" height="360" controls>
                    <source
                      src="C:\Users\HP\Videos\Captures\Create Next App - Google Chrome 2025-06-20 02-41-04.mp4"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsSectionRef}
          className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text">
                Healthcare Impact at Scale
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transforming healthcare delivery through cutting-edge technology
                and unwavering commitment to excellence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Healthcare Providers Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white bg-opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-white opacity-80" />
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {animatedValues.providers}+
                  </div>
                  <div className="text-lg font-medium text-white opacity-90 mb-4">
                    Healthcare Providers
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { month: "Jan", count: 320 },
                          { month: "Feb", count: 380 },
                          { month: "Mar", count: 420 },
                          { month: "Apr", count: 450 },
                          { month: "May", count: 480 },
                          { month: "Jun", count: 500 },
                        ]}
                      >
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#60A5FA"
                          fill="rgba(96, 165, 250, 0.3)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Patients Served Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-green-700 p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white bg-opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Heart className="w-8 h-8 text-white opacity-80" />
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {animatedValues.patients.toLocaleString()}+
                  </div>
                  <div className="text-lg font-medium text-white opacity-90 mb-4">
                    Patients Served
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", patients: 15000 },
                          { month: "Feb", patients: 18000 },
                          { month: "Mar", patients: 20000 },
                          { month: "Apr", patients: 22000 },
                          { month: "May", patients: 24000 },
                          { month: "Jun", patients: 25000 },
                        ]}
                      >
                        <Line
                          type="monotone"
                          dataKey="patients"
                          stroke="#34D399"
                          strokeWidth={3}
                          dot={{ fill: "#34D399", r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* System Uptime Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white bg-opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8 text-white opacity-80" />
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {animatedValues.uptime}%
                  </div>
                  <div className="text-lg font-medium text-white opacity-90 mb-4">
                    System Uptime
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Uptime", value: 99.9, color: "#10B981" },
                            { name: "Downtime", value: 0.1, color: "#EF4444" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          dataKey="value"
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#EF4444" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Support Hours Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white bg-opacity-10 -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-white opacity-80" />
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {animatedValues.support}/7
                  </div>
                  <div className="text-lg font-medium text-white opacity-90 mb-4">
                    Support Hours
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { hour: "00:00", tickets: 12 },
                          { hour: "06:00", tickets: 8 },
                          { hour: "12:00", tickets: 25 },
                          { hour: "18:00", tickets: 18 },
                          { hour: "24:00", tickets: 15 },
                        ]}
                      >
                        <Bar
                          dataKey="tickets"
                          fill="rgba(168, 85, 247, 0.8)"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional metrics row */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">98.5%</div>
                <div className="text-gray-300">Patient Satisfaction</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">45%</div>
                <div className="text-gray-300">Efficiency Improvement</div>
              </div>

              <div className="text-center p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20">
                <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">HIPAA Compliant</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from healthcare professionals who have transformed their
                practice with MediCare Pro
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas ${
                          i < Math.floor(testimonial.stars)
                            ? "fa-star"
                            : i < testimonial.stars
                            ? "fa-star-half-alt"
                            : "fa-star"
                        } ${i >= testimonial.stars ? "text-gray-300" : ""}`}
                      ></i>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                FAQs
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about MediCare Pro
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <button
                    className="flex justify-between items-center w-full text-left group"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <i
                      className={`fas ${
                        activeAccordion === index
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      } text-gray-400 group-hover:text-blue-600 transition-all duration-300`}
                    ></i>
                  </button>
                  <div
                    className={`mt-4 text-gray-600 overflow-hidden transition-all duration-300 ${
                      activeAccordion === index ? "max-h-96" : "max-h-0"
                    }`}
                    style={{
                      maxHeight: activeAccordion === index ? "500px" : "0",
                    }}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Still have questions?{" "}
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Contact our support team
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of healthcare professionals who trust MediCare Pro
              for their daily operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={createRipple}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fas fa-calendar-alt"></i>
                <Link href={"/demo"}>Schedule a Demo</Link>
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  Contact Us
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
                  Get In Touch
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Have questions or want to learn more? Our team is here to help
                  you find the right solution for your healthcare practice.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <i className="fas fa-envelope text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <p className="text-gray-600">hello@medicarepro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <i className="fas fa-phone-alt text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <p className="text-gray-600">+1 (800) 555-HEAL</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <i className="fas fa-map-marker-alt text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Visit Us</h4>
                      <p className="text-gray-600">
                        123 Healthcare Ave, Suite 500
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Send Us a Message
                  </h3>
                  <form
                    action="https://formspree.io/f/xyzjpgon"
                    method="Post"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          placeholder="Subject"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full px-4 py-3 border ${
                            formErrors.message
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                          placeholder="Your message"
                        ></textarea>
                      </div>

                      <div>
                        <button
                          type="submit"
                          onClick={createRipple}
                          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <span className="text-white font-bold text-xl font-serif">
                    MediCare Pro
                  </span>
                </div>
                <p className="text-gray-400 mb-6">
                  Revolutionizing healthcare management with cutting-edge
                  technology and intuitive design.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <i className="fab fa-facebook text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Product</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.product.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Resources</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.resources.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Company</h4>
                <ul className="space-y-3 text-gray-400">
                  {footerLinks.company.map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2025 MediCare Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Layout, 
  Typography, 
  Button, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Divider, 
  Space, 
  Avatar, 
  BackTop,
  Carousel,
  Image,
  Spin
} from 'antd';
import { 
  FormOutlined, 
  DashboardOutlined, 
  TeamOutlined, 
  SearchOutlined,
  ArrowUpOutlined,
  UserOutlined,
  HeartOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import styles from './HomePage.module.css';
import profileImage from '../../assets/profile.jpg';
import PetCarousel from '../../components/Carousel/PetCarousel';
import findPetsAnimation from '../../assets/findpets.json';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

// New animation variants for enhanced effects
const slideInLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 } }
};

const slideInRight = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 } }
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.6 } }
};

const bounce = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15,
      duration: 0.6 
    } 
  }
};

// Reusable section component
const Section = ({ className, children, style }) => (
  <div className={className} style={style}>
    <div className={styles.container}>
      {children}
    </div>
  </div>
);

// Section title component
const SectionTitle = ({ title, subtitle }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeIn}
    style={{ textAlign: 'center', marginBottom: '60px' }}
  >
    <Title level={2} style={{ fontWeight: 700 }}>{title}</Title>
    {subtitle && (
      <Paragraph style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.65)', maxWidth: '600px', margin: '0 auto' }}>
        {subtitle}
      </Paragraph>
    )}
  </motion.div>
);

// Feature card component - Enhanced with better animations
const FeatureCard = ({ icon, title, description, linkText, linkTo, index }) => (
  <motion.div 
    variants={index % 2 === 0 ? slideInLeft : slideInRight}
    custom={index}
    viewport={{ once: true, amount: 0.2 }}
    className={styles.featureCardContainer}
  >
    <Card 
      hoverable
      className={styles.featureCard}
      bodyStyle={{ padding: '30px' }}
    >
      <motion.div 
        className={styles.iconContainer}
        whileHover={{ 
          scale: 1.1, 
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.3 }
        }}
      >
        <span style={{ fontSize: '34px' }}>{icon}</span>
      </motion.div>
      <Title level={3} style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</Title>
      <Paragraph style={{ 
        color: 'rgba(0, 0, 0, 0.75)', 
        marginBottom: '20px', 
        fontSize: '16px',
        lineHeight: '1.6',
        textAlign: 'center'
      }}>
        {description}
      </Paragraph>
      {linkText && linkTo && (
        <Link to={linkTo}>
          <Button type="link" className={styles.featureLink}>{linkText} →</Button>
        </Link>
      )}
    </Card>
  </motion.div>
);

// Testimonial card component
const TestimonialCard = ({ emoji, name, location, testimonial }) => (
  <motion.div variants={fadeIn}>
    <Card className={styles.testimonialCard}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Avatar className={styles.testimonialAvatar} size={48}>
          {emoji}
        </Avatar>
        <div style={{ marginLeft: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>{name}</Title>
          <Text type="secondary">{location}</Text>
        </div>
      </div>
      <Paragraph italic style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
        {testimonial}
      </Paragraph>
    </Card>
  </motion.div>
);

// DogLoader component for loading states
const DogLoader = lazy(() => import('../../components/Loader/DogLoader'));

// HomePage component
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Track scroll position with useCallback for better performance
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);
  
  // Track scroll position
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Simulate image loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Features data - expanded with more detailed information
  const features = useMemo(() => [
    {
      icon: '📝',
      title: 'Register & Login',
      description: 'Create a secure account in minutes to access our full platform. Set up your profile, add your contact details, and start using our services immediately. Our fast registration process ensures you can get started right away.',
      linkText: 'Create Account',
      linkTo: '/register'
    },
    {
      icon: '🔍',
      title: 'Dashboard Access',
      description: 'Your personalized dashboard gives you a complete overview of your activity. Track your pets, monitor their health data, schedule appointments, and receive important notifications all in one place. Stay organized with our intuitive interface.',
      linkText: 'Sign In',
      linkTo: '/login'
    },
    {
      icon: '🤝',
      title: 'Community Help',
      description: 'Connect with thousands of pet lovers in our supportive community. Share experiences, get advice, find local pet services, and help others in need. Our community members have helped reunite hundreds of lost pets with their families.',
      linkText: 'Join Community',
      linkTo: '/register'
    },
    {
      icon: '📱',
      title: 'Mobile Access',
      description: 'Take PetCare with you anywhere using our mobile-friendly platform. Get real-time notifications, access pet information, and connect with our community on any device. Always stay connected, even while traveling.',
      linkText: 'Learn More',
      linkTo: '/register'
    }
  ], []);

  // Testimonials data - memoized to prevent unnecessary re-renders
  const testimonials = useMemo(() => [
    {
      emoji: '🐕',
      name: 'Max\'s Return',
      quote: 'Thanks to this platform, we found our dog Max within 48 hours of posting!',
      author: 'Sarah J.',
      location: 'Boston, MA'
    },
    {
      emoji: '🐈',
      name: 'Whiskers Home',
      quote: 'Our cat was missing for a week until someone on this site recognized her from our post.',
      author: 'Michael T.',
      location: 'Los Angeles, CA'
    }
  ], []);

  // Stats data
  const stats = [
    { title: 'Pets Found', value: 500, prefix: '+', color: '#333333' },
    { title: 'Active Users', value: 1200, prefix: '+', color: '#333333' },
    { title: 'Cities Covered', value: 50, prefix: '+', color: '#333333' },
    { title: 'Success Rate', value: 98, suffix: '%', color: '#333333' }
  ];

  // Warm color palette that complements orange
  const colors = {
    warmBackground: '#FFF8F0',
    lighterOrange: '#FFE6D9',
    softCream: '#FFF6EC',
    accentOrange: '#FF7F50',
    deepOrange: '#E86A3E',
    softBlue: '#E6F7FF',
    accentBlue: '#1890FF'
  };

  return (
    <Layout style={{ background: colors.warmBackground, minHeight: '100vh', paddingTop: '0' }}>
      {/* Hero Section */}
      <div className={styles.heroSection} style={{ 
        background: `linear-gradient(135deg, ${colors.warmBackground} 0%, ${colors.lighterOrange} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '80px 0 0',
        marginTop: '0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className={styles.petPattern} style={{ opacity: 0.4 }} />
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0, x: -100 }}
          animate={{ opacity: 0.6, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'absolute',
            left: '5%',
            top: '15%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: colors.accentOrange,
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0, x: 100 }}
          animate={{ opacity: 0.5, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            position: 'absolute',
            right: '10%',
            bottom: '20%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: colors.accentBlue,
            filter: 'blur(50px)',
            zIndex: 0
          }}
        />
        
        <div className={styles.container} style={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          maxWidth: '100%',
          padding: '0 2rem'
        }}>
          <Row gutter={[{ xs: 16, sm: 24, md: 32, lg: 48 }, { xs: 16, sm: 24, md: 32 }]} align="middle" justify="center" style={{ width: '100%' }}>
            <Col xs={24} sm={24} md={14} lg={12}>
              <motion.div initial="hidden" animate="visible" variants={fadeIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div className={styles.tagBadge} style={{ 
                    background: `linear-gradient(90deg, ${colors.lighterOrange}, ${colors.softCream})`,
                    boxShadow: '0 4px 15px rgba(255, 127, 80, 0.15)'
                  }}>
                    <span>🐾</span>
                    <span>Reuniting pets with their families</span>
                  </div>
                  
                  <Title level={1} style={{ 
                    margin: '24px 0', 
                    fontWeight: 800, 
                    fontSize: 'clamp(2rem, 6vw, 4rem)', 
                    color: '#222222', 
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em'
                  }}>
                    Your <span style={{ 
                      backgroundColor: colors.accentOrange, 
                      padding: '0 15px', 
                      borderRadius: '20px', 
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(255, 127, 80, 0.3)'
                    }}>Pet Care</span> Center
                  </Title>
                  
                  <Paragraph style={{ 
                    fontSize: 'clamp(16px, 2vw, 20px)', 
                    color: '#222222', 
                    maxWidth: '800px',
                    lineHeight: 1.6,
                    marginBottom: '30px'
                  }}>
                    We believe finding a reliable, professional pet sitter should be easy. So make sure every member of our Family gets the best care possible.
                  </Paragraph>
                  
                  <Space size="middle" wrap className={styles.buttonGroup}>
                    {isAuthenticated ? (
                      <Link to="/dashboard">
                        <Button 
                          size="large" 
                          type="primary" 
                          icon={<DashboardOutlined />} 
                          style={{ 
                            background: `linear-gradient(90deg, ${colors.accentOrange}, ${colors.deepOrange})`, 
                            borderColor: colors.accentOrange, 
                            height: '50px', 
                            fontSize: '16px',
                            borderRadius: '30px',
                            boxShadow: '0 6px 16px rgba(255, 127, 80, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          className={styles.primaryButton}
                        >
                          View Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to="/register">
                          <Button 
                            size="large" 
                            className={styles.primaryButton} 
                            style={{ 
                              borderRadius: '30px', 
                              background: `linear-gradient(90deg, ${colors.accentOrange}, ${colors.deepOrange})`, 
                              borderColor: colors.accentOrange, 
                              height: '50px', 
                              fontSize: '16px',
                              boxShadow: '0 6px 16px rgba(255, 127, 80, 0.3)'
                            }}
                          >
                            <Space>
                              <span role="img" aria-label="paw">🐾</span>
                              Watch Now
                            </Space>
                          </Button>
                        </Link>
                        <Link to="/login">
                          <Button 
                            size="large" 
                            className={styles.secondaryButton} 
                            style={{ 
                              borderRadius: '30px', 
                              height: '50px', 
                              fontSize: '16px',
                              borderWidth: '2px',
                              borderColor: colors.accentBlue,
                              color: colors.accentBlue,
                              boxShadow: '0 6px 16px rgba(24, 144, 255, 0.1)'
                            }}
                          >
                            Our Service
                          </Button>
                        </Link>
                      </>
                    )}
                  </Space>
                  
                  {/* Stats counter */}
                  <div className={styles.statCounter} style={{ 
                    marginTop: '40px', 
                    borderRadius: '15px', 
                    background: `linear-gradient(145deg, #ffffff, ${colors.softCream})`, 
                    borderColor: colors.lighterOrange,
                    padding: '15px 20px',
                    boxShadow: '0 10px 25px rgba(255, 127, 80, 0.1)',
                    border: `1px solid ${colors.lighterOrange}`
                  }}>
                    <Row align="middle">
                      <Col>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ marginRight: '10px' }}>
                            <Text strong style={{ fontSize: '18px', color: colors.deepOrange }}>4k+</Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar.Group
                              maxCount={3}
                              maxStyle={{ 
                                color: colors.accentOrange, 
                                backgroundColor: colors.lighterOrange,
                                border: '2px solid #fff',
                                fontWeight: 'bold'
                              }}
                            >
                              <Avatar 
                                style={{ 
                                  backgroundColor: colors.accentOrange, 
                                  border: '2px solid #fff',
                                  color: '#fff'
                                }}
                              >
                                J
                              </Avatar>
                              <Avatar 
                                style={{ 
                                  backgroundColor: colors.deepOrange, 
                                  border: '2px solid #fff',
                                  color: '#fff'
                                }}
                              >
                                S
                              </Avatar>
                              <Avatar 
                                style={{ 
                                  backgroundColor: '#FFA07A', 
                                  border: '2px solid #fff',
                                  color: '#fff'
                                }}
                              >
                                M
                              </Avatar>
                            </Avatar.Group>
                            <Text style={{ marginLeft: '10px', color: '#555' }}>Satisfied Customers</Text>
                          </div>
                        </div>
                      </Col>
                      <Col style={{ marginLeft: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Text style={{ color: '#555' }}>Rating</Text>
                          <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                            <span role="img" aria-label="star" style={{ color: colors.accentOrange, marginRight: '5px' }}>⭐</span>
                            <Text strong style={{ color: colors.deepOrange }}>5.0</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Space>
              </motion.div>
            </Col>
            
            <Col xs={24} sm={24} md={10} lg={10}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 100 }}
                className={styles.profileImageWrapper}
                style={{ 
                  maxWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                {!imagesLoaded ? (
                  <div className={styles.imageLoader}>
                    <Suspense fallback={<Spin size="large" />}>
                      <DogLoader size="medium" showCaption={false} />
                    </Suspense>
                  </div>
                ) : null}
                
                {/* Decorative elements behind the image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  style={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    background: `linear-gradient(45deg, ${colors.lighterOrange}, ${colors.softCream})`,
                    zIndex: 0,
                    top: '10%',
                    left: '10%',
                    filter: 'blur(2px)'
                  }}
                />
                
                <img 
                  src={profileImage} 
                  alt="Pet Care Profile" 
                  className={`${styles.profileImage} ${imagesLoaded ? styles.imageLoaded : styles.imageLoading}`} 
                  onLoad={() => setImagesLoaded(true)}
                  loading="lazy"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                
                {/* Floating paw prints */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    right: '10%',
                    fontSize: '28px',
                    zIndex: 2
                  }}
                >
                  🐾
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    fontSize: '24px',
                    zIndex: 2,
                    transform: 'rotate(-20deg)'
                  }}
                >
                  🐾
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section - Enhanced with better animations and improved layout */}
      <Section style={{ 
        background: '#fff', 
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: colors.softBlue,
          opacity: 0.1,
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: colors.lighterOrange,
          opacity: 0.1,
          zIndex: 0
        }} />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={scaleUp}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className={styles.sectionBadge}>
            <span role="img" aria-label="how it works">🔍</span>
            <span>Simple Process</span>
          </div>
          
          <Title level={2} style={{ 
            margin: '30px 0 20px', 
            fontWeight: 800, 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            position: 'relative',
            display: 'inline-block'
          }}>
            How It Works
            <motion.div 
              className={styles.titleUnderline}
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </Title>
          
          <Paragraph style={{ 
            fontSize: 'clamp(16px, 2vw, 20px)', 
            color: '#555', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Our platform makes it easy to care for your pets and access services with just a few clicks. 
            Follow these simple steps to get started and experience the best pet care available.
          </Paragraph>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className={styles.featuresContainer}
        >
          <Row gutter={[{ xs: 16, sm: 24, md: 32 }, { xs: 24, sm: 32, md: 48 }]} justify="center">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={12} lg={index < 2 ? 12 : 12} key={index}>
                <FeatureCard 
                  {...feature} 
                  index={index}
                />
              </Col>
            ))}
          </Row>
          
          <motion.div 
            className={styles.howItWorksExtra}
            variants={bounce}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Card className={styles.stepsCard}>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>4 Simple Steps</Title>
              <Row gutter={[{ xs: 15, sm: 20, md: 30 }, { xs: 15, sm: 20, md: 30 }]}>
                {[
                  { number: '01', title: 'Create Account', desc: 'Sign up in seconds' },
                  { number: '02', title: 'Set Up Profile', desc: 'Add your pets\' details' },
                  { number: '03', title: 'Browse Services', desc: 'Find what you need' },
                  { number: '04', title: 'Get Started', desc: 'Enjoy the benefits' }
                ].map((step, i) => (
                  <Col xs={12} sm={12} md={6} key={i}>
                    <motion.div 
                      className={styles.stepItem}
                      whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    >
                      <div className={styles.stepNumber}>{step.number}</div>
                      <Title level={5} style={{ margin: '12px 0 5px' }}>{step.title}</Title>
                      <Text type="secondary">{step.desc}</Text>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Card>
          </motion.div>
        </motion.div>
      </Section>

      {/* Statistics Section */}
      <Section style={{ background: '#f9f9f9', padding: '60px 0' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <Row gutter={[{ xs: 16, sm: 24, md: 32 }, { xs: 16, sm: 24, md: 32 }]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} md={6} key={index}>
                <motion.div variants={fadeIn} style={{ textAlign: 'center' }}>
                  <Statistic 
                    title={stat.title} 
                    value={stat.value} 
                    valueStyle={{ color: stat.color, fontWeight: 'bold' }} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Section>

      {/* Testimonials Section */}
      <Section style={{ background: '#fff', padding: '80px 0' }}>
        <SectionTitle 
          title="Success Stories" 
          subtitle="Read how PetFinder has helped reunite pets with their families"
        />
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Row gutter={[{ xs: 16, sm: 20, md: 24 }, { xs: 16, sm: 20, md: 24 }]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} sm={12} md={8} lg={8} key={index}>
                <TestimonialCard 
                  {...testimonial} 
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                />
              </Col>
            ))}
          </Row>
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section className={styles.ctaSection}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className={styles.ctaContent}
        >
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#555', 
            maxWidth: '700px', 
            margin: '0 auto 30px',
            lineHeight: 1.6
          }}>
            Join thousands of pet owners who have successfully found their lost pets using our platform. Our community is growing every day!
          </Paragraph>
          
          {!isAuthenticated && (
            <Row gutter={[24, 24]} align="middle" justify="center">
              <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{
                    maxWidth: '300px', 
                    width: '100%',
                    marginBottom: '20px'
                  }}
                >
                  <Lottie 
                    animationData={findPetsAnimation} 
                    loop={true}
                    style={{ width: '100%' }}
                  />
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={3} style={{ 
                      fontWeight: 600, 
                      color: colors.deepOrange,
                      marginBottom: '16px'
                    }}>
                      Ready to find your lost pet?
                    </Title>
                    <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
                      Create an account today and get access to our powerful pet finding tools and supportive community.
                    </Paragraph>
                    <Space size="middle" wrap style={{ justifyContent: 'flex-start' }}>
                      <Link to="/register">
                        <Button 
                          size="large" 
                          type="primary"
                          style={{ 
                            background: `linear-gradient(90deg, ${colors.accentOrange}, ${colors.deepOrange})`,
                            borderColor: colors.accentOrange,
                            height: '50px',
                            borderRadius: '30px',
                            boxShadow: '0 6px 16px rgba(255, 127, 80, 0.3)'
                          }}
                        >
                          Sign Up Now
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button 
                          size="large"
                          style={{ 
                            borderRadius: '30px',
                            height: '50px',
                            borderWidth: '2px',
                            borderColor: colors.accentBlue,
                            color: colors.accentBlue
                          }}
                        >
                          Sign In
                        </Button>
                      </Link>
                    </Space>
                  </Space>
                </motion.div>
              </Col>
            </Row>
          )}
        </motion.div>
      </Section>
      
      <BackTop>
        <div className={styles.backTopButton}>
          <ArrowUpOutlined />
        </div>
      </BackTop>

      {/* Footer */}
      <Footer className={styles.footer}>
        <div className={styles.container}>
          <Row gutter={[{ xs: 16, sm: 20, md: 24 }, { xs: 20, sm: 30, md: 40 }]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <div>
                <Link to="/" className={styles.footerLogo}>
                  PetFinder <span>🐾</span>
                </Link>
              </div>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                Helping reunite lost pets with their families through our community-driven platform.
              </Paragraph>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>Quick Links</Title>
              <ul className={styles.footerNav}>
                <li><Link to="/" className={styles.footerNavLink}>Home</Link></li>
                <li><Link to="/dashboard" className={styles.footerNavLink}>Dashboard</Link></li>
                <li><Link to="/register" className={styles.footerNavLink}>Sign Up</Link></li>
                <li><Link to="/login" className={styles.footerNavLink}>Login</Link></li>
              </ul>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>Resources</Title>
              <ul className={styles.footerNav}>
                <li><a href="#" className={styles.footerNavLink}>Pet Care Tips</a></li>
                <li><a href="#" className={styles.footerNavLink}>Lost Pet Guide</a></li>
                <li><a href="#" className={styles.footerNavLink}>Community Forums</a></li>
                <li><a href="#" className={styles.footerNavLink}>FAQs</a></li>
              </ul>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>Contact Us</Title>
              <ul className={styles.footerNav}>
                <li style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Email: support@petfinder.com</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Phone: (123) 456-7890</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Address: 123 Pet Street, Animal City</li>
              </ul>
            </Col>
          </Row>
          
          <Divider className={styles.footerDivider} />
          
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12} className={styles.footerLeft}>
              <Text className={styles.footerCopyright}>
                &copy; 2023 PetFinder. All rights reserved.
              </Text>
            </Col>
            <Col xs={24} md={12} className={styles.footerRight}>
              <Space size={16}>
                {['📖', '🐦', '📷', '📺'].map((icon, index) => (
                  <a key={index} href="#" className={styles.socialIcon}>
                    <span role="img" aria-label={['facebook', 'twitter', 'instagram', 'youtube'][index]}>
                      {icon}
                    </span>
                  </a>
                ))}
              </Space>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage; 
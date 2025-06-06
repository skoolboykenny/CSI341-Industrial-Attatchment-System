import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Homepage = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const handleStudentLoginClick = () => navigate('/login');
  const handleOrganisationLoginClick = () => navigate('/login-organisation');
  const handleSupervisorDashboardClick = () => navigate('/supervisor/dashboard');
  const handleAdminLoginClick = () => navigate('/admin/login');

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #1D5D9B, black)',
      padding: '40px 0',
    },
    slideshowContainer: {
      width: '90%',  // Reduced width of the slideshow
      maxWidth: '100vw',
      height: '600px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      marginBottom: '40px',
      borderRadius: '20px',  // Curved edges
    },
    slideImage: {
      width: '100%',
      height: '600px',
      objectFit: 'cover',
    },
    overlayText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '25%',
      height: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      padding: '20px 30px',
      borderRadius: '20px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      zIndex: 2,
      maxWidth: '80%',
    },
    logo: {
      width: '100px',  // Adjust the size of the logo
      height: 'auto',
      marginBottom: '20px',  // Space between the logo and text
    },
    selectionTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
      backgroundColor: '#FBEEAC',
      padding: '15px 30px',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    cardGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: '25px',
      flexWrap: 'wrap',
      maxWidth: '1000px',
      padding: '0 20px',
    },
    card: {
      width: '170px',
      height: '320px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardLabel: {
      fontSize: '1rem',
      fontWeight: '600',
      padding: '10px 0',
    },
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div style={styles.container}>
      <div style={styles.slideshowContainer}>
        <Slider {...sliderSettings}>
          <div>
            <img src="/HomePic1.jpg" alt="Slide 1" style={styles.slideImage} />
          </div>
          <div>
            <img src="/HomePic2.jpg" alt="Slide 2" style={styles.slideImage} />
          </div>
          <div>
            <img src="/HomePic3.jpg" alt="Slide 3" style={styles.slideImage} />
          </div>
          <div>
            <img src="/HomePic4.jpg" alt="Slide 4" style={styles.slideImage} />
          </div>
        </Slider>
        <div style={styles.overlayText}>
          <img src="/UBlogo.png" alt="University of Botswana Logo" style={styles.logo} />
          <br /> University of Botswana <br /> Industrial Attachment System
        </div>
      </div>

      <div style={styles.selectionTitle}>Please select one of the categories</div>

      <div style={styles.cardGrid}>
        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, backgroundColor: '#F4D160' }}
          onClick={handleStudentLoginClick}
        >
          <img src="/Student.jpg" alt="Student" style={styles.cardImage} />
          <div style={styles.cardLabel}>Student</div>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, backgroundColor: '#F4D160' }}
          onClick={handleOrganisationLoginClick}
        >
          <img src="/Organization.jpg" alt="Organization" style={styles.cardImage} />
          <div style={styles.cardLabel}>Organization</div>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, backgroundColor: '#F4D160' }}
          onClick={handleSupervisorDashboardClick}
        >
          <img src="/Supervisor.jpg" alt="Supervisor" style={styles.cardImage} />
          <div style={styles.cardLabel}>Supervisor</div>
        </motion.div>

        <motion.div
          style={styles.card}
          whileHover={{ scale: 1.05, backgroundColor: '#F4D160' }}
          onClick={handleAdminLoginClick}
        >
          <img src="/Admin.jpg" alt="Admin" style={styles.cardImage} />
          <div style={styles.cardLabel}>Admin</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Homepage;
import React, { useState } from 'react';

export default function NikeTechBento() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseMove = (e, cardId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const getNikeShoeImage = (id) => {
    const shoeImages = {
      1: 'https://images.pexels.com/photos/11209837/pexels-photo-11209837.jpeg?cs=srgb&dl=pexels-perfect-lens-11209837.jpg&fm=jpg',
      2: 'https://blog.jd-sports.com.au/wp-content/uploads/2018/08/nike-react-55-header.jpg',
      3: 'https://images.fastcompany.com/image/upload/f_auto,q_auto,c_fit/wp-cms/uploads/2018/04/p-1-nike-flyprint-ushers-in-3d-printed-performance-fabric.jpg',
      4: 'https://d3q0fpse3wbo5h.cloudfront.net/production/uploads/innovations/_1200x480_crop_center-center_80_none/92-min.webp',
      5: 'https://cdn.dribbble.com/userupload/7439013/file/still-7626a18e63ef4c282974fdf891589d11.png?format=webp&resize=400x300&vertical=center',
      6: 'https://media.gq.com/photos/59e779eab2ac1f76b03c344c/master/pass/zoomfly-sp-sneak-of-the-week.gif',
      7: 'https://cdn.mos.cms.futurecdn.net/wb4ZAmgbTPPiHvrwAsp9fQ-1182-80.jpeg',
    };
    return shoeImages[id] || shoeImages[1];
  };

  const getNikeLogoBackground = () => {
    return 'url("https://wallpapers.com/images/hd/nike-3d-wallpaper-sa8cbotvc3bhi1bd.jpg")';
  };

  const cards = [
    {
      id: 1,
      title: 'Nike Air',
      description: 'Revolutionary cushioning technology that delivers responsive comfort with every step, engineered for maximum performance and durability.',
      badge: 'Iconic',
      colorClass: 'teal',
      bgImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="air-grad" cx="50%25" cy="50%25" r="50%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(0,212,255,0.2);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(0,212,255,0.05);stop-opacity:1" /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx="100" cy="100" r="80" fill="url(%23air-grad)" /%3E%3Ccircle cx="300" cy="300" r="120" fill="url(%23air-grad)" opacity="0.5" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(1),
    },
    {
      id: 2,
      title: 'Nike React',
      description: 'Responsive foam technology that absorbs impact and returns energy, keeping athletes moving at peak performance levels.',
      badge: 'Latest',
      colorClass: 'pink',
      bgImage: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(255, 0, 110, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="react-grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(255,0,110,0.15);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(255,0,110,0.05);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x="50" y="50" width="150" height="150" fill="url(%23react-grad)" rx="20" /%3E%3Crect x="200" y="200" width="150" height="150" fill="url(%23react-grad)" opacity="0.6" rx="20" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(2),
    },
    {
      id: 3,
      title: 'Flyknit',
      description: 'Precision engineering that creates lightweight, form-fitting shoes with minimal waste. One of the most innovative weaving techniques ever.',
      badge: 'Precision',
      colorClass: 'lime',
      bgImage: 'linear-gradient(135deg, rgba(127, 255, 0, 0.1) 0%, rgba(127, 255, 0, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="flyknit-grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(127,255,0,0.2);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(127,255,0,0.05);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d="M 50 50 L 150 100 L 200 50 L 300 150 L 250 250 L 100 200 Z" fill="url(%23flyknit-grad)" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(3),
    },
    {
      id: 4,
      title: 'Sustainability',
      description: 'Commitment to responsible manufacturing and material innovation. Building products that perform without compromising our planet\'s future.',
      badge: 'Eco-Friendly',
      colorClass: 'purple',
      bgImage: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="sustain-grad" cx="50%25" cy="50%25" r="50%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(157,78,221,0.2);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(157,78,221,0.05);stop-opacity:1" /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx="150" cy="150" r="100" fill="url(%23sustain-grad)" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(4),
    },
    {
      id: 5,
      title: 'Zoom Air Technology',
      description: 'Ultra-responsive pressurized air units that provide explosive energy return and unmatched responsiveness. Trusted by elite athletes worldwide for peak performance moments.',
      badge: 'Pro-Grade',
      colorClass: 'teal',
      large: true,
      bgImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(0, 212, 255, 0.06) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="zoom-grad" cx="50%25" cy="50%25" r="60%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(0,212,255,0.25);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(0,212,255,0.05);stop-opacity:1" /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx="200" cy="200" r="150" fill="url(%23zoom-grad)" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(5),
    },
    {
      id: 6,
      title: 'Vapor Tech',
      description: 'Advanced aerodynamic design paired with ultra-lightweight materials. Engineered for speed and agility in competitive environments.',
      badge: 'Performance',
      colorClass: 'pink',
      bgImage: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(255, 0, 110, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="vapor-grad" x1="0%25" y1="0%25" x2="100%25" y2="0%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(255,0,110,0.15);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(255,0,110,0.05);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d="M 0 100 Q 100 50, 200 100 T 400 100" stroke="url(%23vapor-grad)" stroke-width="40" fill="none" stroke-linecap="round" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(6),
    },
    {
      id: 7,
      title: 'Cushioning Science',
      description: 'Data-driven research into biomechanics and comfort. Every layer optimized for the perfect balance of support and responsiveness.',
      badge: 'Research',
      colorClass: 'lime',
      bgImage: 'linear-gradient(135deg, rgba(127, 255, 0, 0.1) 0%, rgba(127, 255, 0, 0.05) 100%), url("data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="cushion-grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgba(127,255,0,0.15);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgba(127,255,0,0.05);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x="50" y="50" width="300" height="300" fill="url(%23cushion-grad)" rx="10" /%3E%3C/svg>")',
      bgSize: 'cover',
      shoeImage: getNikeShoeImage(7),
    },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        ${keyframeStyles}
      `}</style>
      
      {/* Nike Background */}
      <div style={styles.nikeBackground} />
      
      <div style={styles.header}>
        <h1 style={styles.title}>Technology / Innovation</h1>
        <p style={styles.subtitle}>Engineered for performance. Built for the future.</p>
      </div>

      <div style={styles.bentoGrid}>
        {cards.map((card, index) => (
           <div
             key={card.id}
             style={{
               ...styles.card,
               ...(card.large ? styles.cardLarge : {}),
               gridColumn: card.large ? 'span 2' : 'span 1',
               backgroundImage: card.bgImage,
               backgroundSize: card.bgSize,
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed',
               animationDelay: `${index * 0.05}s`,
               boxShadow: hoveredCard === card.id ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
             }}
             onMouseMove={(e) => handleMouseMove(e, card.id)}
             onMouseLeave={handleMouseLeave}
             onMouseEnter={() => setHoveredCard(card.id)}
           >
            {/* Full-coverage Shoe Image Background */}
            <img
              src={card.shoeImage}
              alt={card.title}
              style={{
                ...styles.shoeImageBackground,
                ...(hoveredCard === card.id ? { transform: 'scale(1.05)', opacity: 0.25 } : {})
              }}
            />

            <div
              style={{
                ...styles.spotlight,
                opacity: hoveredCard === card.id ? 1 : 0,
                backgroundColor: getSpotlightColor(card.colorClass),
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
              }}
            />
            
            <div style={styles.accentGlow} className={`glow-${card.colorClass}`} />

            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>{card.title}</h2>
              <p style={styles.cardDescription}>{card.description}</p>
            </div>

            <span style={styles.cardBadge}>{card.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getSpotlightColor(colorClass) {
  const colors = {
    teal: 'rgba(0, 212, 255, 0.15)',
    pink: 'rgba(255, 0, 110, 0.15)',
    lime: 'rgba(127, 255, 0, 0.12)',
    purple: 'rgba(157, 78, 221, 0.15)',
  };
  return colors[colorClass] || colors.teal;
}

const keyframeStyles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    .card-large {
      grid-column: span 1 !important;
    }
  }
`;

const styles = {
  container: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '60px 20px',
    background: 'linear-gradient(180deg, #050505 0%, #111118 50%, #0a0a0f 100%)',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  nikeBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(135deg, rgba(120, 0, 255, 0.03) 0%, rgba(0, 212, 255, 0.02) 50%, rgba(255, 0, 110, 0.02) 100%), url("https://wallpapers.com/images/hd/nike-3d-wallpaper-sa8cbotvc3bhi1bd.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundBlendMode: 'overlay',
    opacity: 0.15,
    zIndex: 0,
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center',
    marginBottom: '80px',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '56px',
    fontWeight: '700',
    letterSpacing: '-2px',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: '#fff',
    margin: '0 0 16px 0',
  },
  subtitle: {
    fontSize: '18px',
    color: '#999',
    fontWeight: '300',
    letterSpacing: '0.5px',
    margin: 0,
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(15, 15, 15, 0.8) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '32px',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
    minHeight: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    animation: 'slideUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) backwards',
  },
  cardLarge: {
    minHeight: '420px',
  },
  shoeImageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    opacity: 0.15,
    transition: 'transform 0.4s ease, opacity 0.4s ease',
    pointerEvents: 'none',
    zIndex: 0,
  },
  spotlight: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    transition: 'opacity 0.4s ease',
  },
  accentGlow: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none',
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
    color: '#fff',
    margin: '0 0 12px 0',
  },
  cardDescription: {
    fontSize: '15px',
    color: '#aaa',
    lineHeight: '1.6',
    marginBottom: '24px',
    margin: '0',
  },
  cardBadge: {
    display: 'inline-block',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#ddd',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: 'auto',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 2,
  },
};
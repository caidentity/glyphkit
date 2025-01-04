import './Footer.scss';

const Footer = () => {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Terms', href: '/terms' },
    { label: 'License', href: '/license' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <nav className="footer__nav">
          <ul className="footer__links">
            {links.map((link) => (
              <li key={link.label} className="footer__link-item">
                <a href={link.href} className="footer__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__copyright">
          © {new Date().getFullYear()} Interact LLC
        </div>
      </div>
    </footer>
  );
};

export default Footer;

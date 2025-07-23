'use client';
function FooterClient() {
  
  return (
    <footer id="contacto" className="contact-footer">
        <div className="contact-container">
            <h2 className="contact-title">¿Listo para Empezar?</h2>
            <p className="contact-subtitle">Déjanos un mensaje y nos pondremos en contacto contigo.</p>
            <div className="contact-form">             
                <a href="https://wa.me/56920905973?text=Quiero%20hablar%20del%20eWave%20Pack"><button className="contact-button">Hablemos!</button></a>
            </div>
            <p className="copyright-text">© 2025 Epic Media Wave [ on eWave v1 ]. Todos los derechos reservados.</p>
        </div>
    </footer>
  );
}

export default FooterClient;
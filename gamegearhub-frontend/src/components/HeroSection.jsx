import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function HeroSection({ title, subtitle }) {
  return (
    <div className="bg-dark text-white py-5 mb-4">
      <Container>
        <Row className="align-items-center text-center text-md-start">
          <Col md={8}>
            <h1 className="fw-bold">{title}</h1>
            <p className="lead">{subtitle}</p>
          </Col>
          <Col md={4} className="d-none d-md-block">
            <img
              src="/logo.png"  // ✅ assuming you've added this to public/
              alt="GameGearHub logo"
              style={{ width: '100%', maxWidth: '250px' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection;
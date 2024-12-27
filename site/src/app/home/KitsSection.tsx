import React from 'react';
import { GridContainer, GridRow, GridCol } from '@/components/GridSystem';
import './styling/KitsSection.scss';
import Link from 'next/link';

interface KitCardProps {
  title: string;
  description: string;
  backgroundImage: string;
}

const KitCard: React.FC<KitCardProps> = ({ title, description, backgroundImage }) => (
<Link href="/icons" >
<div className="kit-card">
    <div 
      className="kit-card__background" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
    <div className="kit-card__content">
      <h3 className="kit-card__title">{title}</h3>
      <p className="kit-card__description">{description}</p>
    </div>
  </div>
  </Link>
);

const KitsSection = () => {
  const kits = [
    {
      title: "Essential Kit",
      description: "Core icons for basic interface elements",
      backgroundImage: "/images/essential-kit-bg.jpg"
    },
    {
      title: "Pro Kit",
      description: "Advanced icons for professional applications",
      backgroundImage: "/images/pro-kit-bg.jpg"
    }
  ];

  return (
    <section className="kits-section">
      <GridContainer>
        <GridRow>
          {kits.map((kit, index) => (
            <GridCol 
              key={index} 
              xs={12} 
              md={6}
              className="kit-column"
            >
              <KitCard {...kit} />
            </GridCol>
          ))}
        </GridRow>
      </GridContainer>
    </section>
  );
};

export default KitsSection; 
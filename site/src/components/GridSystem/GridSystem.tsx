"use client";

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type ContainerProps = React.PropsWithChildren<{
  fluid?: boolean;
  fullWidth?: boolean;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  className?: string;
  debug?: boolean;
}>;

interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  children: ReactNode;
  className?: string;
  nogutter?: boolean;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  fullHeight?: boolean;
  childrenMargin?: number;
  debug?: boolean;
  $remainingHeight?: string;
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  offset?: number;
  className?: string;
  debug?: boolean;
  fullHeight?: boolean;
}

const parseMarginValue = (value: string | number | undefined): string => {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') return value;
  return '0px';
};

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

const getColumnWidth = (span: number): string => {
  const width = (span / 12) * 100;
  return `${width}%`;
};

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const StyledContainer = styled.div<ContainerProps>`
  box-sizing: border-box;
  width: ${props => props.fullWidth ? `calc(100% - ${parseMarginValue(props.marginLeft || props.margin)} - ${parseMarginValue(props.marginRight || props.margin)})` : '100%'};
  max-width: ${props => props.fluid ? 'none' : '1860px'};
  margin-top: ${props => parseMarginValue(props.marginTop || props.margin)};
  margin-right: ${props => parseMarginValue(props.marginRight || props.margin)};
  margin-bottom: ${props => parseMarginValue(props.marginBottom || props.margin)};
  margin-left: ${props => parseMarginValue(props.marginLeft || props.margin)};
  padding-left: 16px;
  padding-right: 16px;
  ${props => props.debug && 'background-color: rgba(0,0,0,0.1);'}

  @media (min-width: ${breakpoints.lg}px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 1860px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const StyledRow = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-top: ${props => parseMarginValue(props.marginTop || props.margin)};
  margin-right: ${props => parseMarginValue(props.marginRight || props.margin)};
  margin-bottom: ${props => parseMarginValue(props.marginBottom || props.margin)};
  margin-left: ${props => parseMarginValue(props.marginLeft || props.margin)};
  ${props => props.fullHeight && `
    height: ${props.$remainingHeight};
    overflow: hidden;
  `}
  ${props => props.debug && 'background-color: rgba(0,0,0,0.2);'}
`;

const StyledCol = styled.div<ColProps>`
  flex: 0 0 auto;
  padding-right: 12px;
  padding-left: 12px;
  box-sizing: border-box;
  
  ${props => props.xs !== undefined && `
    width: ${getColumnWidth(props.xs)};
    flex: 0 0 ${getColumnWidth(props.xs)};
  `}

  @media (min-width: ${breakpoints.sm}px) {
    ${props => props.sm !== undefined && `
      width: ${getColumnWidth(props.sm)};
      flex: 0 0 ${getColumnWidth(props.sm)};
    `}
  }

  @media (min-width: ${breakpoints.md}px) {
    ${props => props.md !== undefined && `
      width: ${getColumnWidth(props.md)};
      flex: 0 0 ${getColumnWidth(props.md)};
    `}
  }

  @media (min-width: ${breakpoints.lg}px) {
    ${props => props.lg !== undefined && `
      width: ${getColumnWidth(props.lg)};
      flex: 0 0 ${getColumnWidth(props.lg)};
    `}
  }

  @media (min-width: ${breakpoints.xl}px) {
    ${props => props.xl !== undefined && `
      width: ${getColumnWidth(props.xl)};
      flex: 0 0 ${getColumnWidth(props.xl)};
    `}
  }
`;

const GridContainer: React.FC<ContainerProps> = ({ className = '', children, ...props }) => {
  return (
    <StyledContainer className={`container ${className}`} {...props}>
      {children}
    </StyledContainer>
  );
};

const GridRow: React.FC<RowProps> = ({
  children,
  className = '',
  fullHeight,
  margin,
  marginBottom,
  ...otherProps
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [remainingHeight, setRemainingHeight] = useState('100vh');

  useEffect(() => {
    if (!fullHeight || !rowRef.current) return;

    const updateHeight = () => {
      const rowTop = rowRef.current?.getBoundingClientRect().top || 0;
      const windowHeight = window.innerHeight;
      const marginValue = parseFloat(parseMarginValue(marginBottom || margin));
      const newHeight = windowHeight - rowTop - marginValue;
      setRemainingHeight(`${newHeight}px`);
    };

    updateHeight();
    const debouncedUpdate = debounce(updateHeight, 16);
    window.addEventListener('resize', debouncedUpdate);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
    };
  }, [fullHeight, margin, marginBottom]);

  return (
    <StyledRow
      ref={rowRef}
      className={`row ${className}`}
      $remainingHeight={remainingHeight}
      fullHeight={fullHeight}
      margin={margin}
      marginBottom={marginBottom}
      {...otherProps}
    >
      {children}
    </StyledRow>
  );
};

const GridCol: React.FC<ColProps> = ({ className = '', children, ...props }) => {
  return (
    <StyledCol className={className} {...props}>
      {children}
    </StyledCol>
  );
};

const GridExample: React.FC = () => (
  <GridContainer fullWidth margin={8} debug>
    <GridRow margin={16} debug>
      <GridCol xs={12} md={6} lg={4} debug>Column 1</GridCol>
      <GridCol xs={12} md={6} lg={4} debug>Column 2</GridCol>
      <GridCol xs={12} md={12} lg={4} debug>Column 3</GridCol>
    </GridRow>
  </GridContainer>
);

export { GridContainer, GridRow, GridCol, GridExample };
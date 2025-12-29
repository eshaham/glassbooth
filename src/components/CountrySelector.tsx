'use client';

import { Box, Flex, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

import { Country, countries, defaultCountry } from '@/data/countries';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface CountrySelectorProps {
  value: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
}

export function CountrySelector({
  value,
  onChange,
  disabled,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <Box ref={containerRef} pos="relative">
      <Flex
        component="button"
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        align="center"
        gap={6}
        bg="transparent"
        bd="none"
        c="var(--text-primary)"
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text fz="1.5rem" lh={1}>
          {value.flag}
        </Text>
        <Text fz="clamp(1.25rem, 4vw, 1.5rem)" fw={300} c="var(--text-primary)">
          +{value.dialCode}
        </Text>
        <ChevronIcon open={isOpen} />
      </Flex>

      {isOpen && (
        <Box
          pos="absolute"
          top="100%"
          left={0}
          mt={4}
          w={280}
          mah={300}
          bg="rgba(20, 10, 40, 0.95)"
          bd="1px solid rgba(100, 150, 255, 0.3)"
          style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <Box
            p={8}
            bd="0"
            style={{ borderBottom: '1px solid rgba(100, 150, 255, 0.2)' }}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(100, 150, 255, 0.2)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </Box>
          <Box mah={240} style={{ overflowY: 'auto' }}>
            {filteredCountries.map((country) => (
              <Flex
                key={country.code}
                component="button"
                type="button"
                onClick={() => handleSelect(country)}
                align="center"
                gap={12}
                w="100%"
                px={12}
                py={8}
                bg={
                  value.code === country.code
                    ? 'rgba(0, 217, 255, 0.15)'
                    : 'transparent'
                }
                bd="none"
                ta="left"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  if (value.code !== country.code) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value.code !== country.code) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Text fz="1.25rem">{country.flag}</Text>
                <Text fz="0.875rem" c="var(--text-primary)" flex={1}>
                  {country.name}
                </Text>
                <Text fz="0.75rem" c="var(--text-secondary)">
                  +{country.dialCode}
                </Text>
              </Flex>
            ))}
            {filteredCountries.length === 0 && (
              <Text ta="center" py={16} c="var(--text-secondary)" fz="0.875rem">
                No countries found
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export { defaultCountry };
export type { Country };

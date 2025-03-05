import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTheme } from "../../theme/themeContext";

const Button = styled.div`
  z-index: 99;
  cursor: pointer;
  padding: 8px;
  margin-top: 10px;
`;

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeLinecap="round"
    strokeWidth="3"
    {...props}
  />
);

const transition = { duration: 0.33 };

export function MenuToggle({ toggle, isOpen }) {
  const { theme } = useTheme();
  const strokeColor = theme.name === 'dark' ? '#FFFFFF' : 'hsl(0, 0%, 18%)';

  return (
    <Button onClick={toggle}>
      <svg width="24" height="24" viewBox="0 0 23 23">
        <Path
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5", stroke: strokeColor },
            open: { d: "M 3 16.5 L 17 2.5", stroke: strokeColor },
          }}
          transition={transition}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          stroke={strokeColor}
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={transition}
        />
        <Path
          animate={isOpen ? "open" : "closed"}
          initial={false}
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346", stroke: strokeColor },
            open: { d: "M 3 2.5 L 17 16.346", stroke: strokeColor },
          }}
          transition={transition}
        />
      </svg>
    </Button>
  );
}
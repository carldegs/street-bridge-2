import { useColorMode } from '@chakra-ui/react';
import { Moon, Sun } from 'phosphor-react';
import { useMemo } from 'react';

const useCustomColorMode = () => {
  const { colorMode: mode, toggleColorMode: toggle } = useColorMode();
  const isDark = useMemo(() => mode === 'dark', [mode]);
  const Icon = useMemo(() => (isDark ? Sun : Moon), [isDark]);
  const tooltip = useMemo(
    () => (isDark ? 'Light Mode' : 'Dark Mode'),
    [isDark]
  );

  return {
    mode,
    toggle,
    Icon,
    tooltip,
    isDark,
  };
};

export default useCustomColorMode;

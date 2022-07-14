import { useCallback, useMemo, useState } from 'react';

import { Team } from '../../constants';
import { Game } from '../../lib/api/game/Game';

// TODO: Refactor
const useScore = (game?: Game) => {
  const [scoreMode, setScoreMode] = useState<'toWin' | 'tricks'>('toWin');

  const [score, scoreModeLabel, leadingTeam, winningTeam] = useMemo(() => {
    if (!game) {
      return [[7, 7], '', '', 0];
    }

    const neededToWin = game?.tricksNeeded;
    const tricksWon = game?.scores;
    const score = neededToWin.map((nw, i) => nw - tricksWon[i]);

    const diff = score[0] - score[1];
    const leading = diff > 0 ? 1 : diff < 0 ? 0 : -1;

    const winningTeam =
      neededToWin[Team.vertical] === 0 ? Team.vertical : Team.horizontal;

    switch (scoreMode) {
      case 'toWin':
        return [score, 'TO WIN', leading, winningTeam];
      case 'tricks':
        return [tricksWon, 'TRICKS', leading, winningTeam];
    }
  }, [game, scoreMode]);

  const toggleMode = useCallback(() => {
    setScoreMode((sm) => {
      switch (sm) {
        case 'toWin':
          return 'tricks';
        case 'tricks':
        default:
          return 'toWin';
      }
    });
  }, []);

  return {
    toggleMode,
    score,
    scoreModeLabel,
    leadingTeam,
    winningTeam,
  };
};

export default useScore;

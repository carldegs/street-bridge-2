import { User } from 'firebase/auth';
import { Funnel } from 'phosphor-react';
import { useCallback, useMemo, useState } from 'react';

import { CardSuit, AUTO_LOOP, CardSuitIcons } from '../../constants';
import { Game } from '../../lib/api/game/Game';
import { SortOrder } from '../../types';

const useHand = (game?: Game, user?: User) => {
  const [sort, setSort] = useState<SortOrder>('');
  const [filter, setFilter] = useState<CardSuit | -1>(-1);
  const [showHand, setShowHand] = useState(true);
  const [selectedUser, setSelectedUser] = useState(AUTO_LOOP);

  const FilterIcon = filter < 0 ? Funnel : CardSuitIcons[filter];

  const isSpectator = useMemo(() => {
    if (!game || !user) {
      return false;
    }

    return !game.isPlayer(user.uid);
  }, [game, user]);

  const userId = useMemo(() => {
    if (!game || !user) {
      return '';
    }

    let userId = user.uid;
    if (isSpectator) {
      userId = selectedUser === AUTO_LOOP ? game.currPlayerId : selectedUser;
    }

    return userId;
  }, [game, isSpectator, selectedUser, user]);

  const playerCards = useMemo(() => {
    if (!game || !user) {
      return [];
    }

    let cards = game
      .getPlayerHand(userId)
      .availableCards?.map((card) => card.card);

    if (sort) {
      cards = cards.sort((cardA, cardB) => {
        const suitOrder = cardA.suit - cardB.suit;

        if (suitOrder === 0) {
          const valueOrder = cardA.value - cardB.value;
          return valueOrder * (sort === 'asc' ? 1 : -1);
        }

        return suitOrder * (sort === 'asc' ? 1 : -1);
      });
    }

    if (filter >= 0) {
      cards = cards.filter(({ suit }) => suit === filter);
    }

    return cards;
  }, [filter, game, userId, sort, user]);

  const disableHand = useMemo(
    () => (!userId ? true : userId !== game?.currPlayerId),
    [game?.currPlayerId, userId]
  );

  const disableSuits = useMemo(
    () => game && game.getPlayerRestrictedSuits(userId),
    [game, userId]
  );

  const handleSort = useCallback(() => {
    setSort((s) => {
      switch (s) {
        case '':
          return 'asc';
        case 'asc':
          return 'desc';
        case 'desc':
          return '';
      }
    });
  }, []);

  const handleFilter = useCallback(() => {
    setFilter((f) => {
      switch (f) {
        case -1:
          return CardSuit.club;
        case CardSuit.club:
          return CardSuit.spade;
        case CardSuit.spade:
          return CardSuit.heart;
        case CardSuit.heart:
          return CardSuit.diamond;
        case CardSuit.diamond:
          return -1;
      }
    });
  }, []);

  const handleShowHand = useCallback(() => {
    setShowHand((s) => !s);
  }, []);

  return {
    isSpectator,
    playerCards,
    showHand,
    disableHand,
    disableSuits,
    FilterIcon,
    sort,
    handleSort,
    filter,
    handleFilter,
    handleShowHand,
    selectedUser,
    setSelectedUser,
    spectatingUserId: userId,
  };
};

export default useHand;

import { DocumentData, DocumentReference } from 'firebase/firestore';

import { LobbyRole, PlayerPos, Team } from '../../../constants';
import { Game } from '../game/Game';

interface User {
  uid: string;
  displayName: string;
}

export type LobbyMember = User & {
  role: LobbyRole;
};

type Members = Record<string, LobbyMember>;
const createPlayerListFromMembers = (members: Members) => {
  let vertPlayers = [];
  let horPlayers = [];

  Object.entries(members).forEach(([player, { role }]) => {
    switch (role) {
      case Team.vertical:
        vertPlayers = [...vertPlayers, player];
        break;
      case Team.horizontal:
        horPlayers = [...horPlayers, player];
        break;
    }
  });

  if (vertPlayers.length !== 2 || horPlayers.length !== 2) {
    throw new Error('Must be 2 players per team.');
  }

  const players = ['', '', '', ''];

  players[PlayerPos.north] = vertPlayers[0];
  players[PlayerPos.south] = vertPlayers[1];

  players[PlayerPos.east] = horPlayers[0];
  players[PlayerPos.west] = horPlayers[1];

  return players;
};

class Lobby {
  constructor(
    private _name: string,
    private _host: User,
    public code: string,
    public members?: Members,
    public teamNames: string[] = ['Team A', 'Team B'],
    public prevGames: string[] = [],
    public currGame: DocumentReference<DocumentData> = undefined,
    public id: string = '',
    public ref: DocumentReference<DocumentData> = undefined
  ) {
    this.members = members || {
      [_host.uid]: {
        uid: _host.uid,
        displayName: _host.displayName,
        role: 'spectator',
      },
    };
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    if (!value) {
      throw new Error('Must not be empty.');
    }

    this._name = value;
  }

  public get host(): User {
    return this._host;
  }

  public set host(value: User) {
    if (!this.members[value.uid]) {
      throw new Error(`User ${value.displayName} not a member`);
    }

    this._host = value;
  }

  public get memberIdList() {
    return Object.keys(this.members || {});
  }

  public get numMembers() {
    return this.memberIdList?.length || 0;
  }

  public changeLobbyName(name: string) {
    if (!name) {
      throw new Error('Must not be empty.');
    }

    this.name = name;
  }

  public addMember(user: User, team: LobbyRole = 'spectator') {
    this.members = {
      ...this.members,
      [user.uid]: {
        ...user,
        role: team,
      },
    };

    return this.members;
  }

  public updateMember(userId: string, data: Partial<LobbyMember>) {
    if (!this.isMember(userId)) {
      throw new Error('Member not found.');
    }
    this.members = {
      ...this.members,
      [userId]: {
        ...this.members[userId],
        ...data,
      },
    };

    return this.members;
  }

  public isMember(userId: string) {
    return this.members[userId]?.displayName;
  }

  public isHost(userId: string) {
    return userId === this.host.uid;
  }

  public isTeamMember(userId: string, team: Team) {
    if (!this.isMember(userId)) {
      throw new Error(`User ${userId} not a member.`);
    }

    return (this.members[userId]?.role as number) === (team as number);
  }

  public removeMember(userId: string, newHost?: string) {
    if (!this.isMember(userId)) {
      throw new Error(`User ${userId} not a member.`);
    }

    if (this.isHost(userId) && this.numMembers > 1 && !newHost) {
      throw new Error(
        'Cannot delete user since they are the host. Must include newHost parameter'
      );
    } else if (this.isHost(userId) && !this.members[newHost]) {
      throw new Error(`newHost ${newHost} is not a member.`);
    }

    this.members = Object.fromEntries(
      Object.entries(this.members).filter(([, value]) => value.uid !== userId)
    );

    if (this.isHost(userId)) {
      this.host.uid = newHost;
    }

    return this.members;
  }

  public changeTeamName(team: Team, name: string) {
    if (!name) {
      throw new Error('Name nust not be empty.');
    }

    this.teamNames[team] = name;
  }

  public createGame() {
    const players = createPlayerListFromMembers(this.members);

    const game = new Game(this.host.uid, players, this.teamNames);

    // TODO: set ID
    // this._currGame = 'id';

    return game;
  }

  public getPlayerList(team: LobbyRole) {
    return Object.values(this.members)
      .filter((member) => member.role === team)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  public changeHost(newHostId: string) {
    const newHost = this.members[newHostId];

    if (!newHost) {
      throw new Error('New Host ID not found');
    }

    this.host = { ...newHost };
  }
}

export default Lobby;

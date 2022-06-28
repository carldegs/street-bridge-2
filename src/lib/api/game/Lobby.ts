import { LobbyRole } from '../../../constants';

export class Lobby {
  private members: Record<string, LobbyRole>;
  constructor(private _name: string, private _host: string) {
    this.members = {
      [_host]: 'spectator',
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

  public get host(): string {
    return this._host;
  }

  public set host(value: string) {
    if (!this.members[value]) {
      throw new Error(`User ${value} not a member`);
    }

    this._host = value;
  }

  public changeLobbyName(name: string) {
    if (!name) {
      throw new Error('Must not be empty.');
    }

    this.name = name;
  }

  public updateMembers(user: string, team: LobbyRole = 'spectator') {
    this.members = {
      ...this.members,
      [user]: team,
    };
  }

  public removeMember(user: string, newHost?: string) {
    if (!this.members[user]) {
      throw new Error(`User ${user} not a member.`);
    }

    if (this.host === user && !newHost) {
      throw new Error(
        'Cannot delete user since they are the host. Must include newHost parameter'
      );
    } else if (this.host === user && !this.members[newHost]) {
      throw new Error(`newHost ${newHost} is not a member.`);
    }

    this.members = Object.fromEntries(
      Object.entries(this.members).filter(([, value]) => value !== user)
    );

    if (this.host === user) {
      this.host = newHost;
    }
  }
}

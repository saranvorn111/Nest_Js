import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john_doe',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'jane_doe',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  getOneUser(userId: number): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.userId === userId));
  }

  createUser(username: string, password: string): Promise<User> {
    const newUser: User = {
      userId: this.users.length + 1,
      username,
      password,
    };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }
}

import { Difficulty } from './difficulty.type';
import { Level } from './level.type';

export interface IGameRecord {
  id: string;
  difficulty: Difficulty;
  level: Level;
  score: number;
  totalTime: number;
  state?: 'win' | 'lose' | null;
  date?: Date;
}
